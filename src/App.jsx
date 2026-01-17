import { useEffect, useState } from 'react'
import { supabase } from './services/supabase'
import { Keyboard } from './components/keyboard'
import { MessageArea, SpeakButton } from './components/message'
import styles from './App.module.css'

function App() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentText, setCurrentText] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)

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

  // Handlers del teclado
  const handleKeyPress = (char) => {
    setCurrentText(prev => prev + char)
  }

  const handleBackspace = () => {
    setCurrentText(prev => prev.slice(0, -1))
  }

  const handleSpace = () => {
    setCurrentText(prev => prev + ' ')
  }

  const handleClear = () => {
    setCurrentText('')
  }

  // Handler del botón hablar (por ahora simulado)
  const handleSpeak = () => {
    if (!currentText.trim()) return
    
    setIsSpeaking(true)
    
    // TODO: Aquí irá la llamada a ElevenLabs
    // Por ahora simulamos con el TTS del navegador
    const utterance = new SpeechSynthesisUtterance(currentText)
    utterance.lang = 'es-MX'
    utterance.rate = 0.9
    
    utterance.onend = () => {
      setIsSpeaking(false)
      // Opcional: limpiar después de hablar
      // setCurrentText('')
    }
    
    utterance.onerror = () => {
      setIsSpeaking(false)
    }
    
    window.speechSynthesis.speak(utterance)
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

      {/* Footer (debug info - temporal) */}
      <footer className={styles.footer}>
        ✅ {profile?.name} | Teclado: {profile?.keyboard_layout} | Caracteres: {currentText.length}
      </footer>
    </div>
  )
}

export default App
