/**
 * script.js — Control del panel y carga de preguntas
 */

let currentExam = null;
let difficultyLevel = 2;
let studyLevel = "secundaria";

function escapeHTML(str) {
  return String(str || "").replace(/[&<>"']/g, (m) => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return map[m];
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  if (window.location.pathname.endsWith("app.html")) {
    const user = await getCurrentUser();
    if (!user) {
      window.location.href = "index.html";
      return;
    }
  }

  const slider = document.getElementById("num-q");
  if (slider) {
    slider.addEventListener("input", (e) => {
      document.getElementById("q-count").textContent = e.target.value;
    });
  }

  setDiff(2);
  setStudyLevel("secundaria");
});

function setDiff(level) {
  difficultyLevel = level;
  document.querySelectorAll("#d1, #d2, #d3").forEach((el, i) => {
    if (i + 1 === level) {
      el.className = "diff-btn py-3 rounded-xl bg-cyan-600 text-white font-medium shadow-[0_0_15px_rgba(34,211,238,0.4)]";
    } else {
      el.className = "diff-btn py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-medium hover:border-cyan-500/50";
    }
  });
}

function setStudyLevel(level) {
  studyLevel = level;
  document.querySelectorAll("[data-study]").forEach((el) => {
    if (el.dataset.study === level) {
      el.className = "py-3 px-3 rounded-xl bg-cyan-600 border border-cyan-400 text-white text-sm font-medium transition text-left shadow-[0_0_15px_rgba(34,211,238,0.4)]";
    } else {
      el.className = "py-3 px-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-medium text-slate-200 transition text-left hover:border-cyan-400";
    }
  });
  populateCourseSelect();
}

function populateCourseSelect() {
  const select = document.getElementById("topic-input");
  if (!select) return;

  const names = getCourseNames(studyLevel);
  if (names.length === 0) {
    select.innerHTML = `<option value="">No hay cursos disponibles</option>`;
    return;
  }

  select.innerHTML = names.map((n) => {
    const course = getCourse(studyLevel, n);
    const icon = course?.icon || "📘";
    return `<option value="${escapeHTML(n)}">${icon}${escapeHTML(n)}</option>`;
  }).join("");
}

function startNewExam() {
  const topicSelect = document.getElementById("topic-input");
  const topic = topicSelect?.value;
  const num = parseInt(document.getElementById("num-q")?.value || "20", 10);
  const timePerQ = parseInt(document.getElementById("time-per-q")?.value || "60", 10);

  if (!topic) {
    alert("Por favor selecciona un curso.");
    return;
  }

  try {
    const questions = generateExamQuestions(topic, num, difficultyLevel, studyLevel);

    currentExam = {
      id: Date.now(),
      topic,
      difficulty: difficultyLevel,
      studyLevel,
      questions,
      userAnswers: {},
      startTime: Date.now(),
      timePerQuestion: timePerQ,
      totalTime: timePerQ * questions.length,
      date: new Date().toLocaleDateString("es-ES")
    };

    localStorage.setItem("currentExam", JSON.stringify(currentExam));
    window.location.href = "exam.html";
  } catch (err) {
    alert("Error: " + err.message);
  }
}

async function showHistory() {
  const history = await getUserHistory();
  const levelLabels = { escuela: "Escuela", secundaria: "Secundaria", tecnica: "Técnica", universidad: "Universidad" };

  let html = history.length === 0
    ? `<p class="text-center py-16 text-slate-400">Aún no tienes historial registrado.</p>`
    : history.map((exam) => `
        <div class="bg-slate-800/80 p-5 rounded-2xl mb-3 flex justify-between items-center border border-slate-700/50">
          <div>
            <div class="font-semibold text-slate-100">${escapeHTML(exam.topic)}</div>
            <div class="text-xs text-slate-400">
              ${new Date(exam.created_at).toLocaleDateString()} ·${levelLabels[exam.study_level] || ""} · 
              ${exam.difficulty == 1 ? "Fácil" : exam.difficulty == 3 ? "Difícil" : "Medio"}
            </div>
          </div>
          <div class="text-right">
            <span class="text-3xl font-bold text-cyan-400">${Number(exam.score) || 0}</span>
            <span class="text-xs text-slate-400 block">%</span>
          </div>
        </div>`).join("");

  const modal = document.createElement("div");
  modal.className = "fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4";
  modal.innerHTML = `
    <div class="bg-slate-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-800">
      <div class="p-6 border-b border-slate-800 flex justify-between items-center">
        <h2 class="text-xl font-bold flex items-center gap-2">
          <i class="fas fa-history text-cyan-400"></i> Historial Personal (MySQL)
        </h2>
        <button onclick="this.closest('.fixed').remove()" class="text-2xl text-slate-400 hover:text-white">×</button>
      </div>
      <div class="p-6 max-h-[65vh] overflow-y-auto">${html}</div>
    </div>`;
  document.body.appendChild(modal);
}