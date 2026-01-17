/**
 * Key - Botón individual del teclado AAC
 * 
 * Props:
 * - value: string - El valor de la tecla (letra, símbolo, o tipo especial)
 * - label: string - Texto a mostrar (opcional, usa value por defecto)
 * - type: 'letter' | 'space' | 'backspace' | 'punctuation' | 'special'
 * - onClick: function - Handler al presionar
 * - icon: ReactNode - Icono opcional en lugar de texto
 */

import styles from './Key.module.css'

export default function Key({ 
  value, 
  label, 
  type = 'letter', 
  onClick,
  icon 
}) {
  
  // Determinar las clases CSS según el tipo
  const getClassName = () => {
    const classes = [styles.key]
    
    switch (type) {
      case 'space':
        classes.push(styles.space)
        break
      case 'backspace':
        classes.push(styles.backspace)
        break
      case 'punctuation':
        classes.push(styles.punctuation)
        break
      case 'special':
        classes.push(styles.special)
        break
      default:
        // 'letter' no necesita clase extra
        break
    }
    
    return classes.join(' ')
  }
  
  // Handler del click
  const handleClick = () => {
    if (onClick) {
      onClick(value, type)
    }
  }
  
  // Determinar qué mostrar en la tecla
  const renderContent = () => {
    if (icon) {
      return icon
    }
    return label || value
  }
  
  return (
    <button
      type="button"
      className={getClassName()}
      onClick={handleClick}
      aria-label={type === 'backspace' ? 'Borrar' : value}
    >
      {renderContent()}
    </button>
  )
}
