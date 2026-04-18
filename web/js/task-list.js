const style = document.createElement('style');
style.textContent = `
.task-list {
    max-width: 48rem;
    margin: 2rem auto;
}
.task-list h2 {
    margin-bottom: 1rem;
    color: var(--color-text);
}
.task-item {
    background: white;
    border-radius: var(--radius);
    padding: 1rem;
    margin-bottom: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.task-item.pending {
    border-left: 4px solid #f59e0b;
}
.task-item.in-progress {
    border-left: 4px solid #3b82f6;
}
.task-item.completed {
    border-left: 4px solid #10b981;
    opacity: 0.7;
}
.task-item .task-title {
    font-weight: 500;
}
.task-item .task-status {
    font-size: 0.75rem;
    text-transform: uppercase;
    color: var(--color-text-light);
}
.task-item .task-actions {
    display: flex;
    gap: 0.5rem;
}
.task-item button {
    padding: 0.25rem 0.75rem;
    border: none;
    border-radius: var(--radius);
    cursor: pointer;
    font-size: 0.875rem;
}
.task-item .btn-start {
    background: #3b82f6;
    color: white;
}
.task-item .btn-complete {
    background: #10b981;
    color: white;
}
.task-item button:hover {
    opacity: 0.9;
}
.task-item.completed .task-actions {
    display: none;
}
`;
document.head.appendChild(style);

class TaskList extends HTMLElement {
    constructor() {
        super();
        this.tasks = [];
    }

    connectedCallback() {
        this.render();
        this.loadTasks();
    }

    async loadTasks() {
        try {
            const cleanerId = this.getAttribute('cleaner-id');
            const response = await fetch(`/api/tasks?cleaner_id=${cleanerId}`);
            this.tasks = await response.json();
            this.render();
        } catch (err) {
            console.error('Failed to load tasks:', err);
        }
    }

    async handleAction(taskId, action) {
        try {
            if (action === 'start') {
                await fetch(`/api/tasks/${taskId}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'in-progress' }),
                });
            } else if (action === 'complete') {
                await fetch(`/api/tasks/${taskId}/complete`, {
                    method: 'POST',
                });
            }
            this.tasks = this.tasks.map(t => {
                if (t.id === taskId) {
                    t.status = action === 'complete' ? 'completed' : 'in-progress';
                }
                return t;
            });
            this.render();
        } catch (err) {
            console.error('Failed to update task:', err);
        }
    }

    render() {
        this.innerHTML = `
            <div class="task-list">
                <h2>My Tasks</h2>
                ${this.tasks.map(task => `
                    <div class="task-item ${task.status}">
                        <div>
                            <div class="task-title">${task.title}</div>
                            <div class="task-status">${task.status}</div>
                        </div>
                        <div class="task-actions">
                            ${task.status === 'pending' ? `<button class="btn-start" onclick="this.getRootNode().host.handleAction('${task.id}', 'start')">Start</button>` : ''}
                            ${task.status === 'in-progress' ? `<button class="btn-complete" onclick="this.getRootNode().host.handleAction('${task.id}', 'complete')">Complete</button>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

customElements.define('task-list', TaskList);
