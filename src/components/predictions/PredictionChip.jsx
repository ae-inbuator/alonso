/**
 * PredictionChip - Botón individual de predicción
 * 
 * Props:
 * - word: string - La palabra sugerida
 * - onClick: function - Handler al seleccionar
 * - isAI: boolean - Si viene de IA (para estilo diferente)
 */

import styles from './PredictionChip.module.css'

export default function PredictionChip({ word, onClick, isAI = false }) {
  
  const handleClick = () => {
    if (onClick) {
      onClick(word)
    }
  }
  
  const chipClass = isAI 
    ? `${styles.chip} ${styles.chipAI}` 
    : styles.chip
  
  return (
    <button
      type="button"
      className={chipClass}
      onClick={handleClick}
      aria-label={`Seleccionar: ${word}`}
    >
      {word}
      {isAI && <span className={styles.aiIndicator}>🤖</span>}
    </button>
  )
}
