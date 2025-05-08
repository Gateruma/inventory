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

if (isset($data['buildingname']) && isset($data['buildingdescription']) && isset($data['buildingcapacity'])) {
    $stmt = $conn->prepare("INSERT INTO building (buildingname, buildingdescription, buildingcapacity) VALUES (?, ?, ?)");
    $stmt->bind_param("ssi", $data['buildingname'], $data['buildingdescription'], $data['buildingcapacity']);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Building added successfully']);
    } else {
        echo json_encode(['error' => 'Failed to add building']);
    }
    $stmt->close();
} else {
    echo json_encode(['error' => 'Missing required fields']);
}

$conn->close();
?>