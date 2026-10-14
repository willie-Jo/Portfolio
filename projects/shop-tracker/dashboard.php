<?php
/**
 * Project: ShopTracker - Simple Inventory Management System
 * File: dashboard.php
 * Version: 1.0.0
 * Description: Main admin dashboard, Handles - Check login, 
 *              Add product(INSERT), Sell product(UPDATE quantity - 1), 
 *              View products(COUNT, SUM queries),
 *              Delete product (DELETE).
 * Access: Only authenticated users (session check)
 * Author: William Adejoh
 */

session_start();
include 'config/db.php';

// SECURITY: If not logged in, redirect to login.php
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

// Add Product form
if (isset($_POST['add_product'])) {
    $name = trim($_POST['name']);
    $price = floatval($_POST['price']);
    $qty = intval($_POST['quantity']);

    // Prepared statement to prevent SQL injection
    $stmt = $conn->prepare("INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)");
    $stmt->bind_param("sdi", $name, $price, $qty);   // s=string, d=double, i=integer
    $stmt->execute();
    header("Location: dashboard.php");
    exit;
}

// Sell (reduce quantity by 1)
if (isset($_GET['sell'])) {
    $id = intval($_GET['sell']);
    // Reduce quantity but never below 0
    $conn->query("UPDATE products SET quantity = quantity - 1 WHERE id=". $id ." AND quantity > 0");
    header("Location: dashboard.php");   // Refresh page
    exit;
}

// Delete
if (isset($_GET['delete'])) {
    $id = intval($_GET['delete']);
    $conn->query("DELETE FROM products WHERE id=$id");
    header("Location: dashboard.php");
    exit;
}

// Stats
$total_products = $conn->query("SELECT COUNT(*) as c FROM products")->fetch_assoc()['c'] ?? 0;
$total_qty = $conn->query("SELECT SUM(quantity) as s FROM products")->fetch_assoc()['s'] ?? 0;
$low_stock = $conn->query("SELECT COUNT(*) as c FROM products WHERE quantity < 5")->fetch_assoc()['c'] ?? 0;

// Search + Fetch all products to display
$search = $_GET['search'] ?? '';
if ($search != '') {
    $like = "%".$conn->real_escape_string($search)."%";
    $products = $conn->query("SELECT * FROM products WHERE name LIKE '$like' ORDER BY id DESC");
} else {
    $products = $conn->query("SELECT * FROM products ORDER BY id DESC");
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Shop Tracker</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="header">
        <h2>ShopTracker</h2>
        <div>Hi, <?php echo $_SESSION['username']; ?> | <a href="logout.php">Logout</a></div>
    </div>
    <div class="stats">
        <div class="stat">
            <h3><?php echo $total_products; ?></h3>
            <p>Total Products</p>
        </div>
        <div class="stat">
            <h3><?php echo $total_qty ?: 0; ?></h3>
            <p>Total Stock</p>
        </div>
        <div class="stat">
            <h3><?php echo $low_stock; ?></h3>
            <p>Low Stock (<5)</p>
        </div>
    </div>
    <div class="container">
        <div class="card">
            <h3>Add New Product</h3><br>
            <form method="POST">
                <input type="text" name="name" placeholder="Product Name e.g. Peak Milk" required>
                <input type="number" name="price" type="number" step="0.01" placeholder="Price e.g. 1200" required>
                <input type="number" name="quantity" type="number" placeholder="Quantity e.g 20" required>
                <button type="submit" name="add_product">+ Add Product</button>
            </form>
        </div>
        <div class="card">
            <h3>Products List/Inventory</h3>
            <form method="GET" class="search-row">
                <input type="text" name="search" placeholder="Search product..." value="<?php echo htmlspecialchars($search); ?>">
                <button type="submit">Search</button>
                <?php if($search){echo '<a class="btn" href="dashboard.php">Clear</a>';}?>
            </form>
            <table>
                <tr><th>S/N</th><th>Prod ID</th><th>Name</th><th>Price</th><th>Qty</th><th>Action</th></tr>
                <?php $sn=1; while($row = $products->fetch_assoc()): ?>
                <tr>
                    <td><?php echo $sn++; ?></td>
                    <td style="color:#6b7280; font-size:13px;"><?php echo $row['id']; ?></td>
                    <td><?php echo htmlspecialchars($row['name']); ?></td>
                    <td>₦<?php echo number_format($row['price']); ?></td>
                    <td><?php echo $row['quantity']; ?></td>
                    <td><?php echo $row['quantity'] < 5 ? '<span class="low">Low</span>' : '<span class="ok">Ok</span>'; ?></td>
                    <td>
                        <a class="btn sell" href="?sell=<?php echo $row['id']; ?>">Sell</a>
                        <a class="btn del" href="?delete=<?php echo $row['id']; ?>" onclick="return confirm('Delete?')">Delete</a>
                    </td>
                </tr>
                <?php endwhile; ?>
            </table>
        </div>
    </div>
</body>
</html>