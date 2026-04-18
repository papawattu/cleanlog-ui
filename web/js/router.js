class Router {
    constructor() {
        this.routes = new Map();
        this.currentPage = null;
        this.init();
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    }

    get(route, handler) {
        this.routes.set(route, handler);
    }

    navigate(route) {
        window.location.hash = route;
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const handler = this.routes.get(hash);

        if (handler) {
            if (this.currentPage && typeof this.currentPage.disconnect === 'function') {
                this.currentPage.remove();
            }
            this.currentPage = handler();
        }
    }
}

const router = new Router();

if (typeof window !== 'undefined') {
    window.router = router;
}

export { Router };
export default router;
