/**
 * courses.js
 * Cursos organizados por nivel de estudio.
 * Escuela · Secundaria · Carrera técnica · Universidad
 */

const COURSES_BY_LEVEL = {
  /* ========== ESCUELA (primaria) ========== */
  escuela: {
    "Matemáticas básicas": {
      icon: "🔢",
      description: "Sumas, restas, multiplicaciones y divisiones",
      questions: [
        { q: "¿Cuánto es 7 + 5?", options: ["12", "11", "13", "10"], correct: 0, exp: "7 + 5 = 12" },
        { q: "¿Cuánto es 9 × 3?", options: ["27", "21", "24", "30"], correct: 0, exp: "9 × 3 = 27" },
        { q: "¿Cuánto es 20 ÷ 4?", options: ["5", "4", "6", "8"], correct: 0, exp: "20 ÷ 4 = 5" },
        { q: "¿Cuál es el número mayor: 45 o 54?", options: ["54", "45", "Son iguales", "No se puede saber"], correct: 0, exp: "54 es mayor que 45" },
        { q: "Si tienes 10 manzanas y regalas 3, ¿cuántas te quedan?", options: ["7", "8", "6", "13"], correct: 0, exp: "10 − 3 = 7" },
        { q: "¿Cuántos lados tiene un triángulo?", options: ["3", "4", "5", "6"], correct: 0, exp: "Un triángulo tiene 3 lados" }
      ]
    },
    "Ciencias naturales": {
      icon: "🌱",
      description: "Animales, plantas y el cuerpo humano",
      questions: [
        { q: "¿Qué necesita una planta para crecer?", options: ["Agua y sol", "Solo agua", "Solo tierra", "Solo aire"], correct: 0, exp: "Las plantas necesitan agua, sol y nutrientes" },
        { q: "¿Cuántas patas tiene una araña?", options: ["8", "6", "4", "10"], correct: 0, exp: "Las arañas tienen 8 patas" },
        { q: "¿Qué órgano bombea la sangre?", options: ["El corazón", "El cerebro", "El estómago", "Los pulmones"], correct: 0, exp: "El corazón bombea la sangre" },
        { q: "¿En qué estado está el hielo?", options: ["Sólido", "Líquido", "Gaseoso", "Plasma"], correct: 0, exp: "El hielo es agua en estado sólido" },
        { q: "¿Qué animal pone huevos y vuela?", options: ["Ave", "Perro", "Pez", "Gato"], correct: 0, exp: "Las aves ponen huevos y la mayoría vuelan" }
      ]
    },
    "Lenguaje": {
      icon: "✏️",
      description: "Lectura, escritura y vocabulario",
      questions: [
        { q: "¿Cuál es el plural de 'casa'?", options: ["casas", "cases", "casases", "casa"], correct: 0, exp: "casa → casas" },
        { q: "¿Qué signo se usa al final de una pregunta?", options: ["¿ ?", ". ", "! ", ", "], correct: 0, exp: "Las preguntas van entre ¿ ?" },
        { q: "¿Cuántas vocales hay en el abecedario?", options: ["5", "4", "6", "7"], correct: 0, exp: "a, e, i, o, u = 5 vocales" },
        { q: "¿Qué palabra es un sustantivo?", options: ["mesa", "correr", "bonito", "rápidamente"], correct: 0, exp: "mesa es un nombre (sustantivo)" }
      ]
    },
    "Geografía infantil": {
      icon: "🗺️",
      description: "Países, continentes y el planeta",
      questions: [
        { q: "¿En qué planeta vivimos?", options: ["Tierra", "Marte", "Luna", "Sol"], correct: 0, exp: "Vivimos en el planeta Tierra" },
        { q: "¿Cuántos continentes hay aproximadamente?", options: ["7", "5", "3", "10"], correct: 0, exp: "Hay 7 continentes" },
        { q: "¿Qué es más grande: un país o un continente?", options: ["Un continente", "Un país", "Son iguales", "Depende"], correct: 0, exp: "Un continente agrupa varios países" }
      ]
    }
  },

  /* ========== SECUNDARIA ========== */
  secundaria: {
    "Matemáticas": {
      icon: "📐",
      description: "Álgebra, geometría y porcentajes",
      questions: [
        { q: "Resuelve: 3x − 7 = 14", options: ["x = 7", "x = 5", "x = 3", "x = 9"], correct: 0, exp: "3x = 21 → x = 7" },
        { q: "¿Cuál es el área de un círculo de radio 5?", options: ["25π", "10π", "5π", "π"], correct: 0, exp: "A = πr² = 25π" },
        { q: "¿Cuánto es 15% de 200?", options: ["30", "15", "40", "25"], correct: 0, exp: "0.15 × 200 = 30" },
        { q: "¿Cuál es el valor de √144?", options: ["12", "14", "10", "16"], correct: 0, exp: "12 × 12 = 144" },
        { q: "Si un triángulo tiene lados 3, 4 y 5, ¿es rectángulo?", options: ["Sí", "No", "Solo si es isósceles", "Depende"], correct: 0, exp: "3² + 4² = 5² (Pitágoras)" },
        { q: "¿Cuál es la pendiente de la recta y = 2x + 3?", options: ["2", "3", "5", "0"], correct: 0, exp: "En y = mx + b, m es la pendiente" }
      ]
    },
    "Historia": {
      icon: "📜",
      description: "Historia universal y de América",
      questions: [
        { q: "¿Quién llegó a América en 1492?", options: ["Cristóbal Colón", "Vasco da Gama", "Marco Polo", "Hernán Cortés"], correct: 0, exp: "Colón llegó el 12 de octubre de 1492" },
        { q: "¿En qué año cayó el Muro de Berlín?", options: ["1989", "1991", "1975", "1961"], correct: 0, exp: "9 de noviembre de 1989" },
        { q: "¿Quién fue el primer presidente de EE.UU.?", options: ["George Washington", "Thomas Jefferson", "Abraham Lincoln", "John Adams"], correct: 0, exp: "George Washington (1789–1797)" },
        { q: "¿En qué año terminó la Segunda Guerra Mundial?", options: ["1945", "1939", "1941", "1950"], correct: 0, exp: "1945" },
        { q: "¿Qué civilización construyó Machu Picchu?", options: ["Inca", "Maya", "Azteca", "Olmeca"], correct: 0, exp: "Los incas construyeron Machu Picchu" }
      ]
    },
    "Ciencias": {
      icon: "🔬",
      description: "Física, química y biología básica",
      questions: [
        { q: "¿Cuál es el elemento con símbolo Au?", options: ["Oro", "Plata", "Aluminio", "Argón"], correct: 0, exp: "Au = aurum = oro" },
        { q: "¿Qué planeta es el rojo?", options: ["Marte", "Venus", "Júpiter", "Mercurio"], correct: 0, exp: "Marte por el óxido de hierro" },
        { q: "¿Cuál es la fórmula del agua?", options: ["H₂O", "CO₂", "O₂", "NaCl"], correct: 0, exp: "Dos hidrógenos y un oxígeno" },
        { q: "¿Qué fuerza mantiene a los planetas en órbita?", options: ["Gravedad", "Magnetismo", "Fricción", "Electricidad"], correct: 0, exp: "La gravedad" },
        { q: "¿Cuántos cromosomas tiene un ser humano?", options: ["46", "23", "48", "44"], correct: 0, exp: "23 pares = 46" }
      ]
    },
    "Inglés": {
      icon: "🇬🇧",
      description: "Vocabulario y gramática básica",
      questions: [
        { q: "How do you say 'hola' in English?", options: ["Hello", "Goodbye", "Thanks", "Please"], correct: 0, exp: "Hello = Hola" },
        { q: "What is the past of 'go'?", options: ["went", "goed", "goes", "going"], correct: 0, exp: "go → went" },
        { q: "¿Cuál es el plural de 'child'?", options: ["children", "childs", "childes", "childrens"], correct: 0, exp: "child → children" },
        { q: "How do you say 'gracias'?", options: ["Thank you", "Please", "Sorry", "Hello"], correct: 0, exp: "Thank you" }
      ]
    },
    "Geografía": {
      icon: "🌍",
      description: "Países, capitales y geografía física",
      questions: [
        { q: "¿Capital de Francia?", options: ["París", "Lyon", "Marsella", "Niza"], correct: 0, exp: "París" },
        { q: "¿Río más largo del mundo?", options: ["Amazonas", "Nilo", "Yangtsé", "Misisipi"], correct: 0, exp: "Amazonas (por longitud/caudal)" },
        { q: "¿En qué continente está Egipto?", options: ["África", "Asia", "Europa", "América"], correct: 0, exp: "Norte de África" },
        { q: "¿Océano más grande?", options: ["Pacífico", "Atlántico", "Índico", "Ártico"], correct: 0, exp: "Pacífico" }
      ]
    }
  },

  /* ========== CARRERA TÉCNICA ========== */
  tecnica: {
    "Programación": {
      icon: "💻",
      description: "Fundamentos de código y lógica",
      questions: [
        { q: "¿Qué significa HTML?", options: ["HyperText Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], correct: 0, exp: "HyperText Markup Language" },
        { q: "Operador de igualdad estricta en JavaScript:", options: ["===", "==", "=", "!="], correct: 0, exp: "=== compara valor y tipo" },
        { q: "Método para añadir al final de un array:", options: ["push()", "pop()", "shift()", "unshift()"], correct: 0, exp: "array.push(elemento)" },
        { q: "¿Qué es una función?", options: ["Bloque de código reutilizable", "Una variable", "Un tipo de dato", "Un error"], correct: 0, exp: "Permite reutilizar lógica" },
        { q: "¿Qué significa CSS?", options: ["Cascading Style Sheets", "Computer Style System", "Creative Style Syntax", "Coded Style Sheet"], correct: 0, exp: "Cascading Style Sheets" },
        { q: "¿Qué es un bucle for?", options: ["Repite código un número de veces", "Declara una variable", "Importa una librería", "Cierra el programa"], correct: 0, exp: "Itera un número definido de veces" }
      ]
    },
    "Redes y sistemas": {
      icon: "🌐",
      description: "Redes, IP y sistemas operativos",
      questions: [
        { q: "¿Qué significa IP?", options: ["Internet Protocol", "Internal Process", "Input Port", "Interface Program"], correct: 0, exp: "Internet Protocol" },
        { q: "Puerto por defecto de HTTP:", options: ["80", "443", "22", "21"], correct: 0, exp: "HTTP usa el puerto 80" },
        { q: "¿Qué es un sistema operativo?", options: ["Software que gestiona hardware y programas", "Un navegador", "Una aplicación de oficina", "Un antivirus"], correct: 0, exp: "Ejemplos: Windows, Linux, macOS" },
        { q: "¿Qué hace DNS?", options: ["Traduce nombres de dominio a IP", "Envía correos", "Comprime archivos", "Encripta discos"], correct: 0, exp: "Domain Name System" },
        { q: "Protocolo seguro de web:", options: ["HTTPS", "FTP", "Telnet", "HTTP"], correct: 0, exp: "HTTPS = HTTP + cifrado" }
      ]
    },
    "Electricidad y electrónica": {
      icon: "⚡",
      description: "Conceptos básicos de electricidad",
      questions: [
        { q: "Unidad de resistencia eléctrica:", options: ["Ohmio (Ω)", "Voltio", "Amperio", "Vatio"], correct: 0, exp: "La resistencia se mide en ohmios" },
        { q: "Ley de Ohm:", options: ["V = I × R", "P = V × I", "E = m c²", "F = m a"], correct: 0, exp: "Voltaje = Intensidad × Resistencia" },
        { q: "Unidad de corriente eléctrica:", options: ["Amperio", "Voltio", "Ohmio", "Culombio"], correct: 0, exp: "La corriente se mide en amperios" },
        { q: "¿Qué componente almacena carga eléctrica?", options: ["Condensador", "Resistencia", "Inductor", "Diodo"], correct: 0, exp: "El condensador almacena carga" }
      ]
    },
    "Ofimática": {
      icon: "📊",
      description: "Excel, documentos y productividad",
      questions: [
        { q: "En Excel, ¿qué hace la función SUMA?", options: ["Suma un rango de celdas", "Cuenta celdas", "Promedia", "Busca texto"], correct: 0, exp: "=SUMA(A1:A10)" },
        { q: "Extensión típica de Word:", options: [".docx", ".xlsx", ".pptx", ".pdf"], correct: 0, exp: ".docx es documento de Word" },
        { q: "¿Qué es un gráfico de barras?", options: ["Representa datos con barras", "Un mapa", "Una tabla pivote", "Una macro"], correct: 0, exp: "Compara categorías visualmente" },
        { q: "Atajo para guardar en la mayoría de programas:", options: ["Ctrl + S", "Ctrl + C", "Ctrl + V", "Ctrl + Z"], correct: 0, exp: "Ctrl + S = Guardar" }
      ]
    },
    "Seguridad informática": {
      icon: "🔐",
      description: "Buenas prácticas de seguridad",
      questions: [
        { q: "¿Qué es el phishing?", options: ["Engaño para robar datos", "Un antivirus", "Un tipo de firewall", "Un lenguaje de programación"], correct: 0, exp: "Suplantación para obtener información" },
        { q: "¿Por qué usar contraseñas fuertes?", options: ["Dificultan el acceso no autorizado", "Hacen el PC más rápido", "Mejoran el WiFi", "Ahorran batería"], correct: 0, exp: "Más seguridad ante ataques" },
        { q: "¿Qué es el 2FA?", options: ["Autenticación en dos factores", "Un antivirus", "Un protocolo de red", "Un tipo de backup"], correct: 0, exp: "Añade una segunda verificación" }
      ]
    }
  },

  /* ========== UNIVERSIDAD ========== */
  universidad: {
    "Cálculo": {
      icon: "∫",
      description: "Derivadas, integrales y límites",
      questions: [
        { q: "Derivada de f(x) = x²:", options: ["2x", "x", "2", "x³"], correct: 0, exp: "d/dx (xⁿ) = n xⁿ⁻¹" },
        { q: "Derivada de f(x) = eˣ:", options: ["eˣ", "x eˣ", "1/eˣ", "ln(x)"], correct: 0, exp: "La derivada de eˣ es eˣ" },
        { q: "∫ 2x dx =", options: ["x² + C", "2x² + C", "x + C", "2 + C"], correct: 0, exp: "Integral de 2x es x² + C" },
        { q: "Límite de (sin x)/x cuando x→0:", options: ["1", "0", "∞", "No existe"], correct: 0, exp: "Límite fundamental trigonométrico = 1" },
        { q: "Derivada de ln(x):", options: ["1/x", "x", "ln(x)", "eˣ"], correct: 0, exp: "d/dx ln(x) = 1/x" }
      ]
    },
    "Física universitaria": {
      icon: "⚛️",
      description: "Mecánica, energía y ondas",
      questions: [
        { q: "Segunda ley de Newton:", options: ["F = m a", "E = m c²", "V = I R", "P = F / A"], correct: 0, exp: "Fuerza = masa × aceleración" },
        { q: "Energía cinética:", options: ["½ m v²", "m g h", "m v", "½ k x²"], correct: 0, exp: "K = ½ mv²" },
        { q: "Unidad de fuerza en el SI:", options: ["Newton", "Joule", "Watt", "Pascal"], correct: 0, exp: "1 N = 1 kg·m/s²" },
        { q: "Velocidad de la luz en el vacío (aprox.):", options: ["3×10⁸ m/s", "3×10⁶ m/s", "3×10¹⁰ m/s", "300 m/s"], correct: 0, exp: "c ≈ 3×10⁸ m/s" },
        { q: "Trabajo mecánico:", options: ["W = F · d", "W = m a", "W = ½ mv²", "W = P t"], correct: 0, exp: "Trabajo = fuerza × desplazamiento" }
      ]
    },
    "Programación avanzada": {
      icon: "🖥️",
      description: "Algoritmos, estructuras y paradigmas",
      questions: [
        { q: "Complejidad de búsqueda binaria:", options: ["O(log n)", "O(n)", "O(n²)", "O(1)"], correct: 0, exp: "Divide el espacio a la mitad cada paso" },
        { q: "¿Qué es una estructura de datos FIFO?", options: ["Cola (queue)", "Pila (stack)", "Árbol", "Grafo"], correct: 0, exp: "First In, First Out = cola" },
        { q: "Paradigma que usa clases y objetos:", options: ["Orientado a objetos", "Funcional", "Procedural", "Lógico"], correct: 0, exp: "OOP: clases, objetos, herencia..." },
        { q: "¿Qué es recursión?", options: ["Función que se llama a sí misma", "Un bucle for", "Una variable global", "Un tipo de error"], correct: 0, exp: "Debe tener caso base" },
        { q: "Estructura LIFO:", options: ["Pila (stack)", "Cola (queue)", "Lista enlazada", "Hash table"], correct: 0, exp: "Last In, First Out = pila" }
      ]
    },
    "Estadística": {
      icon: "📈",
      description: "Probabilidad, media y distribución",
      questions: [
        { q: "Media aritmética de 2, 4, 6:", options: ["4", "3", "6", "12"], correct: 0, exp: "(2+4+6)/3 = 4" },
        { q: "Probabilidad de sacar cara en una moneda justa:", options: ["0.5", "0.25", "1", "0"], correct: 0, exp: "1/2 = 0.5" },
        { q: "¿Qué mide la desviación estándar?", options: ["Dispersión respecto a la media", "El valor central", "La moda", "El rango intercuartílico solo"], correct: 0, exp: "Qué tan dispersos están los datos" },
        { q: "En una distribución normal, ≈68% de los datos está a:", options: ["1 desviación estándar de la media", "2 desviaciones", "3 desviaciones", "0 desviaciones"], correct: 0, exp: "Regla empírica 68-95-99.7" }
      ]
    },
    "Química general": {
      icon: "🧪",
      description: "Átomos, moles y reacciones",
      questions: [
        { q: "Número de Avogadro (aprox.):", options: ["6.022×10²³", "3×10⁸", "9.8", "1.6×10⁻¹⁹"], correct: 0, exp: "Partículas en un mol" },
        { q: "pH = 7 indica:", options: ["Neutro", "Ácido", "Básico", "Salino"], correct: 0, exp: "pH 7 = neutro (agua pura)" },
        { q: "Enlace entre metales y no metales típico:", options: ["Iónico", "Covalente", "Metálico", "De hidrógeno"], correct: 0, exp: "Transferencia de electrones" },
        { q: "Gas noble del grupo 18 con Z=10:", options: ["Neón", "Argón", "Helio", "Kriptón"], correct: 0, exp: "Ne (Z=10)" }
      ]
    },
    "Economía": {
      icon: "💰",
      description: "Oferta, demanda y macroeconomía básica",
      questions: [
        { q: "Si sube el precio, ¿qué pasa con la cantidad demandada (ceteris paribus)?", options: ["Disminuye", "Aumenta", "No cambia", "Se duplica"], correct: 0, exp: "Ley de la demanda" },
        { q: "PIB mide:", options: ["Valor de bienes y servicios finales de un país", "Solo exportaciones", "Deuda pública", "Inflación"], correct: 0, exp: "Producto Interno Bruto" },
        { q: "Inflación es:", options: ["Subida general de precios", "Bajada de precios", "Aumento del desempleo", "Crecimiento del PIB"], correct: 0, exp: "Pérdida de poder adquisitivo del dinero" },
        { q: "Política monetaria la gestiona principalmente:", options: ["El banco central", "El congreso solo", "Las empresas", "Los sindicatos"], correct: 0, exp: "Ej. tasas de interés, oferta monetaria" }
      ]
    }
  }
};

/* ========== API pública ========== */

function getCourseNames(studyLevel) {
  const level = studyLevel || "secundaria";
  const group = COURSES_BY_LEVEL[level];
  return group ? Object.keys(group) : [];
}

function getCourse(studyLevel, courseName) {
  return COURSES_BY_LEVEL[studyLevel]?.[courseName] || null;
}

function getQuestionsFromCourse(courseName, count, difficulty = 2, studyLevel = "secundaria") {
  const course = getCourse(studyLevel, courseName);
  if (!course || !course.questions?.length) {
    // Buscar en todos los niveles por si el nombre coincide
    for (const level of Object.keys(COURSES_BY_LEVEL)) {
      const c = COURSES_BY_LEVEL[level][courseName];
      if (c?.questions?.length) {
        return pickQuestions(c.questions, count);
      }
    }
    return [];
  }
  return pickQuestions(course.questions, count);
}

/**
 * Mezcla Fisher-Yates (mejor que sort aleatorio)
 */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Elige preguntas SIN repetir.
 * Si se piden más de las disponibles, devuelve solo las únicas disponibles.
 */
function pickQuestions(list, count) {
  if (!list || list.length === 0) return [];

  // Deduplicar por texto de pregunta por si el banco tiene duplicados
  const seen = new Set();
  const unique = [];
  for (const q of list) {
    const key = String(q.q || "").trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(q);
  }

  const shuffled = shuffleArray(unique);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  // Mezclar también el orden de las opciones en cada pregunta
  return selected.map((q) => {
    const opts = Array.isArray(q.options) ? [...q.options] : [];
    const correctText = opts[q.correct];
    const shuffledOpts = shuffleArray(opts);
    const newCorrect = Math.max(0, shuffledOpts.indexOf(correctText));
    return {
      q: q.q,
      options: shuffledOpts,
      correct: newCorrect,
      exp: q.exp || ""
    };
  });
}

/**
 * Añade un curso a un nivel de estudio
 */
function addCourse(name, data, studyLevel = "secundaria") {
  if (!COURSES_BY_LEVEL[studyLevel]) {
    COURSES_BY_LEVEL[studyLevel] = {};
  }
  COURSES_BY_LEVEL[studyLevel][name] = data;
  saveCustomCourses();
  return true;
}

function saveCustomCourses() {
  // Guardar solo cursos personalizados (marcados con custom: true)
  const custom = {};
  for (const [level, courses] of Object.entries(COURSES_BY_LEVEL)) {
    for (const [name, data] of Object.entries(courses)) {
      if (data.custom) {
        if (!custom[level]) custom[level] = {};
        custom[level][name] = data;
      }
    }
  }
  localStorage.setItem("customCoursesByLevel", JSON.stringify(custom));
}

function loadCustomCourses() {
  try {
    const custom = JSON.parse(localStorage.getItem("customCoursesByLevel") || "{}");
    for (const [level, courses] of Object.entries(custom)) {
      if (!COURSES_BY_LEVEL[level]) COURSES_BY_LEVEL[level] = {};
      Object.assign(COURSES_BY_LEVEL[level], courses);
    }
  } catch (e) {
    console.error("Error cargando cursos personalizados:", e);
  }
}

// Compatibilidad: objeto plano opcional (no usar para listar)
const COURSES = new Proxy(
  {},
  {
    get(_, prop) {
      for (const level of Object.keys(COURSES_BY_LEVEL)) {
        if (COURSES_BY_LEVEL[level][prop]) return COURSES_BY_LEVEL[level][prop];
      }
      return undefined;
    }
  }
);

loadCustomCourses();