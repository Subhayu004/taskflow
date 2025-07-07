let tasks = [];
const API_URL = "http://127.0.0.1:5000/tasks";

const addTaskForm = document.getElementById('addTaskForm');
const taskInput = document.getElementById('taskInput');
const tasksContainer = document.getElementById('tasksContainer');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');

// Fetch tasks from backend
async function loadTasks() {
    const res = await fetch(API_URL);
    tasks = await res.json();
    renderTasks();
    updateStats();
}

// Add task
addTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (!taskText) {
        showNotification("Please enter a task!", "error");
        return;
    }

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: taskText })
    });

    taskInput.value = "";
    await loadTasks();
    showNotification("Task added!", "success");
});

// Toggle task
async function toggleTask(taskId) {
    await fetch(`${API_URL}/${taskId}`, { method: "PUT" });
    await loadTasks();
}

// Delete task
async function deleteTask(taskId) {
    await fetch(`${API_URL}/${taskId}`, { method: "DELETE" });
    await loadTasks();
    showNotification("Task deleted", "success");
}

// Render tasks
function renderTasks() {
    if (tasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <h3>No tasks yet</h3>
                <p>Add your first task above to get started!</p>
            </div>
        `;
        return;
    }

    tasksContainer.innerHTML = tasks.map(task => `
        <div class="task-item ${task.done ? 'completed' : ''}">
            <div class="task-checkbox ${task.done ? 'checked' : ''}" onclick="toggleTask(${task.id})"></div>
            <div class="task-text ${task.done ? 'completed' : ''}">${task.task}</div>
            <div class="task-actions">
                <button class="action-btn delete-btn" onclick="deleteTask(${task.id})">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.done).length;
    const pending = total - completed;

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
}

function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

window.onload = loadTasks;
