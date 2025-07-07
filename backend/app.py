from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

TASK_FILE = "tasks.json"

# Utility functions
def load_tasks():
    if os.path.exists(TASK_FILE):
        with open(TASK_FILE, "r") as f:
            return json.load(f)
    return []

def save_tasks(tasks):
    with open(TASK_FILE, "w") as f:
        json.dump(tasks, f, indent=4)

# Routes
@app.route("/", methods=["GET"])
def index():
    return "✅ TaskFlow Backend is running!", 200

@app.route("/tasks", methods=["GET"])
def get_tasks():
    return jsonify(load_tasks()), 200

@app.route("/tasks", methods=["POST"])
def add_task():
    data = request.get_json()
    task_name = data.get("task")

    if not task_name:
        return jsonify({"error": "Task name is required"}), 400

    tasks = load_tasks()
    new_id = max((t.get("id", 0) for t in tasks), default=0) + 1
    new_task = {"id": new_id, "task": task_name, "done": False}
    tasks.append(new_task)
    save_tasks(tasks)

    return jsonify(new_task), 201

@app.route("/tasks/<int:task_id>", methods=["PUT"])
def toggle_task(task_id):
    tasks = load_tasks()
    for task in tasks:
        if task["id"] == task_id:
            task["done"] = not task["done"]
            save_tasks(tasks)
            return jsonify(task), 200
    return jsonify({"error": "Task not found"}), 404

@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    tasks = load_tasks()
    for i, task in enumerate(tasks):
        if task["id"] == task_id:
            removed = tasks.pop(i)
            save_tasks(tasks)
            return jsonify(removed), 200
    return jsonify({"error": "Task not found"}), 404

# Debug route viewer (optional, for development)
#@app.before_first_request
def show_routes():
    print("\n📍 Registered Routes:")
    for rule in app.url_map.iter_rules():
        print(f"{rule} --> {rule.endpoint}")

# Run
if __name__ == "__main__":
    print("🚀 Starting TaskFlow backend...")
    app.run(debug=True)
