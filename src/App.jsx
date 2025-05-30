import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from './store';
import Layout from './components/common/Layout';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/Login';
// import Dashboard from './pages/Dashboard';
import StaffManagement from './pages/StaffManagement';
// import ShiftManagement from './pages/ShiftManagement';
// import CalendarPage from './pages/CalendarPage';
// import AttendancePage from './pages/AttendancePage';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            <Route path="/staff" element={<StaffManagement />} />
            {/* <Route path="/shifts" element={<ShiftManagement />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/attendance" element={<AttendancePage />} /> */}
          </Route>

          {/* Redirect root to login if not authenticated, otherwise to staff management */}
          <Route
            path="/"
            element={
              <AuthRedirect />
            }
          />

          {/* Catch all other routes and redirect to login/staff */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Provider>
  );
};

// Component to handle root path redirection
const AuthRedirect = () => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/staff" replace /> : <Navigate to="/login" replace />;
};

export default App; 