const style = document.createElement('style');
style.textContent = `
.register-form {
    max-width: 24rem;
    margin: 2rem auto;
    padding: 1.5rem;
    background: white;
    border-radius: var(--radius);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.register-form h2 {
    margin-bottom: 1rem;
    color: var(--color-text);
}
.register-form .form-group {
    margin-bottom: 1rem;
}
.register-form label {
    display: block;
    margin-bottom: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
}
.register-form input,
.register-form select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: var(--radius);
    font-size: 1rem;
}
.register-form button {
    width: 100%;
    padding: 0.5rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius);
    font-size: 1rem;
    cursor: pointer;
}
.register-form button:hover {
    background: var(--color-primary-dark);
}
.register-form .error {
    color: #dc2626;
    margin-top: 0.5rem;
    font-size: 0.875rem;
}
`;
document.head.appendChild(style);

class RegistrationForm extends HTMLElement {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    connectedCallback() {
        this.innerHTML = `
            <form class="register-form" @submit="handleSubmit">
                <h2>Register</h2>
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div class="form-group">
                    <label for="role">Role</label>
                    <select id="role" name="role" required>
                        <option value="cleaner">Cleaner</option>
                        <option value="owner">Owner</option>
                    </select>
                </div>
                <button type="submit">Register</button>
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
            name: form.name.value,
            email: form.email.value,
            password: form.password.value,
            role: form.role.value
        };

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            this.dispatchEvent(new CustomEvent('register-success', {
                bubbles: true,
                detail: await response.json()
            }));
        } catch (err) {
            errorDiv.textContent = err.message;
        }
    }
}

customElements.define('registration-form', RegistrationForm);
