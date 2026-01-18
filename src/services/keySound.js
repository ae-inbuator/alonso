/**
 * Servicio de feedback de audio para teclas
 * Usa Web Speech API para decir la letra tocada
 */

let isMuted = false

// Cargar preferencia guardada
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('aac-key-sound-muted')
  isMuted = saved === 'true'
}

/**
 * Dice una letra o texto corto
 * @param {string} text - Letra o texto a decir
 */
export function speakKey(text) {
  if (isMuted) return
  if (!window.speechSynthesis) return
  
  // Cancelar cualquier utterance anterior para que sea instantáneo
  window.speechSynthesis.cancel()
  
  // Mapear caracteres especiales a palabras
  const specialChars = {
    ' ': 'espacio',
    '.': 'punto',
    ',': 'coma',
    '?': 'interrogación',
    '!': 'exclamación',
    '¿': 'abre interrogación',
    '¡': 'abre exclamación',
    'Ñ': 'eñe',
    'ñ': 'eñe',
  }
  
  const toSpeak = specialChars[text] || text
  
  const utterance = new SpeechSynthesisUtterance(toSpeak)
  utterance.lang = 'es-MX'
  utterance.rate = 1.3  // Un poco más rápido para feedback
  utterance.pitch = 1.0
  utterance.volume = 0.7  // No tan fuerte
  
  window.speechSynthesis.speak(utterance)
}

/**
 * Dice "borrar" cuando se toca backspace
 */
export function speakBackspace() {
  if (isMuted) return
  if (!window.speechSynthesis) return
  
  window.speechSynthesis.cancel()
  
  const utterance = new SpeechSynthesisUtterance('borrar')
  utterance.lang = 'es-MX'
  utterance.rate = 1.3
  utterance.volume = 0.7
  
  window.speechSynthesis.speak(utterance)
}

/**
 * Obtiene el estado de mute
 * @returns {boolean}
 */
export function getIsMuted() {
  return isMuted
}

/**
 * Cambia el estado de mute
 * @param {boolean} muted
 */
export function setMuted(muted) {
  isMuted = muted
  if (typeof window !== 'undefined') {
    localStorage.setItem('aac-key-sound-muted', String(muted))
  }
}

/**
 * Toggle mute
 * @returns {boolean} Nuevo estado
 */
export function toggleMute() {
  setMuted(!isMuted)
  return isMuted
}

export default {
  speakKey,
  speakBackspace,
  getIsMuted,
  setMuted,
  toggleMute
}
