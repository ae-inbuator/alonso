// Vercel Serverless Function para obtener sugerencias de IA (Anthropic Claude)
// La IA sugiere cómo CONTINUAR el texto, no reemplazarlo

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, context } = req.body;

    if (!text || text.trim().length < 3) {
      return res.status(200).json({ suggestions: [] });
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    
    if (!ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY no configurada');
      return res.status(500).json({ error: 'API key no configurada', suggestions: [] });
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
6. Contexto actual: ${context || 'General'}
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
        'anthropic-version': '2023-06-01'
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
      const errorText = await response.text();
      console.error('Error de Anthropic:', errorText);
      return res.status(500).json({ error: 'Error de Anthropic API', suggestions: [] });
    }

    const data = await response.json();
    const responseText = data.content?.[0]?.text || '';
    
    // Parsear las continuaciones
    const additions = responseText
      .split('\n')
      .map(line => line.trim())
      .map(line => line.replace(/^[\d\.\-\*\•]+\s*/, ''))
      .map(line => line.replace(/^["']|["']$/g, ''))
      .filter(line => line.length > 0 && line.length < 40)
      .slice(0, 2);

    // Crear objetos con texto completo y lo que se agrega
    const suggestions = additions.map(addition => {
      const needsSpace = !cleanText.endsWith(' ') && !addition.startsWith(' ');
      const separator = needsSpace ? ' ' : '';
      
      return {
        full: cleanText + separator + addition,
        addition: addition
      };
    });

    console.log('Sugerencias generadas:', suggestions);

    return res.status(200).json({ suggestions });

  } catch (error) {
    console.error('Error en serverless function:', error);
    return res.status(500).json({ error: error.message, suggestions: [] });
  }
}
