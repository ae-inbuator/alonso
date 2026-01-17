/**
 * Diccionario de palabras comunes en español (México)
 * Ordenadas por frecuencia de uso aproximada
 * 
 * Categorías incluidas:
 * - Pronombres y artículos
 * - Verbos comunes (conjugaciones básicas)
 * - Sustantivos cotidianos
 * - Adjetivos frecuentes
 * - Adverbios y conectores
 * - Palabras de cortesía
 * - Números escritos
 */

const spanishWords = [
  // === PRONOMBRES Y ARTÍCULOS ===
  'yo', 'tu', 'tú', 'el', 'él', 'ella', 'nosotros', 'ustedes', 'ellos', 'ellas',
  'mi', 'mis', 'me', 'te', 'se', 'nos', 'les', 'lo', 'la', 'los', 'las',
  'un', 'una', 'uno', 'unos', 'unas', 'este', 'esta', 'esto', 'estos', 'estas',
  'ese', 'esa', 'eso', 'esos', 'esas', 'aquel', 'aquella', 'aquello',
  'que', 'quien', 'cual', 'cuyo', 'donde', 'cuando', 'como', 'cuanto',
  
  // === VERBOS SER/ESTAR ===
  'soy', 'eres', 'es', 'somos', 'son', 'era', 'fue', 'sido', 'siendo',
  'estoy', 'estas', 'estás', 'esta', 'está', 'estamos', 'estan', 'están',
  'estaba', 'estuvo', 'estado', 'estando',
  
  // === VERBOS TENER/HABER ===
  'tengo', 'tienes', 'tiene', 'tenemos', 'tienen', 'tenia', 'tenía', 'tuvo', 'tenido',
  'he', 'has', 'ha', 'hay', 'hemos', 'han', 'habia', 'había', 'hubo', 'habido',
  
  // === VERBOS IR/VENIR ===
  'voy', 'vas', 'va', 'vamos', 'van', 'iba', 'fue', 'ido', 'yendo',
  'vengo', 'vienes', 'viene', 'venimos', 'vienen', 'venia', 'venía', 'vino', 'venido',
  
  // === VERBOS QUERER/PODER/DEBER ===
  'quiero', 'quieres', 'quiere', 'queremos', 'quieren', 'queria', 'quería', 'quiso',
  'puedo', 'puedes', 'puede', 'podemos', 'pueden', 'podia', 'podía', 'pudo',
  'debo', 'debes', 'debe', 'debemos', 'deben', 'debia', 'debía',
  
  // === VERBOS HACER/DECIR ===
  'hago', 'haces', 'hace', 'hacemos', 'hacen', 'hacia', 'hacía', 'hizo', 'hecho',
  'digo', 'dices', 'dice', 'decimos', 'dicen', 'decia', 'decía', 'dijo', 'dicho',
  
  // === VERBOS SABER/CONOCER ===
  'se', 'sé', 'sabes', 'sabe', 'sabemos', 'saben', 'sabia', 'sabía', 'supo', 'sabido',
  'conozco', 'conoces', 'conoce', 'conocemos', 'conocen', 'conocia', 'conocía',
  
  // === VERBOS VER/OÍR/SENTIR ===
  'veo', 'ves', 've', 'vemos', 'ven', 'veia', 'veía', 'vio', 'visto',
  'oigo', 'oyes', 'oye', 'oimos', 'oímos', 'oyen', 'oia', 'oía', 'oyo', 'oyó',
  'siento', 'sientes', 'siente', 'sentimos', 'sienten', 'sintio', 'sintió',
  
  // === VERBOS COMUNES ===
  'como', 'comes', 'come', 'comemos', 'comen', 'comido',
  'bebo', 'bebes', 'bebe', 'bebemos', 'beben', 'bebido',
  'duermo', 'duermes', 'duerme', 'dormimos', 'duermen', 'dormido',
  'trabajo', 'trabajas', 'trabaja', 'trabajamos', 'trabajan',
  'estudio', 'estudias', 'estudia', 'estudiamos', 'estudian',
  'juego', 'juegas', 'juega', 'jugamos', 'juegan',
  'leo', 'lees', 'lee', 'leemos', 'leen', 'leido', 'leído',
  'escribo', 'escribes', 'escribe', 'escribimos', 'escriben',
  'hablo', 'hablas', 'habla', 'hablamos', 'hablan',
  'escucho', 'escuchas', 'escucha', 'escuchamos', 'escuchan',
  'miro', 'miras', 'mira', 'miramos', 'miran',
  'camino', 'caminas', 'camina', 'caminamos', 'caminan',
  'corro', 'corres', 'corre', 'corremos', 'corren',
  'llego', 'llegas', 'llega', 'llegamos', 'llegan',
  'salgo', 'sales', 'sale', 'salimos', 'salen',
  'entro', 'entras', 'entra', 'entramos', 'entran',
  'abro', 'abres', 'abre', 'abrimos', 'abren',
  'cierro', 'cierras', 'cierra', 'cerramos', 'cierran',
  'pongo', 'pones', 'pone', 'ponemos', 'ponen',
  'tomo', 'tomas', 'toma', 'tomamos', 'toman',
  'doy', 'das', 'da', 'damos', 'dan',
  'llamo', 'llamas', 'llama', 'llamamos', 'llaman',
  'paso', 'pasas', 'pasa', 'pasamos', 'pasan',
  'espero', 'esperas', 'espera', 'esperamos', 'esperan',
  'ayudo', 'ayudas', 'ayuda', 'ayudamos', 'ayudan',
  'necesito', 'necesitas', 'necesita', 'necesitamos', 'necesitan',
  'busco', 'buscas', 'busca', 'buscamos', 'buscan',
  'encuentro', 'encuentras', 'encuentra', 'encontramos', 'encuentran',
  'uso', 'usas', 'usa', 'usamos', 'usan',
  'pienso', 'piensas', 'piensa', 'pensamos', 'piensan',
  'creo', 'crees', 'cree', 'creemos', 'creen',
  'entiendo', 'entiendes', 'entiende', 'entendemos', 'entienden',
  'recuerdo', 'recuerdas', 'recuerda', 'recordamos', 'recuerdan',
  'olvido', 'olvidas', 'olvida', 'olvidamos', 'olvidan',
  'gusto', 'gustas', 'gusta', 'gustamos', 'gustan',
  'encanto', 'encantas', 'encanta', 'encantamos', 'encantan',
  'prefiero', 'prefieres', 'prefiere', 'preferimos', 'prefieren',
  
  // === PALABRAS DE CORTESÍA ===
  'hola', 'adios', 'adiós', 'buenos', 'buenas', 'dias', 'días', 'tardes', 'noches',
  'gracias', 'muchas', 'por', 'favor', 'perdon', 'perdón', 'disculpa', 'disculpe',
  'permiso', 'con', 'de', 'nada', 'bienvenido', 'bienvenida',
  
  // === PREGUNTAS ===
  'que', 'qué', 'quien', 'quién', 'cual', 'cuál', 'donde', 'dónde',
  'cuando', 'cuándo', 'como', 'cómo', 'cuanto', 'cuánto', 'cuanta', 'cuánta',
  'por', 'porque', 'porqué', 'para',
  
  // === RESPUESTAS ===
  'si', 'sí', 'no', 'tal', 'vez', 'quiza', 'quizá', 'quizas', 'quizás',
  'claro', 'obvio', 'seguro', 'cierto', 'verdad', 'falso',
  'bien', 'mal', 'mas', 'más', 'menos', 'mucho', 'poco', 'muy', 'tan', 'tanto',
  
  // === TIEMPO ===
  'hoy', 'ayer', 'mañana', 'ahora', 'luego', 'despues', 'después', 'antes',
  'siempre', 'nunca', 'ya', 'todavia', 'todavía', 'aun', 'aún',
  'temprano', 'tarde', 'pronto', 'lento', 'rapido', 'rápido',
  'hora', 'horas', 'minuto', 'minutos', 'segundo', 'segundos',
  'dia', 'día', 'dias', 'días', 'semana', 'semanas', 'mes', 'meses', 'año', 'años',
  'lunes', 'martes', 'miercoles', 'miércoles', 'jueves', 'viernes', 'sabado', 'sábado', 'domingo',
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  
  // === LUGARES ===
  'aqui', 'aquí', 'alli', 'allí', 'alla', 'allá', 'aca', 'acá',
  'cerca', 'lejos', 'arriba', 'abajo', 'adelante', 'atras', 'atrás',
  'dentro', 'fuera', 'adentro', 'afuera', 'izquierda', 'derecha', 'centro',
  'casa', 'escuela', 'trabajo', 'tienda', 'hospital', 'parque',
  'restaurante', 'cine', 'banco', 'iglesia', 'oficina', 'biblioteca',
  'baño', 'cocina', 'sala', 'cuarto', 'habitacion', 'habitación',
  'calle', 'ciudad', 'pueblo', 'pais', 'país', 'mundo',
  
  // === FAMILIA ===
  'familia', 'papa', 'papá', 'mama', 'mamá', 'padre', 'madre', 'padres',
  'hijo', 'hija', 'hijos', 'hermano', 'hermana', 'hermanos',
  'abuelo', 'abuela', 'abuelos', 'nieto', 'nieta', 'nietos',
  'tio', 'tío', 'tia', 'tía', 'tios', 'tíos', 'primo', 'prima', 'primos',
  'esposo', 'esposa', 'novio', 'novia', 'amigo', 'amiga', 'amigos',
  
  // === PERSONAS ===
  'persona', 'personas', 'gente', 'hombre', 'mujer', 'niño', 'niña',
  'joven', 'adulto', 'señor', 'señora', 'doctor', 'doctora',
  'maestro', 'maestra', 'profesor', 'profesora', 'estudiante',
  
  // === CUERPO ===
  'cabeza', 'cara', 'ojos', 'nariz', 'boca', 'oreja', 'orejas',
  'mano', 'manos', 'dedo', 'dedos', 'brazo', 'brazos',
  'pierna', 'piernas', 'pie', 'pies', 'espalda', 'pecho',
  
  // === COMIDA Y BEBIDA ===
  'comida', 'desayuno', 'almuerzo', 'cena', 'agua', 'leche', 'jugo', 'cafe', 'café',
  'pan', 'arroz', 'frijoles', 'carne', 'pollo', 'pescado', 'huevo', 'huevos',
  'fruta', 'manzana', 'platano', 'plátano', 'naranja', 'verdura', 'ensalada',
  'sopa', 'tacos', 'torta', 'pastel', 'galleta', 'dulce', 'helado',
  
  // === ESTADOS Y EMOCIONES ===
  'feliz', 'triste', 'enojado', 'enojada', 'cansado', 'cansada',
  'contento', 'contenta', 'preocupado', 'preocupada', 'nervioso', 'nerviosa',
  'tranquilo', 'tranquila', 'emocionado', 'emocionada', 'aburrido', 'aburrida',
  'enfermo', 'enferma', 'sano', 'sana', 'bien', 'mal', 'mejor', 'peor',
  'hambre', 'sed', 'sueño', 'frio', 'frío', 'calor', 'dolor',
  
  // === ADJETIVOS COMUNES ===
  'grande', 'pequeño', 'pequeña', 'alto', 'alta', 'bajo', 'baja',
  'largo', 'larga', 'corto', 'corta', 'ancho', 'angosto',
  'nuevo', 'nueva', 'viejo', 'vieja', 'joven', 'antiguo', 'moderna',
  'bueno', 'buena', 'malo', 'mala', 'mejor', 'peor',
  'bonito', 'bonita', 'feo', 'fea', 'lindo', 'linda',
  'facil', 'fácil', 'dificil', 'difícil', 'simple', 'complicado',
  'importante', 'necesario', 'posible', 'imposible',
  'primero', 'primera', 'segundo', 'segunda', 'ultimo', 'última', 'siguiente',
  'mismo', 'misma', 'otro', 'otra', 'otros', 'otras',
  'todo', 'toda', 'todos', 'todas', 'cada', 'algunos', 'algunas',
  
  // === COLORES ===
  'color', 'colores', 'rojo', 'roja', 'azul', 'verde', 'amarillo', 'amarilla',
  'naranja', 'morado', 'morada', 'rosa', 'negro', 'negra', 'blanco', 'blanca',
  'gris', 'cafe', 'café', 'dorado', 'plateado',
  
  // === NÚMEROS ===
  'cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
  'once', 'doce', 'trece', 'catorce', 'quince', 'veinte', 'treinta', 'cuarenta', 'cincuenta',
  'cien', 'ciento', 'mil', 'millon', 'millón', 'numero', 'número',
  'primero', 'segundo', 'tercero', 'cuarto', 'quinto',
  
  // === OBJETOS COTIDIANOS ===
  'cosa', 'cosas', 'objeto', 'telefono', 'teléfono', 'celular', 'computadora',
  'libro', 'libros', 'cuaderno', 'lapiz', 'lápiz', 'pluma', 'papel',
  'mesa', 'silla', 'cama', 'puerta', 'ventana', 'pared', 'piso', 'techo',
  'ropa', 'camisa', 'pantalon', 'pantalón', 'zapatos', 'sombrero',
  'bolsa', 'mochila', 'llave', 'llaves', 'dinero', 'cartera',
  'carro', 'coche', 'auto', 'bicicleta', 'autobus', 'autobús', 'avion', 'avión',
  
  // === CONECTORES ===
  'y', 'e', 'o', 'u', 'pero', 'sino', 'aunque', 'porque', 'pues',
  'entonces', 'asi', 'así', 'tambien', 'también', 'tampoco', 'ademas', 'además',
  'sin', 'embargo', 'mientras', 'durante', 'desde', 'hasta', 'entre',
  'sobre', 'bajo', 'hacia', 'contra', 'segun', 'según',
  
  // === PREPOSICIONES ===
  'a', 'ante', 'bajo', 'con', 'contra', 'de', 'desde', 'en', 'entre',
  'hacia', 'hasta', 'para', 'por', 'segun', 'según', 'sin', 'sobre', 'tras',
  
  // === EXPRESIONES ÚTILES AAC ===
  'ayuda', 'necesito', 'quiero', 'puedo', 'tengo', 'estoy', 'siento', 'duele',
  'repite', 'repita', 'espera', 'momento', 'listo', 'lista', 'entiendo', 'entendi', 'entendí',
  'escribiendo', 'pensando', 'buscando'
]

// Crear Set para búsqueda rápida y eliminar duplicados
const wordSet = new Set(spanishWords.map(w => w.toLowerCase()))

// Convertir a array ordenado
export const dictionary = Array.from(wordSet).sort()

// Función de búsqueda
export function searchWords(prefix, limit = 5) {
  if (!prefix || prefix.length === 0) return []
  
  const normalizedPrefix = prefix.toLowerCase()
  const results = []
  
  for (const word of dictionary) {
    if (word.startsWith(normalizedPrefix)) {
      results.push(word)
      if (results.length >= limit) break
    }
  }
  
  return results
}

export default dictionary
