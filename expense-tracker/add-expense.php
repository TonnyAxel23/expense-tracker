<?php
require 'db-config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

try {
    $stmt = $pdo->prepare("INSERT INTO expenses (amount, category, date, note) VALUES (?, ?, ?, ?)");
    $stmt->execute([
        $data['amount'],
        $data['category'],
        $data['date'],
        $data['note']
    ]);
    
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>