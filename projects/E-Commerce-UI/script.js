/*******************************************************
 * E-commerce Product UI - JS V1
 * Author: William Adejoh
 * Description:
 *   Renders product cards from a data array and handles
 *   basic cart functionality, and cattegory filtering. 
 *   Uses DOM manipulation.
 *******************************************************/

// Product data array. In a real app this would come from an API
const products = [
    {id:1, name:"Wireless Headphones", price:99.99, img:"assets/product1.jpg", desc:"Noise cancelling", category:"audio"},
    {id:2, name:"Mechanical Keyboard", price:149.99, img:"assets/product2.jpg", desc:"RGB Backlit", category:"computer"},
    {id:3, name:"4K Webcam", price:79.99, img:"assets/product3.jpg", desc:"For streaming", category:"computer"},
    {id:4, name:"Smart Watch", price:199.99, img:"assets/product4.jpg", desc:"Health tracking", category:"audio"},
    {id:5, name:"Portable Speaker", price:59.99, img:"assets/product5.jpg", desc:"20hr battery", category:"audio"},
    {id:6, name:"Gaming Mouse", price:49.99, img:"assets/product6.jpg", desc:"16000 DPI", category:"computer"},
];

// Store cart item IDs and current filter 
let cart = [];
let currentFilter = 'all';

// Grab DOM elements
const productGrid = document.getElementById('productGrid');
const cartCount = document.getElementById('cartCount');

/* renderProducts: Filters products by category then Loops through products array and injects 
 *  HTML cards into the DOM using template literals 
 * @param {string} filter - 'all', 'audio', or 'computer' */
function renderProducts(filter = 'all'){
    currentFilter = filter;
    const filteredProducts = filter === 'all' ? products : products.filter(p => p.category === filter);

    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="card">
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.desc}</p>
            <div class="price">$${product.price}</div>
            <button class="btn-add" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join('');

    updateActiveButton(filter);  // Highlight active filter
}

// Adds 'active' class to clicked filter
function updateActiveButton(filter){
    document.querySelectorAll('.sidebar button').forEach(btn => {
        btn.classList.remove('active');
        if(btn.getAttribute('onclick').includes(`'${filter}'`)){
            btn.classList.add('active');
        }
    });
}

// filterProducts: Called from sidebar buttons to update the grid
function filterProducts(category){
    renderProducts(category);
}

/*
 * addToCart: Adds product ID to cart array and updates UI
 * @param {number} id - The product ID to add
 */
function addToCart(id){
    cart.push(id);
    cartCount.textContent = cart.length; // Update cart counter
    alert(`${products.find(p => p.id === id).name} added to cart!`);
}

// Initial render on page load
renderProducts('all');  // Starts with 'All' active