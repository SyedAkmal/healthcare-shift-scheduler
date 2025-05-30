import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { createStaffMember, updateStaffMember, setShowModal } from '../../store/slices/staffSlice';

const staffValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  role: Yup.string()
    .required('Role is required'),
  contactNumber: Yup.string()
    .required('Contact number is required')
    .matches(/^[0-9]{10}$/, 'Contact number must be 10 digits'),
  email: Yup.string()
    .email('Invalid email address')
    .nullable(),
  department: Yup.string()
    .nullable(),
  shiftPreference: Yup.string()
    .nullable()
});

const StaffForm = () => {
  const dispatch = useDispatch();
  const { currentStaff, modalMode, roles = [], departments = [], rolesLoading, departmentsLoading } = useSelector((state) => state.staff);

  const initialValues = currentStaff || {
    name: '',
    role: '',
    department: '',
    contactNumber: '',
    email: '',
    shiftPreference: ''
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (modalMode === 'edit') {
        await dispatch(updateStaffMember({ id: currentStaff.id, data: values })).unwrap();
      } else {
        await dispatch(createStaffMember(values)).unwrap();
      }
      dispatch(setShowModal(false));
    } catch (error) {
      // Error handling is done in the thunk
    } finally {
      setSubmitting(false);
    }
  };

  const renderSelectOptions = (items, loading, type) => {
    if (loading) {
      return <option value="">Loading {type}...</option>;
    }
    
    if (!Array.isArray(items) || items.length === 0) {
      return <option value="">No {type} available</option>;
    }

    return (
      <>
        <option value="">Select {type}</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-wrapper">
        <div className="modal-content">
          <div className="modal-header">
            <div className="header-content">
              <h5 className="modal-title">
                {modalMode === 'edit' ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h5>
              <p className="modal-subtitle">
                {modalMode === 'edit' 
                  ? 'Update the information of existing staff member' 
                  : 'Fill in the details to add a new staff member'}
              </p>
            </div>
            <button
              type="button"
              className="close-button"
              onClick={() => dispatch(setShowModal(false))}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={staffValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="form-container">
                <div className="form-grid">
                  <div className="form-section">
                    <h6 className="section-title">Basic Information</h6>
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <Field
                        type="text"
                        id="name"
                        name="name"
                        className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                        placeholder="Enter full name"
                      />
                      {errors.name && touched.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                      )}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="role">Role *</label>
                        <Field
                          as="select"
                          id="role"
                          name="role"
                          className={`form-select ${errors.role && touched.role ? 'is-invalid' : ''}`}
                          disabled={rolesLoading}
                        >
                          {renderSelectOptions(roles, rolesLoading, 'Role')}
                        </Field>
                        {errors.role && touched.role && (
                          <div className="invalid-feedback">{errors.role}</div>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="department">Department</label>
                        <Field
                          as="select"
                          id="department"
                          name="department"
                          className={`form-select ${errors.department && touched.department ? 'is-invalid' : ''}`}
                          disabled={departmentsLoading}
                        >
                          {renderSelectOptions(departments, departmentsLoading, 'Department')}
                        </Field>
                        {errors.department && touched.department && (
                          <div className="invalid-feedback">{errors.department}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h6 className="section-title">Contact Details</h6>
                    <div className="form-group">
                      <label htmlFor="contactNumber">Contact Number *</label>
                      <Field
                        type="text"
                        id="contactNumber"
                        name="contactNumber"
                        className={`form-control ${errors.contactNumber && touched.contactNumber ? 'is-invalid' : ''}`}
                        placeholder="Enter 10-digit number"
                      />
                      {errors.contactNumber && touched.contactNumber && (
                        <div className="invalid-feedback">{errors.contactNumber}</div>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <Field
                        type="email"
                        id="email"
                        name="email"
                        className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                        placeholder="Enter email address"
                      />
                      {errors.email && touched.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="shiftPreference">Shift Preference</label>
                      <Field
                        as="select"
                        id="shiftPreference"
                        name="shiftPreference"
                        className={`form-select ${errors.shiftPreference && touched.shiftPreference ? 'is-invalid' : ''}`}
                      >
                        <option value="">Select Shift Preference</option>
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Night">Night</option>
                        <option value="Flexible">Flexible</option>
                      </Field>
                      {errors.shiftPreference && touched.shiftPreference && (
                        <div className="invalid-feedback">{errors.shiftPreference}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => dispatch(setShowModal(false))}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || rolesLoading || departmentsLoading}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {modalMode === 'edit' ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      modalMode === 'edit' ? 'Update Staff' : 'Create Staff'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9998;
          backdrop-filter: none;
        }

        .modal-wrapper {
          width: 100%;
          max-width: 800px;
          margin: 1.5rem;
          pointer-events: none;
          position: relative;
          z-index: 9999;
          transform: translateZ(0);
          will-change: transform;
        }

        .modal-content {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
          pointer-events: auto;
          position: relative;
          z-index: 10000;
          transform: translateZ(0);
          will-change: transform;
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          background: #ffffff;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }

        .header-content {
          flex: 1;
        }

        .modal-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text);
        }

        .modal-subtitle {
          margin: 0.5rem 0 0;
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .close-button {
          background: none;
          border: none;
          padding: 0.5rem;
          margin: -0.5rem;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.2s;
        }

        .close-button:hover {
          color: var(--text);
        }

        .form-container {
          padding: 1.5rem;
        }

        .form-grid {
          display: grid;
          gap: 2rem;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .section-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 0.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text);
        }

        .form-control,
        .form-select {
          display: block;
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          font-weight: 400;
          line-height: 1.5;
          color: var(--text);
          background-color: var(--background);
          border: 1px solid var(--border);
          border-radius: 8px;
          transition: all 0.2s;
        }

        .form-control:focus,
        .form-select:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.1);
          outline: none;
        }

        .form-control::placeholder {
          color: var(--text-muted);
        }

        .form-control.is-invalid,
        .form-select.is-invalid {
          border-color: var(--danger);
        }

        .invalid-feedback {
          display: block;
          margin-top: 0.25rem;
          font-size: 0.75rem;
          color: var(--danger);
        }

        .modal-footer {
          padding: 1.5rem;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .btn-primary {
          background-color: var(--primary);
          border: 1px solid var(--primary);
          color: white;
        }

        .btn-primary:hover {
          background-color: var(--primary-dark);
          border-color: var(--primary-dark);
        }

        .btn-outline-secondary {
          background-color: transparent;
          border: 1px solid var(--border);
          color: var(--text);
        }

        .btn-outline-secondary:hover {
          background-color: var(--hover);
        }

        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .modal-wrapper {
            margin: 1rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .modal-footer {
            flex-direction: column;
          }

          .modal-footer .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default StaffForm; 