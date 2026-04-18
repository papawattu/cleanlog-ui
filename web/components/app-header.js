class AppHeader extends HTMLElement {
  constructor() {
    super();
    this._render();
  }

  connectedCallback() {
    this._updateAuthState();
    eventBus.on('auth:changed', () => this._updateAuthState());
  }

  disconnectedCallback() {
    eventBus.off('auth:changed', () => this._updateAuthState());
  }

  _updateAuthState() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const fullName = localStorage.getItem('fullName');
    this._user = { token, role, fullName };
    this._render();
  }

  _handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    eventBus.emit('auth:changed');
    eventBus.emit('navigate', { path: '/' });
  }

  _handleLogin() {
    eventBus.emit('navigate', { path: '/login' });
  }

  _handleRegister() {
    eventBus.emit('navigate', { path: '/register' });
  }

  _handleDashboard() {
    eventBus.emit('navigate', { path: '/dashboard' });
  }

  _render() {
    const { token, role, fullName } = this._user || {};
    const isLoggedIn = !!token;

    this.innerHTML = `
      <style>
        :root {
          --primary-color: #2563eb;
          --primary-hover: #1d4ed8;
          --bg-color: #f8fafc;
          --text-color: #1e293b;
          --border-color: #e2e8f0;
        }

        header {
          background: var(--primary-color);
          color: white;
          padding: 0.75rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          cursor: pointer;
          user-select: none;
        }

        nav {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        nav a, nav button {
          color: white;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        nav a:hover, nav button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-name {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        @media (max-width: 640px) {
          header {
            padding: 0.75rem 1rem;
            flex-direction: column;
            gap: 0.75rem;
          }
        }
      </style>
      <div class="logo" tabindex="0" role="button" aria-label="Go to dashboard">
        Cleanlog
      </div>
      <nav role="navigation" aria-label="Main navigation">
        ${isLoggedIn ? `
          <a href="#" onclick="event.preventDefault()" role="button">Dashboard</a>
          <div class="user-info">
            <span class="user-name">${fullName || 'User'}</span>
            <button onclick="this.dispatchEvent(new CustomEvent('cleanlog-logout'))" aria-label="Logout">Logout</button>
          </div>
        ` : `
          <a href="#" onclick="event.preventDefault()" role="button">Login</a>
          <a href="#" onclick="event.preventDefault()" role="button">Register</a>
        `}
      </nav>
    `;

    const logo = this.querySelector('.logo');
    if (logo) {
      logo.addEventListener('click', () => {
        if (isLoggedIn) {
          eventBus.emit('navigate', { path: '/dashboard' });
        } else {
          eventBus.emit('navigate', { path: '/' });
        }
      });
      logo.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          logo.click();
        }
      });
    }

    const logoutBtn = this.querySelector('button[aria-label="Logout"]');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this._handleLogout());
    }

    const loginLinks = this.querySelectorAll('a[role="button"]');
    if (!isLoggedIn && loginLinks.length > 0) {
      const loginLink = Array.from(loginLinks).find(link => link.textContent.trim() === 'Login');
      const registerLink = Array.from(loginLinks).find(link => link.textContent.trim() === 'Register');
      if (loginLink) {
        loginLink.addEventListener('click', (e) => {
          e.preventDefault();
          this._handleLogin();
        });
      }
      if (registerLink) {
        registerLink.addEventListener('click', (e) => {
          e.preventDefault();
          this._handleRegister();
        });
      }
    }
  }
}

customElements.define('app-header', AppHeader);
