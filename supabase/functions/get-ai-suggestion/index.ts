// Edge Function para obtener sugerencias de IA (Anthropic Claude)
// Esta función actúa como proxy para evitar problemas de CORS

import "https://deno.land/x/xhr@0.3.0/mod.ts";

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// Obtener API key desde secrets de Supabase
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, context } = await req.json();

    // Validar input
    if (!text || text.trim().length < 3) {
      return new Response(
        JSON.stringify({ suggestions: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar API key
    if (!ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY no configurada');
      return new Response(
        JSON.stringify({ error: 'API key no configurada', suggestions: [] }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `Eres un asistente de comunicación para una persona que no puede hablar y usa una tablet para comunicarse.
Tu rol es sugerir cómo podría completar su mensaje de forma natural y útil.

REGLAS ESTRICTAS:
1. Sugiere en primera persona (como si fueras el usuario)
2. Máximo 8 palabras por sugerencia
3. Sé natural y conversacional
4. El contexto actual es: ${context || 'General'}
5. El usuario escribe en español de México
6. Responde SOLO con las sugerencias, una por línea
7. No agregues explicaciones, números, viñetas ni nada más
8. Da exactamente 2 sugerencias diferentes`;

    const userPrompt = `El usuario ha escrito: "${text}"

Completa el mensaje de 2 formas diferentes:`;

    // Llamar a Anthropic API
    const response = await fetch(ANTHROPIC_API_URL, {
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
      const errorText = await response.text();
      console.error('Error de Anthropic:', errorText);
      return new Response(
        JSON.stringify({ error: 'Error de Anthropic API', suggestions: [] }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    // Extraer el texto de la respuesta
    const responseText = data.content?.[0]?.text || '';
    
    // Parsear las sugerencias (una por línea)
    const suggestions = responseText
      .split('\n')
      .map((line: string) => line.trim())
      // Limpiar números, viñetas, guiones al inicio
      .map((line: string) => line.replace(/^[\d\.\-\*\•]+\s*/, ''))
      // Limpiar comillas
      .map((line: string) => line.replace(/^["']|["']$/g, ''))
      .filter((line: string) => line.length > 0 && line.length < 60)
      .slice(0, 2);

    console.log('Sugerencias generadas:', suggestions);

    return new Response(
      JSON.stringify({ suggestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error en Edge Function:', error);
    return new Response(
      JSON.stringify({ error: error.message, suggestions: [] }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
