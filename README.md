# ✅ TaskFlow — A Modern To-Do List Web App

**TaskFlow** is a sleek, responsive, and minimalistic to-do list web app that helps users manage tasks across daily, monthly, and yearly timelines. It’s powered by a lightweight **Flask backend** and an interactive **Vanilla JavaScript frontend** with elegant UI/UX.

🌐 **Live Demo:** [taskflow-mf12.onrender.com](https://taskflow-mf12.onrender.com)

---

## 🚀 Features

- ✅ Add, complete, and delete tasks
- 🔄 Real-time task updates via **Fetch API**
- 💾 Persistent storage using `tasks.json` (no database needed)
- 🎨 Fluid UI animations and interactive feedback
- 🌗 Dark / Light mode toggle
- 📆 Task filters: Daily, Monthly, Yearly, Completed, Pending
- 📱 Fully responsive on all screen sizes
- 🔐 Local user session (name, theme, history) saved in `localStorage`
- 🌐 Cross-Origin support with **Flask-CORS**

---

## 🛠️ Tech Stack

### 🔹 Frontend
- HTML5 + CSS3 (with animations and responsive grid)
- Vanilla JavaScript (DOM, Fetch API, LocalStorage)

### 🔹 Backend
- Python 3 + Flask (Micro web framework)
- Flask-CORS (Handles cross-origin requests)
- JSON-based storage (`tasks.json`)

### 🔹 Version Control
- Git
- GitHub

---

## 📸 Preview

![TaskFlow Preview](assests/screenshot.png)  
> *Image of the site*

---

## 🔧 Getting Started (Run Locally)

Follow the steps below to run TaskFlow on your local machine.

### 1. 📥 Clone the Repository

```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
