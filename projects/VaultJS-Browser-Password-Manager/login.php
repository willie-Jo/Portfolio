<?php
/**
 * File: login.php
 * Description: Looks up user by username and return user_id + salt.
 *              No password check on server. Crypto happens in browser.
 */

header('Content-Type: application/json');

// 1. Get username from JS 
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';

if(empty($username)) {
    echo json_encode(["status" => "error", "message" => "Username required"]);
    exit;
}

// 2. Connect to DB
try {
    $pdo = new PDO("mysql:host=localhost;dbname=vaultjs", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "DB Connection failed"]);
    exit;
}

// 3. Find user and return salt
try {
    $stmt = $pdo->prepare("SELECT id, salt FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode([
            "status" => "success",
            "user_id" => $user['id'],
            "salt" => $user['salt']
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "User not found"]);
    }
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Failed to login"]);
}
?>