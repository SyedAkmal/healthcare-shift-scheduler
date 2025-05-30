import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as calendarService from '../../services/calendarService';
import { showNotification } from './uiSlice';

// Async thunks
export const fetchEvents = createAsyncThunk(
  'calendar/fetchEvents',
  async ({ start, view, filters }, { rejectWithValue, dispatch }) => {
    try {
      const response = await calendarService.getEvents(start, view, filters);
      return response;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.message || 'Failed to fetch events'
      }));
      return rejectWithValue(error.message);
    }
  }
);

export const createEvent = createAsyncThunk(
  'calendar/createEvent',
  async (eventData, { rejectWithValue, dispatch }) => {
    try {
      const response = await calendarService.createEvent(eventData);
      dispatch(showNotification({
        type: 'success',
        message: 'Event created successfully'
      }));
      return response;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.message || 'Failed to create event'
      }));
      return rejectWithValue(error.message);
    }
  }
);

export const updateEvent = createAsyncThunk(
  'calendar/updateEvent',
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await calendarService.updateEvent(id, data);
      dispatch(showNotification({
        type: 'success',
        message: 'Event updated successfully'
      }));
      return response;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.message || 'Failed to update event'
      }));
      return rejectWithValue(error.message);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'calendar/deleteEvent',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await calendarService.deleteEvent(id);
      dispatch(showNotification({
        type: 'success',
        message: 'Event deleted successfully'
      }));
      return id;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.message || 'Failed to delete event'
      }));
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  // Calendar data
  events: [],
  currentDate: new Date().toISOString(),
  selectedEvent: null,
  
  // View settings
  currentView: 'dayGridMonth',
  viewPreferences: {
    showWeekends: true,
    showWeekNumbers: true,
    firstDay: 1,
    businessHours: {
      startTime: '06:00',
      endTime: '22:00'
    }
  },
  
  // Filters
  filters: {
    shiftTypes: ['Morning', 'Afternoon', 'Night'],
    departments: [],
    staffRoles: [],
    attendanceStatus: 'all',
    showConflictsOnly: false,
    showUnstaffedOnly: false
  },
  
  // UI state
  sidebarOpen: false,
  loading: {
    events: false,
    eventDetails: false
  },
  
  // Search
  searchQuery: '',
  searchResults: [],
  
  // Export/Print
  exportFormat: 'pdf',
  printOptions: {
    includeStaff: true,
    includeAttendance: true,
    colorPrint: true
  }
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
    setCurrentDate: (state, action) => {
      state.currentDate = action.payload;
    },
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
      state.sidebarOpen = true;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setViewPreferences: (state, action) => {
      state.viewPreferences = { ...state.viewPreferences, ...action.payload };
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setPrintOptions: (state, action) => {
      state.printOptions = { ...state.printOptions, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.loading.events = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload;
        state.loading.events = false;
      })
      .addCase(fetchEvents.rejected, (state) => {
        state.loading.events = false;
      })

      // Create event
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })

      // Update event
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })

      // Delete event
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(e => e.id !== action.payload);
        if (state.selectedEvent?.id === action.payload) {
          state.selectedEvent = null;
          state.sidebarOpen = false;
        }
      });
  }
});

export const {
  setCurrentView,
  setCurrentDate,
  setSelectedEvent,
  setSidebarOpen,
  setFilters,
  setViewPreferences,
  setSearchQuery,
  setPrintOptions
} = calendarSlice.actions;

export default calendarSlice.reducer; 