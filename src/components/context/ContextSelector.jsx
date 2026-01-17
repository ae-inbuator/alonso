/**
 * ContextSelector - Dropdown para seleccionar contexto activo
 * 
 * Props:
 * - contexts: Array - Lista de contextos desde Supabase
 * - activeContext: object - Contexto actualmente seleccionado
 * - onSelect: function(context) - Handler al seleccionar
 * - phraseCounts: object - Conteo de frases por contexto { contextId: count }
 */

import { useState } from 'react'
import styles from './ContextSelector.module.css'

export default function ContextSelector({ 
  contexts = [], 
  activeContext,
  onSelect,
  phraseCounts = {}
}) {
  const [isOpen, setIsOpen] = useState(false)
  
  const handleToggle = () => {
    setIsOpen(prev => !prev)
  }
  
  const handleSelect = (context) => {
    if (onSelect) {
      onSelect(context)
    }
    setIsOpen(false)
  }
  
  const handleClose = () => {
    setIsOpen(false)
  }
  
  // Si no hay contexto activo, mostrar placeholder
  const displayContext = activeContext || { name: 'Seleccionar', icon: '📍' }
  
  return (
    <div className={styles.container}>
      {/* Botón trigger */}
      <button
        type="button"
        className={styles.trigger}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={styles.triggerIcon}>{displayContext.icon}</span>
        <span>{displayContext.name}</span>
        <span className={`${styles.triggerArrow} ${isOpen ? styles.triggerArrowOpen : ''}`}>
          ▼
        </span>
      </button>
      
      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Overlay para cerrar */}
          <div className={styles.overlay} onClick={handleClose} />
          
          {/* Menu */}
          <div className={styles.dropdown} role="listbox">
            {contexts.map(context => {
              const isActive = activeContext?.id === context.id
              const count = phraseCounts[context.id] || 0
              
              return (
                <button
                  key={context.id}
                  type="button"
                  className={`${styles.option} ${isActive ? styles.optionActive : ''}`}
                  onClick={() => handleSelect(context)}
                  role="option"
                  aria-selected={isActive}
                >
                  <span className={styles.optionIcon}>{context.icon}</span>
                  <div className={styles.optionInfo}>
                    <span className={styles.optionName}>{context.name}</span>
                    <span className={styles.optionCount}>{count} frases</span>
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
