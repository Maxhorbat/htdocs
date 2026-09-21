/**
 * ai.js — Módulo de integración con la API de IA
 */

const AI_CONFIG = {
  apiKey: localStorage.getItem("ai_key") || "",
  baseURL: localStorage.getItem("ai_url") || "https://api.openai.com/v1",
  model: localStorage.getItem("ai_model") || "gpt-3.5-turbo",
  useAI: localStorage.getItem("ai_use") === "true"
};

function hasAPIKey() {
  return Boolean(AI_CONFIG.apiKey && AI_CONFIG.apiKey.trim().length > 0);
}

function setAIConfig(config) {
  if (config.apiKey !== undefined) {
    AI_CONFIG.apiKey = config.apiKey;
    localStorage.setItem("ai_key", config.apiKey);
  }
  if (config.baseURL !== undefined) {
    AI_CONFIG.baseURL = config.baseURL;
    localStorage.setItem("ai_url", config.baseURL);
  }
  if (config.model !== undefined) {
    AI_CONFIG.model = config.model;
    localStorage.setItem("ai_model", config.model);
  }
  if (config.useAI !== undefined) {
    AI_CONFIG.useAI = config.useAI;
    localStorage.setItem("ai_use", config.useAI);
  }
}

async function fetchAIQuestions(topic, count, difficulty, studyLevel) {
  if (!hasAPIKey()) {
    throw new Error("No hay API Key configurada.");
  }

  const endpoint = `${AI_CONFIG.baseURL.replace(/\/+$/, "")}/chat/completions`;
  
  const diffMap = { 1: "fácil", 2: "intermedio", 3: "difícil" };
  const diffLabel = diffMap[difficulty] || "intermedio";

  const systemPrompt = `Eres un generador estricto de exámenes en formato JSON. 
Debes responder ÚNICAMENTE con un array JSON válido sin bloques de código Markdown (\`\`\`json) ni texto explicativo.`;

  const userPrompt = `Genera exactamente ${count} preguntas de opción múltiple ÚNICAS (sin repetir ninguna) sobre el tema "${topic}".
Nivel de estudios: ${studyLevel}.
Dificultad: ${diffLabel}.

Estructura obligatoria por pregunta (JSON Array):
[
  {
    "q": "Texto de la pregunta",
    "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
    "correct": 0,
    "exp": "Explicación breve de la respuesta correcta"
  }
]
REGLA CRÍTICA: Debes entregar exactamente ${count} objetos en el array. Respuestas concisas para no truncar el JSON.`;

  // Aumentamos max_tokens para permitir respuestas largas de 20+ preguntas
  const calculatedMaxTokens = Math.max(2000, count * 180);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${AI_CONFIG.apiKey}`
    },
    body: JSON.stringify({
      model: AI_CONFIG.model || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: calculatedMaxTokens
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Error HTTP ${response.status}`);
  }

  const data = await response.json();
  let content = data.choices?.[0]?.message?.content || "";

  // Limpiar posibles etiquetas de código markdown devueltas por la IA
  content = content.replace(/```json/g, "").replace(/```/g, "").trim();

  let parsedQuestions = [];
  try {
    parsedQuestions = JSON.parse(content);
  } catch (e) {
    throw new Error("La IA truncó la respuesta o devolvió un JSON inválido. Intenta de nuevo.");
  }

  if (!Array.isArray(parsedQuestions)) {
    throw new Error("Formato de respuesta inválido de la IA.");
  }

  return parsedQuestions;
}