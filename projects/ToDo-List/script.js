/* 
File: script.js
Description: Contains all the logic for the To-Do List App.
Handles adding, deleting, toggling tasks, filtering, Local Storage, and Dark/Light mode.
*/

// 1. Get DOM elements we need to interact with
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const priorityInput = document.getElementById('priorityInput');
const searchInput = document.getElementById('searchInput');
const taskList = document.getElementById('taskList');
const statsEl = document.getElementById('stats');
const filterBtns = document.querySelectorAll('.filter-btn');
const themeToggle = document.getElementById('theme-toggle');

// 2. App state
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];   // Load from localStorage or empty array
let currentFilter = 'all'; // all, active, completed
let searchTerm = '';

// ========== THEME TOGGLE =========
function applyTheme() {
  // check localStorage for saved theme on page load
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  } else {
    themeToggle.textContent = '🌙';
  }
}

themeToggle.addEventListener('click', () => {
  // Toggle the 'dark' class on the body
  document.body.classList.toggle('dark');

  // Save preference to localStorage
  const newTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', newTheme);

  // Update icon
  themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
})

// ========== SAVE + LOAD ==========
function saveTasks() {
  // convert tasks array to string and save
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ========== RENDER ==========
function renderTasks() {
  // 1. Filter by status first
  let filtered = tasks;
  if (currentFilter === 'active') {
    filtered = tasks.filter(task => !task.completed);
  } else if (currentFilter === 'completed') {
    filtered = tasks.filter(task => task.completed);
  }
  
  // 2. Filter by search term
  if (searchTerm) {
    filtered = filtered.filter(task => 
      task.text.toLowerCase().includes(searchTerm.toLowerCase()));
  }
    
  // 3. Clear list and Render each task to DOM
  taskList.innerHTML = '';
  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;     // store ID for easy access
      
    const today = new Date().toISOString().split('T')[0];
    const isOverdue = task.dueDate && task.dueDate < today && !task.completed;
      
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} class="toggle">
      <div class="task-info">
        <span class="task-text">${task.text}</span>
        <div class="task-meta">
          <span class="priority ${task.priority}">${task.priority}</span>
          ${task.dueDate ? `<span class="due-date ${isOverdue ? 'overdue' : ''}">Due: ${task.dueDate}</span>` : ''}
        </div>
      </div>
      <button class="delete-btn">🗑️</button>`;
    taskList.appendChild(li);
  });
    
  updateStats();
}
  
// ========== STATS ==========
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const left = total - completed;
  statsEl.textContent = `${total} total • ${completed} done • ${left} left`;
}
  
// ========== ADD TASK ==========
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();        // Stop page refresh
  const newTask = {
    id: Date.now(),          // Unique ID
    text: taskInput.value.trim(),
    completed: false,
    priority: priorityInput.value,
    dueDate: dateInput.value // YYYY-MM-DD format
  };
  if (newTask.text === '') return;    // Don't add empty tasks
    
  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskForm.reset();     // Clear form
});
  
// ========== LISTENERS: DELETE, TOGGLE ==========
taskList.addEventListener('click', (e) => {
  const li = e.target.closest('.task-item');
  if (!li) return;
  const id = Number(li.dataset.id);
    
  // Delete task
  if (e.target.classList.contains('delete-btn')) {
    tasks = tasks.filter(task => task.id !== id);
  }
    
  // Toggle Complete
  if (e.target.classList.contains('toggle')) {
    tasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task);
  }
  saveTasks();
  renderTasks();
});
    
// ============ EDIT ON DOUBLE CLICK ==============
taskList.addEventListener('dblclick', (e) => {
  if (!e.target.classList.contains('task-text')) return;
  const li = e.target.closest('.task-item');
  const id = Number(li.dataset.id);
  const task = tasks.find(t => t.id === id);
  
  // Replace span with input
  const input = document.createElement('input');
  input.type = 'text';
  input.value = task.text;
  input.className = 'edit-input';
      
  e.target.replaceWith(input);
  input.focus();
  
  // Save on blur or Enter
  input.addEventListener('blur', () => finishEdit(input, id));
  input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') finishEdit(input, id);
  });
});
    
function finishEdit(input, id) {
  const newText = input.value.trim();
  if (newText) {
    tasks = tasks.map(task => task.id === id ? { ...task, text: newText } : task);
    saveTasks();
  }
  renderTasks();    //Re-render to switch back to span
}
      
// ========== FILTERS + SEARCH ==========
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});
      
searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value;
  renderTasks();
});
      
// ======== Initial load =========
applyTheme();    // Load theme first
renderTasks();   // Then load tasks