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

// File management API functions
export const createFile = async (projectId, fileData) => {
  const response = await api.post(`/${projectId}/files`, fileData);
  return response.data;
};

export const getFiles = async (projectId) => {
  const response = await api.get(`/${projectId}/files`);
  return response.data;
};

export const getFile = async (projectId, fileId) => {
  const response = await api.get(`/${projectId}/files/${fileId}`);
  return response.data;
};

export const getFileContent = async (projectId, fileId) => {
  const response = await api.get(`/${projectId}/files/${fileId}/content`);
  return response.data;
};

export const updateFileContent = async (projectId, fileId, content) => {
  const response = await api.put(`/${projectId}/files/${fileId}/content`, { content });
  return response.data;
};

export const renameFile = async (projectId, fileId, name) => {
  const response = await api.post(`/${projectId}/files/${fileId}/rename`, { name });
  return response.data;
};

export const updateFile = async (projectId, fileId, fileData) => {
  const response = await api.put(`/${projectId}/files/${fileId}`, fileData);
  return response.data;
};

export const deleteFile = async (projectId, fileId) => {
  const response = await api.delete(`/${projectId}/files/${fileId}`);
  return response.data;
};
