<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "inventory");

if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

$sql = "SELECT * FROM equipment"; // Changed table name to 'equipment'
$result = $conn->query($sql);

$equipment = []; // Changed variable name to 'equipment'
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $equipment[] = $row; // Changed variable name to 'equipment'
    }
}

echo json_encode(['success' => true, 'data' => $equipment]); // Changed variable name to 'equipment'

$conn->close();
?>