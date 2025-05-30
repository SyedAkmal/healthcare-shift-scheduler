import axios from 'axios';
import { API_BASE_URL } from '../config/api';

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

// Get all staff members with optional filters
export const getAllStaff = async (params) => {
  try {
    const { page = 1, limit = 10, search = '', role = '', department = '', sort = 'name', order = 'asc' } = params;
    const response = await axiosInstance.get('/api/staff', {
      params: {
        page,
        limit,
        search,
        role,
        department,
        sort,
        order
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch staff list';
  }
};

// Get a single staff member by ID
export const getStaffById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/staff/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch staff member';
  }
};

// Create a new staff member
export const createStaff = async (staffData) => {
  try {
    const response = await axiosInstance.post('/api/staff', staffData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create staff member';
  }
};

// Update a staff member
export const updateStaff = async (id, staffData) => {
  try {
    const response = await axiosInstance.put(`/api/staff/${id}`, staffData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update staff member';
  }
};

// Delete a staff member
export const deleteStaff = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/staff/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete staff member';
  }
};

// Bulk delete staff members
export const bulkDeleteStaff = async (ids) => {
  try {
    const response = await axiosInstance.delete('/api/staff/bulk', { data: { ids } });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete staff members';
  }
};

// Search staff members
export const searchStaff = async (query) => {
  const response = await axiosInstance.get('/api/staff/search', { params: { query } });
  return response.data;
};

// Get staff availability for a date range
export const getStaffAvailability = async (startDate, endDate) => {
  const response = await axiosInstance.get('/api/staff/availability', {
    params: { startDate, endDate },
  });
  return response.data;
};

export const getRoles = async () => {
  try {
    const response = await axiosInstance.get('/api/staff/roles');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch roles';
  }
};

export const getDepartments = async () => {
  try {
    const response = await axiosInstance.get('/api/staff/departments');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch departments';
  }
}; 