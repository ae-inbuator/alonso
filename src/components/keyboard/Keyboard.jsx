/**
 * Keyboard - Teclado ABC completo para AAC
 * 
 * Props:
 * - onKeyPress: function(char) - Cuando se presiona una letra/símbolo
 * - onBackspace: function() - Cuando se presiona borrar
 * - onSpace: function() - Cuando se presiona espacio
 */

import Key from './Key'
import styles from './Keyboard.module.css'

// Layout del teclado ABC en español
const ROWS = [
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
  ['K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S'],
  ['T', 'U', 'V', 'W', 'X', 'Y', 'Z']
]

const PUNCTUATION = ['.', ',', '?', '!', '¿', '¡']

export default function Keyboard({ onKeyPress, onBackspace, onSpace }) {
  
  // Handler general que distribuye según el tipo
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
      {/* Filas de letras A-S */}
      {ROWS.slice(0, 2).map((row, rowIndex) => (
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
      
      {/* Fila T-Z con Borrar */}
      <div className={styles.row}>
        {ROWS[2].map(letter => (
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
      
      {/* Fila de espacio */}
      <div className={styles.rowBottom}>
        <Key
          value=" "
          label="ESPACIO"
          type="space"
          onClick={handleClick}
        />
      </div>
      
      {/* Fila de puntuación */}
      <div className={styles.rowPunctuation}>
        {PUNCTUATION.map(punct => (
          <Key
            key={punct}
            value={punct}
            type="punctuation"
            onClick={handleClick}
          />
        ))}
      </div>
    </div>
  )
}
