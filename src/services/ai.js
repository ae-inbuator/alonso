/**
 * Servicio de IA para sugerencias de frases
 * La IA sugiere cómo CONTINUAR el texto, no reemplazarlo
 */

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const isDev = import.meta.env.DEV;

/**
 * Obtiene sugerencias de CONTINUACIÓN del texto
 * @param {string} text - Texto actual del usuario
 * @param {string} context - Contexto activo (Casa, Escuela, etc.)
 * @returns {Promise<Array<{full: string, addition: string}>>} - Array de sugerencias
 */
export async function getAISuggestions(text, context = 'General') {
  // No llamar si el texto es muy corto
  if (!text || text.trim().length < 3) {
    return [];
  }

  try {
    if (!isDev) {
      return await callVercelFunction(text, context);
    }
    return await callAnthropicDirect(text, context);
  } catch (error) {
    console.error('Error obteniendo sugerencias de IA:', error);
    return [];
  }
}

/**
 * Llama a la Vercel Serverless Function (producción)
 */
async function callVercelFunction(text, context) {
  const response = await fetch('/api/ai-suggestion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text.trim(),
      context: context
    })
  });

  if (!response.ok) {
    console.error('Error de API:', await response.text());
    return [];
  }

  const data = await response.json();
  return data.suggestions || [];
}

/**
 * Llama a Anthropic directamente (desarrollo)
 */
async function callAnthropicDirect(text, context) {
  if (!ANTHROPIC_API_KEY) {
    console.warn('No hay API key de Anthropic');
    return [];
  }

  const cleanText = text.trim();

  const systemPrompt = `Eres un asistente de comunicación para una persona que no puede hablar.
Tu trabajo es COMPLETAR el mensaje que está escribiendo, sugiriendo cómo podría terminar.

REGLAS IMPORTANTES:
1. El usuario ya escribió: "${cleanText}"
2. Tú debes sugerir cómo CONTINUAR ese texto (no repetirlo, no cambiarlo)
3. Responde SOLO con la parte que se debe AGREGAR
4. Máximo 5 palabras por sugerencia
5. Sé natural y conversacional
6. Contexto actual: ${context}
7. Idioma: español de México
8. Da exactamente 2 opciones diferentes, una por línea
9. NO repitas lo que el usuario ya escribió
10. NO uses comillas, números, viñetas ni explicaciones

EJEMPLO:
Si el usuario escribió: "Quiero ir al"
Tú respondes:
baño
cine

Si el usuario escribió: "Hola, ¿cómo"
Tú respondes:
estás?
te fue hoy?`;

  const userPrompt = `El usuario escribió: "${cleanText}"

¿Cómo puede CONTINUAR este mensaje? (solo la parte que falta)`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 60,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Error de Anthropic:', error);
    return [];
  }

  const data = await response.json();
  const responseText = data.content?.[0]?.text || '';
  
  // Parsear las sugerencias (continuaciones)
  const additions = responseText
    .split('\n')
    .map(line => line.trim())
    .map(line => line.replace(/^[\d\.\-\*\•]+\s*/, ''))
    .map(line => line.replace(/^["']|["']$/g, ''))
    .filter(line => line.length > 0 && line.length < 40)
    .slice(0, 2);

  // Crear objetos con texto completo y lo que se agrega
  const suggestions = additions.map(addition => {
    // Asegurar espacio entre texto original y adición si es necesario
    const needsSpace = !cleanText.endsWith(' ') && !addition.startsWith(' ');
    const separator = needsSpace ? ' ' : '';
    
    return {
      full: cleanText + separator + addition,  // Texto completo para mostrar
      addition: addition                        // Solo lo que se agrega
    };
  });

  console.log('Sugerencias IA (continuaciones):', suggestions);
  return suggestions;
}

/**
 * Cancela cualquier llamada pendiente
 */
export function cancelPendingAIRequest() {
  // Por ahora no hay nada que cancelar aquí
}

export default {
  getAISuggestions,
  cancelPendingAIRequest
};
