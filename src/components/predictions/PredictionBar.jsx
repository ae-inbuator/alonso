/**
 * PredictionBar - Barra que muestra las predicciones de palabras
 * 
 * Props:
 * - predictions: Array<string> - Lista de palabras sugeridas
 * - onSelect: function(word) - Handler al seleccionar una predicción
 * - loading: boolean - Si está cargando predicciones de IA
 * - aiPredictions: Array<string> - Predicciones de IA (opcional)
 */

import PredictionChip from './PredictionChip'
import styles from './PredictionBar.module.css'

export default function PredictionBar({ 
  predictions = [], 
  onSelect,
  loading = false,
  aiPredictions = []
}) {
  
  const hasPredictions = predictions.length > 0 || aiPredictions.length > 0
  
  // Si está cargando IA
  if (loading) {
    return (
      <div className={styles.bar}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Pensando...</span>
        </div>
      </div>
    )
  }
  
  // Si no hay predicciones
  if (!hasPredictions) {
    return (
      <div className={styles.bar}>
        <span className={styles.empty}>Escribe para ver sugerencias...</span>
      </div>
    )
  }
  
  return (
    <div className={styles.bar}>
      {/* Predicciones locales */}
      {predictions.map((word, index) => (
        <PredictionChip
          key={`local-${index}-${word}`}
          word={word}
          onClick={onSelect}
        />
      ))}
      
      {/* Predicciones de IA (futuro) */}
      {aiPredictions.map((word, index) => (
        <PredictionChip
          key={`ai-${index}-${word}`}
          word={word}
          onClick={onSelect}
          isAI={true}
        />
      ))}
    </div>
  )
}
