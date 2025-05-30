import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { login } from '../../store/slices/authSlice';
import { showNotification } from '../../store/slices/uiSlice';
import LoadingSpinner from '../common/LoadingSpinner';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/staff');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(login(values)).unwrap();
      dispatch(
        showNotification({
          type: 'success',
          message: 'Login successful! Welcome back.',
        })
      );
      navigate('/staff');
    } catch (error) {
      dispatch(
        showNotification({
          type: 'error',
          message: error || 'Login failed. Please check your credentials and try again.',
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="text-center mb-4">Healthcare Shift Scheduler</h2>
        <p className="text-center text-muted mb-4">Sign in to manage your healthcare shifts</p>
        
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                {errors.email && touched.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                {errors.password && touched.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isSubmitting || isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="small" className="me-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  {error}
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--background);
          padding: 1rem;
        }

        .login-card {
          background-color: var(--background);
          border: 1px solid var(--border);
          border-radius: var(--border-radius-lg);
          padding: 2rem;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        h2 {
          color: var(--text);
          font-weight: 600;
        }

        .text-muted {
          color: var(--text) !important;
          opacity: 0.6;
        }

        .form-label {
          color: var(--text);
        }

        .form-control {
          background-color: var(--background);
          border-color: var(--border);
          color: var(--text);
        }

        .form-control:focus {
          background-color: var(--background);
          border-color: var(--primary);
          color: var(--text);
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }

        .form-control:disabled {
          background-color: var(--hover);
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Login; 