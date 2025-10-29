import axios from 'axios';

const API_BASE_URL = 'http://localhost:6700/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const executeCode = async (projectId, code, language) => {
  const response = await api.post('/editor/execute', { projectId, code, language });
  return response.data;
};
