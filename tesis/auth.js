/**
 * auth.js — Conexión AJAX con XAMPP (PHP / MySQL)
 */

async function signUpUser(email, password) {
  const res = await fetch("api.php?action=register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

async function signInUser(email, password) {
  const res = await fetch("api.php?action=login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

async function signOutUser() {
  await fetch("api.php?action=logout");
  window.location.href = "index.html";
}

async function getCurrentUser() {
  const res = await fetch("api.php?action=get_user");
  const data = await res.json();
  return data.user;
}

async function saveExamToDB(examData) {
  const res = await fetch("api.php?action=save_exam", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic: examData.topic,
      studyLevel: examData.studyLevel,
      difficulty: examData.difficulty,
      score: examData.score,
      totalQuestions: examData.questions.length,
      timeSpent: examData.timeSpent || 0
    })
  });
  return await res.json();
}

async function getUserHistory() {
  const res = await fetch("api.php?action=get_history");
  return await res.json();
}