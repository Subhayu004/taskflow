let tasks = [];
const API_URL = "/tasks";

const addTaskForm = document.getElementById('addTaskForm');
const taskInput = document.getElementById('taskInput');
const tasksContainer = document.getElementById('tasksContainer');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');

async function loadTasks() {
    const res = await fetch(API_URL);
    tasks = await res.json();
    renderTasks();
    updateStats();
}

addTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (!taskText) {
        alert("Please enter a task!");
        return;
    }

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: taskText })
    });

    taskInput.value = "";
    await loadTasks();
});

async function toggleTask(taskId) {
    await fetch(`${API_URL}/${taskId}`, { method: "PUT" });
    await loadTasks();
}

async function deleteTask(taskId) {
    await fetch(`${API_URL}/${taskId}`, { method: "DELETE" });
    await loadTasks();
}

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

window.onload = loadTasks;
