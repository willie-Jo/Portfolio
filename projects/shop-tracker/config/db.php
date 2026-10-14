<?php
/**
 * Project: ShopTracker - Simple Inventory Management System
 * File: config/db.php
 * Version: 1.0.0
 * Description: Database connection handler using MySQL,
 *              Creates $conn object for all DB operation
 * Author: William Adejoh
 */

$host = "localhost";       // XAMPP host
$user = "root";            // default XAMPP user
$pass = "";                // default XAMPP has no password
$dbname = "shop_tracker";  // database name

// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);   // will be used in all other files

// Check connection 
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>