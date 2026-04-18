const style = document.createElement('style');
style.textContent = `
footer {
    background: #1e293b;
    color: #94a3b8;
    padding: 1rem 2rem;
    text-align: center;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 0.875rem;
}
`;
document.head.appendChild(style);

class AppFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                <p>&copy; 2024 Cleanlog</p>
            </footer>
        `;
    }
}

customElements.define('app-footer', AppFooter);
