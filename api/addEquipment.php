<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "inventory");

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => 'Database connection failed']));
}

try {
    // Handle file upload
    $image = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $uploadDir = '../uploads/';
        $fileName = uniqid() . '_' . basename($_FILES['image']['name']);
        $targetPath = $uploadDir . $fileName;
        
        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
            $image = $fileName;
        }
    }

    $query = "INSERT INTO equipment (category, description, brand, quantity, serialNumber, 
              acquisitionDate, warrantyDate, originalSource, status, remarks, locationid, 
              accountablePerson, image) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
              
    $stmt = $conn->prepare($query);
    $stmt->bind_param("sssssssssssss", 
        $_POST['category'],
        $_POST['description'],
        $_POST['brand'],
        $_POST['quantity'],
        $_POST['serialNumber'],
        $_POST['acquisitionDate'],
        $_POST['warrantyDate'],
        $_POST['originalSource'],
        $_POST['status'],
        $_POST['remarks'],
        $_POST['locationid'],
        $_POST['accountablePerson'],
        $image
    );

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        throw new Exception('Failed to add equipment');
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
?>