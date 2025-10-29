import axios from 'axios';

const API_BASE_URL = 'http://localhost:6700/api/projects';

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

// Activity and Version API functions
export const getActivity = async (projectId, limit = 20) => {
  const response = await api.get(`/${projectId}/activity`, { params: { limit } });
  return response.data;
};

export const getVersions = async (projectId) => {
  const response = await api.get(`/${projectId}/versions`);
  return response.data;
};

export const restoreVersion = async (projectId, versionId) => {
  const response = await api.post(`/${projectId}/versions/restore/${versionId}`);
  return response.data;
};
