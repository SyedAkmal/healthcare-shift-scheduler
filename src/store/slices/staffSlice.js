import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import staffService from '../../services/staffService';

// Async thunks
export const fetchStaff = createAsyncThunk(
  'staff/fetchStaff',
  async (filters, { rejectWithValue }) => {
    try {
      return await staffService.getAllStaff(filters);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch staff');
    }
  }
);

export const createStaffMember = createAsyncThunk(
  'staff/createStaffMember',
  async (staffData, { rejectWithValue }) => {
    try {
      return await staffService.createStaff(staffData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create staff member');
    }
  }
);

export const updateStaffMember = createAsyncThunk(
  'staff/updateStaffMember',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await staffService.updateStaff(id, data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update staff member');
    }
  }
);

export const deleteStaffMember = createAsyncThunk(
  'staff/deleteStaffMember',
  async (id, { rejectWithValue }) => {
    try {
      await staffService.deleteStaff(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete staff member');
    }
  }
);

const initialState = {
  staff: [],
  selectedStaff: null,
  filters: {
    search: '',
    role: '',
    department: '',
    sortBy: 'name',
    sortOrder: 'asc',
  },
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setSelectedStaff: (state, action) => {
      state.selectedStaff = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch staff
      .addCase(fetchStaff.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.isLoading = false;
        state.staff = action.payload.items;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create staff member
      .addCase(createStaffMember.fulfilled, (state, action) => {
        state.staff.push(action.payload);
      })
      // Update staff member
      .addCase(updateStaffMember.fulfilled, (state, action) => {
        const index = state.staff.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.staff[index] = action.payload;
        }
      })
      // Delete staff member
      .addCase(deleteStaffMember.fulfilled, (state, action) => {
        state.staff = state.staff.filter((s) => s.id !== action.payload);
      });
  },
});

export const {
  setSelectedStaff,
  updateFilters,
  resetFilters,
  updatePagination,
} = staffSlice.actions;

export default staffSlice.reducer; 