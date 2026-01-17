/**
 * Diccionario de palabras en español ordenado por FRECUENCIA DE USO
 * OPTIMIZADO PARA AAC (Comunicación Aumentativa y Alternativa)
 * 
 * Las palabras de comunicación cotidiana tienen prioridad sobre
 * palabras técnicas o formales.
 */

// Palabras ordenadas por frecuencia Y utilidad para AAC
// El índice representa la prioridad (menor índice = más frecuente/útil)
const wordsByFrequency = [
  // === TOP PRIORITY - Palabras AAC esenciales ===
  // Saludos - lo más importante para iniciar comunicación
  'hola', 'adiós', 'buenos', 'buenas', 'días', 'tardes', 'noches', 'gracias', 'favor', 'perdón',
  
  // Respuestas básicas
  'sí', 'no', 'bien', 'mal', 'más', 'menos', 'ya', 'ahora', 'después', 'antes',
  
  // Necesidades inmediatas
  'quiero', 'necesito', 'puedo', 'tengo', 'estoy', 'me', 'ayuda', 'baño', 'agua', 'hambre',
  'sed', 'dolor', 'frío', 'calor', 'cansado', 'cansada', 'enfermo', 'enferma', 'sueño', 'listo',
  
  // Preguntas comunes
  'qué', 'cómo', 'cuándo', 'dónde', 'quién', 'cuánto', 'por', 'qué', 'cuál', 'para',
  
  // Pronombres esenciales
  'yo', 'tú', 'él', 'ella', 'nosotros', 'ellos', 'mi', 'tu', 'su', 'me',
  'te', 'le', 'nos', 'les', 'lo', 'la', 'los', 'las', 'esto', 'eso',
  
  // Verbos de comunicación
  'decir', 'hablar', 'preguntar', 'responder', 'repetir', 'entender', 'saber', 'conocer', 'pensar', 'creer',
  'gustar', 'encantar', 'preferir', 'querer', 'poder', 'deber', 'tener', 'ser', 'estar', 'ir',
  'venir', 'llegar', 'salir', 'entrar', 'esperar', 'buscar', 'encontrar', 'ver', 'mirar', 'oír',
  'escuchar', 'sentir', 'tocar', 'comer', 'beber', 'dormir', 'despertar', 'descansar', 'trabajar', 'estudiar',
  
  // Lugares comunes
  'casa', 'escuela', 'trabajo', 'baño', 'cuarto', 'cocina', 'sala', 'calle', 'tienda', 'restaurante',
  'hospital', 'doctor', 'aquí', 'allí', 'allá', 'cerca', 'lejos', 'arriba', 'abajo', 'dentro',
  
  // Personas
  'mamá', 'papá', 'hermano', 'hermana', 'amigo', 'amiga', 'familia', 'maestro', 'maestra', 'doctor',
  'doctora', 'señor', 'señora', 'niño', 'niña', 'persona', 'gente', 'todos', 'nadie', 'alguien',
  
  // Tiempo
  'hoy', 'ayer', 'mañana', 'ahora', 'luego', 'después', 'antes', 'siempre', 'nunca', 'todavía',
  'hora', 'minuto', 'día', 'semana', 'mes', 'año', 'tiempo', 'momento', 'rato', 'tarde',
  
  // Emociones
  'feliz', 'triste', 'enojado', 'enojada', 'contento', 'contenta', 'preocupado', 'nervioso', 'tranquilo', 'emocionado',
  'aburrido', 'cansado', 'frustrado', 'confundido', 'asustado', 'sorprendido', 'alegre', 'molesto', 'ansioso', 'orgulloso',
  
  // Adjetivos básicos
  'bueno', 'buena', 'malo', 'mala', 'grande', 'pequeño', 'mucho', 'poco', 'todo', 'nada',
  'otro', 'otra', 'mismo', 'nuevo', 'viejo', 'fácil', 'difícil', 'importante', 'mejor', 'peor',
  
  // === SECONDARY - Artículos y conectores frecuentes ===
  'de', 'la', 'el', 'en', 'y', 'a', 'los', 'las', 'un', 'una',
  'del', 'al', 'con', 'sin', 'pero', 'porque', 'que', 'como', 'cuando', 'donde',
  'si', 'también', 'entonces', 'así', 'muy', 'tan', 'más', 'menos', 'solo', 'casi',
  
  // === CONJUGACIONES COMUNES ===
  // Ser
  'soy', 'eres', 'es', 'somos', 'son', 'era', 'fue', 'sido',
  // Estar  
  'estoy', 'estás', 'está', 'estamos', 'están', 'estaba', 'estuvo', 'estado',
  // Tener
  'tengo', 'tienes', 'tiene', 'tenemos', 'tienen', 'tenía', 'tuvo', 'tenido',
  // Hacer
  'hago', 'haces', 'hace', 'hacemos', 'hacen', 'hacía', 'hizo', 'hecho',
  // Poder
  'puedo', 'puedes', 'puede', 'podemos', 'pueden', 'podía', 'pudo', 'podido',
  // Ir
  'voy', 'vas', 'va', 'vamos', 'van', 'iba', 'fue', 'ido',
  // Querer
  'quiero', 'quieres', 'quiere', 'queremos', 'quieren', 'quería', 'quiso', 'querido',
  // Decir
  'digo', 'dices', 'dice', 'decimos', 'dicen', 'decía', 'dijo', 'dicho',
  // Saber
  'sé', 'sabes', 'sabe', 'sabemos', 'saben', 'sabía', 'supo', 'sabido',
  // Ver
  'veo', 'ves', 've', 'vemos', 'ven', 'veía', 'vio', 'visto',
  // Dar
  'doy', 'das', 'da', 'damos', 'dan', 'daba', 'dio', 'dado',
  // Venir
  'vengo', 'vienes', 'viene', 'venimos', 'vienen', 'venía', 'vino', 'venido',
  // Llegar
  'llego', 'llegas', 'llega', 'llegamos', 'llegan', 'llegaba', 'llegó', 'llegado',
  // Pasar
  'paso', 'pasas', 'pasa', 'pasamos', 'pasan', 'pasaba', 'pasó', 'pasado',
  // Poner
  'pongo', 'pones', 'pone', 'ponemos', 'ponen', 'ponía', 'puso', 'puesto',
  // Salir
  'salgo', 'sales', 'sale', 'salimos', 'salen', 'salía', 'salió', 'salido',
  // Seguir
  'sigo', 'sigues', 'sigue', 'seguimos', 'siguen', 'seguía', 'siguió', 'seguido',
  // Creer
  'creo', 'crees', 'cree', 'creemos', 'creen', 'creía', 'creyó', 'creído',
  // Hablar
  'hablo', 'hablas', 'habla', 'hablamos', 'hablan', 'hablaba', 'habló', 'hablado',
  // Llevar
  'llevo', 'llevas', 'lleva', 'llevamos', 'llevan', 'llevaba', 'llevó', 'llevado',
  // Comer
  'como', 'comes', 'come', 'comemos', 'comen', 'comía', 'comió', 'comido',
  // Dormir
  'duermo', 'duermes', 'duerme', 'dormimos', 'duermen', 'dormía', 'durmió', 'dormido',
  // Sentir
  'siento', 'sientes', 'siente', 'sentimos', 'sienten', 'sentía', 'sintió', 'sentido',
  // Gustar
  'gusta', 'gustan', 'gustaba', 'gustó', 'gustado',
  // Parecer
  'parece', 'parecen', 'parecía', 'pareció', 'parecido',
  // Encontrar
  'encuentro', 'encuentras', 'encuentra', 'encontramos', 'encuentran', 'encontraba', 'encontró',
  // Pensar
  'pienso', 'piensas', 'piensa', 'pensamos', 'piensan', 'pensaba', 'pensó', 'pensado',
  // Esperar
  'espero', 'esperas', 'espera', 'esperamos', 'esperan', 'esperaba', 'esperó', 'esperado',
  // Buscar
  'busco', 'buscas', 'busca', 'buscamos', 'buscan', 'buscaba', 'buscó', 'buscado',
  // Llamar
  'llamo', 'llamas', 'llama', 'llamamos', 'llaman', 'llamaba', 'llamó', 'llamado',
  // Necesitar
  'necesito', 'necesitas', 'necesita', 'necesitamos', 'necesitan', 'necesitaba', 'necesitó',
  // Ayudar
  'ayudo', 'ayudas', 'ayuda', 'ayudamos', 'ayudan', 'ayudaba', 'ayudó', 'ayudado',
  
  // === COMIDA Y BEBIDA ===
  'comida', 'desayuno', 'almuerzo', 'cena', 'café', 'leche', 'jugo', 'agua', 'refresco', 'té',
  'pan', 'arroz', 'frijoles', 'carne', 'pollo', 'pescado', 'huevo', 'queso', 'fruta', 'verdura',
  'manzana', 'plátano', 'naranja', 'uva', 'fresa', 'ensalada', 'sopa', 'tacos', 'torta', 'sandwich',
  'pastel', 'galleta', 'helado', 'chocolate', 'dulce', 'sal', 'azúcar', 'picante', 'rico', 'delicioso',
  
  // === OBJETOS COTIDIANOS ===
  'teléfono', 'celular', 'computadora', 'tableta', 'televisión', 'radio', 'libro', 'cuaderno', 'lápiz', 'pluma',
  'mesa', 'silla', 'cama', 'puerta', 'ventana', 'pared', 'piso', 'techo', 'luz', 'lámpara',
  'ropa', 'camisa', 'pantalón', 'zapatos', 'calcetines', 'chaqueta', 'suéter', 'gorra', 'lentes', 'reloj',
  'bolsa', 'mochila', 'cartera', 'llave', 'dinero', 'tarjeta', 'carro', 'coche', 'bicicleta', 'autobús',
  
  // === COLORES ===
  'rojo', 'azul', 'verde', 'amarillo', 'naranja', 'morado', 'rosa', 'negro', 'blanco', 'gris',
  'café', 'dorado', 'plateado', 'claro', 'oscuro',
  
  // === NÚMEROS ===
  'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
  'once', 'doce', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'cien', 'mil', 'primero', 'segundo',
  
  // === DÍAS Y MESES ===
  'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo',
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  
  // === FRASES CONTEXTO RESTAURANTE ===
  'menú', 'carta', 'cuenta', 'propina', 'mesero', 'mesera', 'ordenar', 'pedir', 'recomendar', 'traer',
  'plato', 'vaso', 'cuchara', 'tenedor', 'cuchillo', 'servilleta', 'sal', 'pimienta', 'salsa', 'limón',
  
  // === FRASES CONTEXTO ESCUELA ===
  'clase', 'tarea', 'examen', 'pregunta', 'respuesta', 'profesor', 'profesora', 'compañero', 'compañera', 'recreo',
  'pizarrón', 'escritorio', 'mochila', 'uniforme', 'calificación', 'nota', 'proyecto', 'presentación', 'lectura', 'matemáticas',
  
  // === MÁS VERBOS ÚTILES ===
  'abrir', 'cerrar', 'encender', 'apagar', 'subir', 'bajar', 'empujar', 'jalar', 'agarrar', 'soltar',
  'sentar', 'parar', 'levantar', 'acostar', 'vestir', 'desvestir', 'bañar', 'lavar', 'secar', 'peinar',
  'correr', 'caminar', 'saltar', 'nadar', 'jugar', 'cantar', 'bailar', 'dibujar', 'pintar', 'escribir',
  'leer', 'contar', 'sumar', 'restar', 'medir', 'pesar', 'cortar', 'pegar', 'doblar', 'romper',
  'arreglar', 'limpiar', 'ordenar', 'guardar', 'sacar', 'meter', 'cargar', 'descargar', 'conectar', 'desconectar',
  'empezar', 'terminar', 'continuar', 'parar', 'repetir', 'cambiar', 'probar', 'practicar', 'intentar', 'lograr',
  'olvidar', 'recordar', 'aprender', 'enseñar', 'explicar', 'mostrar', 'demostrar', 'comparar', 'elegir', 'decidir',
  'aceptar', 'rechazar', 'permitir', 'prohibir', 'invitar', 'visitar', 'llamar', 'contestar', 'mandar', 'recibir',
  'regalar', 'prestar', 'devolver', 'compartir', 'repartir', 'juntar', 'separar', 'mezclar', 'dividir', 'multiplicar',
  
  // === EXPRESIONES ÚTILES ===
  'claro', 'obvio', 'seguro', 'verdad', 'mentira', 'posible', 'imposible', 'fácil', 'difícil', 'normal',
  'extraño', 'raro', 'diferente', 'igual', 'parecido', 'similar', 'contrario', 'opuesto', 'correcto', 'incorrecto',
  'perfecto', 'excelente', 'genial', 'increíble', 'horrible', 'terrible', 'fantástico', 'maravilloso', 'interesante', 'aburrido',
  'divertido', 'gracioso', 'serio', 'importante', 'urgente', 'necesario', 'suficiente', 'demasiado', 'bastante', 'apenas',
  
  // === PREPOSICIONES Y CONECTORES ===
  'a', 'ante', 'bajo', 'con', 'contra', 'de', 'desde', 'durante', 'en', 'entre',
  'hacia', 'hasta', 'mediante', 'para', 'por', 'según', 'sin', 'sobre', 'tras', 'versus',
  'además', 'también', 'tampoco', 'incluso', 'excepto', 'salvo', 'menos', 'sino', 'aunque', 'mientras',
  'apenas', 'enseguida', 'finalmente', 'primero', 'luego', 'después', 'entonces', 'así', 'pues', 'bueno',
  
  // === CUERPO ===
  'cabeza', 'cara', 'ojo', 'ojos', 'nariz', 'boca', 'oreja', 'orejas', 'pelo', 'cabello',
  'mano', 'manos', 'dedo', 'dedos', 'brazo', 'brazos', 'pierna', 'piernas', 'pie', 'pies',
  'espalda', 'pecho', 'estómago', 'cuello', 'hombro', 'rodilla', 'tobillo', 'muñeca', 'codo', 'cadera',
  
  // === CLIMA Y NATURALEZA ===
  'sol', 'luna', 'estrella', 'cielo', 'nube', 'lluvia', 'viento', 'nieve', 'calor', 'frío',
  'árbol', 'flor', 'planta', 'jardín', 'parque', 'playa', 'mar', 'río', 'montaña', 'bosque',
  
  // === TECNOLOGÍA ===
  'internet', 'wifi', 'mensaje', 'foto', 'video', 'música', 'juego', 'aplicación', 'app', 'batería',
  'cargador', 'cable', 'pantalla', 'volumen', 'sonido', 'cámara', 'micrófono', 'audífono', 'bocina', 'control',
  
  // === PALABRAS AUXILIARES (baja prioridad) ===
  'ha', 'he', 'has', 'han', 'hemos', 'había', 'hubo', 'haber', 'habido', 'habiendo',
  'hay', 'habrá', 'habría', 'haya', 'hubiera', 'hubiese',
  'aquel', 'aquella', 'aquello', 'aquellos', 'aquellas',
  'cuyo', 'cuya', 'cuyos', 'cuyas', 'cual', 'cuales',
  'ese', 'esa', 'esos', 'esas', 'este', 'esta', 'estos', 'estas',
  'mío', 'mía', 'míos', 'mías', 'tuyo', 'tuya', 'tuyos', 'tuyas',
  'suyo', 'suya', 'suyos', 'suyas', 'nuestro', 'nuestra', 'nuestros', 'nuestras',
  'alguno', 'alguna', 'algunos', 'algunas', 'ninguno', 'ninguna', 'varios', 'varias',
  'demás', 'ambos', 'ambas', 'cada', 'cualquier', 'cualquiera', 'quienquiera', 'dondequiera'
]

// Eliminar duplicados manteniendo el orden (primera aparición = mayor prioridad)
const uniqueWords = []
const seen = new Set()
for (const word of wordsByFrequency) {
  const lower = word.toLowerCase()
  if (!seen.has(lower)) {
    seen.add(lower)
    uniqueWords.push(word)
  }
}

// Crear un mapa para búsqueda rápida con índice de frecuencia
const frequencyMap = new Map()
uniqueWords.forEach((word, index) => {
  const normalized = word.toLowerCase()
  frequencyMap.set(normalized, {
    word: word,
    frequency: uniqueWords.length - index // Mayor número = más frecuente
  })
})

// Función de búsqueda que devuelve resultados ordenados por FRECUENCIA
export function searchWords(prefix, limit = 5) {
  if (!prefix || prefix.length === 0) return []
  
  const normalizedPrefix = prefix.toLowerCase()
  const results = []
  
  // Buscar todas las coincidencias
  for (const [word, data] of frequencyMap) {
    if (word.startsWith(normalizedPrefix)) {
      results.push({
        word: data.word,
        frequency: data.frequency
      })
    }
  }
  
  // Ordenar por frecuencia (mayor primero)
  results.sort((a, b) => b.frequency - a.frequency)
  
  // Devolver solo las palabras
  return results.slice(0, limit).map(r => r.word)
}

// Exportar el array para compatibilidad
export const dictionary = uniqueWords

export default {
  dictionary,
  searchWords,
  frequencyMap
}
