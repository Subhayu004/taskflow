let tasks = [];
let currentFilter = 'all';
let userName = localStorage.getItem('taskflowUsername') || '';
let taskHistory = [];

const API_BASE = "https://taskflow-mf12.onrender.com";

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
    loadTheme();
    updateClock();
    setInterval(updateClock, 1000);

    if (!userName) {
        document.getElementById('nameModal').style.display = 'flex';
    } else {
        document.getElementById('nameModal').style.display = 'none';
        updateWelcomeMessage();
        loadTasks();
    }
});

function setUserName() {
    const name = document.getElementById('nameInput').value.trim();
    if (name) {
        userName = name;
        localStorage.setItem('taskflowUsername', userName);
        document.getElementById('nameModal').style.display = 'none';
        updateWelcomeMessage();
        addToHistory(`Welcome ${name}! 🎉`);
        loadTasks();
    } else {
        alert('Please enter your name');
    }
}

function updateWelcomeMessage() {
    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : hour < 21 ? "Good Evening" : "Good Night";
    document.getElementById('welcomeMessage').textContent = `${greeting}, ${userName}! 👋`;
}

function updateClock() {
    const timeString = new Date().toLocaleTimeString();
    document.getElementById('clock').textContent = timeString;
}

function toggleTheme() {
    const current = document.body.getAttribute("data-theme");
    const newTheme = current === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    document.querySelector('.theme-toggle').textContent = newTheme === 'dark' ? '☀️ Light Mode' : '🌓 Dark Mode';
}

function loadTheme() {
    const saved = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", saved);
    document.querySelector('.theme-toggle').textContent = saved === 'dark' ? '☀️ Light Mode' : '🌓 Dark Mode';
}

// ---------------------------
// Task CRUD via Flask API
// ---------------------------
async function loadTasks() {
    try {
        const res = await fetch(`${API_BASE}/tasks`);
        tasks = await res.json();
        renderTasks();
        updateStats();
    } catch (err) {
        console.error("Failed to load tasks:", err);
    }
}

async function addTask(taskText, taskType) {
    try {
        const res = await fetch(`${API_BASE}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                task: taskText,
                type: taskType,
                createdAt: new Date().toLocaleString()
            })
        });
        const newTask = await res.json();
        tasks.push(newTask);
        addToHistory(`Added "${taskText}" (${taskType})`);
        renderTasks();
        updateStats();
    } catch (err) {
        console.error("Failed to add task:", err);
    }
}

async function toggleTask(taskId) {
    try {
        const res = await fetch(`${API_BASE}/tasks/${taskId}`, { method: "PUT" });
        const updatedTask = await res.json();
        const index = tasks.findIndex(t => t.id === taskId);
        if (index > -1) {
            tasks[index] = updatedTask;
            addToHistory(`${updatedTask.done ? "Completed" : "Reopened"} "${updatedTask.task}"`);
            renderTasks();
            updateStats();
        }
    } catch (err) {
        console.error("Failed to toggle task:", err);
    }
}

async function deleteTask(taskId) {
    try {
        const res = await fetch(`${API_BASE}/tasks/${taskId}`, { method: "DELETE" });
        if (res.ok) {
            const deletedTask = tasks.find(t => t.id === taskId);
            tasks = tasks.filter(t => t.id !== taskId);
            addToHistory(`Deleted "${deletedTask.task}"`);
            renderTasks();
            updateStats();
        }
    } catch (err) {
        console.error("Failed to delete task:", err);
    }
}

// ---------------------------
// Task UI Functions
// ---------------------------
function filterTasks(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderTasks();
}

function getFilteredTasks() {
    switch (currentFilter) {
        case 'daily': return tasks.filter(t => t.type === 'daily');
        case 'monthly': return tasks.filter(t => t.type === 'monthly');
        case 'yearly': return tasks.filter(t => t.type === 'yearly');
        case 'completed': return tasks.filter(t => t.done);
        case 'pending': return tasks.filter(t => !t.done);
        default: return tasks;
    }
}

function renderTasks() {
    const container = document.getElementById('tasksContainer');
    const filtered = getFilteredTasks();
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <h3>No tasks found</h3>
                <p>Add your first task above to get started!</p>
            </div>`;
        return;
    }
    container.innerHTML = filtered.map(task => `
        <div class="task-item ${task.done ? 'completed' : ''}">
            <div class="task-checkbox ${task.done ? 'checked' : ''}" onclick="toggleTask(${task.id})"></div>
            <div class="task-text ${task.done ? 'completed' : ''}">${task.task}</div>
            <div class="task-type-badge task-type-${task.type}">${task.type}</div>
            <div class="task-actions">
                <button class="action-btn delete-btn" onclick="deleteTask(${task.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.done).length;
    const pending = total - completed;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
}

// ---------------------------
// History
// ---------------------------
function addToHistory(action) {
    const item = { action, timestamp: new Date().toLocaleString() };
    taskHistory.unshift(item);
    if (taskHistory.length > 10) taskHistory = taskHistory.slice(0, 10);
    renderHistory();
}

function renderHistory() {
    const container = document.getElementById('taskHistory');
    if (taskHistory.length === 0) {
        container.innerHTML = `
            <div class="history-item">
                <span class="history-action">Welcome!</span>
                Start adding tasks to see your activity here.
            </div>`;
        return;
    }
    container.innerHTML = taskHistory.map(h => `
        <div class="history-item">
            <span class="history-action">${h.action}</span>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">
                ${h.timestamp}
            </div>
        </div>
    `).join('');
}

// ---------------------------
// Form Event Listeners
// ---------------------------
document.getElementById('addTaskForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const taskInput = document.getElementById('taskInput');
    const taskType = document.getElementById('taskType');
    const taskText = taskInput.value.trim();

    if (!taskText) return alert("Please enter a task!");
    addTask(taskText, taskType.value);
    taskInput.value = "";
});

document.getElementById('nameInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') setUserName();
});
