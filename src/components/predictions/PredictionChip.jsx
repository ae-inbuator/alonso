/**
 * PredictionChip - Botón individual de predicción
 * 
 * Props:
 * - word: string - La palabra/frase sugerida
 * - onClick: function - Handler al seleccionar
 * - isAI: boolean - Si viene de IA
 * - fullText: string - (solo IA) El texto completo resultante
 */

import styles from './PredictionChip.module.css'

export default function PredictionChip({ 
  word, 
  onClick, 
  isAI = false,
  fullText = null 
}) {
  
  const handleClick = () => {
    if (onClick) {
      // Para IA, pasamos el fullText (texto completo)
      // Para palabras normales, pasamos word
      onClick(isAI && fullText ? fullText : word)
    }
  }
  
  // Para sugerencias de IA, mostrar el texto COMPLETO
  if (isAI && fullText) {
    return (
      <button
        type="button"
        className={`${styles.chip} ${styles.chipAI}`}
        onClick={handleClick}
        aria-label={`Seleccionar: ${fullText}`}
      >
        <span className={styles.fullText}>{fullText}</span>
        <span className={styles.aiIndicator}>🤖</span>
      </button>
    )
  }
  
  // Para palabras normales (predicción local)
  return (
    <button
      type="button"
      className={styles.chip}
      onClick={handleClick}
      aria-label={`Seleccionar: ${word}`}
    >
      {word}
    </button>
  )
}
