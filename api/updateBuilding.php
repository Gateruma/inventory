<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "inventory");

if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);

$stmt = $conn->prepare("UPDATE building SET buildingname = ?, buildingdescription = ?, buildingcapacity = ? WHERE buildingid = ?");
$stmt->bind_param("ssii", $data['buildingname'], $data['buildingdescription'], $data['buildingcapacity'], $data['buildingid']);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Building updated successfully']);
} else {
    echo json_encode(['error' => 'Failed to update building: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>