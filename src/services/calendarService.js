import api from './api';

// Helper function to format date range for API
const formatDateRange = (start, view) => {
  const startDate = new Date(start);
  const endDate = new Date(start);

  switch (view) {
    case 'dayGridMonth':
      endDate.setMonth(endDate.getMonth() + 1);
      break;
    case 'timeGridWeek':
    case 'listWeek':
      endDate.setDate(endDate.getDate() + 7);
      break;
    case 'timeGridDay':
      endDate.setDate(endDate.getDate() + 1);
      break;
    default:
      endDate.setMonth(endDate.getMonth() + 1);
  }

  return {
    start: startDate.toISOString(),
    end: endDate.toISOString()
  };
};

// Get events for a date range
export const getEvents = async (start, view, filters = {}) => {
  const dateRange = formatDateRange(start, view);
  const response = await api.get('/calendar/events', {
    params: {
      ...dateRange,
      ...filters
    }
  });
  return response.data;
};

// Get a single event by ID
export const getEvent = async (id) => {
  const response = await api.get(`/calendar/events/${id}`);
  return response.data;
};

// Create a new event
export const createEvent = async (eventData) => {
  const response = await api.post('/calendar/events', eventData);
  return response.data;
};

// Update an existing event
export const updateEvent = async (id, data) => {
  const response = await api.put(`/calendar/events/${id}`, data);
  return response.data;
};

// Delete an event
export const deleteEvent = async (id) => {
  await api.delete(`/calendar/events/${id}`);
};

// Bulk update events
export const bulkUpdateEvents = async (events) => {
  const response = await api.post('/calendar/events/bulk', events);
  return response.data;
};

// Export calendar events
export const exportCalendar = async (format, dateRange, options = {}) => {
  const response = await api.get('/calendar/export', {
    params: {
      format,
      ...dateRange,
      ...options
    },
    responseType: 'blob'
  });
  return response.data;
};

// Import calendar events
export const importCalendar = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/calendar/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Search events
export const searchEvents = async (query, filters = {}) => {
  const response = await api.get('/calendar/search', {
    params: {
      q: query,
      ...filters
    }
  });
  return response.data;
};

// Get recurring events
export const getRecurringEvents = async (seriesId) => {
  const response = await api.get(`/calendar/recurring/${seriesId}`);
  return response.data;
};

// Update recurring event series
export const updateRecurringSeries = async (seriesId, data) => {
  const response = await api.put(`/calendar/recurring/${seriesId}`, data);
  return response.data;
}; 