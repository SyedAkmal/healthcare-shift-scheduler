import api from './api';

const staffService = {
  // Get all staff members with optional filters
  getAllStaff: async (filters = {}) => {
    const response = await api.get('/staff', { params: filters });
    return response.data;
  },

  // Get a single staff member by ID
  getStaffById: async (id) => {
    const response = await api.get(`/staff/${id}`);
    return response.data;
  },

  // Create a new staff member
  createStaff: async (staffData) => {
    const response = await api.post('/staff', staffData);
    return response.data;
  },

  // Update a staff member
  updateStaff: async (id, staffData) => {
    const response = await api.put(`/staff/${id}`, staffData);
    return response.data;
  },

  // Delete a staff member
  deleteStaff: async (id) => {
    const response = await api.delete(`/staff/${id}`);
    return response.data;
  },

  // Bulk delete staff members
  bulkDeleteStaff: async (ids) => {
    const response = await api.post('/staff/bulk-delete', { ids });
    return response.data;
  },

  // Search staff members
  searchStaff: async (query) => {
    const response = await api.get('/staff/search', { params: { query } });
    return response.data;
  },

  // Get staff availability for a date range
  getStaffAvailability: async (startDate, endDate) => {
    const response = await api.get('/staff/availability', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};

export default staffService; 