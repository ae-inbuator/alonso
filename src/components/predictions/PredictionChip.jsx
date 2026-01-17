/**
 * PredictionChip - Botón individual de predicción
 * 
 * Props:
 * - word: string - La palabra/frase sugerida
 * - onClick: function - Handler al seleccionar
 * - isAI: boolean - Si viene de IA
 * - addition: string - (solo IA) La parte que se va a agregar
 * - fullText: string - (solo IA) El texto completo resultante
 */

import styles from './PredictionChip.module.css'

export default function PredictionChip({ 
  word, 
  onClick, 
  isAI = false,
  addition = null,
  fullText = null 
}) {
  
  const handleClick = () => {
    if (onClick) {
      // Para IA, pasamos el fullText (texto completo)
      // Para palabras normales, pasamos word
      onClick(isAI && fullText ? fullText : word)
    }
  }
  
  // Para sugerencias de IA, mostrar "... + adición"
  if (isAI && addition) {
    return (
      <button
        type="button"
        className={`${styles.chip} ${styles.chipAI}`}
        onClick={handleClick}
        aria-label={`Agregar: ${addition}`}
        title={`Resultado: ${fullText}`}
      >
        <span className={styles.aiPrefix}>+</span>
        <span className={styles.addition}>{addition}</span>
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
