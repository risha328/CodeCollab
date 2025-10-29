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

export const createProject = async (projectData) => {
  const response = await api.post('/', projectData);
  return response.data;
};

export const getProjects = async () => {
  const response = await api.get('/');
  return response.data;
};

export const getProject = async (projectId) => {
  const response = await api.get(`/${projectId}`);
  return response.data;
};

export const updateProject = async (projectId, projectData) => {
  const response = await api.put(`/${projectId}`, projectData);
  return response.data;
};

export const deleteProject = async (projectId) => {
  const response = await api.delete(`/${projectId}`);
  return response.data;
};

export const addCollaborator = async (projectId, userIdOrEmail) => {
  const response = await api.post(`/${projectId}/collaborators`, { userId: userIdOrEmail });
  return response.data;
};

export const searchUsers = async (query) => {
  const response = await api.get('/search-users', { params: { q: query } });
  return response.data;
};

export const getCollaborators = async (projectId) => {
  const response = await api.get(`/${projectId}/collaborators`);
  return response.data;
};

export const removeCollaborator = async (projectId, userId) => {
  const response = await api.delete(`/${projectId}/collaborators/${userId}`);
  return response.data;
};

export const getProjectSettings = async (projectId) => {
  const response = await api.get(`/${projectId}/settings`);
  return response.data;
};

export const updateProjectSettings = async (projectId, settings) => {
  const response = await api.put(`/${projectId}/settings`, settings);
  return response.data;
};

export const searchProjects = async (query) => {
  const response = await api.get('/search', { params: { q: query } });
  return response.data;
};

export const searchProjectFiles = async (projectId, query) => {
  const response = await api.get(`/${projectId}/files/search`, { params: { q: query } });
  return response.data;
};
