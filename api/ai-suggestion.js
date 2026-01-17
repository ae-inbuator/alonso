/**
 * Vercel Serverless Function para sugerencias de IA
 * PROMPT INTELIGENTE - Analiza contexto, hora, tipo de oración
 */

export const config = {
  runtime: 'edge',
};

/**
 * Obtiene la información temporal (hora de México)
 */
function getTimeInfo() {
  // Usar timezone de México
  const ahora = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Mexico_City"}));
  const hora = ahora.getHours();
  const dia = ahora.getDay();
  
  let periodo;
  if (hora >= 5 && hora < 12) periodo = 'mañana';
  else if (hora >= 12 && hora < 15) periodo = 'mediodía';
  else if (hora >= 15 && hora < 19) periodo = 'tarde';
  else if (hora >= 19 && hora < 22) periodo = 'noche';
  else periodo = 'noche tarde';
  
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const nombreDia = dias[dia];
  const esFinDeSemana = dia === 0 || dia === 6;
  
  return { hora, periodo, nombreDia, esFinDeSemana };
}

/**
 * Analiza el texto para entender qué tipo de oración es
 */
function analyzeText(text) {
  const cleanText = text.trim().toLowerCase();
  const words = cleanText.split(/\s+/);
  const wordCount = words.length;
  const lastWord = words[words.length - 1] || '';
  
  let tipo = 'afirmación';
  
  if (cleanText.includes('¿') || cleanText.startsWith('qué') || cleanText.startsWith('cómo') ||
      cleanText.startsWith('cuándo') || cleanText.startsWith('dónde') || cleanText.startsWith('quién') ||
      cleanText.startsWith('cuánto') || cleanText.startsWith('por qué') || cleanText.startsWith('cuál')) {
    tipo = 'pregunta';
  }
  else if (cleanText.includes('necesito') || cleanText.includes('quiero') || cleanText.includes('tengo que') ||
           cleanText.includes('debo') || cleanText.includes('ayuda') || cleanText.includes('urgente')) {
    tipo = 'necesidad';
  }
  else if (cleanText.startsWith('hola') || cleanText.startsWith('buenos') || cleanText.startsWith('buenas') ||
           cleanText.startsWith('qué tal') || cleanText.startsWith('hey')) {
    tipo = 'saludo';
  }
  else if (cleanText.includes('adiós') || cleanText.includes('hasta luego') || cleanText.includes('nos vemos') ||
           cleanText.includes('bye') || cleanText.includes('chao')) {
    tipo = 'despedida';
  }
  else if (cleanText.includes('me siento') || cleanText.includes('estoy') || cleanText.includes('tengo miedo') ||
           cleanText.includes('estoy feliz') || cleanText.includes('estoy triste')) {
    tipo = 'emoción';
  }
  
  const palabraIncompleta = !text.endsWith(' ') && lastWord.length > 0 && lastWord.length < 6;
  const necesitaSustantivo = ['al', 'el', 'la', 'los', 'las', 'un', 'una', 'del', 'a', 'de', 'en', 'con', 'por', 'para'].includes(lastWord);
  const necesitaObjeto = ['quiero', 'necesito', 'tengo', 'voy', 'puedo', 'dame', 'trae', 'pon'].includes(lastWord);
  
  return { tipo, wordCount, lastWord, palabraIncompleta, necesitaSustantivo, necesitaObjeto };
}

/**
 * Calcula qué parte del texto completo es "nueva"
 */
function calculateAddition(original, complete) {
  const originalLower = original.toLowerCase().trim();
  const completeLower = complete.toLowerCase();
  
  if (completeLower.startsWith(originalLower)) {
    return complete.slice(original.trim().length);
  }
  
  const words = complete.split(' ');
  const firstWord = words[0].toLowerCase();
  
  if (firstWord.startsWith(originalLower.replace(/\s+$/, '').split(' ').pop().toLowerCase())) {
    const userLastWord = original.trim().split(' ').pop();
    const addition = complete.slice(userLastWord.length);
    return addition;
  }
  
  return complete.slice(original.length);
}

export default async function handler(request) {
  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { text, context = 'General' } = body;
    
    if (!text || text.trim().length < 2) {
      return new Response(JSON.stringify({ suggestions: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    
    if (!ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY no configurada');
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cleanText = text.trim();
    const timeInfo = getTimeInfo();
    const textAnalysis = analyzeText(cleanText);

    const systemPrompt = `Eres el copiloto de comunicación de Alonso, un adolescente mexicano que no puede hablar y usa esta app AAC para comunicarse.

TU MISIÓN: Maximizar su velocidad de comunicación (palabras por minuto) con sugerencias ÚTILES y PRECISAS.

═══════════════════════════════════════════════════════════
INFORMACIÓN DEL MOMENTO ACTUAL
═══════════════════════════════════════════════════════════
• Hora: ${timeInfo.hora}:00 (${timeInfo.periodo})
• Día: ${timeInfo.nombreDia}${timeInfo.esFinDeSemana ? ' (fin de semana)' : ''}
• Contexto/Lugar: ${context}
• Tipo de oración detectado: ${textAnalysis.tipo}
• Palabras escritas: ${textAnalysis.wordCount}
• Última palabra: "${textAnalysis.lastWord}"
• ¿Palabra incompleta?: ${textAnalysis.palabraIncompleta ? 'SÍ' : 'NO'}
• ¿Necesita sustantivo?: ${textAnalysis.necesitaSustantivo ? 'SÍ' : 'NO'}
• ¿Necesita objeto?: ${textAnalysis.necesitaObjeto ? 'SÍ' : 'NO'}

═══════════════════════════════════════════════════════════
REGLAS DE ORO
═══════════════════════════════════════════════════════════

1. COMPLETA PALABRAS INCOMPLETAS PRIMERO
   Si la última palabra está incompleta, tu PRIORIDAD es completarla.
   "HOL" → "Hola" (no "Hol a mamá")
   "QUIE" → "Quiero" 
   "NECE" → "Necesito"

2. USA EL CONTEXTO INTELIGENTEMENTE
   ${context === 'Casa' ? '• En CASA: familia, comida, descanso, TV, necesidades básicas' : ''}
   ${context === 'Escuela' ? '• En ESCUELA: maestros, compañeros, clases, tareas, recreo, preguntas académicas' : ''}
   ${context === 'Restaurante' ? '• En RESTAURANTE: pedir comida, menú, cuenta, mesero, bebidas' : ''}
   ${context === 'Terapia' ? '• En TERAPIA: emociones, cómo me siento, lo que pienso, preguntas del terapeuta' : ''}

3. USA LA HORA INTELIGENTEMENTE
   ${timeInfo.periodo === 'mañana' ? '• MAÑANA: desayuno, prepararse, ir a escuela, buenos días' : ''}
   ${timeInfo.periodo === 'mediodía' ? '• MEDIODÍA: almuerzo, hambre, recreo, mitad del día' : ''}
   ${timeInfo.periodo === 'tarde' ? '• TARDE: después de escuela, tarea, merienda, actividades' : ''}
   ${timeInfo.periodo === 'noche' ? '• NOCHE: cena, descanso, buenas noches, mañana' : ''}

4. PRIORIZA NECESIDADES BÁSICAS
   Si detectas palabras como "necesito", "quiero", "tengo", prioriza:
   → baño, agua, comida, ayuda, descanso, dolor

5. NO INVENTES LO QUE NO SABES
   - NO adivines cómo se siente (a menos que él lo diga)
   - NO inventes a dónde fue o qué hizo
   - Si el texto es largo/específico, solo da el SIGUIENTE PASO
   
6. CANTIDAD DE SUGERENCIA
   - Texto corto (1-2 palabras) → Puedes sugerir frase común completa
   - Texto medio (3-5 palabras) → Sugiere 2-4 palabras más
   - Texto largo (6+ palabras) → Sugiere solo 1-2 palabras (el mínimo para continuar)

═══════════════════════════════════════════════════════════
EJEMPLOS POR SITUACIÓN
═══════════════════════════════════════════════════════════

PALABRA INCOMPLETA:
"HOL" → "Hola" / "Hola, ¿cómo estás?"
"QUIE" → "Quiero" / "Quiero ir"
"NECE" → "Necesito" / "Necesito ayuda"

NECESIDAD BÁSICA:
"Necesito ir al" → "Necesito ir al baño" / "Necesito ir al doctor"
"Tengo mucha" → "Tengo mucha hambre" / "Tengo mucha sed"
"Me duele" → "Me duele la cabeza" / "Me duele el estómago"

SALUDO (varía según hora):
"Hola" (mañana) → "Hola, buenos días" / "Hola, ¿cómo amaneciste?"
"Hola" (tarde) → "Hola, buenas tardes" / "Hola, ¿cómo te fue?"
"Hola" (noche) → "Hola, buenas noches" / "Hola, ¿cómo estuvo tu día?"

CONTEXTO ESCUELA:
"No entendí" → "No entendí la tarea" / "No entendí, ¿puede repetir?"
"Tengo una" → "Tengo una pregunta" / "Tengo una duda"

CONTEXTO RESTAURANTE:
"Quiero" → "Quiero ordenar" / "Quiero la cuenta"
"Me trae" → "Me trae la carta" / "Me trae más agua"

CONTEXTO CASA (noche):
"Ya quiero" → "Ya quiero dormir" / "Ya quiero descansar"
"Tengo" → "Tengo sueño" / "Tengo hambre"

TEXTO LARGO (solo siguiente paso):
"Hoy en la escuela me fue" → "Hoy en la escuela me fue bien" / "Hoy en la escuela me fue mal"
"Ayer cuando llegué a casa" → "Ayer cuando llegué a casa vi" / "Ayer cuando llegué a casa estaba"

═══════════════════════════════════════════════════════════
FORMATO DE RESPUESTA
═══════════════════════════════════════════════════════════
- Devuelve EXACTAMENTE 2 opciones
- Cada opción es el MENSAJE COMPLETO (lo que escribió + tu sugerencia)
- Una opción por línea
- NO uses comillas, números, viñetas, explicaciones
- NO repitas la misma idea con palabras diferentes

IMPORTANTE: La primera sugerencia debe ser la MÁS PROBABLE según el contexto.`;

    const userPrompt = `Alonso escribió: "${cleanText}"

Las 2 mejores formas de completar este mensaje:`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 100,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error de Anthropic:', error);
      return new Response(JSON.stringify({ error: 'Anthropic API error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const responseText = data.content?.[0]?.text || '';
    
    const completions = responseText
      .split('\n')
      .map(line => line.trim())
      .map(line => line.replace(/^[\d\.\-\*\•]+\s*/, ''))
      .map(line => line.replace(/^["']|["']$/g, ''))
      .filter(line => line.length > 0 && line.length < 100)
      .slice(0, 2);

    const suggestions = completions.map(complete => {
      const addition = calculateAddition(cleanText, complete);
      return {
        full: complete,
        addition: addition.trim()
      };
    });

    console.log('IA Response:', { text: cleanText, context, timeInfo, suggestions });

    return new Response(JSON.stringify({ suggestions }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error en función:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
