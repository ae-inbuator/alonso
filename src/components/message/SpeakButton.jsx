/**
 * SpeakButton - Botón para convertir texto a voz
 * 
 * Props:
 * - onClick: function - Handler al presionar
 * - disabled: boolean - Deshabilitar si no hay texto
 * - isSpeaking: boolean - Si está reproduciendo audio
 */

import styles from './SpeakButton.module.css'

export default function SpeakButton({ 
  onClick, 
  disabled = false,
  isSpeaking = false 
}) {
  
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick()
    }
  }
  
  const buttonClass = `${styles.speakButton} ${isSpeaking ? styles.speaking : ''}`
  
  return (
    <button
      type="button"
      className={buttonClass}
      onClick={handleClick}
      disabled={disabled}
      aria-label={isSpeaking ? 'Hablando...' : 'Hablar'}
      title={disabled ? 'Escribe algo primero' : 'Presiona para hablar'}
    >
      <span className={styles.icon}>
        {isSpeaking ? '🔊' : '🔈'}
      </span>
      <span className={styles.label}>
        {isSpeaking ? 'Hablando' : 'Hablar'}
      </span>
    </button>
  )
}
