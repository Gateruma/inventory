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

if (empty($data)) {
    echo json_encode(['success' => false, 'error' => 'No data received']);
    exit;
}

$requiredFields = ['email', 'password', 'firstName', 'lastName']; // Removed 'role' from required fields
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        echo json_encode(['success' => false, 'error' => 'All fields are required']);
        exit;
    }
}

$email = $data['email'];
$password = $data['password'];
$firstName = $data['firstName'];
$lastName = $data['lastName'];
$role = "User"; // Default role
$title = $data['title'] ?? '';
$middleName = $data['middleName'] ?? '';
$suffix = $data['suffix'] ?? '';
$academicTitle = $data['academicTitle'] ?? '';
$phone = $data['phone'] ?? '';
$createdAt = date('Y-m-d H:i:s');
$updatedAt = date('Y-m-d H:i:s');

// Check if user already exists
$stmt = $conn->prepare("SELECT email FROM user WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'error' => 'User already exists']);
    exit;
}

// Insert new user
$stmt = $conn->prepare("INSERT INTO user (userID, title, firstName, middleName, lastName, suffix, academicTitle, email, password, phone, createdAt, updatedAt, role) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Database query preparation failed: ' . $conn->error]);
    exit;
}

$stmt->bind_param("ssssssssssss", $title, $firstName, $middleName, $lastName, $suffix, $academicTitle, $email, $password, $phone, $createdAt, $updatedAt, $role);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Registration failed']);
}

$stmt->close();
$conn->close();
?>