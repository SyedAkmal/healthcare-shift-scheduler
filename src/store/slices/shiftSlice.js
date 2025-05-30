import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as shiftService from '../../services/shiftService';
import { showNotification } from './uiSlice';

// Async thunks
export const fetchShifts = createAsyncThunk(
  'shifts/fetchShifts',
  async ({ date, range }, { rejectWithValue }) => {
    try {
      const response = await shiftService.getShifts(date, range);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createShift = createAsyncThunk(
  'shifts/createShift',
  async (shiftData, { rejectWithValue, dispatch }) => {
    try {
      const response = await shiftService.createShift(shiftData);
      dispatch(showNotification({
        type: 'success',
        message: 'Shift created successfully'
      }));
      return response;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.message || 'Failed to create shift'
      }));
      return rejectWithValue(error.message);
    }
  }
);

export const updateShift = createAsyncThunk(
  'shifts/updateShift',
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await shiftService.updateShift(id, data);
      dispatch(showNotification({
        type: 'success',
        message: 'Shift updated successfully'
      }));
      return response;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.message || 'Failed to update shift'
      }));
      return rejectWithValue(error.message);
    }
  }
);

export const deleteShift = createAsyncThunk(
  'shifts/deleteShift',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await shiftService.deleteShift(id);
      dispatch(showNotification({
        type: 'success',
        message: 'Shift deleted successfully'
      }));
      return id;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.message || 'Failed to delete shift'
      }));
      return rejectWithValue(error.message);
    }
  }
);

export const assignStaff = createAsyncThunk(
  'shifts/assignStaff',
  async ({ shiftId, staffId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await shiftService.assignStaff(shiftId, staffId);
      dispatch(showNotification({
        type: 'success',
        message: 'Staff assigned successfully'
      }));
      return response;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.message || 'Failed to assign staff'
      }));
      return rejectWithValue(error.message);
    }
  }
);

export const unassignStaff = createAsyncThunk(
  'shifts/unassignStaff',
  async ({ shiftId, staffId }, { rejectWithValue, dispatch }) => {
    try {
      await shiftService.unassignStaff(shiftId, staffId);
      dispatch(showNotification({
        type: 'success',
        message: 'Staff unassigned successfully'
      }));
      return { shiftId, staffId };
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.message || 'Failed to unassign staff'
      }));
      return rejectWithValue(error.message);
    }
  }
);

export const checkConflicts = createAsyncThunk(
  'shifts/checkConflicts',
  async ({ shiftId, staffId }, { rejectWithValue }) => {
    try {
      const response = await shiftService.checkConflicts(shiftId, staffId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCapacityStatus = createAsyncThunk(
  'shifts/fetchCapacityStatus',
  async (date, { rejectWithValue }) => {
    try {
      const response = await shiftService.getCapacityStatus(date);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const applyTemplate = createAsyncThunk(
  'shifts/applyTemplate',
  async ({ templateId, dates }, { rejectWithValue, dispatch }) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      const templateShifts = {
        weekday: [
          { type: 'Morning', startTime: '06:00', endTime: '14:00', capacity: 5 },
          { type: 'Afternoon', startTime: '14:00', endTime: '22:00', capacity: 5 },
          { type: 'Night', startTime: '22:00', endTime: '06:00', capacity: 3 }
        ],
        weekend: [
          { type: 'Morning', startTime: '07:00', endTime: '15:00', capacity: 3 },
          { type: 'Afternoon', startTime: '15:00', endTime: '23:00', capacity: 3 },
          { type: 'Night', startTime: '23:00', endTime: '07:00', capacity: 2 }
        ],
        custom: [
          { type: 'Morning', startTime: '08:00', endTime: '16:00', capacity: 4 },
          { type: 'Afternoon', startTime: '16:00', endTime: '00:00', capacity: 4 }
        ]
      };

      const template = templateShifts[templateId];
      if (!template) {
        throw new Error('Invalid template');
      }

      const createdShifts = [];
      for (const date of dates) {
        for (const shift of template) {
          const shiftData = {
            date: date.toISOString().split('T')[0],
            ...shift
          };
          const response = await shiftService.createShift(shiftData);
          createdShifts.push(response);
        }
      }

      dispatch(showNotification({
        type: 'success',
        message: 'Template applied successfully'
      }));

      return createdShifts;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.message || 'Failed to apply template'
      }));
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  // Shift data
  shifts: [],
  selectedDate: new Date().toISOString().split('T')[0],
  selectedShift: null,
  
  // Staff assignment
  availableStaff: [],
  assignedStaff: {},
  staffAvailability: {},
  
  // Capacity tracking
  capacityStatus: {
    morning: { current: 0, required: 5, percentage: 0 },
    afternoon: { current: 0, required: 5, percentage: 0 },
    night: { current: 0, required: 5, percentage: 0 }
  },
  
  // Conflicts
  conflicts: [],
  activeConflicts: [],
  
  // UI state
  loading: {
    shifts: false,
    staff: false,
    assignment: false
  },
  errors: {
    shifts: null,
    staff: null,
    assignment: null,
    template: null
  },
  
  // Calendar view
  calendarView: 'week',
  calendarEvents: [],
  
  // Filters
  filters: {
    role: '',
    department: '',
    availability: '',
    shiftType: ''
  },
  
  // Real-time updates
  lastUpdated: null,
  websocketConnected: false
};

const shiftSlice = createSlice({
  name: 'shifts',
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setSelectedShift: (state, action) => {
      state.selectedShift = action.payload;
    },
    setCalendarView: (state, action) => {
      state.calendarView = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    updateWebsocketStatus: (state, action) => {
      state.websocketConnected = action.payload;
    },
    updateLastUpdated: (state) => {
      state.lastUpdated = new Date().toISOString();
    },
    addConflict: (state, action) => {
      state.conflicts.push(action.payload);
      state.activeConflicts = state.conflicts.filter(c => !c.resolved);
    },
    resolveConflict: (state, action) => {
      const conflict = state.conflicts.find(c => c.id === action.payload);
      if (conflict) {
        conflict.resolved = true;
        state.activeConflicts = state.conflicts.filter(c => !c.resolved);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch shifts
      .addCase(fetchShifts.pending, (state) => {
        state.loading.shifts = true;
      })
      .addCase(fetchShifts.fulfilled, (state, action) => {
        state.loading.shifts = false;
        state.shifts = action.payload;
        state.calendarEvents = action.payload.map(shift => ({
          id: shift.id,
          title: `${shift.type} Shift`,
          start: shift.startTime,
          end: shift.endTime,
          color: shift.type === 'Morning' ? '#ffc107' : 
                 shift.type === 'Afternoon' ? '#007bff' : '#6f42c1',
          extendedProps: { ...shift }
        }));
      })
      .addCase(fetchShifts.rejected, (state, action) => {
        state.loading.shifts = false;
        state.errors.shifts = action.payload;
      })

      // Create shift
      .addCase(createShift.fulfilled, (state, action) => {
        state.shifts.push(action.payload);
        state.calendarEvents.push({
          id: action.payload.id,
          title: `${action.payload.type} Shift`,
          start: action.payload.startTime,
          end: action.payload.endTime,
          color: action.payload.type === 'Morning' ? '#ffc107' : 
                 action.payload.type === 'Afternoon' ? '#007bff' : '#6f42c1',
          extendedProps: { ...action.payload }
        });
      })

      // Update shift
      .addCase(updateShift.fulfilled, (state, action) => {
        const index = state.shifts.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.shifts[index] = action.payload;
          state.calendarEvents = state.calendarEvents.map(event => 
            event.id === action.payload.id ? {
              ...event,
              title: `${action.payload.type} Shift`,
              start: action.payload.startTime,
              end: action.payload.endTime,
              color: action.payload.type === 'Morning' ? '#ffc107' : 
                     action.payload.type === 'Afternoon' ? '#007bff' : '#6f42c1',
              extendedProps: { ...action.payload }
            } : event
          );
        }
      })

      // Delete shift
      .addCase(deleteShift.fulfilled, (state, action) => {
        state.shifts = state.shifts.filter(s => s.id !== action.payload);
        state.calendarEvents = state.calendarEvents.filter(e => e.id !== action.payload);
      })

      // Assign staff
      .addCase(assignStaff.fulfilled, (state, action) => {
        const { shiftId, staffMember } = action.payload;
        if (!state.assignedStaff[shiftId]) {
          state.assignedStaff[shiftId] = [];
        }
        state.assignedStaff[shiftId].push(staffMember);
        
        // Update capacity
        const shift = state.shifts.find(s => s.id === shiftId);
        if (shift) {
          const type = shift.type.toLowerCase();
          state.capacityStatus[type].current += 1;
          state.capacityStatus[type].percentage = 
            (state.capacityStatus[type].current / state.capacityStatus[type].required) * 100;
        }
      })

      // Unassign staff
      .addCase(unassignStaff.fulfilled, (state, action) => {
        const { shiftId, staffId } = action.payload;
        if (state.assignedStaff[shiftId]) {
          state.assignedStaff[shiftId] = state.assignedStaff[shiftId]
            .filter(staff => staff.id !== staffId);
          
          // Update capacity
          const shift = state.shifts.find(s => s.id === shiftId);
          if (shift) {
            const type = shift.type.toLowerCase();
            state.capacityStatus[type].current -= 1;
            state.capacityStatus[type].percentage = 
              (state.capacityStatus[type].current / state.capacityStatus[type].required) * 100;
          }
        }
      })

      // Check conflicts
      .addCase(checkConflicts.fulfilled, (state, action) => {
        state.conflicts = action.payload;
        state.activeConflicts = action.payload.filter(c => !c.resolved);
      })

      // Fetch capacity status
      .addCase(fetchCapacityStatus.fulfilled, (state, action) => {
        state.capacityStatus = action.payload;
      })

      // Apply template
      .addCase(applyTemplate.pending, (state) => {
        state.loading.shifts = true;
        state.errors.template = null;
      })
      .addCase(applyTemplate.fulfilled, (state, action) => {
        state.loading.shifts = false;
        state.shifts = [...state.shifts, ...action.payload];
        state.errors.template = null;
      })
      .addCase(applyTemplate.rejected, (state, action) => {
        state.loading.shifts = false;
        state.errors.template = action.payload;
      });
  }
});

export const {
  setSelectedDate,
  setSelectedShift,
  setCalendarView,
  setFilters,
  clearFilters,
  updateWebsocketStatus,
  updateLastUpdated,
  addConflict,
  resolveConflict
} = shiftSlice.actions;

export default shiftSlice.reducer; 