import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  notification: {
    show: false,
    type: null, // 'success' | 'error' | 'warning' | 'info'
    message: '',
  },
  modals: {
    addStaff: false,
    editStaff: false,
    deleteStaff: false,
    addShift: false,
    editShift: false,
    markAttendance: false,
  },
  sidebarOpen: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    showNotification: (state, action) => {
      state.notification = {
        show: true,
        type: action.payload.type,
        message: action.payload.message,
      };
    },
    hideNotification: (state) => {
      state.notification = {
        show: false,
        type: null,
        message: '',
      };
    },
    toggleModal: (state, action) => {
      const modalName = action.payload;
      state.modals[modalName] = !state.modals[modalName];
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const {
  setLoading,
  showNotification,
  hideNotification,
  toggleModal,
  toggleSidebar,
} = uiSlice.actions;

export default uiSlice.reducer; 