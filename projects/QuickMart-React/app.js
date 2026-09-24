/**
 * File: app.js
 * Project: QuickMart React - E-Commerce UI (Offline-First Build)
 * Built With: React (Custom Offline Engine) - JSX, No Babel, No CDN
 * Description: Main React logic, Defines product data,reusable components,
 * state management with useState, category filtering with Array.filter(),
 * list rendering with Array.map(), and cart handling with spread operator.
 * Author: William Adejoh 
 */

// product data as array of objects 
// Each object hold id, name, price, description, category
const products = [
    {id:1, name:"Wireless Headphones", price:99.99, img:"assets/product1.jpg", desc:"Noise cancelling", category:"audio"},
    {id:2, name:"Mechanical Keyboard", price:149.99, img:"assets/product2.jpg", desc:"RGB Backlit", category:"computer"},
    {id:3, name:"4K Webcam", price:79.99, img:"assets/product3.jpg", desc:"For streaming", category:"computer"},
    {id:4, name:"Smart Watch", price:199.99, img:"assets/product4.jpg", desc:"Health tracking", category:"audio"},
    {id:5, name:"Portable Speaker", price:59.99, img:"assets/product5.jpg", desc:"20hr battery", category:"audio"},
    {id:6, name:"Gaming Mouse", price:49.99, img:"assets/product6.jpg", desc:"16000 DPI", category:"computer"},
];

// ProductCard Component - Component function that returns UI 
// destructuring {name, desc, price, onAdd} - built-in JS syntax to extract props (built-in React concept for passing data)
function ProductCard ({name, desc, price, onAdd}) {
    // React.createElement - built-in React method to create DOM element
    return React.createElement(
        "div",
        {className: "qm-card"},
        React.createElement("div", {className: "qm-badge"}, "NEW"),  // create badge element
        React.createElement("h3", null, name),    // product name - null means no props
        React.createElement("p", {className: "qm-desc"}, desc),   // render description
        React.createElement("div", {className: "qm-price"}, `$${price}`),    // render price 
        // onClick - built-in event prop calls onAdd when clicked
        React.createElement("button", {className: "btn-add", onClick: onAdd}, "Add to Cart")
    );
}

// App Component with state - Root component that manages state and UI logic
// We call HTML inside JS = JSX
function App() {
    // useState - built-in React hook for state memory
    const {useState} = React;
    // cart state - useState returns array [value, setter] - Array destructuring
    const [cart, setCart] = useState([]);  // initial value - empty array
    // filter state - holds current category filter
    const [filter, setFilter] = useState('all');   // 'all' is initial string

    // filtered products - returns new array based on condition
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

    // build UI tree with createElement
    return React.createElement(
        "div",
        {className: "qm-app"},
        // header build - cart count using cart.lenght
        React.createElement("header", {className: "qm-header"}, 
          React.createElement("h1", null, "QuickMart. (Offline Mode)"),
          React.createElement("div", {className: "qm-cart"}, `Cart : ${cart.length}`)
        ),
        // hero section build
        React.createElement("section", {className: "qm-hero"},
          React.createElement("h2", null, "Curated Tools for Focus."),
          React.createElement("p", null, "Built with React offline-first, state-driven UI.")
        ),
        // build filter chips - buttons that call setFilter to update state
        React.createElement("div", {className: "qm-filters"},  
          React.createElement("button", {onClick: () => setFilter('all'), className: filter==='all'?'qm-chip active':'qm-chip'}, "All Gear"),  
          React.createElement("button", {onClick: () => setFilter('audio'), className: filter==='audio'?'qm-chip active':'qm-chip'}, "Audio"),  
          React.createElement("button", {onClick: () => setFilter('computer'), className: filter==='computer'?'qm-chip active':'qm-chip'}, "Setup")
        ),
        // product grid build - map() transform array of React elements
        // ... spread operator unpacks array so elements become children of grid
        // key - built-in React prop for list identity tracking
        React.createElement("main", {className: "qm-grid"},
          ...filtered.map(p => 
            React.createElement(ProductCard, {
                key: p.id,  // set key to unique id - key is built-in React identifier
                name: p.name,  // pass name prop to child
                desc: p.desc,
                price: p.price,
                onAdd: () => setCart([...cart, p.id])  // use spread to clone cart and add new id - immutable
            })
          )
        )
    );
}

// get root div in index.html
const rootElement = document.getElementById('root');
// Create React Root using ReactDOM.createRoot - built-in ReactDOM(binds React to DOM container)
const root = ReactDOM.createRoot(rootElement);
// Render App - React.createElement(App) calls App function and returns UI tree
root.render(React.createElement(App)); 
