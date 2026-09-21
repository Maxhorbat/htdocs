<?php
require_once 'db.php';

session_start();
$data = json_decode(file_get_contents("php://input"), true);
$action = $_GET['action'] ?? '';

// --- REGISTRAR USUARIO ---
if ($action === 'register') {
    $email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
    $password = $data['password'] ?? '';

    if (!$email) {
        echo json_encode(["error" => "Ingresa un correo electrónico válido."]);
        exit;
    }

    if (strlen($password) < 6) {
        echo json_encode(["error" => "La contraseña debe tener al menos 6 caracteres."]);
        exit;
    }

    // Verificar si el correo ya existe
    $checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $checkStmt->bind_param("s", $email);
    $checkStmt->execute();
    if ($checkStmt->get_result()->num_rows > 0) {
        echo json_encode(["error" => "El correo ya está registrado en la base de datos."]);
        exit;
    }

    // Insertar el nuevo usuario en MySQL
    $hashed = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $conn->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $email, $hashed);

    if ($stmt->execute()) {
        $userId = $stmt->insert_id;
        $_SESSION['user_id'] = $userId;
        $_SESSION['email'] = $email;
        echo json_encode([
            "success" => true, 
            "message" => "Usuario creado exitosamente.", 
            "user" => ["id" => $userId, "email" => $email]
        ]);
    } else {
        echo json_encode(["error" => "Error al guardar el usuario en la base de datos."]);
    }
    exit;
}

// --- INICIAR SESIÓN ---
if ($action === 'login') {
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    $stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        if (password_verify($password, $row['password'])) {
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['email'] = $email;
            echo json_encode(["success" => true, "user" => ["id" => $row['id'], "email" => $email]]);
            exit;
        }
    }
    echo json_encode(["error" => "Credenciales incorrectas o el usuario no existe."]);
    exit;
}

// --- CERRAR SESIÓN ---
if ($action === 'logout') {
    session_destroy();
    echo json_encode(["success" => true]);
    exit;
}

// --- CONSULTAR SESIÓN ACTIVA ---
if ($action === 'get_user') {
    if (isset($_SESSION['user_id'])) {
        echo json_encode(["user" => ["id" => $_SESSION['user_id'], "email" => $_SESSION['email']]]);
    } else {
        echo json_encode(["user" => null]);
    }
    exit;
}

// --- GUARDAR RESULTADO DE EXAMEN ---
if ($action === 'save_exam') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["error" => "Sesión no válida."]);
        exit;
    }

    $userId = $_SESSION['user_id'];
    $topic = $data['topic'] ?? '';
    $studyLevel = $data['studyLevel'] ?? '';
    $difficulty = (int)($data['difficulty'] ?? 1);
    $score = (int)($data['score'] ?? 0);
    $totalQuestions = (int)($data['totalQuestions'] ?? 20);
    $timeSpent = (int)($data['timeSpent'] ?? 0);

    $stmt = $conn->prepare("INSERT INTO exam_results (user_id, topic, study_level, difficulty, score, total_questions, time_spent) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issiiii", $userId, $topic, $studyLevel, $difficulty, $score, $totalQuestions, $timeSpent);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Error guardando resultado."]);
    }
    exit;
}

// --- OBTENER HISTORIAL DE USUARIO ---
if ($action === 'get_history') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode([]);
        exit;
    }

    $userId = $_SESSION['user_id'];
    $stmt = $conn->prepare("SELECT * FROM exam_results WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    $history = [];
    while ($row = $result->fetch_assoc()) {
        $history[] = $row;
    }

    echo json_encode($history);
    exit;
}

// --- GENERAR PREGUNTAS CON IA ---
if ($action === 'generate_ia_questions') {
    $topic = $data['topic'] ?? 'General';
    $level = $data['studyLevel'] ?? 'Secundaria';
    $difficulty = $data['difficulty'] ?? 2;
    $count = (int)($data['count'] ?? 20);

    $diffText = ($difficulty == 1) ? "Fácil" : (($difficulty == 3) ? "Difícil" : "Intermedio");

    // Prompt estricto para retornar únicamente JSON
    $prompt = "Genera exactamente {$count} preguntas de opción múltiple sobre '{$topic}' para nivel '{$level}' con dificultad '{$diffText}'. "
            . "Responde ÚNICAMENTE con un JSON válido estructurado así: "
            . "[{\"q\": \"pregunta\", \"options\": [\"op1\", \"op2\", \"op3\", \"op4\"], \"correct\": 0, \"exp\": \"explicación breve\"}]. "
            . "Donde 'correct' es el índice de la respuesta correcta (0-3).";

    $apiKey = "TU_OPENAI_API_KEY_AQUI"; // Reemplaza con tu Key

    $ch = curl_init("https://api.openai.com/v1/chat/completions");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",
        "Authorization: Bearer " . $apiKey
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        "model" => "gpt-3.5-turbo",
        "messages" => [["role" => "user", "content" => $prompt]],
        "temperature" => 0.7
    ]));

    $response = curl_exec($ch);
    curl_close($ch);

    $json = json_decode($response, true);
    $content = $json['choices'][0]['message']['content'] ?? '[]';

    header("Content-Type: application/json");
    echo $content; // Devuelve las preguntas generadas por la IA
    exit;
}

?>