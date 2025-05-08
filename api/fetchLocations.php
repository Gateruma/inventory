<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "inventory");

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => 'Database connection failed']));
}

try {
    $query = "SELECT l.locationid, l.roomname, l.roomcapacity, l.buildingid, b.buildingname 
              FROM location l 
              LEFT JOIN building b ON l.buildingid = b.buildingid 
              ORDER BY b.buildingname, l.roomname";
              
    $result = $conn->query($query);

    if ($result) {
        $locations = [];
        while ($row = $result->fetch_assoc()) {
            $locations[] = [
                'id' => $row['locationid'],
                'name' => $row['roomname'] . ' - ' . $row['buildingname'],
                'roomname' => $row['roomname'],
                'roomcapacity' => $row['roomcapacity'],
                'buildingid' => $row['buildingid'],
                'buildingname' => $row['buildingname']
            ];
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