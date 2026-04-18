import { eventBus } from './eventBus.js';
import { api } from './api.js';

const ROUTES = {
  '/': 'public-home',
  '/login': 'login-form',
  '/register': 'register-form',
  '/dashboard': 'dashboard',
  '/tasks': 'task-list',
  '/tasks/create': 'create-task',
  '/schedules': 'schedule-view',
};

class App extends HTMLElement {
  constructor() {
    super();
    this._currentRoute = '/';
    this._user = null;
  }

  connectedCallback() {
    this._initAuth();
    eventBus.on('navigate', (detail) => {
      this._navigate(detail.path);
    });
    eventBus.on('auth:changed', () => {
      this._initAuth();
      this._navigate(this._currentRoute);
    });
    this._navigate(this._getInitialRoute());
  }

  disconnectedCallback() {
    eventBus.off('navigate');
    eventBus.off('auth:changed');
  }

  _initAuth() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const fullName = localStorage.getItem('fullName');
    if (token) {
      this._user = { token, role, fullName };
    } else {
      this._user = null;
    }
  }

  _getInitialRoute() {
    const hash = window.location.hash.slice(1);
    if (hash) {
      return hash;
    }
    if (this._user) {
      return '/dashboard';
    }
    return '/';
  }

  _navigate(path) {
    this._currentRoute = path;
    window.location.hash = path;
    this._clearContent();
    this._renderRoute(path);
    this._updateHeader();
  }

  _clearContent() {
    const content = this.querySelector('main');
    if (content) {
      while (content.firstChild) {
        content.removeChild(content.firstChild);
      }
    }
  }

  _renderRoute(path) {
    if (path === '/' || path === '') {
      this._renderPublicHome();
      return;
    }

    const route = ROUTES[path];
    if (!route) {
      this._renderNotFound();
      return;
    }

    if (this._isProtectedRoute(path)) {
      if (!this._user) {
        this._navigate('/login');
        return;
      }
    }

    switch (route) {
      case 'login-form':
        this._renderLoginForm();
        break;
      case 'register-form':
        this._renderRegisterForm();
        break;
      case 'dashboard':
        this._renderDashboard();
        break;
      case 'task-list':
        this._renderTaskList();
        break;
      case 'create-task':
        this._renderCreateTask();
        break;
      case 'schedule-view':
        this._renderScheduleView();
        break;
      default:
        this._renderNotFound();
    }
  }

  _isProtectedRoute(path) {
    return ['/dashboard', '/tasks', '/schedules'].includes(path);
  }

  _renderPublicHome() {
    const main = this.querySelector('main');
    const section = document.createElement('section');
    section.setAttribute('role', 'main');
    section.setAttribute('aria-label', 'Welcome');
    section.innerHTML = `
      <style>
        .home-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
          padding: 2rem;
        }

        .home-hero h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: var(--text-color);
        }

        .home-hero p {
          font-size: 1.25rem;
          color: var(--text-muted);
          margin-bottom: 2rem;
          max-width: 500px;
        }

        .home-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .home-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          max-width: 900px;
          margin: 3rem auto;
          padding: 0 2rem;
        }

        .feature-card {
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          padding: 1.5rem;
          text-align: left;
        }

        .feature-card h3 {
          margin-bottom: 0.5rem;
          color: var(--text-color);
        }

        .feature-card p {
          color: var(--text-muted);
          font-size: 0.875rem;
        }
      </style>
      <div class="home-hero">
        <h1>Cleanlog</h1>
        <p>Track and manage cleaning tasks with ease. Perfect for homeowners and professional cleaners.</p>
        <div class="home-actions">
          <button class="btn-primary" id="btn-get-started">Get Started</button>
          <button class="btn-secondary" id="btn-login">Login</button>
        </div>
      </div>
      <div class="home-features">
        <div class="feature-card">
          <h3>For Homeowners</h3>
          <p>Create tasks, assign cleaners, and track progress in real-time.</p>
        </div>
        <div class="feature-card">
          <h3>For Cleaners</h3>
          <p>View your assigned tasks, update status, and manage your schedule.</p>
        </div>
        <div class="feature-card">
          <h3>Simple Scheduling</h3>
          <p>Organize cleaning sessions with date and time slot management.</p>
        </div>
      </div>
    `;

    section.querySelector('#btn-get-started').addEventListener('click', () => {
      eventBus.emit('navigate', { path: '/register' });
    });
    section.querySelector('#btn-login').addEventListener('click', () => {
      eventBus.emit('navigate', { path: '/login' });
    });
    main.appendChild(section);
  }

  _renderLoginForm() {
    const main = this.querySelector('main');
    const section = document.createElement('section');
    section.setAttribute('role', 'main');
    section.setAttribute('aria-label', 'Login');
    section.innerHTML = `
      <style>
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
          padding: 2rem;
        }

        .auth-card {
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          padding: 2rem;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .auth-card h2 {
          margin-bottom: 1.5rem;
          text-align: center;
          color: var(--text-color);
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-color);
        }

        .form-group input {
          width: 100%;
          padding: 0.625rem;
          border: 1px solid var(--border-color);
          border-radius: 0.375rem;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }

        .form-actions {
          margin-top: 1.5rem;
        }

        .form-actions .btn-primary {
          width: 100%;
        }

        .auth-switch {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .auth-switch a {
          color: var(--primary-color);
          text-decoration: none;
        }

        .auth-switch a:hover {
          text-decoration: underline;
        }

        .form-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 0.375rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .form-loading {
          opacity: 0.6;
          pointer-events: none;
        }
      </style>
      <div class="auth-container">
        <div class="auth-card">
          <h2>Login</h2>
          <div id="form-error" role="alert" aria-live="polite"></div>
          <form id="login-form" novalidate>
            <div class="form-group">
              <label for="login-email">Email</label>
              <input type="email" id="login-email" name="email" required autocomplete="email" aria-required="true" />
            </div>
            <div class="form-group">
              <label for="login-password">Password</label>
              <input type="password" id="login-password" name="password" required autocomplete="current-password" aria-required="true" />
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary">Login</button>
            </div>
          </form>
          <p class="auth-switch">
            Don't have an account? <a href="#" id="link-register">Register</a>
          </p>
        </div>
      </div>
    `;

    const form = section.querySelector('#login-form');
    const errorDiv = section.querySelector('#form-error');
    const linkRegister = section.querySelector('#link-register');

    linkRegister.addEventListener('click', (e) => {
      e.preventDefault();
      eventBus.emit('navigate', { path: '/register' });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorDiv.textContent = '';
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.classList.add('form-loading');

      const email = form.querySelector('#login-email').value.trim();
      const password = form.querySelector('#login-password').value;

      try {
        const data = await api.login({ email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('fullName', data.fullName);
        localStorage.setItem('userId', data.userId);
        eventBus.emit('auth:changed');
        eventBus.emit('navigate', { path: '/dashboard' });
      } catch (err) {
        errorDiv.textContent = err.message || 'Login failed. Please try again.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('form-loading');
      }
    });

    main.appendChild(section);
  }

  _renderRegisterForm() {
    const main = this.querySelector('main');
    const section = document.createElement('section');
    section.setAttribute('role', 'main');
    section.setAttribute('aria-label', 'Register');
    section.innerHTML = `
      <style>
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
          padding: 2rem;
        }

        .auth-card {
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          padding: 2rem;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .auth-card h2 {
          margin-bottom: 1.5rem;
          text-align: center;
          color: var(--text-color);
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-color);
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 0.625rem;
          border: 1px solid var(--border-color);
          border-radius: 0.375rem;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }

        .form-actions {
          margin-top: 1.5rem;
        }

        .form-actions .btn-primary {
          width: 100%;
        }

        .auth-switch {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .auth-switch a {
          color: var(--primary-color);
          text-decoration: none;
        }

        .auth-switch a:hover {
          text-decoration: underline;
        }

        .form-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 0.375rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .form-loading {
          opacity: 0.6;
          pointer-events: none;
        }
      </style>
      <div class="auth-container">
        <div class="auth-card">
          <h2>Create Account</h2>
          <div id="form-error" role="alert" aria-live="polite"></div>
          <form id="register-form" novalidate>
            <div class="form-group">
              <label for="reg-fullname">Full Name</label>
              <input type="text" id="reg-fullname" name="fullName" required autocomplete="name" aria-required="true" />
            </div>
            <div class="form-group">
              <label for="reg-email">Email</label>
              <input type="email" id="reg-email" name="email" required autocomplete="email" aria-required="true" />
            </div>
            <div class="form-group">
              <label for="reg-password">Password</label>
              <input type="password" id="reg-password" name="password" required autocomplete="new-password" aria-required="true" minlength="8" />
            </div>
            <div class="form-group">
              <label for="reg-role">Account Type</label>
              <select id="reg-role" name="role" required aria-required="true">
                <option value="">Select...</option>
                <option value="owner">Homeowner</option>
                <option value="cleaner">Cleaner</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary">Register</button>
            </div>
          </form>
          <p class="auth-switch">
            Already have an account? <a href="#" id="link-login">Login</a>
          </p>
        </div>
      </div>
    `;

    const form = section.querySelector('#register-form');
    const errorDiv = section.querySelector('#form-error');
    const linkLogin = section.querySelector('#link-login');

    linkLogin.addEventListener('click', (e) => {
      e.preventDefault();
      eventBus.emit('navigate', { path: '/login' });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorDiv.textContent = '';
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.classList.add('form-loading');

      const fullName = form.querySelector('#reg-fullname').value.trim();
      const email = form.querySelector('#reg-email').value.trim();
      const password = form.querySelector('#reg-password').value;
      const role = form.querySelector('#reg-role').value;

      if (!fullName || !email || !password || !role) {
        errorDiv.textContent = 'All fields are required.';
        submitBtn.disabled = false;
        submitBtn.classList.remove('form-loading');
        return;
      }

      if (password.length < 8) {
        errorDiv.textContent = 'Password must be at least 8 characters.';
        submitBtn.disabled = false;
        submitBtn.classList.remove('form-loading');
        return;
      }

      try {
        const data = await api.register({ fullName, email, password, role });
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('fullName', data.fullName);
        localStorage.setItem('userId', data.userId);
        eventBus.emit('auth:changed');
        eventBus.emit('navigate', { path: '/dashboard' });
      } catch (err) {
        errorDiv.textContent = err.message || 'Registration failed. Please try again.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('form-loading');
      }
    });

    main.appendChild(section);
  }

  _renderDashboard() {
    const main = this.querySelector('main');
    const section = document.createElement('section');
    section.setAttribute('role', 'main');
    section.setAttribute('aria-label', 'Dashboard');
    section.innerHTML = `
      <style>
        .dashboard {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .dashboard-header h2 {
          color: var(--text-color);
        }

        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          padding: 1.25rem;
          text-align: center;
        }

        .stat-card .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .stat-card .stat-label {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .dashboard-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .dashboard-content {
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          padding: 1.5rem;
        }

        .dashboard-content h3 {
          margin-bottom: 1rem;
          color: var(--text-color);
        }

        .dashboard-charts {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .chart-card {
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          padding: 1.5rem;
        }

        .chart-card h3 {
          margin-bottom: 1rem;
          color: var(--text-color);
          font-size: 1rem;
          font-weight: 600;
        }

        .chart-card svg {
          width: 100%;
          height: auto;
          display: block;
        }

        .chart-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1rem;
          justify-content: center;
        }

        .chart-legend-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        .chart-legend-dot {
          width: 0.625rem;
          height: 0.625rem;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .chart-legend-value {
          font-weight: 600;
          color: var(--text-color);
        }

        .bar-chart-container {
          display: flex;
          align-items: flex-end;
          gap: 0.5rem;
          height: 160px;
          padding-top: 1rem;
        }

        .bar-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          height: 100%;
          justify-content: flex-end;
        }

        .bar-value {
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--text-color);
          margin-bottom: 0.25rem;
        }

        .bar {
          width: 100%;
          max-width: 40px;
          border-radius: 0.25rem 0.25rem 0 0;
          min-height: 4px;
          transition: height 0.3s ease;
        }

        .bar-label {
          font-size: 0.6875rem;
          color: var(--text-muted);
          margin-top: 0.375rem;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 60px;
        }

        .completion-rate {
          text-align: center;
          padding: 1rem 0;
        }

        .completion-rate-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--primary-color);
          line-height: 1;
        }

        .completion-rate-label {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
        }

        .completion-bar-container {
          margin-top: 1rem;
          background: var(--border-color);
          border-radius: 0.5rem;
          height: 0.75rem;
          overflow: hidden;
        }

        .completion-bar {
          height: 100%;
          border-radius: 0.5rem;
          background: linear-gradient(90deg, var(--primary-color), #3b82f6);
          transition: width 0.5s ease;
        }

        .weekly-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.5rem;
        }

        .weekly-day {
          text-align: center;
          padding: 0.75rem 0.5rem;
          border-radius: 0.5rem;
          background: var(--bg-color);
        }

        .weekly-day-label {
          font-size: 0.6875rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 0.375rem;
        }

        .weekly-day-count {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-color);
        }

        .weekly-day.today {
          background: var(--primary-color);
        }

        .weekly-day.today .weekly-day-label,
        .weekly-day.today .weekly-day-count {
          color: white;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: var(--text-muted);
        }

        .empty-state p {
          margin-bottom: 1rem;
        }
      </style>
      <div class="dashboard">
        <div class="dashboard-header">
          <h2>Dashboard</h2>
          <div class="dashboard-actions">
            <button class="btn-primary" id="btn-create-task">Create Task</button>
            <button class="btn-secondary" id="btn-view-tasks">View Tasks</button>
            <button class="btn-secondary" id="btn-view-schedules">View Schedules</button>
          </div>
        </div>
        <div class="dashboard-stats" id="dashboard-stats">
          <div class="stat-card">
            <div class="stat-number" id="stat-total">-</div>
            <div class="stat-label">Total Tasks</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" id="stat-pending">-</div>
            <div class="stat-label">Pending</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" id="stat-in-progress">-</div>
            <div class="stat-label">In Progress</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" id="stat-completed">-</div>
            <div class="stat-label">Completed</div>
          </div>
        </div>
        <div class="dashboard-charts" id="dashboard-charts">
          <div class="chart-card">
            <h3>Task Status</h3>
            <svg id="status-donut" viewBox="0 0 200 200" width="200" height="200"></svg>
            <div class="chart-legend" id="status-legend"></div>
          </div>
          <div class="chart-card">
            <h3>Tasks by Type</h3>
            <div class="bar-chart-container" id="type-bar-chart"></div>
          </div>
          <div class="chart-card">
            <h3>Completion Rate</h3>
            <div class="completion-rate">
              <div class="completion-rate-value" id="completion-rate-value">-</div>
              <div class="completion-rate-label">of tasks completed</div>
              <div class="completion-bar-container">
                <div class="completion-bar" id="completion-bar" style="width: 0%"></div>
              </div>
            </div>
          </div>
          <div class="chart-card">
            <h3>This Week</h3>
            <div class="weekly-grid" id="weekly-grid"></div>
          </div>
        </div>
        <div class="dashboard-content" id="dashboard-content">
          <div class="empty-state">
            <p>Loading dashboard data...</p>
          </div>
        </div>
      </div>
    `;

    section.querySelector('#btn-create-task').addEventListener('click', () => {
      eventBus.emit('navigate', { path: '/tasks/create' });
    });
    section.querySelector('#btn-view-tasks').addEventListener('click', () => {
      eventBus.emit('navigate', { path: '/tasks' });
    });
    section.querySelector('#btn-view-schedules').addEventListener('click', () => {
      eventBus.emit('navigate', { path: '/schedules' });
    });

    this._loadDashboardStats(section);
    main.appendChild(section);
  }

  async _loadDashboardStats(section) {
    try {
      const tasks = await api.listTasks();
      const total = tasks.length;
      const pending = tasks.filter(t => t.status === 'pending').length;
      const inProgress = tasks.filter(t => t.status === 'in_progress').length;
      const completed = tasks.filter(t => t.status === 'completed').length;

      section.querySelector('#stat-total').textContent = total;
      section.querySelector('#stat-pending').textContent = pending;
      section.querySelector('#stat-in-progress').textContent = inProgress;
      section.querySelector('#stat-completed').textContent = completed;

      this._renderStatusDonut(section, { pending, inProgress, completed }, total);
      this._renderTypeBarChart(section, tasks);
      this._renderCompletionRate(section, completed, total);
      this._renderWeeklyGrid(section, tasks);

      const content = section.querySelector('#dashboard-content');
      if (total === 0) {
        content.innerHTML = `
          <div class="empty-state">
            <p>No tasks yet.</p>
            <button class="btn-primary" id="btn-create-first">Create Your First Task</button>
          </div>
        `;
        content.querySelector('#btn-create-first').addEventListener('click', () => {
          eventBus.emit('navigate', { path: '/tasks/create' });
        });
      } else {
        const recentTasks = tasks.slice(-5).reverse();
        content.innerHTML = `
          <h3>Recent Tasks</h3>
          <table aria-label="Recent tasks">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Type</th>
                <th scope="col">Status</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              ${recentTasks.map(task => `
                <tr>
                  <td>${task.title}</td>
                  <td>${this._formatTaskType(task.taskType)}</td>
                  <td><span class="status-badge status-${task.status}">${this._formatStatus(task.status)}</span></td>
                  <td>${this._formatDate(task.scheduledDate)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      }
    } catch (err) {
      const content = section.querySelector('#dashboard-content');
      content.innerHTML = `
        <div class="empty-state">
          <p>Failed to load dashboard data.</p>
        </div>
      `;
    }
  }

  _renderStatusDonut(section, counts, total) {
    const svg = section.querySelector('#status-donut');
    const legend = section.querySelector('#status-legend');
    if (!svg || !legend) return;

    const statusCounts = [
      { label: 'Pending', value: counts.pending, color: '#f59e0b' },
      { label: 'In Progress', value: counts.inProgress, color: '#3b82f6' },
      { label: 'Completed', value: counts.completed, color: '#10b981' },
    ];

    const radius = 70;
    const cx = 100;
    const cy = 100;
    const strokeWidth = 28;
    const circumference = 2 * Math.PI * radius;

    let offset = 0;
    let paths = '';

    for (const status of statusCounts) {
      if (total === 0) break;
      const fraction = status.value / total;
      const dashLength = fraction * circumference;
      const dashGap = circumference - dashLength;
      paths += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${status.color}" stroke-width="${strokeWidth}" stroke-dasharray="${dashLength} ${dashGap}" stroke-dashoffset="${-offset}" stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})" />`;
      offset += dashLength;
    }

    if (total === 0) {
      paths = `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="var(--border-color)" stroke-width="${strokeWidth}" />`;
    }

    const centerText = total > 0
      ? `<text x="${cx}" y="${cy - 8}" text-anchor="middle" font-size="28" font-weight="700" fill="var(--text-color)">${total}</text>
         <text x="${cx}" y="${cy + 12}" text-anchor="middle" font-size="11" fill="var(--text-muted)">total tasks</text>`
      : `<text x="${cx}" y="${cy}" text-anchor="middle" font-size="14" fill="var(--text-muted)">No tasks</text>`;

    svg.innerHTML = paths + centerText;

    legend.innerHTML = statusCounts.map(s => `
      <div class="chart-legend-item">
        <span class="chart-legend-dot" style="background: ${s.color}"></span>
        <span>${s.label}</span>
        <span class="chart-legend-value">${s.value}</span>
      </div>
    `).join('');
  }

  _renderTypeBarChart(section, tasks) {
    const container = section.querySelector('#type-bar-chart');
    if (!container) return;

    const typeColors = {
      general_cleaning: '#6366f1',
      bathroom_cleaning: '#8b5cf6',
      kitchen_cleaning: '#ec4899',
      floor_care: '#f59e0b',
      window_cleaning: '#06b6d4',
    };

    const typeCounts = {};
    for (const task of tasks) {
      typeCounts[task.taskType] = (typeCounts[task.taskType] || 0) + 1;
    }

    const entries = Object.entries(typeCounts);
    if (entries.length === 0) {
      container.innerHTML = '<div class="empty-state" style="padding: 2rem 0;"><p>No task data</p></div>';
      return;
    }

    const maxCount = Math.max(...entries.map(e => e[1]));

    container.innerHTML = entries.map(([type, count]) => {
      const height = maxCount > 0 ? (count / maxCount) * 130 : 0;
      const color = typeColors[type] || '#64748b';
      const label = this._formatTaskType(type);
      return `
        <div class="bar-group">
          <div class="bar-value">${count}</div>
          <div class="bar" style="height: ${height}px; background: ${color};"></div>
          <div class="bar-label">${label}</div>
        </div>
      `;
    }).join('');
  }

  _renderCompletionRate(section, completed, total) {
    const valueEl = section.querySelector('#completion-rate-value');
    const barEl = section.querySelector('#completion-bar');
    if (!valueEl || !barEl) return;

    if (total === 0) {
      valueEl.textContent = '0%';
      barEl.style.width = '0%';
      return;
    }

    const rate = Math.round((completed / total) * 100);
    valueEl.textContent = rate + '%';
    barEl.style.width = rate + '%';
  }

  _renderWeeklyGrid(section, tasks) {
    const grid = section.querySelector('#weekly-grid');
    if (!grid) return;

    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayTasks = {};

    const startOfWeek = new Date(monday);
    const endOfWeek = new Date(monday);
    endOfWeek.setDate(monday.getDate() + 6);

    for (const task of tasks) {
      if (!task.scheduledDate) continue;
      const taskDate = new Date(task.scheduledDate + 'T00:00:00');
      if (taskDate >= startOfWeek && taskDate <= endOfWeek) {
        const idx = taskDate.getDay();
        const adjustedIdx = (idx + 6) % 7;
        dayTasks[adjustedIdx] = (dayTasks[adjustedIdx] || 0) + 1;
      }
    }

    const isToday = (dayIdx) => {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + dayIdx);
      return dayDate.toDateString() === today.toDateString();
    };

    grid.innerHTML = dayNames.map((name, idx) => `
      <div class="weekly-day ${isToday(idx) ? 'today' : ''}">
        <div class="weekly-day-label">${name}</div>
        <div class="weekly-day-count">${dayTasks[idx] || 0}</div>
      </div>
    `).join('');
  }

  _renderTaskList() {
    const main = this.querySelector('main');
    const section = document.createElement('section');
    section.setAttribute('role', 'main');
    section.setAttribute('aria-label', 'Tasks');
    section.innerHTML = `
      <style>
        .task-list-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .task-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .task-list-header h2 {
          color: var(--text-color);
        }

        .task-filters {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .task-filters button {
          padding: 0.375rem 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: 0.375rem;
          background: white;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .task-filters button.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .task-table {
          width: 100%;
          border-collapse: collapse;
        }

        .task-table th,
        .task-table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }

        .task-table th {
          font-weight: 600;
          color: var(--text-color);
        }

        .task-table td {
          color: var(--text-muted);
        }

        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-in_progress {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-completed {
          background: #d1fae5;
          color: #065f46;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: var(--text-muted);
        }

        .task-actions {
          display: flex;
          gap: 0.5rem;
        }

        .task-actions button {
          padding: 0.25rem 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: 0.25rem;
          background: white;
          cursor: pointer;
          font-size: 0.75rem;
        }

        .task-actions button:hover {
          background: var(--bg-color);
        }

        @media (max-width: 768px) {
          .task-table {
            display: block;
            overflow-x: auto;
          }
        }
      </style>
      <div class="task-list-page">
        <div class="task-list-header">
          <h2>Tasks</h2>
          <button class="btn-primary" id="btn-create-task">Create Task</button>
        </div>
        <div class="task-filters" role="toolbar" aria-label="Filter tasks">
          <button class="active" data-filter="all">All</button>
          <button data-filter="pending">Pending</button>
          <button data-filter="in_progress">In Progress</button>
          <button data-filter="completed">Completed</button>
        </div>
        <div id="task-table-container">
          <div class="empty-state">
            <p>Loading tasks...</p>
          </div>
        </div>
      </div>
    `;

    section.querySelector('#btn-create-task').addEventListener('click', () => {
      eventBus.emit('navigate', { path: '/tasks/create' });
    });

    const filterBtns = section.querySelectorAll('.task-filters button');
    let currentFilter = 'all';

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        this._renderTaskTable(section, currentFilter);
      });
    });

    this._renderTaskTable(section, currentFilter);
    main.appendChild(section);
  }

  async _renderTaskTable(section, filter) {
    const container = section.querySelector('#task-table-container');
    try {
      let tasks = await api.listTasks();
      if (filter !== 'all') {
        tasks = tasks.filter(t => t.status === filter);
      }

      if (tasks.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <p>No tasks found.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <table class="task-table" aria-label="Tasks">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Type</th>
              <th scope="col">Status</th>
              <th scope="col">Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${tasks.map(task => `
              <tr>
                <td>${task.title}</td>
                <td>${this._formatTaskType(task.taskType)}</td>
                <td><span class="status-badge status-${task.status}">${this._formatStatus(task.status)}</span></td>
                <td>${this._formatDate(task.scheduledDate)}</td>
                <td>
                  <div class="task-actions">
                    ${task.status === 'pending' ? `<button class="btn-start-task" data-id="${task.id}" aria-label="Start task ${task.title}">Start</button>` : ''}
                    ${task.status === 'in_progress' ? `<button class="btn-complete-task" data-id="${task.id}" aria-label="Complete task ${task.title}">Complete</button>` : ''}
                    ${task.status === 'pending' ? `<button class="btn-delete-task" data-id="${task.id}" aria-label="Delete task ${task.title}">Delete</button>` : ''}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      container.querySelectorAll('.btn-start-task').forEach(btn => {
        btn.addEventListener('click', async () => {
          try {
            await api.updateTaskStatus(btn.dataset.id, 'in_progress');
            eventBus.emit('navigate', { path: '/tasks' });
          } catch (err) {
            alert(err.message);
          }
        });
      });

      container.querySelectorAll('.btn-complete-task').forEach(btn => {
        btn.addEventListener('click', async () => {
          try {
            await api.completeTask(btn.dataset.id);
            eventBus.emit('navigate', { path: '/tasks' });
          } catch (err) {
            alert(err.message);
          }
        });
      });

      container.querySelectorAll('.btn-delete-task').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (confirm('Are you sure you want to delete this task?')) {
            try {
              await api.deleteTask(btn.dataset.id);
              eventBus.emit('navigate', { path: '/tasks' });
            } catch (err) {
              alert(err.message);
            }
          }
        });
      });
    } catch (err) {
      container.innerHTML = `
        <div class="empty-state">
          <p>Failed to load tasks.</p>
        </div>
      `;
    }
  }

  _renderScheduleView() {
    const main = this.querySelector('main');
    const section = document.createElement('section');
    section.setAttribute('role', 'main');
    section.setAttribute('aria-label', 'Schedules');
    section.innerHTML = `
      <style>
        .schedule-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .schedule-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .schedule-header h2 {
          color: var(--text-color);
        }

        .schedule-grid {
          display: grid;
          gap: 1rem;
        }

        .schedule-card {
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          padding: 1.25rem;
        }

        .schedule-card .schedule-date {
          font-weight: 600;
          color: var(--text-color);
          margin-bottom: 0.5rem;
        }

        .schedule-card .schedule-details {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .schedule-card .schedule-actions {
          margin-top: 0.75rem;
          display: flex;
          gap: 0.5rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: var(--text-muted);
        }
      </style>
      <div class="schedule-page">
        <div class="schedule-header">
          <h2>Schedules</h2>
        </div>
        <div id="schedule-container" class="schedule-grid">
          <div class="empty-state">
            <p>Loading schedules...</p>
          </div>
        </div>
      </div>
    `;

    this._renderScheduleCards(section);
    main.appendChild(section);
  }

  async _renderScheduleCards(section) {
    const container = section.querySelector('#schedule-container');
    try {
      const schedules = await api.listSchedules();

      if (schedules.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <p>No schedules found.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = schedules.map(schedule => `
        <div class="schedule-card">
          <div class="schedule-date">${this._formatDate(schedule.date)}</div>
          <div class="schedule-details">
            <span>Time: ${schedule.timeSlot}</span>
            <span>Status: ${schedule.active ? 'Active' : 'Inactive'}</span>
          </div>
          <div class="schedule-actions">
            ${schedule.active ? 
              `<button class="btn-deactivate-schedule" data-id="${schedule.id}" aria-label="Deactivate schedule">Deactivate</button>` :
              `<button class="btn-reactivate-schedule" data-id="${schedule.id}" aria-label="Reactivate schedule">Reactivate</button>`
            }
            <button class="btn-delete-schedule" data-id="${schedule.id}" aria-label="Delete schedule">Delete</button>
          </div>
        </div>
      `).join('');

      container.querySelectorAll('.btn-deactivate-schedule').forEach(btn => {
        btn.addEventListener('click', async () => {
          try {
            await api.updateSchedule(btn.dataset.id, { active: false });
            this._renderScheduleCards(section);
          } catch (err) {
            alert(err.message);
          }
        });
      });

      container.querySelectorAll('.btn-reactivate-schedule').forEach(btn => {
        btn.addEventListener('click', async () => {
          try {
            await api.updateSchedule(btn.dataset.id, { active: true });
            this._renderScheduleCards(section);
          } catch (err) {
            alert(err.message);
          }
        });
      });

      container.querySelectorAll('.btn-delete-schedule').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (confirm('Are you sure you want to delete this schedule?')) {
            try {
              await api.deleteSchedule(btn.dataset.id);
              this._renderScheduleCards(section);
            } catch (err) {
              alert(err.message);
            }
          }
        });
      });
    } catch (err) {
      container.innerHTML = `
        <div class="empty-state">
          <p>Failed to load schedules.</p>
        </div>
      `;
    }
  }

  _renderCreateTask() {
    const main = this.querySelector('main');
    const section = document.createElement('section');
    section.setAttribute('role', 'main');
    section.setAttribute('aria-label', 'Create Task');
    section.innerHTML = `
      <style>
        .create-task-page {
          padding: 2rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .create-task-page h2 {
          color: var(--text-color);
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-color);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.625rem;
          border: 1px solid var(--border-color);
          border-radius: 0.375rem;
          font-size: 0.875rem;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }

        .form-group textarea {
          min-height: 100px;
          resize: vertical;
        }

        .form-actions {
          margin-top: 1.5rem;
          display: flex;
          gap: 0.75rem;
        }

        .form-actions .btn-primary {
          flex: 1;
        }

        .form-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 0.375rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .form-success {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
          padding: 0.75rem;
          border-radius: 0.375rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .form-loading {
          opacity: 0.6;
          pointer-events: none;
        }
      </style>
      <div class="create-task-page">
        <h2>Create Task</h2>
        <div id="form-message" role="alert" aria-live="polite"></div>
        <form id="create-task-form" novalidate>
          <div class="form-group">
            <label for="task-title">Title *</label>
            <input type="text" id="task-title" name="title" required maxlength="100" aria-required="true" placeholder="e.g., Clean kitchen" />
          </div>
          <div class="form-group">
            <label for="task-description">Description</label>
            <textarea id="task-description" name="description" maxlength="500" placeholder="Optional details about the task"></textarea>
          </div>
          <div class="form-group">
            <label for="task-type">Task Type *</label>
            <select id="task-type" name="taskType" required aria-required="true">
              <option value="">Select type...</option>
              <option value="general_cleaning">General Cleaning</option>
              <option value="bathroom_cleaning">Bathroom Cleaning</option>
              <option value="kitchen_cleaning">Kitchen Cleaning</option>
              <option value="floor_care">Floor Care</option>
              <option value="window_cleaning">Window Cleaning</option>
            </select>
          </div>
          <div class="form-group">
            <label for="task-date">Scheduled Date *</label>
            <input type="date" id="task-date" name="scheduledDate" required aria-required="true" />
          </div>
          <div class="form-group">
            <label for="task-time">Scheduled Time</label>
            <input type="time" id="task-time" name="scheduledTime" />
          </div>
          <div class="form-group">
            <label for="task-cleaner">Assign to Cleaner *</label>
            <select id="task-cleaner" name="assignedTo" required aria-required="true">
              <option value="">Loading cleaners...</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary">Create Task</button>
            <button type="button" class="btn-secondary" id="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    `;

    const form = section.querySelector('#create-task-form');
    const messageDiv = section.querySelector('#form-message');
    const btnCancel = section.querySelector('#btn-cancel');
    const cleanerSelect = section.querySelector('#task-cleaner');

    this._loadCleaners(cleanerSelect);

    btnCancel.addEventListener('click', () => {
      eventBus.emit('navigate', { path: '/tasks' });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      messageDiv.textContent = '';
      messageDiv.className = '';
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.classList.add('form-loading');

      const title = form.querySelector('#task-title').value.trim();
      const description = form.querySelector('#task-description').value.trim();
      const taskType = form.querySelector('#task-type').value;
      const scheduledDate = form.querySelector('#task-date').value;
      const scheduledTime = form.querySelector('#task-time').value;
      const assignedTo = form.querySelector('#task-cleaner').value;

      if (!title || !taskType || !scheduledDate || !assignedTo) {
        messageDiv.textContent = 'Title, task type, date, and cleaner are required.';
        messageDiv.className = 'form-error';
        submitBtn.disabled = false;
        submitBtn.classList.remove('form-loading');
        return;
      }

      try {
        const createdTask = await api.createTask({
          title,
          description,
          taskType,
          scheduledDate,
          scheduledTime: scheduledTime || null,
          assignedTo,
          createdBy: localStorage.getItem('userId'),
        });
        messageDiv.textContent = 'Task created successfully!';
        messageDiv.className = 'form-success';
        setTimeout(() => {
          eventBus.emit('navigate', { path: '/tasks' });
        }, 1000);
      } catch (err) {
        messageDiv.textContent = err.message || 'Failed to create task.';
        messageDiv.className = 'form-error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('form-loading');
      }
    });

    main.appendChild(section);
  }

  async _loadCleaners(selectEl) {
    try {
      const users = await api.listUsers();
      const cleaners = users.filter(u => u.role === 'cleaner');
      selectEl.innerHTML = `
        <option value="">Select a cleaner...</option>
        ${cleaners.map(u => `
          <option value="${u.id}">${u.fullName} (${u.email})</option>
        `).join('')}
      `;
      if (cleaners.length === 0) {
        selectEl.innerHTML = '<option value="">No cleaners registered</option>';
      }
    } catch (err) {
      selectEl.innerHTML = '<option value="">Failed to load cleaners</option>';
    }
  }

  _updateHeader() {
    const header = this.querySelector('app-header');
    if (header) {
      header.dispatchEvent(new CustomEvent('app:navigate', { bubbles: true }));
    }
  }

  _formatTaskType(type) {
    const types = {
      general_cleaning: 'General',
      bathroom_cleaning: 'Bathroom',
      kitchen_cleaning: 'Kitchen',
      floor_care: 'Floor Care',
      window_cleaning: 'Window',
    };
    return types[type] || type;
  }

  _formatStatus(status) {
    const statuses = {
      pending: 'Pending',
      in_progress: 'In Progress',
      completed: 'Completed',
    };
    return statuses[status] || status;
  }

  _formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}

customElements.define('app-container', App);
