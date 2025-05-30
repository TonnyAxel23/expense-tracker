<?php
require 'db-config.php';

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT * FROM expenses ORDER BY date DESC");
    $expenses = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($expenses);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>