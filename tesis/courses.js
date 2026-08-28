/**
 * courses.js
 * Banco de cursos y preguntas.
 * Aquí puedes añadir más materias fácilmente.
 */

const COURSES = {
  "Matemáticas": {
    icon: "📐",
    description: "Álgebra, geometría y cálculo básico",
    questions: [
      { q: "Resuelve: 3x - 7 = 14", options: ["x = 7", "x = 5", "x = 21/3", "x = 3"], correct: 0, exp: "3x = 21 → x = 7" },
      { q: "¿Cuál es el área de un círculo de radio 5?", options: ["25π", "10π", "5π", "π"], correct: 0, exp: "A = πr² = 25π" },
      { q: "¿Cuál es la derivada de f(x) = x²?", options: ["2x", "x", "2", "x³"], correct: 0, exp: "La derivada de xⁿ es n·xⁿ⁻¹ → 2x" },
      { q: "¿Cuánto es 15% de 200?", options: ["30", "15", "40", "25"], correct: 0, exp: "0.15 × 200 = 30" },
      { q: "¿Cuál es el valor de √144?", options: ["12", "14", "10", "16"], correct: 0, exp: "12 × 12 = 144" },
      { q: "Si un triángulo tiene lados 3, 4 y 5, ¿es rectángulo?", options: ["Sí", "No", "Solo si es isósceles", "Depende del ángulo"], correct: 0, exp: "3² + 4² = 9 + 16 = 25 = 5² (Pitágoras)" }
    ]
  },
  "Historia": {
    icon: "📜",
    description: "Historia universal y de América",
    questions: [
      { q: "¿Quién descubrió América en 1492?", options: ["Cristóbal Colón", "Vasco da Gama", "Marco Polo", "Hernán Cortés"], correct: 0, exp: "Cristóbal Colón llegó a América el 12 de octubre de 1492" },
      { q: "¿En qué año cayó el Muro de Berlín?", options: ["1989", "1991", "1975", "1961"], correct: 0, exp: "9 de noviembre de 1989" },
      { q: "¿Quién fue el primer presidente de Estados Unidos?", options: ["George Washington", "Thomas Jefferson", "Abraham Lincoln", "John Adams"], correct: 0, exp: "George Washington (1789-1797)" },
      { q: "¿En qué año terminó la Segunda Guerra Mundial?", options: ["1945", "1939", "1941", "1950"], correct: 0, exp: "1945 con la rendición de Japón" },
      { q: "¿Quién fue el líder de la Revolución Rusa de 1917?", options: ["Lenin", "Stalin", "Trotsky", "Marx"], correct: 0, exp: "Vladímir Lenin lideró la Revolución de Octubre" }
    ]
  },
  "Ciencia": {
    icon: "🔬",
    description: "Física, química y biología",
    questions: [
      { q: "¿Cuál es el elemento químico con símbolo Au?", options: ["Plata", "Oro", "Aluminio", "Argón"], correct: 1, exp: "Au proviene del latín 'aurum' = Oro" },
      { q: "¿Qué planeta es conocido como el planeta rojo?", options: ["Marte", "Venus", "Júpiter", "Mercurio"], correct: 0, exp: "Marte debe su color al óxido de hierro" },
      { q: "¿Cuál es la fórmula del agua?", options: ["H₂O", "CO₂", "O₂", "NaCl"], correct: 0, exp: "Dos átomos de hidrógeno y uno de oxígeno" },
      { q: "¿Qué fuerza mantiene a los planetas en órbita?", options: ["Gravedad", "Magnetismo", "Fricción", "Electricidad"], correct: 0, exp: "La gravedad de Newton / Einstein" },
      { q: "¿Cuántos cromosomas tiene un ser humano?", options: ["46", "23", "48", "44"], correct: 0, exp: "23 pares = 46 cromosomas" }
    ]
  },
  "Programación": {
    icon: "💻",
    description: "Fundamentos de JavaScript y lógica",
    questions: [
      { q: "¿Qué significa HTML?", options: ["HyperText Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], correct: 0, exp: "HyperText Markup Language" },
      { q: "¿Cuál es el operador de igualdad estricta en JavaScript?", options: ["===", "==", "=", "!="], correct: 0, exp: "=== compara valor y tipo" },
      { q: "¿Qué método se usa para añadir un elemento al final de un array?", options: ["push()", "pop()", "shift()", "unshift()"], correct: 0, exp: "array.push(elemento)" },
      { q: "¿Qué es una función en programación?", options: ["Un bloque de código reutilizable", "Una variable especial", "Un tipo de dato", "Un error del sistema"], correct: 0, exp: "Permite reutilizar lógica" },
      { q: "¿Qué significa CSS?", options: ["Cascading Style Sheets", "Computer Style System", "Creative Style Syntax", "Coded Style Sheet"], correct: 0, exp: "Cascading Style Sheets" }
    ]
  },
  "Geografía": {
    icon: "🌍",
    description: "Países, capitales y geografía física",
    questions: [
      { q: "¿Cuál es la capital de Francia?", options: ["París", "Lyon", "Marsella", "Niza"], correct: 0, exp: "París es la capital de Francia" },
      { q: "¿Cuál es el río más largo del mundo?", options: ["Nilo", "Amazonas", "Yangtsé", "Misisipi"], correct: 1, exp: "El Amazonas es el más largo por caudal y longitud reciente" },
      { q: "¿En qué continente está Egipto?", options: ["África", "Asia", "Europa", "América"], correct: 0, exp: "Egipto está en el norte de África" },
      { q: "¿Cuál es el océano más grande?", options: ["Pacífico", "Atlántico", "Índico", "Ártico"], correct: 0, exp: "El Océano Pacífico cubre ~30% de la Tierra" }
    ]
  },
  "Inglés": {
    icon: "🇬🇧",
    description: "Vocabulario y gramática básica",
    questions: [
      { q: "¿Cómo se dice 'hola' en inglés?", options: ["Hello", "Goodbye", "Thanks", "Please"], correct: 0, exp: "Hello = Hola" },
      { q: "What is the past tense of 'go'?", options: ["went", "goed", "goes", "going"], correct: 0, exp: "go → went (irregular)" },
      { q: "¿Cuál es el plural de 'child'?", options: ["children", "childs", "childes", "childrens"], correct: 0, exp: "child → children (irregular)" },
      { q: "How do you say 'gracias' in English?", options: ["Thank you", "Please", "Sorry", "Hello"], correct: 0, exp: "Thank you = Gracias" }
    ]
  }
};

function addCourse(name, data) {
  if (COURSES[name]) console.warn(`El curso "${name}" ya existe. Se sobrescribirá.`);
  COURSES[name] = data;
  saveCustomCourses();
  return true;
}

function saveCustomCourses() {
  const custom = {};
  const originals = ["Matemáticas", "Historia", "Ciencia", "Programación", "Geografía", "Inglés"];
  for (const [name, data] of Object.entries(COURSES)) {
    if (!originals.includes(name)) custom[name] = data;
  }
  localStorage.setItem("customCourses", JSON.stringify(custom));
}

function loadCustomCourses() {
  try {
    const custom = JSON.parse(localStorage.getItem("customCourses") || "{}");
    Object.assign(COURSES, custom);
  } catch (e) {
    console.error("Error cargando cursos personalizados:", e);
  }
}

function getCourseNames() {
  return Object.keys(COURSES);
}

function getQuestionsFromCourse(courseName, count, difficulty = 2) {
  const course = COURSES[courseName];
  if (!course || !course.questions.length) return [];
  let questions = [...course.questions].sort(() => Math.random() - 0.5);
  while (questions.length < count) {
    questions = questions.concat([...course.questions].sort(() => Math.random() - 0.5));
  }
  return questions.slice(0, count).map(q => ({ ...q }));
}

loadCustomCourses();