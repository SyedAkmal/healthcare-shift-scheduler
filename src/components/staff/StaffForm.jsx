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
  staffId: Yup.string()
    .required('Staff ID is required')
    .matches(/^[A-Z0-9]{4,10}$/, 'Staff ID must be 4-10 characters of uppercase letters and numbers'),
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
    staffId: '',
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
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {modalMode === 'edit' ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => dispatch(setShowModal(false))}
            ></button>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={staffValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name *</label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                    />
                    {errors.name && touched.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="staffId" className="form-label">Staff ID *</label>
                    <Field
                      type="text"
                      id="staffId"
                      name="staffId"
                      className={`form-control ${errors.staffId && touched.staffId ? 'is-invalid' : ''}`}
                    />
                    {errors.staffId && touched.staffId && (
                      <div className="invalid-feedback">{errors.staffId}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">Role *</label>
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

                  <div className="mb-3">
                    <label htmlFor="department" className="form-label">Department</label>
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

                  <div className="mb-3">
                    <label htmlFor="contactNumber" className="form-label">Contact Number *</label>
                    <Field
                      type="text"
                      id="contactNumber"
                      name="contactNumber"
                      className={`form-control ${errors.contactNumber && touched.contactNumber ? 'is-invalid' : ''}`}
                    />
                    {errors.contactNumber && touched.contactNumber && (
                      <div className="invalid-feedback">{errors.contactNumber}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                    />
                    {errors.email && touched.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="shiftPreference" className="form-label">Shift Preference</label>
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

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
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
                        Saving...
                      </>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className="modal-backdrop show"></div>

      <style jsx>{`
        .modal-content {
          background-color: var(--background);
          color: var(--text);
        }

        .modal-header {
          border-bottom-color: var(--border);
        }

        .modal-footer {
          border-top-color: var(--border);
        }

        .form-label {
          color: var(--text);
        }

        .form-control,
        .form-select {
          background-color: var(--background);
          border-color: var(--border);
          color: var(--text);
        }

        .form-control:focus,
        .form-select:focus {
          background-color: var(--background);
          border-color: var(--primary);
          color: var(--text);
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }

        .form-control:disabled,
        .form-select:disabled {
          background-color: var(--hover);
          cursor: not-allowed;
        }

        .invalid-feedback {
          display: block;
        }
      `}</style>
    </div>
  );
};

export default StaffForm; 