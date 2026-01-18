/**
 * HistoryPanel - Panel modal para ver y repetir mensajes anteriores
 */

import { useState, useEffect } from 'react'
import { getHistory, incrementUseCount } from '../../services/history'
import styles from './HistoryPanel.module.css'

export default function HistoryPanel({ 
  isOpen, 
  onClose, 
  profileId,
  onRepeat,  // Función para repetir (hablar) un mensaje
  onInsert   // Función para insertar texto en el área de mensaje
}) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar historial cuando se abre
  useEffect(() => {
    if (isOpen && profileId) {
      loadHistory()
    }
  }, [isOpen, profileId])

  async function loadHistory() {
    setLoading(true)
    setError(null)
    try {
      const data = await getHistory(profileId, { limit: 50 })
      setMessages(data)
    } catch (err) {
      console.error('Error cargando historial:', err)
      setError('No se pudo cargar el historial')
    } finally {
      setLoading(false)
    }
  }

  // Repetir mensaje (hablar)
  async function handleRepeat(message) {
    try {
      await incrementUseCount(message.id)
      if (onRepeat) {
        onRepeat(message.text)
      }
      onClose()
    } catch (err) {
      console.error('Error al repetir:', err)
    }
  }

  // Insertar mensaje en área de texto
  function handleInsert(message) {
    if (onInsert) {
      onInsert(message.text)
    }
    onClose()
  }

  // Formatear fecha relativa
  function formatDate(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Ahora'
    if (diffMins < 60) return `Hace ${diffMins} min`
    if (diffHours < 24) return `Hace ${diffHours} hr`
    if (diffDays < 7) return `Hace ${diffDays} días`
    
    return date.toLocaleDateString('es-MX', { 
      day: 'numeric', 
      month: 'short' 
    })
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>📜 Historial</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {loading && (
            <div className={styles.loading}>Cargando...</div>
          )}

          {error && (
            <div className={styles.error}>{error}</div>
          )}

          {!loading && !error && messages.length === 0 && (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>📭</span>
              <p>No hay mensajes todavía</p>
              <p className={styles.emptyHint}>Los mensajes que digas aparecerán aquí</p>
            </div>
          )}

          {!loading && !error && messages.length > 0 && (
            <ul className={styles.list}>
              {messages.map((msg) => (
                <li key={msg.id} className={styles.item}>
                  <div className={styles.messageContent}>
                    <p className={styles.text}>{msg.text}</p>
                    <div className={styles.meta}>
                      <span className={styles.time}>{formatDate(msg.created_at)}</span>
                      {msg.was_ai_assisted && <span className={styles.aiTag}>🤖</span>}
                      {msg.use_count > 1 && (
                        <span className={styles.useCount}>×{msg.use_count}</span>
                      )}
                      {msg.context?.icon && (
                        <span className={styles.context}>{msg.context.icon}</span>
                      )}
                    </div>
                  </div>
                  <div className={styles.actions}>
                    <button 
                      className={styles.repeatButton}
                      onClick={() => handleRepeat(msg)}
                      title="Repetir (hablar)"
                    >
                      🔊
                    </button>
                    <button 
                      className={styles.insertButton}
                      onClick={() => handleInsert(msg)}
                      title="Insertar en texto"
                    >
                      ➕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
