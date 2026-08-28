/**
 * ai.js
 * Módulo de conexión con IA para generar preguntas de examen.
 *
 * Soporta:
 * 1. Modo LOCAL (sin API) → usa el banco de courses.js
 * 2. Modo OPENAI / GROK / cualquier API compatible con OpenAI
 *
 * Cómo usar con IA real:
 * 1. Obtén una API key (OpenAI, xAI/Grok, OpenRouter, etc.)
 * 2. En la interfaz: botón 🤖 → pega tu key y activa "Usar IA"
 */

const AI_CONFIG = {
  apiKey: localStorage.getItem("ai_api_key") || "",
  baseURL: localStorage.getItem("ai_base_url") || "https://api.openai.com/v1",
  model: localStorage.getItem("ai_model") || "gpt-4o-mini",
  useAI: localStorage.getItem("ai_use") === "true"
};

function setAIConfig({ apiKey, baseURL, model, useAI }) {
  if (apiKey !== undefined) {
    AI_CONFIG.apiKey = apiKey;
    localStorage.setItem("ai_api_key", apiKey);
  }
  if (baseURL !== undefined) {
    AI_CONFIG.baseURL = baseURL;
    localStorage.setItem("ai_base_url", baseURL);
  }
  if (model !== undefined) {
    AI_CONFIG.model = model;
    localStorage.setItem("ai_model", model);
  }
  if (useAI !== undefined) {
    AI_CONFIG.useAI = useAI;
    localStorage.setItem("ai_use", String(useAI));
  }
}

async function generateQuestionsWithAI(topic, count, difficulty = 2) {
  if (!AI_CONFIG.apiKey) {
    throw new Error("No hay API key configurada. Usa el botón 🤖 para configurarla.");
  }

  const difficultyText = {
    1: "fácil (nivel básico, secundaria)",
    2: "medio (nivel intermedio)",
    3: "difícil (nivel avanzado o universitario)"
  }[difficulty] || "medio";

  const systemPrompt = `Eres un experto generador de exámenes. 
Genera exactamente ${count} preguntas de opción múltiple sobre el tema: "${topic}".
Dificultad: ${difficultyText}.

Responde SOLO con un JSON válido en este formato exacto (sin markdown, sin explicaciones):
[
  {
    "q": "Texto de la pregunta",
    "options": ["opción A", "opción B", "opción C", "opción D"],
    "correct": 0,
    "exp": "Breve explicación de por qué es correcta"
  }
]
El índice "correct" debe ser 0, 1, 2 o 3 según la posición de la respuesta correcta.
Las opciones deben ser realistas y las incorrectas deben ser plausibles.`;

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
        { role: "user", content: `Genera ${count} preguntas sobre: ${topic}` }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Error de la API: ${response.status} - ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";

  let jsonStr = content.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/```json?/g, "").replace(/```/g, "").trim();
  }

  try {
    const questions = JSON.parse(jsonStr);
    if (!Array.isArray(questions)) throw new Error("No es un array");
    return questions.map(q => ({
      q: q.q,
      options: q.options,
      correct: Number(q.correct),
      exp: q.exp || ""
    }));
  } catch (e) {
    console.error("Error parseando respuesta de IA:", content);
    throw new Error("La IA no devolvió un JSON válido. Intenta de nuevo.");
  }
}

async function generateExamQuestions(topic, count, difficulty = 2) {
  let localQuestions = [];
  if (typeof getQuestionsFromCourse === "function") {
    localQuestions = getQuestionsFromCourse(topic, count, difficulty);
  }

  if (!AI_CONFIG.useAI || !AI_CONFIG.apiKey) {
    if (localQuestions.length > 0) return localQuestions;
    return createFallbackQuestions(topic, count);
  }

  try {
    console.log("🤖 Generando preguntas con IA...");
    const aiQuestions = await generateQuestionsWithAI(topic, count, difficulty);
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
      exp: "Esta es una pregunta de ejemplo. Configura la IA o añade un curso real."
    });
  }
  return qs;
}

async function createCourseWithAI(courseName, description, numQuestions = 8) {
  if (!AI_CONFIG.apiKey) {
    throw new Error("Necesitas una API key para generar cursos con IA");
  }
  const questions = await generateQuestionsWithAI(courseName, numQuestions, 2);
  const newCourse = {
    icon: "📚",
    description: description || `Curso generado sobre ${courseName}`,
    questions
  };
  if (typeof addCourse === "function") {
    addCourse(courseName, newCourse);
  }
  return newCourse;
}

window.AI_CONFIG = AI_CONFIG;
window.setAIConfig = setAIConfig;
window.generateExamQuestions = generateExamQuestions;
window.createCourseWithAI = createCourseWithAI;