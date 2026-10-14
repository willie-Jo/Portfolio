<?php
/**
 * Project: ShopTracker - Simple Inventory Management System
 * File: login.php
 * Version: 1.0.0
 * Description: Creates session on success, prevents access without login.
 * Dependencies: config/db.php, css - /style.css
 * Author: William Adejoh
 */

session_start();           // start session to keep user logged in
include "config/db.php";   // Include database connection

$error = "";      // stores error message

// if user submits login form (POST request)
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = trim($_POST['username']);    // Gets username from form
    $password = trim($_POST['password']);    // Gets password from form
    
    // prepare SQL to prevent SQL injection
    $stmt = $conn->prepare("SELECT * FROM users WHERE username= ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result =  $stmt->get_result();
    
    // if user exists
    if ($row = $result->fetch_assoc()) {
        // verify hashed password
        if (password_verify($password, $row['password'])) {
            $_SESSION['user_id'] = $row['id'];    // save user id in session
            $_SESSION['role'] = $row['role'];     // save role (admin/staff)
            $_SESSION['username'] = $row['username'];
            header("Location: dashboard.php");    // redirect to dashboard
            exit;
        } else {
            $error = "Wrong Password";
        }
    } else {
        $error = "user not found: " /*. htmlspecialchars($username)*/;     // shows if login fails
    }   
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="style.css">
<body class="login-body">
    <h2>ShopTracker</h2>
    <div class="login-box">
        <small>Login</small>
        <p class="sub">Use admin / admin123</p>
        
        <?php if($error) echo "<div class='error'>$error</div>"; ?>
        <form method="POST">
            <input type="text" name="username" placeholder="username" required><br>
            <input type="password" name="password" placeholder="password" required><br>
            <button type="submit">Login</button>
        </form>
    </div>
    <!--<p>First time? Run this SQL to create admin (pass: admin123):</p>-->
</body>
</html>