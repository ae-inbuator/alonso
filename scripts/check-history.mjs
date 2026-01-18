/**
 * Script para ver el historial de mensajes desde la terminal
 * Ejecutar: node scripts/check-history.mjs
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mqvdtufnfcriehmcosbd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xdmR0dWZuZmNyaWVobWNvc2JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MDQxMzgsImV4cCI6MjA4NDE4MDEzOH0.5-x2o8YARp0dh1IbkJpAie0IJcfqFiL_oLmdUH9OP3I'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkHistory() {
  console.log('\n📜 HISTORIAL DE MENSAJES\n')
  console.log('='.repeat(60))
  
  const { data, error } = await supabase
    .from('message_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)
  
  if (error) {
    console.error('❌ Error:', error.message)
    return
  }
  
  if (!data || data.length === 0) {
    console.log('📭 No hay mensajes en el historial todavía.')
    console.log('\nPrueba escribir algo en la app y tocar HABLAR.')
    return
  }
  
  console.log(`✅ ${data.length} mensajes encontrados:\n`)
  
  data.forEach((msg, i) => {
    const fecha = new Date(msg.created_at).toLocaleString('es-MX')
    const ai = msg.was_ai_assisted ? '🤖' : '  '
    console.log(`${i + 1}. ${ai} "${msg.text}"`)
    console.log(`   📅 ${fecha} | 📊 Usado ${msg.use_count}x`)
    console.log('')
  })
  
  console.log('='.repeat(60))
  console.log('🤖 = Usó sugerencia de IA')
}

checkHistory()
