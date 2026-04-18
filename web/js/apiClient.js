const API_BASE = '/api';

class ApiClient {
    constructor(baseURL = API_BASE) {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        if (config.body && !(config.body instanceof FormData)) {
            config.body = JSON.stringify(config.body);
        }

        const response = await fetch(url, config);

        if (!response.ok) {
            const error = await response.text();
            const err = new Error(error);
            err.status = response.status;
            throw err;
        }

        if (response.status === 204) {
            return null;
        }

        return response.json();
    }

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    post(endpoint, body) {
        return this.request(endpoint, { method: 'POST', body });
    }

    put(endpoint, body) {
        return this.request(endpoint, { method: 'PUT', body });
    }

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

module.exports = { ApiClient };
