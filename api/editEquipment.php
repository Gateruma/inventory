<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "inventory");

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => 'Database connection failed']));
}

$id = $_GET['id'];
$category = $_POST['category'];
$description = $_POST['description'];
$brand = $_POST['brand'];
$quantity = $_POST['quantity'];
$serialNumber = $_POST['serialNumber'];
$acquisitionDate = $_POST['acquisitionDate'];
$warrantyDate = $_POST['warrantyDate'];
$originalSource = $_POST['originalSource'];
$status = $_POST['status'];
$remarks = $_POST['remarks'];
$locationid = $_POST['locationid'];
$accountablePerson = $_POST['accountablePerson'];
$image = $_FILES['image']['name'];

// Handle image upload if a new image is provided
if ($image) {
    $targetDir = "../uploads/";
    $targetFile = $targetDir . basename($image);
    move_uploaded_file($_FILES['image']['tmp_name'], $targetFile);
}

$query = "UPDATE equipment SET category=?, description=?, brand=?, quantity=?, serialNumber=?, acquisitionDate=?, warrantyDate=?, originalSource=?, status=?, remarks=?, locationid=?, accountablePerson=?, image=? WHERE id=?";
$stmt = $conn->prepare($query);
$stmt->bind_param("sssssssssssssi", $category, $description, $brand, $quantity, $serialNumber, $acquisitionDate, $warrantyDate, $originalSource, $status, $remarks, $locationid, $accountablePerson, $image, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to update equipment']);
}

$stmt->close();
$conn->close();
?>