import { useEffect, useState, useMemo } from 'react'
import { supabase } from './services/supabase'
import { getPredictions, applyPrediction } from './services/prediction'
import { speak } from './services/tts'
import { Keyboard } from './components/keyboard'
import { MessageArea, SpeakButton } from './components/message'
import { PredictionBar } from './components/predictions'
import { PhrasesPanel } from './components/phrases'
import styles from './App.module.css'

function App() {
  const [profile, setProfile] = useState(null)
  const [phrases, setPhrases] = useState([])
  const [loading, setLoading] = useState(true)
  const [phrasesLoading, setPhrasesLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentText, setCurrentText] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [ttsError, setTtsError] = useState(null)

  // Cargar perfil
  useEffect(() => {
    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('*')
          .single()

        if (error) throw error
        setProfile(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
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

  // Calcular predicciones basadas en el texto actual
  const predictions = useMemo(() => {
    return getPredictions(currentText, [], 3)
  }, [currentText])

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
  }

  // Handler de predicción seleccionada
  const handlePredictionSelect = (word) => {
    setCurrentText(prev => applyPrediction(prev, word))
  }

  // Handler de frase seleccionada
  const handlePhraseSelect = (phrase) => {
    // Insertar la frase en el texto actual
    setCurrentText(prev => {
      // Si hay texto, agregar espacio antes
      if (prev.trim()) {
        return prev.trim() + ' ' + phrase.text
      }
      return phrase.text
    })
    setTtsError(null)
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
      console.log('Usando TTS del navegador como fallback...')
      try {
        const utterance = new SpeechSynthesisUtterance(currentText)
        utterance.lang = 'es-MX'
        utterance.rate = 0.9
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)
        window.speechSynthesis.speak(utterance)
        setIsSpeaking(true)
        setTtsError('Usando voz del navegador (ElevenLabs no disponible)')
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
          <div className={styles.contextBadge}>
            🏠 Casa
          </div>
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
            phrases={phrases}
            onPhraseSelect={handlePhraseSelect}
            loading={phrasesLoading}
          />
        </section>

        {/* Barra de predicciones */}
        <section className={styles.predictionsSection}>
          <PredictionBar
            predictions={predictions}
            onSelect={handlePredictionSelect}
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
        ✅ {profile?.name} | 🔊 ElevenLabs | 📝 {phrases.length} frases
      </footer>
    </div>
  )
}

export default App
