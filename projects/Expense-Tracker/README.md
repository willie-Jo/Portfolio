# Expense Tracker

A simple personal finance tracker built with Vanilla HTML, CSS, and JavaScript. 
All data is saved in your browser using `localStorage`.

### Features
- Add Expenses: Description, Amount, and Category
- Live Total: Automatically calculates total spent
- Delete Items: Remove any expense with 1 click
- Persistent Data: Uses localStorage. Your data stays after refresh
- Category Tags: Organize spending: Food, Transport, Bills, etc
- Fully Responsive: Works on Desktop, Tablet, and Mobile
- Clean UI: Card-based design with accent colors

### Tech Stack
- HTML5 - Semantic form structure
- CSS3 - Flexbox, Responsive Design, Mobile-first
- Vanilla JavaScript - DOM Manipulation, Array Methods, localStorage CRUD

### How to Use
1. Clone the repo
2. Open `index.html` in your browser
3. Fill the form and click "Add Expense"
4. Your expenses are automatically saved to the browser


### Key Concepts Learned
- `localStorage.setItem()` and `JSON.parse()` for data persistence
- `Array.reduce()` to calculate totals
- `Array.filter()` for deleting items
- Event delegation and form handling
- Dynamic DOM rendering

### Future Upgrade
This can be connected to an E-commerce Product UI. Instead of manual input, 
"Add to Cart" can push directly to this tracker as the "Cart Summary".