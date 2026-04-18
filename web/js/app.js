import './header.js';
import './footer.js';
import './login-form.js';
import './registration-form.js';
import './eventBus.js';
import './apiClient.js';
import './router.js';

const style = document.createElement('style');
style.textContent = `
.page {
    max-width: 48rem;
    margin: 2rem auto;
}
.nav-links {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}
.nav-links a {
    padding: 0.5rem 1rem;
    background: var(--color-primary);
    color: white;
    text-decoration: none;
    border-radius: var(--radius);
}
.nav-links a:hover {
    background: var(--color-primary-dark);
}
`;
document.head.appendChild(style);

class App extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="page">
                <h1>Welcome to Cleanlog</h1>
                <p>Your house cleaning management application.</p>
                <div class="nav-links">
                    <a href="#/login">Login</a>
                    <a href="#/register">Register</a>
                </div>
            </div>
        `;
    }
}

customElements.define('app-root', App);
