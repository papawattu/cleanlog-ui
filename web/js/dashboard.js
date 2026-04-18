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
.charts-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
}
.chart-card {
    background: white;
    border-radius: var(--radius);
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.chart-card h3 {
    margin-bottom: 1rem;
    color: var(--color-text);
    font-size: 1rem;
}
.chart-card svg {
    width: 100%;
    max-width: 200px;
    height: 200px;
    margin: 0 auto;
    display: block;
}
.bar-chart {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 0.5rem;
    height: 200px;
    padding: 1rem 0;
}
.bar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
}
.bar {
    width: 40px;
    border-radius: 4px 4px 0 0;
    transition: height 0.3s ease;
}
.bar-label {
    font-size: 0.7rem;
    color: var(--color-text-light);
    text-align: center;
}
.bar-value {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text);
}
.completion-bar {
    width: 100%;
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 0.5rem;
}
.completion-bar-fill {
    height: 100%;
    background: var(--color-primary);
    border-radius: 4px;
    transition: width 0.3s ease;
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
            completed: this.tasks.filter(t => t.status === 'completed').length,
            inProgress: this.tasks.filter(t => t.status === 'in-progress').length
        };
    }

    getTasksByType() {
        const types = {};
        this.tasks.forEach(t => {
            types[t.type] = (types[t.type] || 0) + 1;
        });
        return types;
    }

    createDonutChart(stats) {
        const total = stats.total || 1;
        const pending = stats.pending;
        const inProgress = stats.inProgress;
        const completed = stats.completed;

        const radius = 70;
        const circumference = 2 * Math.PI * radius;

        const pendingPct = pending / total;
        const inProgressPct = inProgress / total;
        const completedPct = completed / total;

        const pendingOffset = 0;
        const inProgressOffset = -pendingPct * circumference;
        const completedOffset = -(pendingPct + inProgressPct) * circumference;

        return `
            <svg viewBox="0 0 200 200" role="img" aria-label="Task status donut chart">
                <circle cx="100" cy="100" r="${radius}" fill="none" stroke="#e5e7eb" stroke-width="20"/>
                <circle cx="100" cy="100" r="${radius}" fill="none" stroke="#fef3c7" stroke-width="20"
                    stroke-dasharray="${circumference}" stroke-dashoffset="${-pendingPct * circumference}"
                    transform="rotate(-90 100 100)" style="transition: stroke-dashoffset 0.5s ease"/>
                <circle cx="100" cy="100" r="${radius}" fill="none" stroke="#dbeafe" stroke-width="20"
                    stroke-dasharray="${circumference}" stroke-dashoffset="${-inProgressPct * circumference}"
                    transform="rotate(${90 + inProgressOffset} 100 100)" style="transition: stroke-dashoffset 0.5s ease"/>
                <circle cx="100" cy="100" r="${radius}" fill="none" stroke="#d1fae5" stroke-width="20"
                    stroke-dasharray="${circumference}" stroke-dashoffset="${-completedPct * circumference}"
                    transform="rotate(${90 + completedOffset} 100 100)" style="transition: stroke-dashoffset 0.5s ease"/>
                <text x="100" y="95" text-anchor="middle" font-size="24" font-weight="700" fill="var(--color-primary)">${stats.completed}</text>
                <text x="100" y="115" text-anchor="middle" font-size="12" fill="var(--color-text-light)">completed</text>
            </svg>
            <div style="display:flex;gap:1rem;justify-content:center;margin-top:1rem;">
                <span style="display:flex;align-items:center;gap:0.25rem;font-size:0.75rem;">
                    <span style="width:10px;height:10px;background:#fef3c7;border-radius:2px;"></span> Pending (${pending})
                </span>
                <span style="display:flex;align-items:center;gap:0.25rem;font-size:0.75rem;">
                    <span style="width:10px;height:10px;background:#dbeafe;border-radius:2px;"></span> In Progress (${inProgress})
                </span>
                <span style="display:flex;align-items:center;gap:0.25rem;font-size:0.75rem;">
                    <span style="width:10px;height:10px;background:#d1fae5;border-radius:2px;"></span> Completed (${completed})
                </span>
            </div>
        `;
    }

    createBarChart(types) {
        const typeColors = {
            'general': '#6366f1',
            'bathroom': '#06b6d4',
            'kitchen': '#f59e0b',
            'floor': '#10b981',
            'window': '#8b5cf6'
        };
        const maxCount = Math.max(...Object.values(types), 1);
        const barHeight = 160;

        const bars = Object.entries(types).map(([type, count]) => {
            const height = (count / maxCount) * barHeight;
            const color = typeColors[type] || '#6366f1';
            const shortLabel = type.replace('_cleaning', '').replace('care', '');
            return `
                <div class="bar-wrapper">
                    <div class="bar-value">${count}</div>
                    <div class="bar" style="height:${height}px;background:${color};"></div>
                    <div class="bar-label">${shortLabel}</div>
                </div>
            `;
        }).join('');

        return `<div class="bar-chart">${bars}</div>`;
    }

    render() {
        const stats = this.getStats();
        const types = this.getTasksByType();
        const completionPct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

        this.innerHTML = `
            <div class="dashboard">
                <h2>Owner Dashboard</h2>
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <div class="stat-number">${stats.total}</div>
                        <div class="stat-label">Total Tasks</div>
                        <div class="completion-bar">
                            <div class="completion-bar-fill" style="width:${completionPct}%"></div>
                        </div>
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
                <div class="charts-container">
                    <div class="chart-card">
                        <h3>Task Status</h3>
                        ${this.createDonutChart(stats)}
                    </div>
                    <div class="chart-card">
                        <h3>Tasks by Type</h3>
                        ${this.createBarChart(types)}
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
