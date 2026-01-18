/**
 * Servicio de Historial de Mensajes
 * 
 * Guarda y recupera mensajes hablados
 */

import { supabase } from './supabase'

/**
 * Guarda un mensaje en el historial
 * @param {object} params - Parámetros del mensaje
 * @param {string} params.text - Texto del mensaje
 * @param {string} params.profileId - ID del perfil
 * @param {string} params.contextId - ID del contexto activo (opcional)
 * @param {boolean} params.wasAIAssisted - Si usó sugerencia de IA
 * @returns {Promise<object>} - Mensaje guardado
 */
export async function saveMessage({ text, profileId, contextId = null, wasAIAssisted = false }) {
  if (!text || !text.trim()) {
    throw new Error('El mensaje no puede estar vacío')
  }

  const wordCount = text.trim().split(/\s+/).length

  const { data, error } = await supabase
    .from('message_history')
    .insert({
      text: text.trim(),
      profile_id: profileId,
      context_id: contextId,
      word_count: wordCount,
      was_ai_assisted: wasAIAssisted,
      use_count: 1
    })
    .select()
    .single()

  if (error) {
    console.error('Error guardando mensaje:', error)
    throw error
  }

  console.log('✅ Mensaje guardado en historial:', data)
  return data
}

/**
 * Obtiene el historial de mensajes
 * @param {string} profileId - ID del perfil
 * @param {object} options - Opciones de consulta
 * @param {number} options.limit - Número máximo de mensajes (default: 50)
 * @param {string} options.contextId - Filtrar por contexto (opcional)
 * @returns {Promise<Array>} - Lista de mensajes
 */
export async function getHistory(profileId, options = {}) {
  const { limit = 50, contextId = null } = options

  let query = supabase
    .from('message_history')
    .select(`
      *,
      context:context_id (name, icon)
    `)
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (contextId) {
    query = query.eq('context_id', contextId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error obteniendo historial:', error)
    throw error
  }

  return data || []
}

/**
 * Obtiene los mensajes más usados (frecuentes)
 * @param {string} profileId - ID del perfil
 * @param {number} limit - Número máximo de mensajes
 * @returns {Promise<Array>} - Lista de mensajes frecuentes
 */
export async function getFrequentMessages(profileId, limit = 10) {
  const { data, error } = await supabase
    .from('message_history')
    .select('*')
    .eq('profile_id', profileId)
    .order('use_count', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error obteniendo mensajes frecuentes:', error)
    throw error
  }

  return data || []
}

/**
 * Incrementa el contador de uso de un mensaje
 * (cuando se repite un mensaje del historial)
 * @param {string} messageId - ID del mensaje
 * @returns {Promise<object>} - Mensaje actualizado
 */
export async function incrementUseCount(messageId) {
  // Primero obtener el uso actual
  const { data: current, error: fetchError } = await supabase
    .from('message_history')
    .select('use_count')
    .eq('id', messageId)
    .single()

  if (fetchError) {
    console.error('Error obteniendo mensaje:', fetchError)
    throw fetchError
  }

  // Incrementar
  const { data, error } = await supabase
    .from('message_history')
    .update({ use_count: (current.use_count || 1) + 1 })
    .eq('id', messageId)
    .select()
    .single()

  if (error) {
    console.error('Error actualizando uso:', error)
    throw error
  }

  return data
}

/**
 * Elimina un mensaje del historial
 * @param {string} messageId - ID del mensaje
 * @returns {Promise<void>}
 */
export async function deleteMessage(messageId) {
  const { error } = await supabase
    .from('message_history')
    .delete()
    .eq('id', messageId)

  if (error) {
    console.error('Error eliminando mensaje:', error)
    throw error
  }
}

/**
 * Obtiene los últimos N mensajes (para contexto de IA)
 * @param {string} profileId - ID del perfil
 * @param {number} limit - Número de mensajes
 * @returns {Promise<Array>} - Lista de mensajes recientes
 */
export async function getRecentMessages(profileId, limit = 5) {
  const { data, error } = await supabase
    .from('message_history')
    .select('text, created_at')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error obteniendo mensajes recientes:', error)
    throw error
  }

  // Devolver en orden cronológico (más antiguo primero)
  return (data || []).reverse()
}

export default {
  saveMessage,
  getHistory,
  getFrequentMessages,
  incrementUseCount,
  deleteMessage,
  getRecentMessages
}
