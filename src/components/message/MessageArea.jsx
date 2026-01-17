/**
 * MessageArea - Área donde se muestra el texto que el usuario escribe
 * 
 * Props:
 * - text: string - El texto actual
 * - placeholder: string - Texto a mostrar cuando está vacío
 * - onClear: function - Handler para limpiar el texto
 * - showCursor: boolean - Mostrar cursor parpadeante (default: true)
 */

import styles from './MessageArea.module.css'

export default function MessageArea({ 
  text = '', 
  placeholder = 'Escribe tu mensaje...', 
  onClear,
  showCursor = true 
}) {
  
  const hasText = text.length > 0
  
  return (
    <div className={styles.container}>
      {/* Caja del mensaje */}
      <div className={styles.messageBox}>
        {hasText ? (
          <>
            {text}
            {showCursor && <span className={styles.cursor} />}
          </>
        ) : (
          <>
            <span className={styles.placeholder}>{placeholder}</span>
            {showCursor && <span className={styles.cursor} />}
          </>
        )}
      </div>
      
      {/* Botón limpiar */}
      <button
        type="button"
        className={`${styles.clearButton} ${!hasText ? styles.hidden : ''}`}
        onClick={onClear}
        aria-label="Limpiar mensaje"
        title="Limpiar todo"
      >
        ✕
      </button>
    </div>
  )
}
