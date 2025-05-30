import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../../store/slices/authSlice';
import LoadingSpinner from '../common/LoadingSpinner';

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, isLoading, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute; 