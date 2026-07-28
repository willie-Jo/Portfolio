/*
File: script.js
Description: Full CRUD for expenses. Saves to localStorage so data persists on refresh.
*/

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('expenseForm');
    const descInput = document.getElementById('descInput');
    const amountInput = document.getElementById('amountInput');
    const categoryInput = document.getElementById('categoryInput');
    const expenseList = document.getElementById('expenseList');
    const totalAmount = document.getElementById('totalAmount');
    
    let expenses = []; // This will hold all our expense objects
    
    // ========== 1. LOAD FROM LOCALSTORAGE ==========
    function loadExpenses() {
        // Get data from localStorage. If nothing, use empty array
        const saved = localStorage.getItem('expenses');
        expenses = saved ? JSON.parse(saved) : [];
        renderExpenses(); // Display them
    }
    
    // ========== 2. SAVE TO LOCALSTORAGE ==========
    function saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }
    
    // ========== 3. ADD NEW EXPENSE ==========
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop page from refreshing
        
        const newExpense = {
            id: Date.now(), // Unique ID using timestamp
            description: descInput.value.trim(),
            amount: parseFloat(amountInput.value), // Convert string to number
            category: categoryInput.value
        };
        
        expenses.push(newExpense); // Add to array
        saveExpenses();
        renderExpenses(); // Re-render UI
        form.reset(); // Clear form
    });
    
    // ========== 4. DELETE EXPENSE ==========
    function deleteExpense(id) {
        // Filter out the expense with the matching id
        expenses = expenses.filter(expense => expense.id !== id);
        saveExpenses();
        renderExpenses();
    }
    
    // ========== 5. RENDER EXPENSES TO UI ==========
    function renderExpenses() {
        expenseList.innerHTML = ''; // Clear list first
        
        if(expenses.length === 0) {
            expenseList.innerHTML = '<p style="text-align:center; color:#94a3b8;">No expenses yet. Add one above!</p>';
        }
        
        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.classList.add('expense-item');
            
            // Using template literals to inject data
            li.innerHTML = `
            <div class="expense-info">
            <span class="desc">${expense.description}</span>
            <span class="category">${expense.category}</span>
            </div>
            <div class="expense-amount">
            <span class="amount">-₦${expense.amount.toFixed(2)}</span>
            <button class="delete-btn" onclick="deleteExpense(${expense.id})">X</button>
            </div>
            `;
            expenseList.appendChild(li);
        });
        
        updateTotal(); // Update total every render
    }
    
    // ========== 6. UPDATE TOTAL ==========
    function updateTotal() {
        // Use .reduce to sum all amounts
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = `₦${total.toFixed(2)}`; // Format to 2 decimals
    }
    
    // Make deleteExpense global so onclick can access it
    window.deleteExpense = deleteExpense;
    
    // ========== 7. INITIALIZE ==========
    loadExpenses();
});