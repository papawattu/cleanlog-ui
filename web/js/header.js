const style = document.createElement('style');
style.textContent = `
header {
    background: #2563eb;
    color: white;
    padding: 1rem 2rem;
    font-family: system-ui, -apple-system, sans-serif;
}
`;
document.head.appendChild(style);

class AppHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <nav>
                <h1>Cleanlog</h1>
            </nav>
        `;
    }
}

customElements.define('app-header', AppHeader);
