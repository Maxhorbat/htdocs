/**
 * ai.js — Conexión segura con IA
 * 
 * Seguridad:
 * - La API key solo vive en localStorage de ESTE navegador
 * - Nunca se envía a ningún servidor propio
 * - Solo se usa al llamar a la API que tú configuraste
 * - No se imprime en consola ni en logs
 * - Si hay key guardada, se usa IA automáticamente
 */

const AI_CONFIG = {
  apiKey: localStorage.getItem("ai_api_key") || "",
  baseURL: localStorage.getItem("ai_base_url") || "https://api.openai.com/v1",
  model: localStorage.getItem("ai_model") || "gpt-4o-mini",
  // Si hay key, usar IA por defecto (automatizado)
  useAI: localStorage.getItem("ai_use") !== "false" && !!(localStorage.getItem("ai_api_key"))
};

/** Niveles de estudio reconocidos por la IA */
const STUDY_LEVELS = {
  escuela: {
    id: "escuela",
    label: "Escuela (primaria)",
    description: "6-12 años. Conceptos básicos, lenguaje simple, ejemplos cotidianos."
  },
  secundaria: {
    id: "secundaria",
    label: "Secundaria",
    description: "12-15 años. Conceptos intermedios de la educación media."
  },
  tecnica: {
    id: "tecnica",
    label: "Carrera técnica",
    description: "Formación técnica/profesional. Enfoque práctico y aplicado."
  },
  universidad: {
    id: "universidad",
    label: "Universidad",
    description: "Nivel universitario. Conceptos avanzados, rigor académico."
  }
};

function setAIConfig({ apiKey, baseURL, model, useAI }) {
  if (apiKey !== undefined) {
    // No guardar espacios ni caracteres basura
    const clean = String(apiKey).trim();
    AI_CONFIG.apiKey = clean;
    if (clean) {
      localStorage.setItem("ai_api_key", clean);
      // Si hay key y no se forzó useAI=false, activar IA
      if (useAI === undefined) {
        AI_CONFIG.useAI = true;
        localStorage.setItem("ai_use", "true");
      }
    } else {
      localStorage.removeItem("ai_api_key");
      AI_CONFIG.useAI = false;
      localStorage.setItem("ai_use", "false");
    }
  }
  if (baseURL !== undefined) {
    AI_CONFIG.baseURL = String(baseURL).trim().replace(/\/$/, "");
    localStorage.setItem("ai_base_url", AI_CONFIG.baseURL);
  }
  if (model !== undefined) {
    AI_CONFIG.model = String(model).trim();
    localStorage.setItem("ai_model", AI_CONFIG.model);
  }
  if (useAI !== undefined) {
    AI_CONFIG.useAI = !!useAI;
    localStorage.setItem("ai_use", String(!!useAI));
  }
}

/** ¿Hay API key configurada? */
function hasAPIKey() {
  return !!(AI_CONFIG.apiKey && AI_CONFIG.apiKey.length > 10);
}

/** ¿Se usará IA en este momento? */
function shouldUseAI() {
  return hasAPIKey() && AI_CONFIG.useAI;
}

/**
 * Genera preguntas con IA adaptadas al nivel de estudio + dificultad
 */
async function generateQuestionsWithAI(topic, count, difficulty = 2, studyLevel = "secundaria") {
  if (!hasAPIKey()) {
    throw new Error("No hay API key. Configúrala con el botón 🤖 (solo una vez).");
  }

  const levelInfo = STUDY_LEVELS[studyLevel] || STUDY_LEVELS.secundaria;
  const difficultyText = {
    1: "FÁCIL: preguntas sencillas, respuesta directa, sin trucos",
    2: "MEDIO: requieren razonamiento moderado",
    3: "DIFÍCIL: razonamiento profundo, casos límite o aplicación avanzada"
  }[difficulty] || "MEDIO";

  const systemPrompt = `Eres un experto generador de exámenes educativos de alta calidad.

NIVEL DE ESTUDIO: ${levelInfo.label}
Descripción del nivel: ${levelInfo.description}

DIFICULTAD: ${difficultyText}

REGLAS OBLIGATORIAS:
1. Genera exactamente ${count} preguntas de opción múltiple sobre: "${topic}"
2. Adapta el vocabulario, profundidad y ejemplos al nivel de estudio indicado.
3. Si el nivel es "Escuela", usa lenguaje simple y ejemplos de la vida diaria.
4. Si es "Universidad", puedes usar terminología técnica y conceptos avanzados.
5. Las opciones incorrectas deben ser plausibles (distractores realistas).
6. Responde SOLO con un JSON válido, sin markdown, sin texto extra:

[
  {
    "q": "Texto de la pregunta",
    "options": ["opción A", "opción B", "opción C", "opción D"],
    "correct": 0,
    "exp": "Explicación breve y clara de la respuesta correcta"
  }
]

El campo "correct" es el índice (0-3) de la respuesta correcta.`;

  const response = await fetch(`${AI_CONFIG.baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${AI_CONFIG.apiKey}`
    },
    body: JSON.stringify({
      model: AI_CONFIG.model,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Genera ${count} preguntas sobre "${topic}" para nivel ${levelInfo.label}, dificultad ${difficultyText.split(":")[0]}.`
        }
      ],
      temperature: 0.7,
      max_tokens: 2500
    })
  });

  if (!response.ok) {
    let errMsg = `${response.status}`;
    try {
      const errBody = await response.json();
      errMsg = errBody.error?.message || errMsg;
    } catch (_) {
      errMsg = await response.text().catch(() => errMsg);
    }
    // No revelar la key en el error
    throw new Error(`Error de la API: ${errMsg}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";

  let jsonStr = content.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/```json?/gi, "").replace(/```/g, "").trim();
  }

  try {
    const questions = JSON.parse(jsonStr);
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("La IA no devolvió un array de preguntas");
    }
    return questions.map((q) => ({
      q: String(q.q || ""),
      options: Array.isArray(q.options) ? q.options.map(String) : ["A", "B", "C", "D"],
      correct: Math.min(3, Math.max(0, Number(q.correct) || 0)),
      exp: String(q.exp || "")
    }));
  } catch (e) {
    console.error("Error parseando respuesta de IA (contenido omitido por seguridad)");
    throw new Error("La IA no devolvió un JSON válido. Intenta de nuevo.");
  }
}

/**
 * Función principal: IA automática si hay key, si no → banco local
 */
async function generateExamQuestions(topic, count, difficulty = 2, studyLevel = "secundaria") {
  let localQuestions = [];
  if (typeof getQuestionsFromCourse === "function") {
    localQuestions = getQuestionsFromCourse(topic, count, difficulty, studyLevel);
  }

  // Automatizado: si hay key y useAI, usar IA
  if (!shouldUseAI()) {
    if (localQuestions.length > 0) return localQuestions;
    return createFallbackQuestions(topic, count);
  }

  try {
    console.log("🤖 Generando preguntas con IA (nivel:", studyLevel, ")");
    const aiQuestions = await generateQuestionsWithAI(topic, count, difficulty, studyLevel);
    console.log("✅ Preguntas generadas con IA");
    return aiQuestions;
  } catch (error) {
    console.warn("⚠️ Falló la IA, usando banco local:", error.message);
    if (localQuestions.length > 0) return localQuestions;
    return createFallbackQuestions(topic, count);
  }
}

function createFallbackQuestions(topic, count) {
  const qs = [];
  for (let i = 0; i < count; i++) {
    qs.push({
      q: `Pregunta de ejemplo sobre ${topic} #${i + 1}`,
      options: ["Opción A", "Opción B", "Opción C", "Opción D"],
      correct: 0,
      exp: "Pregunta de ejemplo. Configura la IA o usa un curso del banco local."
    });
  }
  return qs;
}

async function createCourseWithAI(courseName, description, numQuestions = 8, studyLevel = "secundaria") {
  if (!hasAPIKey()) {
    throw new Error("Necesitas una API key para generar cursos con IA");
  }
  const questions = await generateQuestionsWithAI(courseName, numQuestions, 2, studyLevel);
  const newCourse = {
    icon: "📚",
    description: description || `Curso sobre ${courseName}`,
    questions
  };
  if (typeof addCourse === "function") {
    addCourse(courseName, newCourse);
  }
  return newCourse;
}

/** Borrar API key de forma segura */
function clearAPIKey() {
  AI_CONFIG.apiKey = "";
  AI_CONFIG.useAI = false;
  localStorage.removeItem("ai_api_key");
  localStorage.setItem("ai_use", "false");
}

window.AI_CONFIG = AI_CONFIG;
window.STUDY_LEVELS = STUDY_LEVELS;
window.setAIConfig = setAIConfig;
window.hasAPIKey = hasAPIKey;
window.shouldUseAI = shouldUseAI;
window.generateExamQuestions = generateExamQuestions;
window.createCourseWithAI = createCourseWithAI;
window.clearAPIKey = clearAPIKey;