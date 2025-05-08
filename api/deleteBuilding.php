<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: DELETE');
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "inventory");

if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

$buildingId = $_GET['id'];

$stmt = $conn->prepare("DELETE FROM building WHERE buildingid = ?");
$stmt->bind_param("i", $buildingId);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Building deleted successfully']);
} else {
    echo json_encode(['error' => 'Failed to delete building']);
}

$stmt->close();
$conn->close();
?>