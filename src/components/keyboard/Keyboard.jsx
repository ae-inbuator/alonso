/**
 * Keyboard - Teclado ABC GRANDE (7 letras por fila)
 */

import Key from './Key'
import styles from './Keyboard.module.css'

// Layout: 7 letras por fila para teclas más grandes
const ROWS = [
  ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  ['H', 'I', 'J', 'K', 'L', 'M', 'N'],
  ['Ñ', 'O', 'P', 'Q', 'R', 'S', 'T'],
  ['U', 'V', 'W', 'X', 'Y', 'Z']
]

export default function Keyboard({ onKeyPress, onBackspace, onSpace }) {
  
  const handleClick = (value, type) => {
    switch (type) {
      case 'backspace':
        if (onBackspace) onBackspace()
        break
      case 'space':
        if (onSpace) onSpace()
        break
      default:
        if (onKeyPress) onKeyPress(value)
        break
    }
  }
  
  return (
    <div className={styles.keyboard}>
      {/* Filas A-G, H-N, Ñ-T */}
      {ROWS.slice(0, 3).map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map(letter => (
            <Key
              key={letter}
              value={letter}
              onClick={handleClick}
            />
          ))}
        </div>
      ))}
      
      {/* Fila U-Z + Borrar */}
      <div className={styles.row}>
        {ROWS[3].map(letter => (
          <Key
            key={letter}
            value={letter}
            onClick={handleClick}
          />
        ))}
        <Key
          value="backspace"
          label="⌫"
          type="backspace"
          onClick={handleClick}
        />
      </div>
      
      {/* ESPACIO */}
      <div className={styles.row}>
        <Key
          value=" "
          label="ESPACIO"
          type="space"
          onClick={handleClick}
        />
      </div>
    </div>
  )
}
