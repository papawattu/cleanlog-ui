const style = document.createElement('style');
style.textContent = `
.login-form {
    max-width: 24rem;
    margin: 2rem auto;
    padding: 1.5rem;
    background: white;
    border-radius: var(--radius);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.login-form h2 {
    margin-bottom: 1rem;
    color: var(--color-text);
}
.login-form .form-group {
    margin-bottom: 1rem;
}
.login-form label {
    display: block;
    margin-bottom: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
}
.login-form input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: var(--radius);
    font-size: 1rem;
}
.login-form button {
    width: 100%;
    padding: 0.5rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius);
    font-size: 1rem;
    cursor: pointer;
}
.login-form button:hover {
    background: var(--color-primary-dark);
}
.login-form .error {
    color: #dc2626;
    margin-top: 0.5rem;
    font-size: 0.875rem;
}
`;
document.head.appendChild(style);

class LoginForm extends HTMLElement {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    connectedCallback() {
        this.innerHTML = `
            <form class="login-form" @submit="handleSubmit">
                <h2>Login</h2>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit">Login</button>
                <div class="error"></div>
            </form>
        `;
    }

    async handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const errorDiv = form.querySelector('.error');
        errorDiv.textContent = '';

        const data = {
            email: form.email.value,
            password: form.password.value
        };

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            this.dispatchEvent(new CustomEvent('login-success', {
                bubbles: true,
                detail: await response.json()
            }));
        } catch (err) {
            errorDiv.textContent = err.message;
        }
    }
}

customElements.define('login-form', LoginForm);
