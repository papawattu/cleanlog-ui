class EventBus {
    constructor() {
        this.events = new Map();
    }

    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(callback);
        return () => this.off(event, callback);
    }

    off(event, callback) {
        const callbacks = this.events.get(event);
        if (callbacks) {
            this.events.set(event, callbacks.filter(cb => cb !== callback));
        }
    }

    emit(event, data) {
        const callbacks = this.events.get(event);
        if (callbacks) {
            callbacks.forEach(callback => callback(data));
        }
    }

    destroy() {
        this.events.clear();
    }
}

module.exports = { EventBus };
