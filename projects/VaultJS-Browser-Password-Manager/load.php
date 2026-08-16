<?php
/**
* File: load.php
* Description: Fetches the encrypted vault data for a given user_id from database.
*              Returns the IV and ciphertext so the frontend can decrypt it.
*              and returns user_id + salt to the frontend.
* Author: William Adejoh
* Project: VaultJS Password Manager
* Version: 1.0
*/

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('content-Type: application/json');   // Tell the browser/JS the response will be JSON

// 1. Read JSON data sent from frontend fetch()
$raw_input = file_get_contents('php://input');    // "php://input" Built-in stream, gets raw POST body
$data = json_decode($raw_input, true);       // converts JSON string to PHP array. true = associative array
$user_id = $data['user_id'];          // get the user_id sent

// 2. Connect to MySQL Database using PDO for security
try {
    $pdo = new PDO("mysql:host=localhost;dbname=vaultjs", "root", "");  //  creates DB connection
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);      // PDO to throw exceptions on error 
} catch(PDOException $e) {                            // PDOException(Built-in class) catches DB errors 
    echo json_encode(["status" => "error", "message"=> "DB Connection failed"]);  // converts to JSON string
    exit;    // stop script execution if DB fails
}

// 3. Query the database for user's vault
try {
    // prepare() method uses "?" placeholder to prevent SQL injection
    $stmt = $pdo->prepare("SELECT iv, data FROM vaults WHERE user_id = ?");
    $stmt->execute([$user_id]);     //runs the query with user_id
    $vault = $stmt->fetch(PDO::FETCH_ASSOC);    // fetch(Built-in PDO method) gets 1 row as associative array
    
    if ($vault) {
        // Vault found: send IV and encrypted data back
        echo json_encode([
            "status" => "success",
            "iv" => $vault['iv'],           // Base64 encoded IV from DB
            "data" => $vault['data']        // Base64 encoded ciphertext from DB
        ]);
    } else {
        // No vault yet: new user
        echo json_encode([
            "status" => "success",
            "iv" => null,
            "data" => null
        ]);
    }
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Failed to load vault"]);
}
?>