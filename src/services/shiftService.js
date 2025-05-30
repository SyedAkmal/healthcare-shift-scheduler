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

// Get shifts with optional date range
export const getShifts = async (date, range) => {
  try {
    const response = await axiosInstance.get('/api/shifts', {
      params: { date, range }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch shifts';
  }
};

// Create a new shift
export const createShift = async (shiftData) => {
  try {
    const response = await axiosInstance.post('/api/shifts', shiftData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create shift';
  }
};

// Update a shift
export const updateShift = async (id, shiftData) => {
  try {
    const response = await axiosInstance.put(`/api/shifts/${id}`, shiftData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update shift';
  }
};

// Delete a shift
export const deleteShift = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/shifts/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete shift';
  }
};

// Assign staff to shift
export const assignStaff = async (shiftId, staffId) => {
  try {
    const response = await axiosInstance.post(`/api/shifts/${shiftId}/assign`, { staffId });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to assign staff';
  }
};

// Unassign staff from shift
export const unassignStaff = async (shiftId, staffId) => {
  try {
    const response = await axiosInstance.delete(`/api/shifts/${shiftId}/staff/${staffId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to unassign staff';
  }
};

// Bulk assign staff to shift
export const bulkAssignStaff = async (shiftId, staffIds) => {
  try {
    const response = await axiosInstance.post(`/api/shifts/${shiftId}/assign/bulk`, { staffIds });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to bulk assign staff';
  }
};

// Get capacity status
export const getCapacityStatus = async (date) => {
  try {
    const response = await axiosInstance.get('/api/shifts/capacity', {
      params: { date }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch capacity status';
  }
};

// Check for conflicts
export const checkConflicts = async (shiftId, staffId) => {
  try {
    const response = await axiosInstance.post('/api/shifts/conflicts/check', {
      shiftId,
      staffId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to check conflicts';
  }
};

// Get shift templates
export const getShiftTemplates = async () => {
  try {
    const response = await axiosInstance.get('/api/shifts/templates');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch shift templates';
  }
};

// Apply shift template
export const applyTemplate = async (templateId, dates) => {
  try {
    const response = await axiosInstance.post('/api/shifts/apply-template', {
      templateId,
      dates
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to apply template';
  }
};

// Get staff availability
export const getStaffAvailability = async (date, staffIds) => {
  try {
    const response = await axiosInstance.get('/api/staff/availability', {
      params: { date, staffIds }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch staff availability';
  }
}; 