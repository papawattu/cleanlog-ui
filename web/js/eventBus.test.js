const { EventBus } = require('./eventBus.js');

describe('EventBus', () => {
    let bus;

    beforeEach(() => {
        bus = new EventBus();
    });

    afterEach(() => {
        bus.destroy();
    });

    it('should call callback when event is emitted', () => {
        const callback = jest.fn();
        bus.on('test-event', callback);
        bus.emit('test-event', { data: 'test' });

        expect(callback).toHaveBeenCalledWith({ data: 'test' });
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should support multiple listeners for same event', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();
        bus.on('test-event', callback1);
        bus.on('test-event', callback2);
        bus.emit('test-event');

        expect(callback1).toHaveBeenCalled();
        expect(callback2).toHaveBeenCalled();
    });

    it('should remove listener when unsubscribed', () => {
        const callback = jest.fn();
        bus.on('test-event', callback);
        bus.off('test-event', callback);
        bus.emit('test-event');

        expect(callback).not.toHaveBeenCalled();
    });

    it('should return unsubscribe function', () => {
        const callback = jest.fn();
        const unsubscribe = bus.on('test-event', callback);
        unsubscribe();
        bus.emit('test-event');

        expect(callback).not.toHaveBeenCalled();
    });

    it('should clear all events on destroy', () => {
        bus.on('test-event', jest.fn());
        bus.destroy();
        bus.emit('test-event');
    });
});
