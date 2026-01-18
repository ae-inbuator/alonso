/**
 * PredictionBar - Barra que muestra las predicciones de palabras y frases IA
 * 
 * Props:
 * - predictions: Array<string> - Lista de palabras sugeridas (locales)
 * - onSelect: function(word) - Handler al seleccionar una predicción local
 * - loading: boolean - Si está cargando predicciones de IA
 * - aiPredictions: Array<{full, addition}> - Predicciones de IA (continuaciones)
 * - onAISelect: function(fullText) - Handler al seleccionar una predicción de IA
 */

import PredictionChip from './PredictionChip'
import styles from './PredictionBar.module.css'

export default function PredictionBar({ 
  predictions = [], 
  onSelect,
  loading = false,
  aiPredictions = [],
  onAISelect
}) {
  
  const hasPredictions = predictions.length > 0 || aiPredictions.length > 0
  
  return (
    <div className={styles.bar}>
      {/* Predicciones locales (palabras) */}
      {predictions.map((word, index) => (
        <PredictionChip
          key={`local-${index}-${word}`}
          word={word}
          onClick={onSelect}
        />
      ))}
      
      {/* Separador si hay ambos tipos */}
      {predictions.length > 0 && (aiPredictions.length > 0 || loading) && (
        <div className={styles.separator}>|</div>
      )}
      
      {/* Indicador de carga de IA */}
      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>🤖</span>
        </div>
      )}
      
      {/* Predicciones de IA (texto completo) */}
      {!loading && aiPredictions.map((suggestion, index) => (
        <PredictionChip
          key={`ai-${index}-${suggestion.full}`}
          word={suggestion.full}
          onClick={() => onAISelect && onAISelect(suggestion.full)}
          isAI={true}
          fullText={suggestion.full}
        />
      ))}
      
      {/* Estado vacío (solo si no hay nada) */}
      {!hasPredictions && !loading && (
        <span className={styles.empty}>Escribe para ver sugerencias...</span>
      )}
    </div>
  )
}
