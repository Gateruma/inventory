<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "inventory");

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => 'Database connection failed']));
}

$data = json_decode(file_get_contents('php://input'), true);

// Add debug logging
error_log('Received login request: ' . print_r($data, true));

if (empty($data)) {
    echo json_encode(['success' => false, 'error' => 'No data received']);
    exit;
}

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'error' => 'Email and password are required']);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM user WHERE email = ?");
if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Database query preparation failed']);
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'error' => 'User not found']);
    exit;
}

$user = $result->fetch_assoc();

if ($password === $user['password']) {  // Changed from password_verify to direct comparison
    session_start();
    $_SESSION['user'] = $user;
    echo json_encode(['success' => true, 'user' => $user]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid password']);
}

$stmt->close();
$conn->close();
?>