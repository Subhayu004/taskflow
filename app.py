from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import json
import os

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

TASK_FILE = "tasks.json"

def load_tasks():
    if os.path.exists(TASK_FILE):
        with open(TASK_FILE, "r") as f:
            return json.load(f)
    return []

def save_tasks(tasks):
    with open(TASK_FILE, "w") as f:
        json.dump(tasks, f, indent=4)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/tasks", methods=["GET"])
def get_tasks():
    return jsonify(load_tasks())

@app.route("/tasks", methods=["POST"])
def add_task():
    data = request.get_json()
    task_name = data.get("task")
    if not task_name:
        return jsonify({"error": "Task name is required"}), 400

    tasks = load_tasks()
    new_id = max([t.get("id", 0) for t in tasks], default=0) + 1
    new
