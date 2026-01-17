# 📋 AAC Comunicador - Estado Actual del Proyecto

> **Documento de estado y pendientes**
> 
> Última actualización: 17 de Enero 2025
> Sesiones de desarrollo: 4

---

## 📊 Resumen Ejecutivo

| Aspecto | Estado |
|---------|--------|
| **Core funcional** | ✅ 90% completo |
| **TTS (ElevenLabs)** | ✅ Funcionando |
| **IA (Claude)** | ✅ Funcionando con prompt inteligente |
| **Predicción local** | ✅ Funcionando con frecuencias |
| **UI/UX** | ⚠️ 70% - Necesita pulido |
| **Settings** | ❌ No implementado |
| **Historial** | ❌ No implementado |
| **PWA** | ❌ No implementado |
| **Deploy** | ❌ No probado |

---

## ✅ Lo que SÍ está implementado y funcionando

### 1. Base de Datos (Supabase) - 100%
- **Proyecto**: mqvdtufnfcriehmcosbd.supabase.co
- **Tablas creadas**:
  - `profile` - Configuración del usuario
  - `context` - Contextos (Casa, Escuela, Restaurante, Terapia)
  - `phrase` - Frases rápidas (~90 frases)
  - `personal_vocab` - Vocabulario personal (tabla vacía)
  - `message_history` - Historial (tabla vacía, no se usa)
  - `ai_suggestion_log` - Logs IA (tabla vacía, no se usa)
- **Seed data**: 4 contextos + ~90 frases iniciales

### 2. Frontend React - 85%

#### Componentes implementados:
```
src/components/
├── keyboard/
│   ├── Keyboard.jsx      ✅ Teclado ABC completo
│   ├── Keyboard.module.css
│   ├── Key.jsx           ✅ Teclas individuales
│   └── Key.module.css
│
├── message/
│   ├── MessageArea.jsx   ✅ Área de texto + botón limpiar
│   ├── MessageArea.module.css
│   ├── SpeakButton.jsx   ✅ Botón HABLAR grande
│   └── SpeakButton.module.css
│
├── predictions/
│   ├── PredictionBar.jsx      ✅ Barra con predicciones locales + IA
│   ├── PredictionBar.module.css
│   ├── PredictionChip.jsx     ✅ Chips individuales
│   └── PredictionChip.module.css
│
├── phrases/
│   ├── PhrasesPanel.jsx       ✅ Panel con categorías y frases
│   ├── PhrasesPanel.module.css
│   ├── PhraseButton.jsx       ✅ Botones de frases
│   └── PhraseButton.module.css
│
├── context/
│   ├── ContextSelector.jsx    ✅ Dropdown de contextos
│   └── ContextSelector.module.css
│
├── settings/                  ❌ VACÍO - No implementado
│   └── (sin archivos)
│
└── common/
    ├── Button.jsx             ✅ Botón reutilizable
    └── Button.module.css
```

#### App.jsx - Estado principal:
- ✅ Carga perfil de Supabase
- ✅ Carga contextos de Supabase
- ✅ Carga frases de Supabase
- ✅ Manejo de texto actual (currentText)
- ✅ Cambio de contextos
- ✅ Filtro de frases por contexto
- ✅ Predicciones locales (palabras)
- ✅ Predicciones IA con debounce (700ms)
- ✅ TTS con ElevenLabs + fallback navegador

### 3. Servicios - 90%

#### `services/supabase.js` ✅
- Cliente Supabase configurado y funcionando

#### `services/tts.js` ✅
- Integración ElevenLabs completa
- `textToSpeech()` - Convierte texto a audio
- `speak()` - Reproduce audio
- `getVoices()` - Lista voces disponibles
- Fallback a Web Speech API si falla

#### `services/prediction.js` ✅
- `getPredictions()` - Busca palabras en diccionario
- `applyPrediction()` - Inserta palabra seleccionada
- Prioriza vocabulario personal (cuando exista)

#### `services/ai.js` ✅ (ACTUALIZADO RECIENTEMENTE)
- `getAISuggestions()` - Llama a Claude Haiku
- **Prompt inteligente** con:
  - Hora del día (mañana/mediodía/tarde/noche)
  - Día de la semana
  - Contexto activo (Casa/Escuela/Restaurante/Terapia)
  - Análisis del texto (tipo de oración, palabra incompleta, etc.)
- Modo desarrollo: Llama directo a Anthropic
- Modo producción: Llama a `/api/ai-suggestion`

### 4. API Vercel Serverless - 100%

#### `api/ai-suggestion.js` ✅
- Edge function para producción
- Mismo prompt inteligente que ai.js
- Manejo de CORS
- Usa timezone de México

### 5. Diccionario Español - 100%

#### `utils/spanishWords.js` ✅ (ACTUALIZADO RECIENTEMENTE)
- ~1,800 palabras ordenadas por frecuencia AAC
- **Orden de prioridad**:
  1. Saludos (hola, gracias, por favor)
  2. Necesidades básicas (baño, agua, hambre)
  3. Respuestas (sí, no, bien, mal)
  4. Verbos comunes conjugados
  5. Palabras auxiliares al final (ha, hay, he)
- Función `searchWords()` con ordenamiento por frecuencia

### 6. Variables de Entorno

#### `.env.local` configurado:
```
VITE_SUPABASE_URL=https://mqvdtufnfcriehmcosbd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_ELEVENLABS_API_KEY=sk_...
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

---

## ❌ Lo que NO está implementado

### 1. Settings Modal - 0%
**Pendiente completo:**
- [ ] Modal de configuración
- [ ] Configuración de voz (velocidad, tono)
- [ ] Configuración de tema (claro/oscuro)
- [ ] Configuración de tamaño de botones
- [ ] Administrar frases personales
- [ ] Administrar vocabulario personal

### 2. Historial de Mensajes - 0%
**Pendiente completo:**
- [ ] Panel/Modal de historial
- [ ] Guardar mensajes en `message_history`
- [ ] Repetir mensajes anteriores
- [ ] Buscar en historial

### 3. PWA (Progressive Web App) - 0%
**Pendiente completo:**
- [ ] Configurar `vite-plugin-pwa`
- [ ] Manifest.json
- [ ] Service Worker
- [ ] Iconos de la app
- [ ] Modo offline básico

### 4. Deploy - 0%
**Pendiente:**
- [ ] Configurar Vercel
- [ ] Variables de entorno en Vercel
- [ ] Probar build de producción
- [ ] Configurar dominio (opcional)

### 5. Logging de IA - 0%
- [ ] Guardar sugerencias en `ai_suggestion_log`
- [ ] Marcar si fue aceptada o no
- [ ] Analytics de uso

---

## ⚠️ Bugs y Issues Conocidos

### 1. Sugerencias de IA - ISSUE ACTIVO
**Problema**: Al escribir "HOL", la IA muestra:
- "+ a" (confuso)
- "+ a, ¿cómo estás?"

**Comportamiento deseado**:
- "Hola" (primera opción simple)
- "Hola, buenos días" (segunda opción extendida)

**Causa**: El prompt pide frases completas pero muestra solo la "adición", lo cual es confuso cuando la adición es pequeña.

**Propuesta de solución**:
- Primera sugerencia = solo completar palabra
- Segunda sugerencia = frase extendida útil

### 2. Posible: Espacios duplicados
Al seleccionar predicción local y luego escribir, podría haber espacios duplicados. Necesita testing.

### 3. Sin feedback táctil
Los botones no tienen sonido ni vibración al tocar. Importante para accesibilidad.

---

## 🔧 Mejoras Propuestas (No implementadas)

### UX/UI
1. **Feedback táctil**: Vibración al tocar teclas
2. **Sonido de tecla**: Click sutil al escribir
3. **Animaciones**: Transiciones suaves al insertar texto
4. **Tema oscuro**: Para uso nocturno
5. **Tamaño de botones configurable**: Pequeño/Mediano/Grande

### Predicción
1. **Aprender de uso**: Las palabras más usadas suben de prioridad
2. **Contexto conversacional**: Recordar últimas frases para mejor predicción
3. **Nombres propios**: Agregar nombres de familia/amigos

### IA
1. **Historial en prompt**: Enviar últimos 3 mensajes para contexto
2. **Modo conservador vs creativo**: Dejar que usuario elija
3. **Cache de sugerencias**: No repetir llamadas para mismo texto

### Frases
1. **Favoritos**: Marcar frases favoritas
2. **Frecuentes**: Mostrar las más usadas primero
3. **Crear/Editar frases**: Desde la app

---

## 📁 Estructura de Archivos Actual

```
C:\Users\artur\Desktop\alonso\
├── api/
│   └── ai-suggestion.js      # Vercel Edge Function
│
├── public/
│   └── vite.svg
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   └── Button.module.css
│   │   ├── context/
│   │   │   ├── ContextSelector.jsx
│   │   │   ├── ContextSelector.module.css
│   │   │   └── index.js
│   │   ├── keyboard/
│   │   │   ├── Key.jsx
│   │   │   ├── Key.module.css
│   │   │   ├── Keyboard.jsx
│   │   │   ├── Keyboard.module.css
│   │   │   └── index.js
│   │   ├── message/
│   │   │   ├── MessageArea.jsx
│   │   │   ├── MessageArea.module.css
│   │   │   ├── SpeakButton.jsx
│   │   │   ├── SpeakButton.module.css
│   │   │   └── index.js
│   │   ├── phrases/
│   │   │   ├── PhraseButton.jsx
│   │   │   ├── PhraseButton.module.css
│   │   │   ├── PhrasesPanel.jsx
│   │   │   ├── PhrasesPanel.module.css
│   │   │   └── index.js
│   │   ├── predictions/
│   │   │   ├── PredictionBar.jsx
│   │   │   ├── PredictionBar.module.css
│   │   │   ├── PredictionChip.jsx
│   │   │   ├── PredictionChip.module.css
│   │   │   └── index.js
│   │   └── settings/          # VACÍO
│   │
│   ├── services/
│   │   ├── ai.js              # IA con prompt inteligente
│   │   ├── prediction.js      # Predicción local
│   │   ├── supabase.js        # Cliente Supabase
│   │   └── tts.js             # ElevenLabs TTS
│   │
│   ├── styles/
│   │   └── variables.css      # Variables CSS globales
│   │
│   ├── utils/
│   │   └── spanishWords.js    # Diccionario ordenado por frecuencia
│   │
│   ├── App.jsx                # Componente principal
│   ├── App.module.css         # Estilos del layout
│   ├── index.css              # Estilos globales
│   └── main.jsx               # Entry point
│
├── .env.local                 # Variables de entorno
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

---

## 🔑 Credenciales (NO COMPARTIR)

### Supabase
- **URL**: https://mqvdtufnfcriehmcosbd.supabase.co
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

### APIs
- **ElevenLabs**: Configurada en .env.local
- **Anthropic**: Configurada en .env.local

### GitHub
- **Repo**: https://github.com/aeinbu-/alonso.git

---

## 📝 Checklist para Continuar

### Prioridad ALTA (Core)
- [ ] Arreglar sugerencias IA (mostrar texto claro, no "+ a")
- [ ] Guardar mensajes en historial al hablar
- [ ] Settings básico (al menos voz)

### Prioridad MEDIA (Usabilidad)
- [ ] Panel de historial
- [ ] PWA para instalar en iPad
- [ ] Feedback táctil/sonido

### Prioridad BAJA (Nice to have)
- [ ] Tema oscuro
- [ ] Administrar frases desde app
- [ ] Analytics de uso
- [ ] Modo offline

---

## 🚀 Para Iniciar Nuevo Chat

Copia este resumen al inicio del nuevo chat:

```
Proyecto: AAC Comunicador (app de comunicación aumentativa)
Ubicación: C:\Users\artur\Desktop\alonso
Estado: MVP funcional, falta pulido

FUNCIONA:
- Teclado ABC grande
- TTS con ElevenLabs
- Predicción de palabras (frecuencia AAC)
- IA con Claude (prompt inteligente con hora/contexto)
- Frases rápidas por contexto
- Selector de contextos

NO FUNCIONA / PENDIENTE:
- Settings modal
- Historial de mensajes
- PWA
- Deploy

BUG ACTIVO:
- Sugerencias IA muestran "+ a" en vez de "Hola"

SIGUIENTE PASO RECOMENDADO:
Arreglar prompt IA para que primera sugerencia sea simple
```

---

## 📚 Investigación Realizada

### Papers/Recursos consultados:
1. Trnka et al. (2007): Word prediction mejora comunicación 58.6%
2. Valencia et al. (2023): AI Language Models en AAC
3. Topic modeling para predicción de palabras infrecuentes
4. Youth language adaptation para AAC
5. Context engineering para LLMs

### Hallazgos clave:
- Frecuencia > orden alfabético para predicciones
- Predicción conservadora > agresiva (construye confianza)
- Contexto temporal (hora/día) mejora relevancia
- El usuario de AAC tiene conversaciones REALES (preguntas tipo "¿cómo estás?" sí tienen sentido)

---

*Documento generado el 17 de Enero 2025*
