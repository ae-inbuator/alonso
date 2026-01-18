# 🗣️ AAC Comunicador - Estado del Proyecto

> **Aplicación de Comunicación Aumentativa y Alternativa**
> 
> Última actualización: 18 de Enero 2025

---

## 📋 ¿Qué es esta app?

Una aplicación web (PWA) para **Alonso**, un adolescente que no puede hablar pero sabe leer y escribir perfectamente. La app le permite:

1. **Escribir mensajes** con un teclado ABC grande (no QWERTY)
2. **Escuchar el mensaje en voz alta** con una voz natural
3. **Responder rápido** con botones SÍ y NO
4. **Recibir sugerencias** de palabras y frases mientras escribe

---

## 🎯 Usuario Objetivo

| Característica | Detalle |
|----------------|---------|
| **Perfil** | Adolescente con capacidad lingüística completa |
| **Limitación** | No puede hablar verbalmente, dificultad motora |
| **Necesidad principal** | Botones GRANDES e inteligentes |
| **Idioma** | Español (México) |
| **Dispositivo** | iPad (landscape) |

---

## ✅ Funcionalidades Implementadas

### 1. Teclado ABC Grande
- **7 letras por fila** (antes eran 10) para máximo tamaño
- Orden alfabético (A-Z + Ñ)
- Tecla ESPACIO grande abajo
- Tecla BORRAR (⌫) al final de la última fila
- **Sin puntuación visible** (se quitó para dar más espacio)

### 2. Botones de Acción Rápida
```
[ SÍ ]  [ NO ]  [ HABLAR ]  [ 🔊 ]
```
- **SÍ**: Dice "Sí" inmediatamente (verde)
- **NO**: Dice "No" inmediatamente (rojo)
- **HABLAR**: Lee el mensaje escrito (azul)
- **🔊/🔇**: Activa/desactiva sonido de teclas

### 3. Sonido de Teclas
- Cuando tocas una letra, la dice en voz alta
- Ejemplo: Tocas "A" → dice "a"
- Tocas espacio → dice "espacio"
- Tocas borrar → dice "borrar"
- Se puede silenciar con el botón 🔊

### 4. Predicción de Palabras (Local)
- Mientras escribes, sugiere palabras
- Ejemplo: Escribes "HO" → sugiere "Hola", "Hoy", "Hora"
- **Diccionario de ~1,800 palabras** ordenadas por frecuencia AAC
- Prioriza: saludos, necesidades básicas, respuestas comunes

### 5. Predicción con IA (Claude)
- Después de 700ms sin escribir, llama a la IA
- Sugiere cómo completar la frase
- Considera:
  - **Hora del día** (mañana/tarde/noche)
  - **Día de la semana**
  - **Contexto activo** (Casa, Escuela, Restaurante, Terapia)
- Se muestra con icono 🤖

### 6. Síntesis de Voz (TTS)
- Usa **ElevenLabs** para voz natural en español
- Fallback a voz del navegador si falla
- Voz masculina, ~20 años, español México

### 7. Contextos
- **Casa** 🏠
- **Escuela** 🎓
- **Restaurante** 🍽️
- **Terapia** 💬

El contexto afecta las sugerencias de la IA.

### 8. Historial de Mensajes
- Guarda todo lo que dice
- Panel para ver mensajes anteriores
- Puede **repetir** (decirlo de nuevo) o **insertar** (agregarlo al texto actual)

### 9. PWA (Progressive Web App)
- Se puede **instalar en el iPad** como app
- Funciona en pantalla completa
- Orientación landscape

---

## 🖥️ Layout Actual de la Pantalla

```
┌──────────────────────────────────────────────────────────────┐
│ [Tu mensaje aquí...              ][✕]    🏠▼  📜  ⚙️        │
├──────────────────────────────────────────────────────────────┤
│   [ SÍ ]      [ NO ]      [   HABLAR   ]      [ 🔊 ]        │
├──────────────────────────────────────────────────────────────┤
│   [ sugerencia 1 ]  [ 🤖 sugerencia IA ]  [ palabra ]       │
├──────────────────────────────────────────────────────────────┤
│     A      B      C      D      E      F      G              │
│     H      I      J      K      L      M      N              │
│     Ñ      O      P      Q      R      S      T              │
│     U      V      W      X      Y      Z      ⌫              │
│                    [    ESPACIO    ]                         │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔧 Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| **Frontend** | React 19 + Vite |
| **Estilos** | CSS Modules |
| **Base de datos** | Supabase (PostgreSQL) |
| **Voz (TTS)** | ElevenLabs API |
| **IA** | Anthropic Claude Haiku |
| **Hosting** | Vercel |

---

## 🗄️ Base de Datos (Supabase)

### Tablas principales:

| Tabla | Propósito |
|-------|-----------|
| `profile` | Configuración del usuario (voz, tema, etc.) |
| `context` | Contextos disponibles (Casa, Escuela, etc.) |
| `phrase` | Frases rápidas predefinidas (~90) |
| `personal_vocab` | Vocabulario personal (nombres, lugares) |
| `message_history` | Historial de mensajes enviados |
| `ai_suggestion_log` | Log de sugerencias de IA (para análisis) |

### Proyecto Supabase:
- **URL**: https://mqvdtufnfcriehmcosbd.supabase.co

---

## 🤖 Cómo Funciona la IA

### Flujo:
1. Usuario escribe algo (ej: "Quiero")
2. Después de 700ms sin escribir, se llama a la IA
3. La IA recibe:
   - El texto actual
   - El contexto (Casa/Escuela/etc.)
   - La hora y día actual
4. La IA responde con 1-2 sugerencias
5. Se muestran con icono 🤖

### Prompt de la IA:
La IA actúa como "copiloto" que sugiere cómo completar el mensaje. Reglas:
- Sugiere en **primera persona** (como si fuera Alonso)
- Máximo **10 palabras** por sugerencia
- Tono **natural y conversacional**
- Considera el contexto y la hora

### Modelo:
- **Claude 3 Haiku** (rápido y económico)
- Vía Edge Function de Vercel (`/api/ai-suggestion`)

---

## 📁 Estructura de Archivos

```
src/
├── components/
│   ├── keyboard/          # Teclado ABC
│   │   ├── Keyboard.jsx
│   │   └── Key.jsx
│   ├── message/           # Área de mensaje
│   │   ├── MessageArea.jsx
│   │   └── SpeakButton.jsx
│   ├── predictions/       # Barra de predicciones
│   │   ├── PredictionBar.jsx
│   │   └── PredictionChip.jsx
│   ├── context/           # Selector de contexto
│   │   └── ContextSelector.jsx
│   └── history/           # Panel de historial
│       └── HistoryPanel.jsx
│
├── services/
│   ├── supabase.js        # Cliente de base de datos
│   ├── tts.js             # Síntesis de voz (ElevenLabs)
│   ├── ai.js              # Llamadas a Claude
│   ├── prediction.js      # Predicción local de palabras
│   ├── history.js         # Guardar/cargar historial
│   └── keySound.js        # Sonido al tocar teclas
│
├── utils/
│   └── spanishWords.js    # Diccionario español (~1,800 palabras)
│
├── App.jsx                # Componente principal
├── App.module.css         # Estilos principales
└── main.jsx               # Entry point

api/
└── ai-suggestion.js       # Edge function para IA (Vercel)
```

---

## 🔑 Variables de Entorno

```env
VITE_SUPABASE_URL=https://mqvdtufnfcriehmcosbd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_ELEVENLABS_API_KEY=sk_...
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

---

## 🚀 Cómo Correr el Proyecto

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build para producción
npm run build

# Deploy (automático con Vercel)
git push origin main
```

---

## 📱 URL de Producción

**https://alonso-three.vercel.app**

Para instalar en iPad:
1. Abrir Safari
2. Ir a la URL
3. Compartir → Agregar a Inicio

---

## ⏳ Pendiente por Implementar

### Confirmado que se necesita:
- [ ] Puntuación opcional (puntos, comas, signos de pregunta)
- [ ] Botón de AYUDA para emergencias
- [ ] Frases rápidas frecuentes (si Alonso las quiere)

### Por evaluar con Alonso:
- [ ] ¿Quiere los botones SÍ/NO?
- [ ] ¿Quiere sonido de teclas por default?
- [ ] ¿Le sirven las sugerencias de IA?

### Mejoras técnicas pendientes:
- [ ] Logging de sugerencias IA aceptadas/rechazadas
- [ ] Vocabulario personal (nombres propios)
- [ ] Aprender de uso (priorizar palabras frecuentes)
- [ ] Settings modal funcional

---

## 📝 Decisiones de Diseño Importantes

### ¿Por qué teclado ABC y no QWERTY?
Más fácil encontrar letras para alguien que no está acostumbrado a QWERTY.

### ¿Por qué 7 letras por fila?
Para que las teclas sean lo más grandes posible en iPad landscape.

### ¿Por qué se quitó la puntuación?
Para dar más espacio al teclado. Se puede agregar si Alonso la necesita.

### ¿Por qué predicciones por frecuencia AAC?
En comunicación AAC, las palabras más útiles son: saludos, necesidades básicas (baño, agua, hambre), y respuestas (sí, no, bien). No tiene sentido ordenar alfabéticamente.

### ¿Por qué la IA considera la hora y el día?
- En la mañana: más probable "Buenos días"
- Al mediodía: más probable hablar de comida
- Viernes: contexto diferente a lunes

---

## 🆘 Troubleshooting

### La voz no funciona
1. Verificar que ElevenLabs API key sea válida
2. Revisar consola del navegador
3. La app tiene fallback a voz del navegador

### Las sugerencias IA no aparecen
1. Escribir al menos 3 caracteres
2. Esperar 700ms sin escribir
3. Verificar API key de Anthropic
4. Revisar consola para errores

### No carga en iPad
1. Verificar conexión a internet
2. Limpiar caché de Safari
3. Re-instalar desde Safari

---

## 📞 Contacto del Proyecto

Este proyecto fue desarrollado para Alonso y su familia.

**Repositorio**: https://github.com/aeinbu-/alonso.git

---

*Documento actualizado el 18 de Enero 2025*
