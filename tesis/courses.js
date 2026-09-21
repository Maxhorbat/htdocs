/**
 * courses.js — Banco estático ampliado
 */

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickQuestions(pool, count) {
  if (!Array.isArray(pool) || pool.length === 0) return [];
  
  let combinedPool = [];
  while (combinedPool.length < count) {
    combinedPool = combinedPool.concat(shuffleArray(pool));
  }
  
  const selectedPool = combinedPool.slice(0, count);

  return selectedPool.map((q) => {
    const originalOptions = Array.isArray(q.options) ? q.options : [];
    const correctIdx = typeof q.correct === 'number' ? q.correct : 0;

    const mappedOpts = originalOptions.map((text, idx) => ({
      text,
      isCorrect: idx === correctIdx
    }));

    const shuffledOpts = shuffleArray(mappedOpts);
    const newCorrectIdx = shuffledOpts.findIndex((o) => o.isCorrect);

    return {
      q: q.q || "",
      options: shuffledOpts.map((o) => o.text),
      correct: newCorrectIdx >= 0 ? newCorrectIdx : 0,
      exp: q.exp || ""
    };
  });
}

const BASE_COURSES = {
  escuela: {
    "Ciencias Naturales": {
      icon: "🌱",
      questions: [
        { q: "¿Qué proceso usan las plantas para fabricar su alimento?", options: ["Fotosíntesis", "Respiración", "Digestión", "Absorción"], correct: 0, exp: "La fotosíntesis convierte la luz solar en glucosa." },
        { q: "¿Cuál es el planeta más cercano al Sol?", options: ["Mercurio", "Venus", "Tierra", "Marte"], correct: 0, exp: "Mercurio ocupa el primer lugar en distancia al Sol." },
        { q: "¿Qué gas es indispensable para la respiración humana?", options: ["Oxígeno", "Dióxido de carbono", "Nitrógeno", "Helio"], correct: 0, exp: "El oxígeno es vital para nuestras células." },
        { q: "¿Cuál es el animal terrestre más grande del mundo?", options: ["Elefante africano", "Jirafa", "Rinoceronte", "Hipopótamo"], correct: 0, exp: "El elefante africano es el mamífero terrestre más grande." },
        { q: "¿Qué parte de la planta absorbe el agua del suelo?", options: ["Raíz", "Tallo", "Hoja", "Flor"], correct: 0, exp: "Las raíces extraen agua y nutrientes." },
        { q: "¿Cuál es el estado físico del agua a temperatura ambiente?", options: ["Líquido", "Sólido", "Gaseoso", "Plasma"], correct: 0, exp: "Permanecen en estado líquido a temperatura habitual." },
        { q: "¿Qué estrella nos da luz y calor?", options: ["El Sol", "La Luna", "Alfa Centauri", "Sirio"], correct: 0, exp: "El Sol es la estrella central de nuestro sistema." },
        { q: "¿A qué grupo pertenecen las ranas?", options: ["Anfibios", "Reptiles", "Mamíferos", "Aves"], correct: 0, exp: "Las ranas son animales anfibios." },
        { q: "¿Cuál es el órgano de la vista?", options: ["Ojo", "Oído", "Nariz", "Piel"], correct: 0, exp: "Los ojos son receptores visuales." },
        { q: "¿Qué forman varias estrellas en el cielo nocturno?", options: ["Constelaciones", "Cometas", "Asteroides", "Satélites"], correct: 0, exp: "Son agrupaciones aparentes de estrellas." },
        { q: "¿Qué animal fabrica miel?", options: ["Abeja", "Avispa", "Hormiga", "Mosca"], correct: 0, exp: "Las abejas elaboran miel a partir de néctar." },
        { q: "¿En qué estado se encuentra el hielo?", options: ["Sólido", "Líquido", "Gaseoso", "Vapor"], correct: 0, exp: "El hielo es agua congelada en estado sólido." },
        { q: "¿Qué sentido nos permite escuchar música?", options: ["Oído", "Tacto", "Gusto", "Olfato"], correct: 0, exp: "El oído percibe ondas sonoras." },
        { q: "¿Cuál de estos animales es un ave que no vuela?", options: ["Pingüino", "Águila", "Gaviota", "Gorrión"], correct: 0, exp: "Los pingüinos nadan pero no vuelan." },
        { q: "¿Cuál es el satélite natural de la Tierra?", options: ["La Luna", "Marte", "El Sol", "Titán"], correct: 0, exp: "La Luna es el único satélite natural de la Tierra." },
        { q: "¿Cómo se llama el agua en estado gaseoso?", options: ["Vapor de agua", "Hielo", "Lluvia", "Nieve"], correct: 0, exp: "Al evaporarse se convierte en vapor." },
        { q: "¿Qué instrumento mide la temperatura?", options: ["Termómetro", "Brújula", "Regla", "Báscula"], correct: 0, exp: "El termómetro mide la temperatura." },
        { q: "¿De qué está cubierta la piel de los peces?", options: ["Escamas", "Plumas", "Pelos", "Lana"], correct: 0, exp: "Las escamas protegen su cuerpo." },
        { q: "¿Qué tipo de energía produce el viento?", options: ["Eólica", "Solar", "Hidráulica", "Térmica"], correct: 0, exp: "El viento genera energía eólica." },
        { q: "¿Cómo se llama la transformación de oruga a mariposa?", options: ["Metamorfosis", "Evolución", "Crecimiento", "Respiración"], correct: 0, exp: "Es una transformación llamada metamorfosis." }
      ]
    }
  },
  secundaria: {
    "Matemáticas": {
      icon: "📐",
      questions: [
        { q: "Si 2x + 5 = 15, ¿cuál es el valor de x?", options: ["x = 5", "x = 10", "x = 7", "x = 3"], correct: 0, exp: "2x = 10 -> x = 5" },
        { q: "¿Área de un triángulo de base 8 y altura 5?", options: ["20", "40", "13", "30"], correct: 0, exp: "(8 * 5) / 2 = 20" },
        { q: "¿Cuánto es √144?", options: ["12", "14", "10", "16"], correct: 0, exp: "12 * 12 = 144" },
        { q: "¿Valor aproximado de Pi (π)?", options: ["3.1416", "3.1214", "3.1614", "3.1400"], correct: 0, exp: "Se aproxima a 3.1416." },
        { q: "¿Cómo se denomina un ángulo de 90 grados?", options: ["Recto", "Agudo", "Obtuso", "Llano"], correct: 0, exp: "Un ángulo de 90° es recto." },
        { q: "¿Cuánto suman los ángulos internos de un triángulo?", options: ["180°", "360°", "90°", "270°"], correct: 0, exp: "Suman siempre 180°." },
        { q: "¿Resultado de 3² + 4²?", options: ["25", "14", "49", "12"], correct: 0, exp: "9 + 16 = 25" },
        { q: "¿Perímetro de un cuadrado con lado de 6 cm?", options: ["24 cm", "36 cm", "12 cm", "18 cm"], correct: 0, exp: "4 * 6 = 24 cm" },
        { q: "¿Resto de dividir 17 entre 5?", options: ["2", "3", "1", "0"], correct: 0, exp: "17 = (5 * 3) + 2" },
        { q: "Si un auto va a 60 km/h, ¿cuánto recorre en 3 horas?", options: ["180 km", "120 km", "200 km", "150 km"], correct: 0, exp: "Distancia = 60 * 3 = 180 km" },
        { q: "Factoriza: 5x + 10", options: ["5(x + 2)", "5(x + 10)", "x(5 + 10)", "10(x + 1)"], correct: 0, exp: "Extraemos el factor común 5." },
        { q: "¿Cuánto es 2⁵?", options: ["32", "10", "16", "64"], correct: 0, exp: "2 elevado a la 5 da 32." },
        { q: "¿Cuál de los siguientes es un número primo?", options: ["13", "15", "9", "21"], correct: 0, exp: "13 solo es divisible por 1 y 13." },
        { q: "Si y = 2x - 1 y x = 4, ¿cuánto vale y?", options: ["7", "8", "9", "6"], correct: 0, exp: "y = 2(4) - 1 = 7" },
        { q: "¿Cuánto es el 20% de 150?", options: ["30", "20", "15", "40"], correct: 0, exp: "150 * 0.20 = 30" },
        { q: "¿Cuántos lados tiene un heptágono?", options: ["7", "6", "8", "9"], correct: 0, exp: "Tiene 7 lados." },
        { q: "Simplifica la fracción 12/16", options: ["3/4", "6/8", "2/3", "4/5"], correct: 0, exp: "Dividido entre 4 resulta 3/4." },
        { q: "¿Qué letra representa la pendiente en y = mx + b?", options: ["m", "b", "x", "y"], correct: 0, exp: "'m' es la pendiente." },
        { q: "¿Valor absoluto de -25?", options: ["25", "-25", "0", "1"], correct: 0, exp: "La distancia respecto a cero es 25." },
        { q: "¿Siguiente número en la secuencia 2, 4, 8, 16...?", options: ["32", "24", "20", "64"], correct: 0, exp: "Se multiplica por 2." }
      ]
    }
  },
  tecnica: {
    "Sistemas y Redes": {
      icon: "🌐",
      questions: [
        { q: "¿Qué puerto usa HTTP por defecto?", options: ["80", "443", "21", "22"], correct: 0, exp: "HTTP usa el puerto 80." },
        { q: "¿Qué significa IP?", options: ["Internet Protocol", "Internal Process", "Interface Port", "Input Provider"], correct: 0, exp: "IP es Internet Protocol." },
        { q: "¿Qué dispositivo conecta diferentes redes de datos?", options: ["Router", "Switch", "Hub", "Módem"], correct: 0, exp: "El router enruta entre subredes." },
        { q: "¿Qué protocolo cifra las conexiones web?", options: ["HTTPS", "HTTP", "FTP", "Telnet"], correct: 0, exp: "HTTPS utiliza TLS/SSL." },
        { q: "¿Qué dirección física identifica a una tarjeta de red?", options: ["MAC", "IP", "DNS", "Gateway"], correct: 0, exp: "Es la dirección MAC grabada en hardware." },
        { q: "¿Qué puerto utiliza el protocolo SSH?", options: ["22", "80", "443", "25"], correct: 0, exp: "SSH utiliza el puerto 22." },
        { q: "¿Qué servicio traduce dominios a direcciones IP?", options: ["DNS", "DHCP", "FTP", "NAT"], correct: 0, exp: "DNS resuelve nombres a IP." },
        { q: "¿Qué protocolo asigna direcciones IP automáticas?", options: ["DHCP", "DNS", "SNMP", "SMTP"], correct: 0, exp: "DHCP las asigna dinámicamente." },
        { q: "Máscara de subred por defecto para Clase C:", options: ["255.255.255.0", "255.0.0.0", "255.255.0.0", "255.255.255.255"], correct: 0, exp: "Corresponde al bloque /24." },
        { q: "¿Comando para probar conectividad en red?", options: ["ping", "tracert", "ipconfig", "netstat"], correct: 0, exp: "ping utiliza paquetes ICMP." },
        { q: "¿Capa del modelo OSI que gestiona rutas?", options: ["Red", "Transporte", "Enlace de datos", "Física"], correct: 0, exp: "La Capa 3 maneja el enrutamiento." },
        { q: "Protocolo orientado a conexión confiable:", options: ["TCP", "UDP", "IP", "ICMP"], correct: 0, exp: "TCP asegura la entrega." },
        { q: "Protocolo no orientado a conexión rápido:", options: ["UDP", "TCP", "HTTP", "FTP"], correct: 0, exp: "UDP no espera confirmaciones." },
        { q: "¿Comando que muestra IPs en Windows?", options: ["ipconfig", "ifconfig", "netstat", "ping"], correct: 0, exp: "ipconfig despliega la red en Windows." },
        { q: "¿Comando que muestra interfaces en Linux?", options: ["ip a / ifconfig", "ipconfig", "systemctl", "route"], correct: 0, exp: "'ip a' despliega interfaces en Linux." },
        { q: "Topología donde todo conecta a un nodo central:", options: ["Estrella", "Malla", "Bus", "Anillo"], correct: 0, exp: "Es la topología en Estrella." },
        { q: "Rango IP privado Clase A:", options: ["10.0.0.0 a 10.255.255.255", "192.168.0.0 a 192.168.255.255", "172.16.0.0 a 172.31.255.255", "127.0.0.0/8"], correct: 0, exp: "Reservado en RFC 1918." },
        { q: "¿Puerto de correo saliente SMTP?", options: ["25", "110", "143", "80"], correct: 0, exp: "Usa el puerto 25." },
        { q: "¿Dispositivo capa 2 OSI?", options: ["Switch", "Router", "Repetidor", "Hub"], correct: 0, exp: "El switch trabaja a nivel de enlace de datos." },
        { q: "¿Qué significa VPN?", options: ["Virtual Private Network", "Visual Process Node", "Vector Path Network", "Virtual Public Network"], correct: 0, exp: "Virtual Private Network." }
      ]
    }
  },
  universidad: {
    "Programación": {
      icon: "💻",
      questions: [
        { q: "¿Complejidad temporal de la búsqueda binaria?", options: ["O(log n)", "O(n)", "O(n^2)", "O(1)"], correct: 0, exp: "Divide el problema a la mitad progresivamente." },
        { q: "¿Estructura bajo el principio LIFO?", options: ["Pila (Stack)", "Cola (Queue)", "Lista enlazada", "Árbol"], correct: 0, exp: "Last In, First Out." },
        { q: "Comando Git para enviar cambios a remoto:", options: ["git push", "git commit", "git pull", "git add"], correct: 0, exp: "git push actualiza la rama remota." },
        { q: "¿Estructura bajo el principio FIFO?", options: ["Cola (Queue)", "Pila (Stack)", "Grafo", "Heap"], correct: 0, exp: "First In, First Out." },
        { q: "Peor caso de QuickSort:", options: ["O(n^2)", "O(n log n)", "O(n)", "O(1)"], correct: 0, exp: "Ocurre cuando el pivote es desbalanceado." },
        { q: "¿Qué concepto de POO permite múltiples formas?", options: ["Polimorfismo", "Encapsulamiento", "Herencia", "Abstracción"], correct: 0, exp: "Permite tratar instancias de forma genérica." },
        { q: "Valor predeterminado de boolean en Java:", options: ["false", "true", "null", "0"], correct: 0, exp: "Inicia siempre en false." },
        { q: "Operador de comparación estricta en JavaScript:", options: ["===", "==", "=", "!="], correct: 0, exp: "Verifica valor y tipo de dato." },
        { q: "Estructura clave-valor:", options: ["Mapa / Diccionario", "Array", "Set", "Lista"], correct: 0, exp: "Relaciona llaves únicas con valores." },
        { q: "Método para agregar al final en un Array de JS:", options: ["push()", "pop()", "shift()", "unshift()"], correct: 0, exp: "push() inserta al final del arreglo." },
        { q: "Declaración de variables inmutables en JS:", options: ["const", "let", "var", "static"], correct: 0, exp: "const impide la reasignación." },
        { q: "¿Qué significa SQL?", options: ["Structured Query Language", "Sequential Quality Logic", "System Query List", "Simple Query Language"], correct: 0, exp: "Lenguaje de Consulta Estructurado." },
        { q: "En bases de datos, ¿qué garantiza ACID?", options: ["Transacciones fiables", "Seguridad en la red", "Velocidad de procesamiento", "Cifrado"], correct: 0, exp: "Garantiza atomicidad, consistencia, aislamiento y durabilidad." },
        { q: "¿Qué JOIN filtra solo coincidencias exactas?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"], correct: 0, exp: "Obtiene la intersección de tablas." },
        { q: "¿Qué significa API?", options: ["Application Programming Interface", "Automated Process Integration", "Applied Program Interaction", "Advanced Protocol Interface"], correct: 0, exp: "Interfaz de Programación de Aplicaciones." },
        { q: "HTTP Status Code para 'No encontrado':", options: ["404", "200", "500", "403"], correct: 0, exp: "404 Not Found." },
        { q: "HTTP Status Code para solicitud exitosa:", options: ["200", "201", "301", "400"], correct: 0, exp: "200 OK." },
        { q: "Archivo de construcción de imágenes Docker:", options: ["Dockerfile", "docker-compose.yml", "package.json", "Makefile"], correct: 0, exp: "Contiene instrucciones para generar la imagen." },
        { q: "Paradigma que evita mutación de estados:", options: ["Funcional", "Orientado a Objetos", "Imperativo", "Procedimental"], correct: 0, exp: "Promueve funciones puras e inmutabilidad." },
        { q: "Acceso directo por índice en Array:", options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], correct: 0, exp: "Toma tiempo constante O(1)." }
      ]
    }
  }
};

function getCourseNames(level) {
  const base = BASE_COURSES[level] || {};
  return Object.keys(base);
}

function getCourse(level, name) {
  return BASE_COURSES[level]?.[name] || null;
}

function generateExamQuestions(topic, count, difficulty, studyLevel) {
  const course = getCourse(studyLevel, topic);
  if (course && Array.isArray(course.questions) && course.questions.length > 0) {
    return pickQuestions(course.questions, count);
  }
  throw new Error(`No hay preguntas disponibles para el curso seleccionado.`);
}

/**
 * Genera preguntas en tiempo real utilizando la IA del servidor.
 */
async function generateExamQuestions(topic, count, difficulty, studyLevel) {
  const res = await fetch("api.php?action=generate_ia_questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, count, difficulty, studyLevel })
  });

  if (!res.ok) throw new Error("Error al conectar con el servidor de IA.");

  const questions = await res.json();
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("La IA no pudo procesar las preguntas para esta configuración.");
  }

  return questions;
}