import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (name, email, password, phone) =>
    api.post('/auth/register', { name, email, password, phone }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getMe: () =>
    api.get('/auth/me'),
};

export const advisoryService = {
  createRequest: (title, description) =>
    api.post('/advisory', { title, description }),
  getMyRequests: () =>
    api.get('/advisory/my-requests'),
  getRequestById: (id) =>
    api.get(`/advisory/${id}`),
  updateRequest: (id, data) =>
    api.put(`/advisory/${id}`, data),
};

export const adminService = {
  getAllUsers: (role, status) =>
    api.get('/admin/users', { params: { role, status } }),
  getUserById: (id) =>
    api.get(`/admin/users/${id}`),
  updateUserStatus: (id, status) =>
    api.put(`/admin/users/${id}`, { status }),
  deleteUser: (id) =>
    api.delete(`/admin/users/${id}`),
  getDashboardStats: () =>
    api.get('/admin/dashboard/stats'),
  getAllRequests: (status, priority) =>
    api.get('/admin/requests', { params: { status, priority } }),
  updateRequestStatus: (id, data) =>
    api.put(`/admin/requests/${id}`, data),
  deleteRequest: (id) =>
    api.delete(`/admin/requests/${id}`),
};

export const resourceService = {
  getAllResources: (category) =>
    api.get('/resources', { params: { category } }),
  createResource: (data) =>
    api.post('/resources', data),
  updateResource: (id, data) =>
    api.put(`/resources/${id}`, data),
  deleteResource: (id) =>
    api.delete(`/resources/${id}`),
};

export const testimonialService = {
  getApproved: () =>
    api.get('/testimonials'),
  getMy: () =>
    api.get('/testimonials/my'),
  create: (text, rating) =>
    api.post('/testimonials', { text, rating }),
  // Admin
  getAll: () =>
    api.get('/testimonials/admin'),
  updateStatus: (id, status) =>
    api.put(`/testimonials/${id}`, { status }),
};

export default api;
