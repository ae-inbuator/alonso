/**
 * PhraseButton - Botón individual de frase rápida
 * 
 * Props:
 * - phrase: object - { text, icon, is_favorite }
 * - onClick: function - Handler al presionar
 */

import styles from './PhraseButton.module.css'

export default function PhraseButton({ phrase, onClick }) {
  
  const handleClick = () => {
    if (onClick) {
      onClick(phrase)
    }
  }
  
  const buttonClass = phrase.is_favorite 
    ? `${styles.button} ${styles.favorite}`
    : styles.button
  
  // Acortar texto para mostrar si es muy largo
  const displayText = phrase.text.length > 20 
    ? phrase.text.substring(0, 18) + '...'
    : phrase.text
  
  return (
    <button
      type="button"
      className={buttonClass}
      onClick={handleClick}
      title={phrase.text}
      aria-label={`Frase: ${phrase.text}`}
    >
      {phrase.icon && (
        <span className={styles.icon}>{phrase.icon}</span>
      )}
      <span className={styles.text}>{displayText}</span>
    </button>
  )
}
