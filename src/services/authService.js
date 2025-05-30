import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // Store user data if available in response
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed. Please try again.';
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await axiosInstance.get('/api/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get user data';
  }
}; 