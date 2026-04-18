const style = document.createElement('style');
style.textContent = `
.dashboard {
    max-width: 64rem;
    margin: 2rem auto;
}
.dashboard h2 {
    margin-bottom: 1rem;
    color: var(--color-text);
}
.dashboard-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
}
.stat-card {
    background: white;
    border-radius: var(--radius);
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    text-align: center;
}
.stat-card .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-primary);
}
.stat-card .stat-label {
    font-size: 0.875rem;
    color: var(--color-text-light);
    margin-top: 0.25rem;
}
.task-table {
    width: 100%;
    background: white;
    border-radius: var(--radius);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-collapse: collapse;
}
.task-table th,
.task-table td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
}
.task-table th {
    background: #f9fafb;
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--color-text-light);
}
.task-table td {
    font-size: 0.875rem;
}
.status-badge {
    display: inline-block;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
}
.status-badge.pending {
    background: #fef3c7;
    color: #92400e;
}
.status-badge.in-progress {
    background: #dbeafe;
    color: #1e40af;
}
.status-badge.completed {
    background: #d1fae5;
    color: #065f46;
}
`;
document.head.appendChild(style);

class Dashboard extends HTMLElement {
    constructor() {
        super();
        this.tasks = [];
    }

    connectedCallback() {
        this.render();
        this.loadDashboard();
    }

    async loadDashboard() {
        try {
            const ownerId = this.getAttribute('owner-id');
            const [tasksResponse] = await Promise.all([
                fetch(`/api/owner/tasks?owner_id=${ownerId}`)
            ]);
            this.tasks = await tasksResponse.json();
            this.render();
        } catch (err) {
            console.error('Failed to load dashboard:', err);
        }
    }

    getStats() {
        return {
            total: this.tasks.length,
            pending: this.tasks.filter(t => t.status === 'pending').length,
            completed: this.tasks.filter(t => t.status === 'completed').length
        };
    }

    render() {
        const stats = this.getStats();
        this.innerHTML = `
            <div class="dashboard">
                <h2>Owner Dashboard</h2>
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <div class="stat-number">${stats.total}</div>
                        <div class="stat-label">Total Tasks</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.pending}</div>
                        <div class="stat-label">Pending</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.completed}</div>
                        <div class="stat-label">Completed</div>
                    </div>
                </div>
                <table class="task-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Scheduled</th>
                            <th>Cleaner</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.tasks.map(task => `
                            <tr>
                                <td>${task.title}</td>
                                <td>${task.type}</td>
                                <td><span class="status-badge ${task.status}">${task.status}</span></td>
                                <td>${task.scheduledAt}</td>
                                <td>${task.cleanerId || 'Unassigned'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
}

customElements.define('dashboard', Dashboard);
