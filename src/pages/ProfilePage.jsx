import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { updateProfile } from '../store/slices/authSlice';
import { showNotification } from '../store/slices/uiSlice';

const profileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().matches(/^\+?[\d\s-]+$/, 'Invalid phone number'),
  department: Yup.string().required('Department is required'),
  shiftPreference: Yup.string(),
  bio: Yup.string().max(500, 'Bio must be less than 500 characters')
});

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(updateProfile(values)).unwrap();
      dispatch(showNotification({
        type: 'success',
        message: 'Profile updated successfully'
      }));
      setIsEditing(false);
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.message || 'Failed to update profile'
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Profile</h1>
        <button
          className="btn btn-primary"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="profile-avatar mb-3">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <h5 className="card-title mb-1">{user?.name}</h5>
              <p className="text-muted">{user?.role}</p>
              <div className="profile-stats">
                <div className="stat-item">
                  <div className="stat-value">127</div>
                  <div className="stat-label">Shifts</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">98%</div>
                  <div className="stat-label">Attendance</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">24</div>
                  <div className="stat-label">Hours/Week</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <Formik
                initialValues={{
                  name: user?.name || '',
                  email: user?.email || '',
                  phone: user?.phone || '',
                  department: user?.department || '',
                  shiftPreference: user?.shiftPreference || '',
                  bio: user?.bio || ''
                }}
                validationSchema={profileSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Name</label>
                        <Field
                          name="name"
                          type="text"
                          className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                          disabled={!isEditing}
                        />
                        {errors.name && touched.name && (
                          <div className="invalid-feedback">{errors.name}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <Field
                          name="email"
                          type="email"
                          className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                          disabled={!isEditing}
                        />
                        {errors.email && touched.email && (
                          <div className="invalid-feedback">{errors.email}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Phone</label>
                        <Field
                          name="phone"
                          type="text"
                          className={`form-control ${errors.phone && touched.phone ? 'is-invalid' : ''}`}
                          disabled={!isEditing}
                        />
                        {errors.phone && touched.phone && (
                          <div className="invalid-feedback">{errors.phone}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Department</label>
                        <Field
                          name="department"
                          as="select"
                          className={`form-select ${errors.department && touched.department ? 'is-invalid' : ''}`}
                          disabled={!isEditing}
                        >
                          <option value="">Select Department</option>
                          <option value="emergency">Emergency</option>
                          <option value="surgery">Surgery</option>
                          <option value="pediatrics">Pediatrics</option>
                        </Field>
                        {errors.department && touched.department && (
                          <div className="invalid-feedback">{errors.department}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Shift Preference</label>
                        <Field
                          name="shiftPreference"
                          as="select"
                          className="form-select"
                          disabled={!isEditing}
                        >
                          <option value="">No Preference</option>
                          <option value="morning">Morning</option>
                          <option value="afternoon">Afternoon</option>
                          <option value="night">Night</option>
                        </Field>
                      </div>

                      <div className="col-12">
                        <label className="form-label">Bio</label>
                        <Field
                          name="bio"
                          as="textarea"
                          className={`form-control ${errors.bio && touched.bio ? 'is-invalid' : ''}`}
                          rows="4"
                          disabled={!isEditing}
                        />
                        {errors.bio && touched.bio && (
                          <div className="invalid-feedback">{errors.bio}</div>
                        )}
                      </div>

                      {isEditing && (
                        <div className="col-12">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-page {
          padding: 1.5rem;
        }

        .card {
          background-color: var(--background);
          border-color: var(--border);
        }

        .profile-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background-color: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 600;
          margin: 0 auto;
        }

        .profile-stats {
          display: flex;
          justify-content: space-around;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--primary);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .form-control,
        .form-select {
          background-color: var(--background);
          border-color: var(--border);
          color: var(--text);
        }

        .form-control:disabled,
        .form-select:disabled {
          background-color: var(--hover);
          opacity: 0.75;
        }

        @media (max-width: 768px) {
          .profile-page {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage; 