import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as staffService from '../../services/staffService';
import { showNotification } from './uiSlice';

// Async thunks
export const fetchStaff = createAsyncThunk(
  'staff/fetchStaff',
  async (params, { rejectWithValue }) => {
    try {
      const response = await staffService.getAllStaff(params);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createStaffMember = createAsyncThunk(
  'staff/createStaff',
  async (staffData, { rejectWithValue, dispatch }) => {
    try {
      const response = await staffService.createStaff(staffData);
      dispatch(showNotification({
        type: 'success',
        message: 'Staff member created successfully'
      }));
      return response;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error || 'Failed to create staff member'
      }));
      return rejectWithValue(error);
    }
  }
);

export const updateStaffMember = createAsyncThunk(
  'staff/updateStaff',
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await staffService.updateStaff(id, data);
      dispatch(showNotification({
        type: 'success',
        message: 'Staff member updated successfully'
      }));
      return response;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error || 'Failed to update staff member'
      }));
      return rejectWithValue(error);
    }
  }
);

export const deleteStaffMember = createAsyncThunk(
  'staff/deleteStaff',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await staffService.deleteStaff(id);
      dispatch(showNotification({
        type: 'success',
        message: 'Staff member deleted successfully'
      }));
      return id;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error || 'Failed to delete staff member'
      }));
      return rejectWithValue(error);
    }
  }
);

export const bulkDeleteStaffMembers = createAsyncThunk(
  'staff/bulkDeleteStaff',
  async (ids, { rejectWithValue, dispatch }) => {
    try {
      await staffService.bulkDeleteStaff(ids);
      dispatch(showNotification({
        type: 'success',
        message: 'Staff members deleted successfully'
      }));
      return ids;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error || 'Failed to delete staff members'
      }));
      return rejectWithValue(error);
    }
  }
);

export const fetchRoles = createAsyncThunk(
  'staff/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await staffService.getRoles();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchDepartments = createAsyncThunk(
  'staff/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await staffService.getDepartments();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  staffList: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  },
  filters: {
    search: '',
    role: '',
    department: '',
    shiftPreference: ''
  },
  sorting: {
    field: 'name',
    direction: 'asc'
  },
  selectedStaff: [],
  currentStaff: null,
  showModal: false,
  modalMode: 'add',
  roles: [],
  departments: [],
  rolesLoading: false,
  departmentsLoading: false
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset to first page when filters change
    },
    setSorting: (state, action) => {
      state.sorting = action.payload;
    },
    setSelectedStaff: (state, action) => {
      state.selectedStaff = action.payload;
    },
    setCurrentStaff: (state, action) => {
      state.currentStaff = action.payload;
    },
    setShowModal: (state, action) => {
      state.showModal = action.payload;
      if (!action.payload) {
        state.currentStaff = null;
        state.modalMode = 'add';
      }
    },
    setModalMode: (state, action) => {
      state.modalMode = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.currentPage = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch staff
      .addCase(fetchStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staffList = action.payload.data;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems,
          itemsPerPage: action.payload.itemsPerPage
        };
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create staff
      .addCase(createStaffMember.fulfilled, (state) => {
        state.showModal = false;
      })
      // Update staff
      .addCase(updateStaffMember.fulfilled, (state) => {
        state.showModal = false;
        state.currentStaff = null;
      })
      // Delete staff
      .addCase(deleteStaffMember.fulfilled, (state, action) => {
        state.staffList = state.staffList.filter(staff => staff.id !== action.payload);
        state.selectedStaff = state.selectedStaff.filter(id => id !== action.payload);
      })
      // Bulk delete staff
      .addCase(bulkDeleteStaffMembers.fulfilled, (state, action) => {
        state.staffList = state.staffList.filter(staff => !action.payload.includes(staff.id));
        state.selectedStaff = [];
      })
      // Fetch roles
      .addCase(fetchRoles.pending, (state) => {
        state.rolesLoading = true;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.rolesLoading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state) => {
        state.rolesLoading = false;
      })
      // Fetch departments
      .addCase(fetchDepartments.pending, (state) => {
        state.departmentsLoading = true;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departmentsLoading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state) => {
        state.departmentsLoading = false;
      });
  }
});

export const {
  setFilters,
  setSorting,
  setSelectedStaff,
  setCurrentStaff,
  setShowModal,
  setModalMode,
  clearFilters
} = staffSlice.actions;

export default staffSlice.reducer; 