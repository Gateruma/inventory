<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "inventory");

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => 'Database connection failed']));
}

try {
    $query = "SELECT statusid, statusname FROM status ORDER BY statusname";
    $result = $conn->query($query);

    if ($result) {
        $statuses = [];
        while ($row = $result->fetch_assoc()) {
            $statuses[] = [
                'id' => $row['statusid'],
                'name' => $row['statusname']
            ];
        }
        echo json_encode(['success' => true, 'data' => $statuses]);
    } else {
        throw new Exception('Failed to fetch statuses');
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
?>