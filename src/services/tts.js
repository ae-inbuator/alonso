/**
 * Servicio de Text-to-Speech con ElevenLabs
 * 
 * Documentación: https://elevenlabs.io/docs/api-reference/text-to-speech
 */

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY
const BASE_URL = 'https://api.elevenlabs.io/v1'

// Voces predeterminadas para español
// Puedes cambiar esto después de ver las voces disponibles
const DEFAULT_VOICES = {
  male: 'pNInz6obpgDQGcFmaJgB',    // Adam - voz masculina
  female: '21m00Tcm4TlvDq8ikWAM'   // Rachel - voz femenina
}

/**
 * Configuración por defecto para la voz
 */
const DEFAULT_VOICE_SETTINGS = {
  stability: 0.5,           // 0-1: Más alto = más estable/consistente
  similarity_boost: 0.75,   // 0-1: Qué tan similar a la voz original
  style: 0.0,               // 0-1: Exageración del estilo
  use_speaker_boost: true   // Mejora la calidad de la voz
}

/**
 * Convierte texto a audio usando ElevenLabs
 * @param {string} text - Texto a convertir
 * @param {object} options - Opciones adicionales
 * @returns {Promise<Blob>} - Audio en formato Blob
 */
export async function textToSpeech(text, options = {}) {
  const {
    voiceId = DEFAULT_VOICES.male,
    modelId = 'eleven_multilingual_v2',  // Mejor para español
    voiceSettings = DEFAULT_VOICE_SETTINGS
  } = options

  const url = `${BASE_URL}/text-to-speech/${voiceId}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: voiceSettings
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail?.message || `Error de ElevenLabs: ${response.status}`)
  }

  return await response.blob()
}

/**
 * Convierte texto a audio y lo reproduce
 * @param {string} text - Texto a hablar
 * @param {object} options - Opciones adicionales
 * @returns {Promise<HTMLAudioElement>} - Elemento de audio
 */
export async function speak(text, options = {}) {
  const { onStart, onEnd, onError } = options

  try {
    if (onStart) onStart()

    const audioBlob = await textToSpeech(text, options)
    const audioUrl = URL.createObjectURL(audioBlob)
    const audio = new Audio(audioUrl)

    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
        if (onEnd) onEnd()
        resolve(audio)
      }

      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl)
        if (onError) onError(error)
        reject(error)
      }

      audio.play()
    })
  } catch (error) {
    if (onError) onError(error)
    throw error
  }
}

/**
 * Obtiene la lista de voces disponibles
 * @returns {Promise<Array>} - Lista de voces
 */
export async function getVoices() {
  const response = await fetch(`${BASE_URL}/voices`, {
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY
    }
  })

  if (!response.ok) {
    throw new Error(`Error al obtener voces: ${response.status}`)
  }

  const data = await response.json()
  return data.voices
}

/**
 * Obtiene información de una voz específica
 * @param {string} voiceId - ID de la voz
 * @returns {Promise<object>} - Información de la voz
 */
export async function getVoice(voiceId) {
  const response = await fetch(`${BASE_URL}/voices/${voiceId}`, {
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY
    }
  })

  if (!response.ok) {
    throw new Error(`Error al obtener voz: ${response.status}`)
  }

  return await response.json()
}

export default {
  textToSpeech,
  speak,
  getVoices,
  getVoice,
  DEFAULT_VOICES
}
