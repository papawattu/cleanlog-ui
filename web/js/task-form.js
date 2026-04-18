const style = document.createElement('style');
style.textContent = `
.task-form {
    max-width: 32rem;
    margin: 2rem auto;
    padding: 1.5rem;
    background: white;
    border-radius: var(--radius);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.task-form h2 {
    margin-bottom: 1rem;
    color: var(--color-text);
}
.task-form .form-group {
    margin-bottom: 1rem;
}
.task-form label {
    display: block;
    margin-bottom: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
}
.task-form input,
.task-form textarea,
.task-form select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: var(--radius);
    font-size: 1rem;
}
.task-form textarea {
    min-height: 6rem;
    resize: vertical;
}
.task-form button {
    width: 100%;
    padding: 0.5rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius);
    font-size: 1rem;
    cursor: pointer;
}
.task-form button:hover {
    background: var(--color-primary-dark);
}
.task-form .error {
    color: #dc2626;
    margin-top: 0.5rem;
    font-size: 0.875rem;
}
.task-form .success {
    color: #10b981;
    margin-top: 0.5rem;
    font-size: 0.875rem;
}
`;
document.head.appendChild(style);

class TaskForm extends HTMLElement {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    connectedCallback() {
        this.innerHTML = `
            <form class="task-form" @submit="handleSubmit">
                <h2>Create Task</h2>
                <div class="form-group">
                    <label for="title">Title</label>
                    <input type="text" id="title" name="title" required>
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" name="description"></textarea>
                </div>
                <div class="form-group">
                    <label for="type">Task Type</label>
                    <select id="type" name="type" required>
                        <option value="general">General Cleaning</option>
                        <option value="bathroom">Bathroom Cleaning</option>
                        <option value="kitchen">Kitchen Cleaning</option>
                        <option value="floor">Floor Care</option>
                        <option value="window">Window Cleaning</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="scheduledAt">Schedule Date</label>
                    <input type="date" id="scheduledAt" name="scheduledAt" required>
                </div>
                <button type="submit">Create Task</button>
                <div class="error"></div>
                <div class="success"></div>
            </form>
        `;
    }

    async handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const errorDiv = form.querySelector('.error');
        const successDiv = form.querySelector('.success');
        errorDiv.textContent = '';
        successDiv.textContent = '';

        const data = {
            title: form.title.value,
            description: form.description.value,
            type: form.type.value,
            scheduledAt: form.scheduledAt.value,
            ownerId: this.getAttribute('owner-id')
        };

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            successDiv.textContent = 'Task created successfully!';
            form.reset();

            this.dispatchEvent(new CustomEvent('task-created', {
                bubbles: true,
                detail: await response.json()
            }));
        } catch (err) {
            errorDiv.textContent = err.message;
        }
    }
}

customElements.define('task-form', TaskForm);
