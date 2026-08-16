<?php
/**
* File: register.php
* Description: Handles new user registration
*              Creates a random salt, saves username + salt to DB,
*              and returns user_id + salt to the frontend.
* Author: William Adejoh
* Project: VaultJS Password Manager
* Version: 1.0
* Requires: PHP 7.4+, MySQL, PDO
*/

/*ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);*/


header('content-Type: application/json');

// 1. Get data sent from js
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';    // ?? prevents error if missing
/*$password_hash = $data['password_hash']; */  //  we won't store this yet, just for login later

if (empty($username)) {
    echo json_encode(["status" => "error", "message" => "Username required"]);
    exit;
}

// 2. Connect to DB
try{
    $pdo = new PDO("mysql:host=localhost;dbname=vaultjs", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => "DB Connection failed"]);
    exit;
}

// 3. Generate a random 16-byte salt
// random_bytes() [Built-in PHP Function]
$salt_bytes = random_bytes(16);           // Generate 16 random bytes
$salt_b64 = base64_encode($salt_bytes);   // Convert bytes to text so we can store in MySQL

// 4. Save user + salt to DB
try {
    $stmt = $pdo->prepare("INSERT INTO users (username, salt) VALUES (?, ?)");  // prepare SQL statement with "?" placeholders
    $stmt->execute([$username, $salt_b64]);
    
    $user_id = $pdo->lastInsertId();    // Get the new user's ID
    
    echo json_encode([
        "status" => "success",
        "user_id" => $user_id,
        "salt" => $salt_b64         //  Send the salt back to JS to derive the key
    ]);
} catch(PDOException $e) {
    // This will trigger if username already exists because of UNIQUE
    echo json_encode(["status" => "error", "message" => "Username already taken"]);
}
?>