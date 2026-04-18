const API_BASE = '';

async function apiRequest(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const config = {
    headers,
    ...options,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

const api = {
  get: (path) => apiRequest(path, { method: 'GET' }),

  post: (path, body) => apiRequest(path, {
    method: 'POST',
    body,
  }),

  put: (path, body) => apiRequest(path, {
    method: 'PUT',
    body,
  }),

  delete: (path) => apiRequest(path, { method: 'DELETE' }),

  register: (data) => api.post('/register', data),

  login: (data) => api.post('/login', data),

  createTask: (data) => api.post('/tasks', data),

  listTasks: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/tasks${query ? '?' + query : ''}`);
  },

  completeTask: (taskId) => api.post(`/tasks/complete/${taskId}`),

  updateTaskStatus: (taskId, status) => api.post(`/tasks/status/${taskId}`, { status }),

  deleteTask: (taskId) => api.post(`/tasks/delete/${taskId}`),

  createSchedule: (data) => api.post('/schedules', data),

  listSchedules: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/schedules${query ? '?' + query : ''}`);
  },

  updateSchedule: (scheduleId, data) => api.post(`/schedules/${scheduleId}`, data),

  deleteSchedule: (scheduleId) => api.post(`/schedules/delete/${scheduleId}`),

  listUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/users/list${query ? '?' + query : ''}`);
  },
};

export { apiRequest, api };
