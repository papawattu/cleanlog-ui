class AppFooter extends HTMLElement {
  constructor() {
    super();
    this._render();
  }

  _render() {
    this.innerHTML = `
      <style>
        :root {
          --bg-dark: #1e293b;
          --text-light: #94a3b8;
        }

        footer {
          background: var(--bg-dark);
          color: white;
          padding: 1.5rem 2rem;
          text-align: center;
          margin-top: auto;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .footer-links a {
          color: var(--text-light);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: white;
        }

        .copyright {
          color: var(--text-light);
          font-size: 0.75rem;
        }

        @media (max-width: 640px) {
          footer {
            padding: 1rem;
          }
        }
      </style>
      <div class="footer-content">
        <div class="footer-links">
          <a href="#" aria-label="About Cleanlog">About</a>
          <a href="#" aria-label="Contact us">Contact</a>
          <a href="#" aria-label="Privacy policy">Privacy</a>
          <a href="#" aria-label="Terms of service">Terms</a>
        </div>
        <p class="copyright">&copy; ${new Date().getFullYear()} Cleanlog. All rights reserved.</p>
      </div>
    `;

    const links = this.querySelectorAll('.footer-links a');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
      });
    });
  }
}

customElements.define('app-footer', AppFooter);
