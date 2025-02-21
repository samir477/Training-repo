import { html, render } from 'lit-html';
import { todo_dapp_backend } from 'declarations/todo_dapp_backend';

class App {
  tasks = [];
  completedCount = 0;
  pendingCount = 0;

  constructor() {
    window.onload = () => {
      this.#fetchTasks(); // Load tasks on startup
    };
  }

  async #fetchTasks() {
    try {
      this.tasks = await todo_dapp_backend.get_tasks();
      this.completedCount = await todo_dapp_backend.count_completed_tasks();
      this.pendingCount = await todo_dapp_backend.count_pending_tasks();
      this.#render();
    } catch (error) {
      console.error("❌ Failed to fetch tasks:", error);
    }
  }

  async #handleSubmit(e) {
    e.preventDefault();
    const taskInput = document.getElementById('taskInput');
    const addButton = document.getElementById('addTaskButton');
    const description = taskInput.value.trim();

    if (!description) {
      console.warn("⚠️ Task description is empty!");
      return;
    }

    addButton.disabled = true; // Prevent duplicate submissions
    try {
      console.log("📌 Adding task:", description);
      await todo_dapp_backend.add_task(description);
      taskInput.value = ''; // Clear input after adding
      await this.#fetchTasks();
    } catch (error) {
      console.error("❌ Error adding task:", error);
    } finally {
      addButton.disabled = false;
    }
  }

  async #markCompleted(id) {
    try {
      console.log("✅ Marking completed:", id);
      await todo_dapp_backend.mark_task_completed(id);
      await this.#fetchTasks();
    } catch (error) {
      console.error("❌ Error marking task as completed:", error);
    }
  }

  async #markImportant(id) {
    try {
      console.log("⭐ Marking important:", id);
      await todo_dapp_backend.mark_task_important(id);
      await this.#fetchTasks();
    } catch (error) {
      console.error("❌ Error marking task as important:", error);
    }
  }

  async #removeTask(id) {
    try {
      console.log("🗑️ Removing task:", id);
      await todo_dapp_backend.remove_task(id);
      await this.#fetchTasks();
    } catch (error) {
      console.error("❌ Error removing task:", error);
    }
  }

  #render() {
    const root = document.getElementById('root');
    if (!root) {
      console.error("❌ Root element not found! Make sure the HTML contains <div id='root'></div>");
      return;
    }

    let taskList = html`
      <ul>
        ${this.tasks.map(({ id, description, completed, important }) => html`
          <li class="${completed ? 'completed' : ''} ${important ? 'important' : ''}">
            <span class="task-text">${description}</span>
            <div class="task-buttons">
              <button 
                class="complete-btn" 
                @click=${() => this.#markCompleted(id)}
                title="Mark as completed"
              >
                <i class="fas fa-check"></i>
                <span>Complete</span>
              </button>
              <button 
                class="important-btn" 
                @click=${() => this.#markImportant(id)}
                title="Mark as important"
              >
                <i class="fas fa-star"></i>
                <span>Important</span>
              </button>
              <button 
                class="delete-btn" 
                @click=${() => this.#removeTask(id)}
                title="Delete task"
              >
                <i class="fas fa-trash"></i>
                <span>Delete</span>
              </button>
            </div>
          </li>
        `)}
      </ul>
    `;

    let body = html`
      <main class="todo-container">
        <div class="todo-header">
          <h1><i class="fas fa-check-circle"></i> Todo DApp</h1>
          <div class="task-stats">
            <div class="stat-item">
              <i class="fas fa-check-circle"></i>
              <span>Completed: ${this.completedCount}</span>
            </div>
            <div class="stat-item">
              <i class="fas fa-hourglass-half"></i>
              <span>Pending: ${this.pendingCount}</span>
            </div>
          </div>
        </div>

        <form id="taskForm" class="task-form">
          <div class="input-group">
            <i class="fas fa-tasks input-icon"></i>
            <input 
              id="taskInput" 
              type="text" 
              placeholder="Enter a task..." 
              required 
            />
          </div>
          <button id="addTaskButton" type="submit" class="add-button">
            <i class="fas fa-plus"></i>
            Add Task
          </button>
        </form>

        <section id="taskList" class="task-list">
          ${taskList}
        </section>
      </main>
    `;

    render(body, root);

    // Ensure form event listener is attached after rendering
    const form = document.getElementById('taskForm');
    if (form) {
      form.onsubmit = this.#handleSubmit.bind(this);
    }
  }
}

export default App;