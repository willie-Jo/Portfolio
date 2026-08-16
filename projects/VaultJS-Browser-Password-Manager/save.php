<?php
/**
* File: save.php
* Description: Receives encrypted vault data from frontend and saves/updates it in the database.
*              Uses UPSERT to either insert new vault or update existing one for the user.
*              and returns user_id + salt to the frontend.
* Author: William Adejoh
* Project: VaultJS Password Manager
* Version: 1.0
*/

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

// 1. Get data from frontend
$data = json_decode(file_get_contents('php://input'), true);
$user_id = $data['user_id'];
$iv = $data['iv'];            // Base64 IV from frontend
$vault_data = $data['data'];  // Base64 ciphertext from frontend

// 2. Connect to DB
try {
    $pdo = new PDO("mysql:host=localhost;dbname=vaultjs", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "DB connection failed"]);
    exit;
}

// 3. Update the vault for user
try {
    // ON DUPLICATE KEY(MySQL Syntax) - if user_id exists, update it, Else insert new row.
    $stmt = $pdo->prepare("INSERT INTO vaults (user_id, iv, data) VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE iv = VALUES(iv), data = VALUES(data)");
    $stmt->execute([$user_id, $iv, $vault_data]);
    echo json_encode(["status" => "success"]);
    
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Failed to save vault"]);
}
?>