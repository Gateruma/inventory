<?php
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "inventory");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit();
}

$id = $_GET['id'];

$query = "DELETE FROM equipment WHERE id=?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to delete equipment']);
}

$stmt->close();
$conn->close();
?>