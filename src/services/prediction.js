/**
 * Servicio de Predicción Local
 * 
 * Busca palabras que coincidan con lo que el usuario está escribiendo.
 * Prioriza:
 * 1. Palabras del vocabulario personal (personal_vocab de Supabase)
 * 2. Palabras más cortas/comunes primero
 */

import { searchWords } from '../utils/spanishWords'

/**
 * Obtiene la última palabra que el usuario está escribiendo
 * @param {string} text - Texto completo
 * @returns {string} - Última palabra parcial
 */
export function getCurrentWord(text) {
  if (!text) return ''
  
  // Obtener la última palabra (después del último espacio)
  const words = text.split(' ')
  const lastWord = words[words.length - 1]
  
  return lastWord || ''
}

/**
 * Busca predicciones basadas en el texto actual
 * @param {string} text - Texto completo que el usuario ha escrito
 * @param {Array} personalVocab - Palabras personalizadas del usuario (opcional)
 * @param {number} limit - Número máximo de predicciones
 * @returns {Array} - Lista de palabras sugeridas
 */
export function getPredictions(text, personalVocab = [], limit = 3) {
  const currentWord = getCurrentWord(text)
  
  // Si no hay palabra actual o es muy corta, no mostrar predicciones
  if (!currentWord || currentWord.length < 1) {
    return []
  }
  
  const normalizedWord = currentWord.toLowerCase()
  const predictions = []
  const seen = new Set()
  
  // 1. Primero buscar en vocabulario personal
  if (personalVocab && personalVocab.length > 0) {
    for (const item of personalVocab) {
      const word = item.word || item
      if (word.toLowerCase().startsWith(normalizedWord)) {
        const capitalized = capitalizeIfNeeded(word, currentWord)
        if (!seen.has(capitalized.toLowerCase())) {
          predictions.push({
            word: capitalized,
            source: 'personal',
            priority: item.priority || 10
          })
          seen.add(capitalized.toLowerCase())
        }
      }
    }
  }
  
  // 2. Luego buscar en diccionario general
  const dictionaryResults = searchWords(normalizedWord, limit * 2)
  
  for (const word of dictionaryResults) {
    const capitalized = capitalizeIfNeeded(word, currentWord)
    if (!seen.has(capitalized.toLowerCase())) {
      predictions.push({
        word: capitalized,
        source: 'dictionary',
        priority: 5
      })
      seen.add(capitalized.toLowerCase())
    }
  }
  
  // 3. Ordenar por prioridad y limitar resultados
  predictions.sort((a, b) => b.priority - a.priority)
  
  // 4. Devolver solo las palabras (sin metadata)
  return predictions.slice(0, limit).map(p => p.word)
}

/**
 * Capitaliza la palabra si el usuario empezó con mayúscula
 */
function capitalizeIfNeeded(word, original) {
  if (!original || original.length === 0) return word
  
  // Si el original empieza con mayúscula, capitalizar la sugerencia
  if (original[0] === original[0].toUpperCase()) {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }
  
  return word
}

/**
 * Reemplaza la palabra actual con la predicción seleccionada
 * @param {string} text - Texto completo actual
 * @param {string} prediction - Palabra seleccionada
 * @returns {string} - Nuevo texto con la predicción insertada
 */
export function applyPrediction(text, prediction) {
  if (!text) return prediction + ' '
  
  const words = text.split(' ')
  
  // Reemplazar la última palabra con la predicción
  words[words.length - 1] = prediction
  
  // Agregar espacio al final para continuar escribiendo
  return words.join(' ') + ' '
}

export default {
  getCurrentWord,
  getPredictions,
  applyPrediction
}
