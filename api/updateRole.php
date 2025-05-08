<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "inventory");

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => 'Database connection failed']));
}

$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($data['email']) || !isset($data['newRole'])) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

$email = $conn->real_escape_string($data['email']);
$newRole = $conn->real_escape_string($data['newRole']);

// Update the role based on unique email
$stmt = $conn->prepare("UPDATE user SET role = ? WHERE email = ?");
$stmt->bind_param("ss", $newRole, $email);

if ($stmt->execute()) {
    $nameQuery = $conn->prepare("SELECT firstName, lastName FROM user WHERE email = ?");
    $nameQuery->bind_param("s", $email);
    $nameQuery->execute();
    $nameResult = $nameQuery->get_result();
    $userData = $nameResult->fetch_assoc();
    
    $userName = $userData ? $userData['firstName'] . ' ' . $userData['lastName'] : $email;
    
    echo json_encode([
        'success' => true, 
        'message' => "$userName's role has been updated to $newRole"
    ]);
    
    $nameQuery->close();
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to update role: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>