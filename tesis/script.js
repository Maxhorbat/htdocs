/**
 * script.js - Lógica principal de ExamenIA
 * Incluye temporizador configurable
 */

let currentExam = null;
let difficultyLevel = 2;

/* ========== DIFICULTAD ========== */
function setDiff(level) {
  difficultyLevel = level;
  document.querySelectorAll("#d1, #d2, #d3").forEach((el, i) => {
    if (i + 1 === level) {
      el.classList.add("bg-emerald-600", "text-white");
      el.classList.remove("bg-gray-700");
    } else {
      el.classList.remove("bg-emerald-600", "text-white");
      el.classList.add("bg-gray-700");
    }
  });
}

function updateCount(slider) {
  const el = document.getElementById("q-count");
  if (el) el.textContent = slider.value;
}

/* ========== INICIAR EXAMEN ========== */
async function startNewExam() {
  const topicInput = document.getElementById("topic-input");
  const topic = (topicInput?.value || "General").trim();
  const num = parseInt(document.getElementById("num-q")?.value || "10");
  const timePerQ = parseInt(document.getElementById("time-per-q")?.value || "60");

  const btn = document.querySelector("button[onclick='startNewExam()']");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Generando preguntas...`;
  }

  try {
    const questions = await generateExamQuestions(topic, num, difficultyLevel);

    currentExam = {
      id: Date.now(),
      topic,
      difficulty: difficultyLevel,
      questions,
      userAnswers: {},
      startTime: Date.now(),
      timePerQuestion: timePerQ,
      totalTime: timePerQ * questions.length,
      date: new Date().toLocaleDateString("es-ES", {
        weekday: "short",
        day: "numeric",
        month: "short"
      })
    };

    localStorage.setItem("currentExam", JSON.stringify(currentExam));
    window.location.href = "exam.html";
  } catch (err) {
    alert("Error al generar el examen: " + err.message);
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i class="fas fa-play"></i> COMENZAR EXAMEN`;
    }
  }
}

/* ========== HISTORIAL ========== */
function showHistory() {
  const history = JSON.parse(localStorage.getItem("examHistory") || "[]");

  let html =
    history.length === 0
      ? `<p class="text-center py-16 text-gray-400">Aún no tienes exámenes guardados.<br>¡Comienza uno ahora!</p>`
      : history
          .map(
            (exam) => `
        <div class="bg-gray-800/80 hover:bg-gray-800 p-5 rounded-2xl mb-3 flex justify-between items-center transition">
          <div>
            <div class="font-semibold">${exam.topic}</div>
            <div class="text-xs text-gray-400">${exam.date || ""}</div>
          </div>
          <div class="text-right">
            <span class="text-3xl font-bold text-emerald-400">${exam.score}</span>
            <span class="text-xs text-gray-400 block">%</span>
          </div>
        </div>`
          )
          .join("");

  const modal = document.createElement("div");
  modal.className = "fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4";
  modal.innerHTML = `
    <div class="bg-gray-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
      <div class="p-6 border-b border-gray-800 flex justify-between items-center">
        <h2 class="text-2xl font-bold flex items-center gap-2">
          <i class="fas fa-history text-emerald-500"></i> Historial
        </h2>
        <button onclick="this.closest('.fixed').remove()" class="text-3xl text-gray-400 hover:text-white leading-none">×</button>
      </div>
      <div class="p-6 max-h-[65vh] overflow-y-auto">${html}</div>
      ${
        history.length
          ? `<div class="p-4 border-t border-gray-800">
              <button onclick="clearAllHistory()" class="text-red-400 hover:text-red-500 text-sm flex items-center gap-2">
                <i class="fas fa-trash"></i> Borrar todo el historial
              </button>
            </div>`
          : ""
      }
    </div>`;
  document.body.appendChild(modal);
}

function clearAllHistory() {
  if (confirm("¿Eliminar todo el historial permanentemente?")) {
    localStorage.removeItem("examHistory");
    document.querySelector(".fixed")?.remove();
  }
}

/* ========== CONFIGURACIÓN DE IA ========== */
function openAISettings() {
  const modal = document.createElement("div");
  modal.className = "fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4";
  modal.innerHTML = `
    <div class="bg-gray-900 rounded-3xl w-full max-w-md overflow-hidden">
      <div class="p-6 border-b border-gray-800 flex justify-between items-center">
        <h2 class="text-xl font-bold flex items-center gap-2">
          <i class="fas fa-robot text-emerald-500"></i> Configurar IA
        </h2>
        <button onclick="this.closest('.fixed').remove()" class="text-3xl text-gray-400 hover:text-white">×</button>
      </div>
      <div class="p-6 space-y-5">
        <div>
          <label class="block text-sm text-gray-400 mb-1">API Key</label>
          <input id="ai-key" type="password" value="${AI_CONFIG.apiKey || ""}"
                 placeholder="sk-... o tu clave"
                 class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500">
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">Base URL</label>
          <input id="ai-url" type="text" value="${AI_CONFIG.baseURL}"
                 class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500">
          <p class="text-xs text-gray-500 mt-1">OpenAI: https://api.openai.com/v1<br>
             xAI/Grok: https://api.x.ai/v1<br>
             OpenRouter: https://openrouter.ai/api/v1</p>
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">Modelo</label>
          <input id="ai-model" type="text" value="${AI_CONFIG.model}"
                 class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500">
        </div>
        <div class="flex items-center gap-3">
          <input type="checkbox" id="ai-use" ${AI_CONFIG.useAI ? "checked" : ""} class="w-5 h-5 accent-emerald-500">
          <label for="ai-use" class="text-sm">Usar IA para generar preguntas</label>
        </div>
        <button onclick="saveAISettings()"
                class="w-full py-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-semibold transition">
          Guardar configuración
        </button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function saveAISettings() {
  setAIConfig({
    apiKey: document.getElementById("ai-key").value.trim(),
    baseURL: document.getElementById("ai-url").value.trim(),
    model: document.getElementById("ai-model").value.trim(),
    useAI: document.getElementById("ai-use").checked
  });
  document.querySelector(".fixed")?.remove();
  alert("✅ Configuración de IA guardada");
}

/* ========== AÑADIR CURSO MANUAL ========== */
function openAddCourse() {
  const modal = document.createElement("div");
  modal.className = "fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4";
  modal.innerHTML = `
    <div class="bg-gray-900 rounded-3xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
      <div class="p-6 border-b border-gray-800 flex justify-between items-center">
        <h2 class="text-xl font-bold">Añadir nuevo curso</h2>
        <button onclick="this.closest('.fixed').remove()" class="text-3xl text-gray-400 hover:text-white">×</button>
      </div>
      <div class="p-6 space-y-4 overflow-y-auto">
        <div>
          <label class="block text-sm text-gray-400 mb-1">Nombre del curso</label>
          <input id="new-course-name" placeholder="Ej: Física Cuántica"
                 class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500">
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">Descripción</label>
          <input id="new-course-desc" placeholder="Breve descripción"
                 class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500">
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">Icono (emoji)</label>
          <input id="new-course-icon" value="📚" maxlength="2"
                 class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500">
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">Preguntas (JSON)</label>
          <textarea id="new-course-qs" rows="8" placeholder='[
  {
    "q": "¿Pregunta?",
    "options": ["A", "B", "C", "D"],
    "correct": 0,
    "exp": "Explicación"
  }
]'
            class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-emerald-500"></textarea>
        </div>
        <button onclick="saveNewCourse()"
                class="w-full py-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-semibold">
          Guardar curso
        </button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function saveNewCourse() {
  const name = document.getElementById("new-course-name").value.trim();
  const desc = document.getElementById("new-course-desc").value.trim();
  const icon = document.getElementById("new-course-icon").value.trim() || "📚";
  const qsText = document.getElementById("new-course-qs").value.trim();

  if (!name) return alert("El nombre es obligatorio");

  let questions = [];
  try {
    questions = JSON.parse(qsText || "[]");
    if (!Array.isArray(questions)) throw new Error("Debe ser un array");
  } catch (e) {
    return alert("JSON de preguntas inválido: " + e.message);
  }

  addCourse(name, { icon, description: desc, questions });
  document.querySelector(".fixed")?.remove();
  alert(`✅ Curso "${name}" añadido correctamente`);
  populateCourseSelect();
}

/* ========== SELECTOR DE CURSOS ========== */
function populateCourseSelect() {
  const select = document.getElementById("topic-input");
  if (!select || select.tagName !== "SELECT") return;

  const names = typeof getCourseNames === "function" ? getCourseNames() : [];
  select.innerHTML = names
    .map((n) => {
      const icon = COURSES[n]?.icon || "📘";
      return `<option value="${n}">${icon} ${n}</option>`;
    })
    .join("");
}

/* ========== REINICIAR ========== */
function restartSame() {
  const current = JSON.parse(localStorage.getItem("currentExam") || "null");
  if (current) {
    localStorage.setItem(
      "currentExam",
      JSON.stringify({
        ...current,
        userAnswers: {},
        startTime: Date.now()
      })
    );
    window.location.href = "exam.html";
  }
}

/* ========== INIT ========== */
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("num-q")) {
    document.getElementById("num-q").addEventListener("input", (e) => updateCount(e.target));
    setDiff(2);
  }
  if (document.getElementById("topic-input")?.tagName === "SELECT") {
    populateCourseSelect();
  }
});