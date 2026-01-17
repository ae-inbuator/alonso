import { useEffect, useState, useMemo, useRef } from 'react'
import { supabase } from './services/supabase'
import { getPredictions, applyPrediction } from './services/prediction'
import { speak } from './services/tts'
import { getAISuggestions, cancelPendingAIRequest } from './services/ai'
import { Keyboard } from './components/keyboard'
import { MessageArea, SpeakButton } from './components/message'
import { PredictionBar } from './components/predictions'
import { PhrasesPanel } from './components/phrases'
import { ContextSelector } from './components/context'
import styles from './App.module.css'

function App() {
  const [profile, setProfile] = useState(null)
  const [contexts, setContexts] = useState([])
  const [activeContext, setActiveContext] = useState(null)
  const [phrases, setPhrases] = useState([])
  const [loading, setLoading] = useState(true)
  const [phrasesLoading, setPhrasesLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentText, setCurrentText] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [ttsError, setTtsError] = useState(null)
  
  // Estados para IA - ahora son objetos {full, addition}
  const [aiPredictions, setAiPredictions] = useState([])
  const [aiLoading, setAiLoading] = useState(false)
  
  // Refs para debounce
  const aiDebounceTimer = useRef(null)
  const loadingTimer = useRef(null)

  // Cargar perfil y contextos
  useEffect(() => {
    async function loadInitialData() {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profile')
          .select('*')
          .single()

        if (profileError) throw profileError
        setProfile(profileData)

        const { data: contextsData, error: contextsError } = await supabase
          .from('context')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })

        if (contextsError) throw contextsError
        setContexts(contextsData || [])

        if (contextsData && contextsData.length > 0) {
          const savedContextId = profileData?.active_context_id
          const savedContext = contextsData.find(c => c.id === savedContextId)
          setActiveContext(savedContext || contextsData[0])
        }

      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Cargar frases
  useEffect(() => {
    async function loadPhrases() {
      try {
        const { data, error } = await supabase
          .from('phrase')
          .select('*')
          .order('sort_order', { ascending: true })
          .order('use_count', { ascending: false })

        if (error) throw error
        setPhrases(data || [])
      } catch (err) {
        console.error('Error cargando frases:', err)
      } finally {
        setPhrasesLoading(false)
      }
    }

    loadPhrases()
  }, [])

  // Llamar a IA cuando el texto cambia (con debounce)
  useEffect(() => {
    // Cancelar timers anteriores
    if (aiDebounceTimer.current) {
      clearTimeout(aiDebounceTimer.current)
    }
    if (loadingTimer.current) {
      clearTimeout(loadingTimer.current)
    }

    // No llamar si el texto es muy corto
    if (!currentText || currentText.trim().length < 3) {
      setAiPredictions([])
      setAiLoading(false)
      return
    }

    // Delay corto - 700ms después de dejar de escribir
    const DEBOUNCE_DELAY = 700

    // Mostrar loading después de 300ms
    loadingTimer.current = setTimeout(() => {
      setAiLoading(true)
    }, 300)

    // Llamar a la IA después del delay
    aiDebounceTimer.current = setTimeout(async () => {
      try {
        console.log('Llamando a IA con:', currentText)
        const suggestions = await getAISuggestions(
          currentText, 
          activeContext?.name || 'General'
        )
        setAiPredictions(suggestions)
      } catch (err) {
        console.error('Error obteniendo sugerencias IA:', err)
        setAiPredictions([])
      } finally {
        if (loadingTimer.current) {
          clearTimeout(loadingTimer.current)
        }
        setAiLoading(false)
      }
    }, DEBOUNCE_DELAY)

    // Cleanup
    return () => {
      if (loadingTimer.current) {
        clearTimeout(loadingTimer.current)
      }
      if (aiDebounceTimer.current) {
        clearTimeout(aiDebounceTimer.current)
      }
    }
  }, [currentText, activeContext])

  // Limpiar predicciones IA cuando cambia el contexto
  useEffect(() => {
    setAiPredictions([])
  }, [activeContext])

  // Filtrar frases por contexto activo
  const filteredPhrases = useMemo(() => {
    if (!activeContext) return phrases
    return phrases.filter(phrase => 
      !phrase.context_id || phrase.context_id === activeContext.id
    )
  }, [phrases, activeContext])

  // Contar frases por contexto
  const phraseCounts = useMemo(() => {
    const counts = {}
    contexts.forEach(ctx => {
      counts[ctx.id] = phrases.filter(p => 
        !p.context_id || p.context_id === ctx.id
      ).length
    })
    return counts
  }, [phrases, contexts])

  // Calcular predicciones locales (palabras)
  const predictions = useMemo(() => {
    return getPredictions(currentText, [], 3)
  }, [currentText])

  // Handler para cambiar contexto
  const handleContextChange = (context) => {
    setActiveContext(context)
  }

  // Handlers del teclado
  const handleKeyPress = (char) => {
    setCurrentText(prev => prev + char)
    setTtsError(null)
  }

  const handleBackspace = () => {
    setCurrentText(prev => prev.slice(0, -1))
  }

  const handleSpace = () => {
    setCurrentText(prev => prev + ' ')
  }

  const handleClear = () => {
    setCurrentText('')
    setTtsError(null)
    setAiPredictions([])
    setAiLoading(false)
    cancelPendingAIRequest()
  }

  // Handler de predicción local seleccionada (palabra)
  const handlePredictionSelect = (word) => {
    setCurrentText(prev => applyPrediction(prev, word))
  }

  // Handler de predicción IA seleccionada (texto completo)
  const handleAIPredictionSelect = (fullText) => {
    // Ahora simplemente usamos el texto completo que viene de la IA
    setCurrentText(fullText)
    setAiPredictions([])
  }

  // Handler de frase rápida seleccionada
  const handlePhraseSelect = (phrase) => {
    setCurrentText(prev => {
      if (prev.trim()) {
        return prev.trim() + ' ' + phrase.text
      }
      return phrase.text
    })
    setTtsError(null)
    setAiPredictions([])
  }

  // Handler del botón hablar
  const handleSpeak = async () => {
    if (!currentText.trim() || isSpeaking) return
    
    setIsSpeaking(true)
    setTtsError(null)
    
    try {
      await speak(currentText, {
        onEnd: () => {
          setIsSpeaking(false)
        },
        onError: (error) => {
          console.error('Error TTS:', error)
          setIsSpeaking(false)
          setTtsError('Error al reproducir audio')
        }
      })
    } catch (error) {
      console.error('Error al hablar:', error)
      setIsSpeaking(false)
      
      // Fallback al TTS del navegador
      try {
        const utterance = new SpeechSynthesisUtterance(currentText)
        utterance.lang = 'es-MX'
        utterance.rate = 0.9
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)
        window.speechSynthesis.speak(utterance)
        setIsSpeaking(true)
        setTtsError('Usando voz del navegador')
      } catch (fallbackError) {
        setTtsError('Error: No se pudo reproducir audio')
      }
    }
  }

  // Estados de carga y error
  if (loading) {
    return <div className={styles.loading}>Cargando...</div>
  }
  
  if (error) {
    return <div className={styles.error}>Error: {error}</div>
  }

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.logo}>💬 AAC</span>
          <ContextSelector
            contexts={contexts}
            activeContext={activeContext}
            onSelect={handleContextChange}
            phraseCounts={phraseCounts}
          />
        </div>
        
        <div className={styles.headerRight}>
          <button className={styles.iconButton} title="Historial">
            📜
          </button>
          <button className={styles.iconButton} title="Configuración">
            ⚙️
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Área de mensaje + botón hablar */}
        <section className={styles.messageSection}>
          <div className={styles.messageRow}>
            <MessageArea
              text={currentText}
              placeholder="Escribe tu mensaje..."
              onClear={handleClear}
            />
            <SpeakButton
              onClick={handleSpeak}
              disabled={!currentText.trim()}
              isSpeaking={isSpeaking}
            />
          </div>
          {ttsError && (
            <div className={styles.ttsError}>
              ⚠️ {ttsError}
            </div>
          )}
        </section>

        {/* Panel de frases rápidas */}
        <section className={styles.phrasesSection}>
          <PhrasesPanel
            phrases={filteredPhrases}
            onPhraseSelect={handlePhraseSelect}
            loading={phrasesLoading}
          />
        </section>

        {/* Barra de predicciones */}
        <section className={styles.predictionsSection}>
          <PredictionBar
            predictions={predictions}
            onSelect={handlePredictionSelect}
            aiPredictions={aiPredictions}
            onAISelect={handleAIPredictionSelect}
            loading={aiLoading}
          />
        </section>

        {/* Teclado */}
        <section className={styles.keyboardSection}>
          <Keyboard
            onKeyPress={handleKeyPress}
            onBackspace={handleBackspace}
            onSpace={handleSpace}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        ✅ {profile?.name} | 📍 {activeContext?.name || 'Sin contexto'} | 📝 {filteredPhrases.length} frases | 🤖 {aiLoading ? 'Pensando...' : aiPredictions.length > 0 ? 'Sugerencias listas' : 'Lista'}
      </footer>
    </div>
  )
}

export default App
