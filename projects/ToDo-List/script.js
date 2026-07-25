/* 
  File: script.js
  Description: Contains all the logic for the To-Do List App.
  Handles adding, deleting, toggling tasks, filtering, Local Storage, and Dark/Light mode.
*/

// Get DOM elements we need to interact with
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const themeToggle = document.getElementById('theme-toggle');

// Load tasks from Local Storage. If none exist, start with empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all'; // Default filter

/* 
  Function: saveTasks
  Purpose: Save the current tasks array to browser Local Storage
*/
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

/* 
  Function: renderTasks
  Purpose: Clear the list and re-draw all tasks based on current filter
*/
function renderTasks() {
  taskList.innerHTML = ''; // Clear existing tasks

  // Filter tasks based on what user selected: all, active, completed
  let filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true; // 'all'
  });

  // Loop through filtered tasks and create HTML for each
  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task ${task.completed ? 'completed' : ''}`; // Add 'completed' class if true
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
      <span>${task.text}</span>
      <button onclick="deleteTask(${task.id})">🗑️</button>
    `;
    taskList.appendChild(li);
  });
}

/* 
  Event: Add new task when form is submitted
*/
taskForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Stop page from reloading
  const text = taskInput.value.trim(); // Get input and remove spaces
  if (!text) return; // Don't add empty tasks
  
  // Add new task object to tasks array
  tasks.push({ id: Date.now(), text, completed: false });
  taskInput.value = ''; // Clear input field
  saveTasks(); // Save to Local Storage
  renderTasks(); // Update UI
});

/* 
  Function: toggleTask
  Purpose: Mark a task as complete or incomplete when checkbox is clicked
*/
function toggleTask(id) {
  tasks = tasks.map(task => task.id === id ? {...task, completed: !task.completed} : task);
  saveTasks();
  renderTasks();
}

/* 
  Function: deleteTask
  Purpose: Remove a task from the array when delete button is clicked
*/
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id); // Keep all tasks except the one with this id
  saveTasks();
  renderTasks();
}

/* 
  Event: Filter buttons
  Purpose: Change currentFilter and re-render tasks
*/
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active')); // Remove active from all
    btn.classList.add('active'); // Add active to clicked button
    currentFilter = btn.dataset.filter; // Get filter type from data-filter attribute
    renderTasks();
  });
});

/* 
  Event: Dark/Light Mode Toggle
  Purpose: Add/remove .dark class on body and change icon
*/
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  // Change icon based on mode
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

// Initial render when page loads
renderTasks();