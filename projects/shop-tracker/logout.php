<?php 
// logout.php - Ends session

session_start();
session_destroy();
header("Location: login.php");
?>