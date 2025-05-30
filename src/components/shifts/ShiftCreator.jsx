import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import { createShift, applyTemplate } from '../../store/slices/shiftSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import 'react-datepicker/dist/react-datepicker.css';

const shiftValidationSchema = Yup.object().shape({
  dates: Yup.array()
    .min(1, 'Please select at least one date')
    .required('Date is required'),
  shiftType: Yup.string()
    .oneOf(['Morning', 'Afternoon', 'Night'], 'Please select a valid shift type')
    .required('Shift type is required'),
  capacity: Yup.number()
    .min(1, 'Capacity must be at least 1')
    .max(50, 'Capacity cannot exceed 50')
    .required('Capacity is required'),
  startTime: Yup.string()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)')
    .required('Start time is required'),
  endTime: Yup.string()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)')
    .required('End time is required')
    .test('is-after-start', 'End time must be after start time', function(endTime) {
      const { startTime } = this.parent;
      if (!startTime || !endTime) return true;
      return endTime > startTime;
    })
});

const ShiftCreator = () => {
  const dispatch = useDispatch();
  const [isTemplateMode, setIsTemplateMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const shiftState = useSelector((state) => state.shifts);
  const isLoading = shiftState?.loading?.shifts || false;

  const defaultTimes = {
    Morning: { start: '06:00', end: '14:00' },
    Afternoon: { start: '14:00', end: '22:00' },
    Night: { start: '22:00', end: '06:00' }
  };

  const initialValues = {
    dates: [],
    shiftType: '',
    capacity: 5,
    startTime: '',
    endTime: '',
    notes: ''
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (isTemplateMode && selectedTemplate) {
        await dispatch(applyTemplate({
          templateId: selectedTemplate,
          dates: values.dates
        })).unwrap();
      } else {
        const shiftsToCreate = values.dates.map(date => ({
          date: date.toISOString().split('T')[0],
          type: values.shiftType,
          capacity: values.capacity,
          startTime: values.startTime,
          endTime: values.endTime,
          notes: values.notes
        }));

        // Create shifts in sequence
        for (const shift of shiftsToCreate) {
          await dispatch(createShift(shift)).unwrap();
        }
      }
      resetForm();
    } catch (error) {
      // Error handling is done in the thunk
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="shift-creator card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Create Shift</h5>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="templateMode"
            checked={isTemplateMode}
            onChange={(e) => setIsTemplateMode(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="templateMode">
            Use Template
          </label>
        </div>
      </div>

      <div className="card-body">
        <Formik
          initialValues={initialValues}
          validationSchema={shiftValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label className="form-label">Date(s)</label>
                <DatePicker
                  selected={values.dates[0]}
                  onChange={(dates) => setFieldValue('dates', Array.isArray(dates) ? dates : [dates])}
                  minDate={new Date()}
                  selectsRange={!isTemplateMode}
                  multiple={!isTemplateMode}
                  inline
                  className="form-control"
                />
                {errors.dates && touched.dates && (
                  <div className="invalid-feedback d-block">{errors.dates}</div>
                )}
              </div>

              {isTemplateMode ? (
                <div className="mb-3">
                  <label className="form-label">Template</label>
                  <Field
                    as="select"
                    name="template"
                    className={`form-select ${errors.template && touched.template ? 'is-invalid' : ''}`}
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                  >
                    <option value="">Select a template</option>
                    <option value="weekday">Weekday Template</option>
                    <option value="weekend">Weekend Template</option>
                    <option value="custom">Custom Template</option>
                  </Field>
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="form-label">Shift Type</label>
                    <Field
                      as="select"
                      name="shiftType"
                      className={`form-select ${errors.shiftType && touched.shiftType ? 'is-invalid' : ''}`}
                      onChange={(e) => {
                        const type = e.target.value;
                        setFieldValue('shiftType', type);
                        if (type && defaultTimes[type]) {
                          setFieldValue('startTime', defaultTimes[type].start);
                          setFieldValue('endTime', defaultTimes[type].end);
                        }
                      }}
                    >
                      <option value="">Select shift type</option>
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Night">Night</option>
                    </Field>
                    {errors.shiftType && touched.shiftType && (
                      <div className="invalid-feedback d-block">{errors.shiftType}</div>
                    )}
                  </div>

                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label">Start Time</label>
                      <Field
                        type="time"
                        name="startTime"
                        className={`form-control ${errors.startTime && touched.startTime ? 'is-invalid' : ''}`}
                      />
                      {errors.startTime && touched.startTime && (
                        <div className="invalid-feedback d-block">{errors.startTime}</div>
                      )}
                    </div>
                    <div className="col">
                      <label className="form-label">End Time</label>
                      <Field
                        type="time"
                        name="endTime"
                        className={`form-control ${errors.endTime && touched.endTime ? 'is-invalid' : ''}`}
                      />
                      {errors.endTime && touched.endTime && (
                        <div className="invalid-feedback d-block">{errors.endTime}</div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Capacity</label>
                    <Field
                      type="number"
                      name="capacity"
                      min="1"
                      max="50"
                      className={`form-control ${errors.capacity && touched.capacity ? 'is-invalid' : ''}`}
                    />
                    {errors.capacity && touched.capacity && (
                      <div className="invalid-feedback d-block">{errors.capacity}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Notes</label>
                    <Field
                      as="textarea"
                      name="notes"
                      className="form-control"
                      rows="3"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? (
                  <>
                    <LoadingSpinner size="small" className="me-2" />
                    Creating...
                  </>
                ) : (
                  'Create Shift'
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      <style jsx>{`
        .shift-creator {
          background-color: var(--background);
          border-color: var(--border);
        }

        .card-header {
          background-color: var(--background);
          border-bottom-color: var(--border);
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

        .form-check-input:checked {
          background-color: var(--primary);
          border-color: var(--primary);
        }

        .react-datepicker {
          background-color: var(--background);
          border-color: var(--border);
        }

        .react-datepicker__header {
          background-color: var(--background);
          border-bottom-color: var(--border);
        }

        .react-datepicker__day {
          color: var(--text);
        }

        .react-datepicker__day:hover {
          background-color: var(--hover);
        }

        .react-datepicker__day--selected {
          background-color: var(--primary);
          color: white;
        }
      `}</style>
    </div>
  );
};

export default ShiftCreator; 