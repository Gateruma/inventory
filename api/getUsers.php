<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "inventory");

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => 'Database connection failed']));
}

// Check if a specific user ID is requested
$userId = isset($_GET['userId']) ? intval($_GET['userId']) : null;

if ($userId) {
    $query = "SELECT * FROM user WHERE userID = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $query = "SELECT * FROM user";
    $result = $conn->query($query);
}

if ($result) {
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $users]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to fetch users']);
}

$conn->close();
?>