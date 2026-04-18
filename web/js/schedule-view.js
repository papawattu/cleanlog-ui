const style = document.createElement('style');
style.textContent = `
.schedule-view {
    max-width: 48rem;
    margin: 2rem auto;
}
.schedule-view h2 {
    margin-bottom: 1rem;
    color: var(--color-text);
}
.schedule-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.5rem;
}
.schedule-day {
    background: white;
    border-radius: var(--radius);
    padding: 0.75rem;
    min-height: 6rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.schedule-day .day-header {
    font-weight: 600;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-text-light);
}
.schedule-day .task-count {
    font-size: 0.75rem;
    color: var(--color-primary);
}
`;
document.head.appendChild(style);

class ScheduleView extends HTMLElement {
    constructor() {
        super();
        this.schedule = [];
    }

    connectedCallback() {
        this.render();
        this.loadSchedule();
    }

    async loadSchedule() {
        try {
            const cleanerId = this.getAttribute('cleaner-id');
            const response = await fetch(`/api/schedule?cleaner_id=${cleanerId}`);
            this.schedule = await response.json();
            this.render();
        } catch (err) {
            console.error('Failed to load schedule:', err);
        }
    }

    render() {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        this.innerHTML = `
            <div class="schedule-view">
                <h2>My Schedule</h2>
                <div class="schedule-grid">
                    ${days.map((day, i) => {
                        const tasks = this.schedule.filter((_, idx) => idx % 7 === i);
                        return `
                            <div class="schedule-day">
                                <div class="day-header">${day}</div>
                                <div class="task-count">${tasks.length} tasks</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
}

customElements.define('schedule-view', ScheduleView);
