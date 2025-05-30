import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

// Layout Components
import Layout from './components/common/Layout';
import PrivateRoute from './components/auth/PrivateRoute';

// Authentication
import Login from './components/auth/Login';

// Main Pages
// import Dashboard from './pages/Dashboard';
import StaffManagement from './pages/StaffManagement';
import ShiftScheduler from './pages/ShiftScheduler';
import CalendarPage from './pages/CalendarPage';
import AttendancePage from './pages/AttendancePage';

// User Pages
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

// Styles
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/globals.css';

const App = () => {
  console.log("Auto Deployed");
  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route >
            {/* Main Routes */}
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            <Route path="/staff" element={<StaffManagement />} />
            <Route path="/shifts" element={<ShiftScheduler />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/attendance" element={<AttendancePage />} />

            {/* User Routes */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={
              <AdminRoute>
                <SettingsPage />
              </AdminRoute>
            } />
          </Route>

          {/* Redirect root to login if not authenticated, otherwise to dashboard */}
          <Route path="/" element={<AuthRedirect />} />

          {/* Catch all other routes and redirect to login/dashboard */}
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
    </>
  );
};

// Component to handle root path redirection
const AuthRedirect = () => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

// Component to protect admin-only routes
const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default App; 