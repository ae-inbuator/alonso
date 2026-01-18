import { useEffect, useState, useMemo, useRef } from 'react'
import { supabase } from './services/supabase'
import { getPredictions, applyPrediction } from './services/prediction'
import { speak } from './services/tts'
import { getAISuggestions, cancelPendingAIRequest } from './services/ai'
import { saveMessage } from './services/history'
import { speakKey, speakBackspace, getIsMuted, setMuted } from './services/keySound'
import { Keyboard } from './components/keyboard'
import { MessageArea } from './components/message'
import { PredictionBar } from './components/predictions'
import { ContextSelector } from './components/context'
import { HistoryPanel } from './components/history'
import styles from './App.module.css'

function App() {
  const [profile, setProfile] = useState(null)
  const [contexts, setContexts] = useState([])
  const [activeContext, setActiveContext] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentText, setCurrentText] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  
  // Estados para IA
  const [aiPredictions, setAiPredictions] = useState([])
  const [aiLoading, setAiLoading] = useState(false)
  
  // Rastrear si usó sugerencia de IA en este mensaje
  const [usedAISuggestion, setUsedAISuggestion] = useState(false)
  
  // Estado para el panel de historial
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  
  // Estado para sonido de teclas (mute/unmute)
  const [isKeySoundMuted, setIsKeySoundMuted] = useState(getIsMuted())
  
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

  // Llamar a IA cuando el texto cambia (con debounce)
  useEffect(() => {
    if (aiDebounceTimer.current) {
      clearTimeout(aiDebounceTimer.current)
    }
    if (loadingTimer.current) {
      clearTimeout(loadingTimer.current)
    }

    if (!currentText || currentText.trim().length < 3) {
      setAiPredictions([])
      setAiLoading(false)
      return
    }

    const DEBOUNCE_DELAY = 700

    loadingTimer.current = setTimeout(() => {
      setAiLoading(true)
    }, 300)

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

  // Calcular predicciones locales (palabras)
  const predictions = useMemo(() => {
    return getPredictions(currentText, [], 3)
  }, [currentText])

  // Handler para cambiar contexto
  const handleContextChange = (context) => {
    setActiveContext(context)
  }

  // Toggle sonido de teclas
  const handleToggleKeySound = () => {
    const newMuted = !isKeySoundMuted
    setIsKeySoundMuted(newMuted)
    setMuted(newMuted)
  }

  // Handlers del teclado
  const handleKeyPress = (char) => {
    speakKey(char)
    setCurrentText(prev => prev + char)
  }

  const handleBackspace = () => {
    speakBackspace()
    setCurrentText(prev => prev.slice(0, -1))
  }

  const handleSpace = () => {
    speakKey(' ')
    setCurrentText(prev => prev + ' ')
  }

  const handleClear = () => {
    setCurrentText('')
    setAiPredictions([])
    setAiLoading(false)
    setUsedAISuggestion(false)
    cancelPendingAIRequest()
  }

  // Handler de predicción local seleccionada (palabra)
  const handlePredictionSelect = (word) => {
    setCurrentText(prev => applyPrediction(prev, word))
  }

  // Handler de predicción IA seleccionada (texto completo)
  const handleAIPredictionSelect = (fullText) => {
    setCurrentText(fullText)
    setAiPredictions([])
    setUsedAISuggestion(true)
  }

  // Función para hablar texto
  const speakText = async (textToSpeak, saveToHistory = true) => {
    if (!textToSpeak.trim() || isSpeaking) return
    
    setIsSpeaking(true)
    
    // Guardar en historial
    if (saveToHistory && profile?.id) {
      saveMessage({
        text: textToSpeak,
        profileId: profile.id,
        contextId: activeContext?.id || null,
        wasAIAssisted: usedAISuggestion
      }).catch(err => {
        console.error('❌ Error guardando:', err)
      })
    }
    
    try {
      await speak(textToSpeak, {
        onEnd: () => {
          setIsSpeaking(false)
          if (saveToHistory) {
            setCurrentText('')
            setUsedAISuggestion(false)
            setAiPredictions([])
          }
        },
        onError: (error) => {
          console.error('Error TTS:', error)
          setIsSpeaking(false)
        }
      })
    } catch (error) {
      console.error('Error al hablar:', error)
      setIsSpeaking(false)
      
      // Fallback al TTS del navegador
      try {
        const utterance = new SpeechSynthesisUtterance(textToSpeak)
        utterance.lang = 'es-MX'
        utterance.rate = 0.9
        utterance.onend = () => {
          setIsSpeaking(false)
          if (saveToHistory) {
            setCurrentText('')
            setUsedAISuggestion(false)
            setAiPredictions([])
          }
        }
        utterance.onerror = () => setIsSpeaking(false)
        window.speechSynthesis.speak(utterance)
        setIsSpeaking(true)
      } catch (fallbackError) {
        console.error('Fallback TTS error:', fallbackError)
      }
    }
  }

  // Handler del botón hablar
  const handleSpeak = async () => {
    await speakText(currentText.trim(), true)
  }

  // Handler para SÍ
  const handleYes = async () => {
    await speakText('Sí', true)
  }

  // Handler para NO
  const handleNo = async () => {
    await speakText('No', true)
  }

  // Handler para repetir desde historial
  const handleRepeatFromHistory = async (text) => {
    await speakText(text, false)
  }

  // Handler para insertar texto desde historial
  const handleInsertFromHistory = (text) => {
    setCurrentText(prev => {
      if (prev.trim()) {
        return prev.trim() + ' ' + text
      }
      return text
    })
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
      {/* Header mínimo */}
      <header className={styles.header}>
        <div className={styles.messageWrapper}>
          <MessageArea
            text={currentText}
            placeholder="Escribe tu mensaje..."
            onClear={handleClear}
          />
        </div>
        
        <div className={styles.headerRight}>
          <ContextSelector
            contexts={contexts}
            activeContext={activeContext}
            onSelect={handleContextChange}
          />
          <button 
            className={styles.smallIconButton} 
            title="Historial"
            onClick={() => setIsHistoryOpen(true)}
          >
            📜
          </button>
          <button className={styles.smallIconButton} title="Configuración">
            ⚙️
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Fila de acciones: SÍ, NO, HABLAR, MUTE */}
        <section className={styles.actionsRow}>
          <button 
            className={`${styles.actionButton} ${styles.yesButton}`}
            onClick={handleYes}
            disabled={isSpeaking}
          >
            SÍ
          </button>
          <button 
            className={`${styles.actionButton} ${styles.noButton}`}
            onClick={handleNo}
            disabled={isSpeaking}
          >
            NO
          </button>
          <button 
            className={`${styles.actionButton} ${styles.speakButton}`}
            onClick={handleSpeak}
            disabled={!currentText.trim() || isSpeaking}
          >
            {isSpeaking ? '...' : 'HABLAR'}
          </button>
          <button 
            className={`${styles.actionButton} ${styles.muteButton} ${isKeySoundMuted ? styles.muted : ''}`}
            onClick={handleToggleKeySound}
          >
            {isKeySoundMuted ? '🔇' : '🔊'}
          </button>
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

      {/* Panel de Historial */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        profileId={profile?.id}
        onRepeat={handleRepeatFromHistory}
        onInsert={handleInsertFromHistory}
      />
    </div>
  )
}

export default App
