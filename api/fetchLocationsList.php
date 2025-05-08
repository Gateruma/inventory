<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "inventory");

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => 'Database connection failed']));
}

try {
    $query = "SELECT id, name FROM locations ORDER BY name ASC";
    $result = $conn->query($query);

    if ($result) {
        $locations = [];
        while ($row = $result->fetch_assoc()) {
            $locations[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $locations]);
    } else {
        throw new Exception('Failed to fetch locations');
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
?>