const { ApiClient } = require('./apiClient.js');

describe('ApiClient', () => {
    let client;

    beforeEach(() => {
        client = new ApiClient();
    });

    it('should send GET request with correct headers', async () => {
        global.fetch = jest.fn(() => Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ data: 'test' }),
        }));

        const result = await client.get('/test');

        expect(fetch).toHaveBeenCalledWith('/api/test', {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET',
        });
        expect(result).toEqual({ data: 'test' });
    });

    it('should send POST request with body', async () => {
        global.fetch = jest.fn(() => Promise.resolve({
            ok: true,
            status: 201,
            json: () => Promise.resolve({ id: '123' }),
        }));

        const result = await client.post('/test', { name: 'test' });

        expect(fetch).toHaveBeenCalledWith('/api/test', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ name: 'test' }),
        });
        expect(result).toEqual({ id: '123' });
    });

    it('should throw error on non-OK response', async () => {
        global.fetch = jest.fn(() => Promise.resolve({
            ok: false,
            status: 400,
            text: () => Promise.resolve('bad request'),
        }));

        await expect(client.get('/test')).rejects.toThrow('bad request');
    });

    it('should return null for 204 response', async () => {
        global.fetch = jest.fn(() => Promise.resolve({
            ok: true,
            status: 204,
        }));

        const result = await client.delete('/test');
        expect(result).toBeNull();
    });
});
