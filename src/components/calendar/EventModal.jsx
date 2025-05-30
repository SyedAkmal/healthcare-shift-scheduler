import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createEvent, updateEvent } from '../../store/slices/calendarSlice';

const EventModal = ({ isOpen, onClose, event = null }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    shiftType: 'Morning',
    capacity: '',
    date: '',
    startTime: '',
    endTime: '',
    notes: ''
  });

  useEffect(() => {
    if (event) {
      const start = new Date(event.start);
      const end = event.end ? new Date(event.end) : null;

      setFormData({
        shiftType: event.extendedProps?.shiftType || 'Morning',
        capacity: event.extendedProps?.capacity || '',
        date: start.toISOString().split('T')[0],
        startTime: start.toTimeString().slice(0, 5),
        endTime: end ? end.toTimeString().slice(0, 5) : '',
        notes: event.extendedProps?.notes || ''
      });
    } else {
      setFormData({
        shiftType: 'Morning',
        capacity: '',
        date: '',
        startTime: '',
        endTime: '',
        notes: ''
      });
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

    const eventData = {
      title: `${formData.shiftType} Shift`,
      start: startDateTime,
      end: endDateTime,
      extendedProps: {
        shiftType: formData.shiftType,
        capacity: parseInt(formData.capacity, 10),
        notes: formData.notes,
        staffCount: event?.extendedProps?.staffCount || 0,
        assignedStaff: event?.extendedProps?.assignedStaff || [],
        conflicts: event?.extendedProps?.conflicts || []
      }
    };

    if (event) {
      dispatch(updateEvent({ id: event.id, ...eventData }));
    } else {
      dispatch(createEvent(eventData));
    }

    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="event-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h5>{event ? 'Edit Shift' : 'Create New Shift'}</h5>
          <button className="close-btn" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="shiftType">Shift Type</label>
            <select
              id="shiftType"
              name="shiftType"
              className="form-control"
              value={formData.shiftType}
              onChange={handleChange}
              required
            >
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Night">Night</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              className="form-control"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                className="form-control"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                className="form-control"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Staff Capacity</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              className="form-control"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              className="form-control"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {event ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .event-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1051;
        }

        .modal-content {
          position: relative;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 500px;
          z-index: 1052;
          padding: 1rem;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e9ecef;
        }

        .modal-header h5 {
          margin: 0;
          font-weight: 500;
        }

        .close-btn {
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          padding: 0.25rem;
        }

        .close-btn:hover {
          color: #212529;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #212529;
          font-size: 0.875rem;
        }

        .form-control {
          display: block;
          width: 100%;
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
          line-height: 1.5;
          color: #212529;
          background-color: #ffffff;
          border: 1px solid #ced4da;
          border-radius: 4px;
          transition: border-color 0.15s ease-in-out;
        }

        .form-control:focus {
          border-color: #86b7fe;
          outline: 0;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #e9ecef;
        }

        .btn {
          display: inline-block;
          font-weight: 400;
          text-align: center;
          vertical-align: middle;
          user-select: none;
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
          line-height: 1.5;
          border-radius: 4px;
          transition: all 0.15s ease-in-out;
          cursor: pointer;
        }

        .btn-primary {
          color: #ffffff;
          background-color: #0d6efd;
          border: 1px solid #0d6efd;
        }

        .btn-primary:hover {
          background-color: #0a58ca;
          border-color: #0a58ca;
        }

        .btn-secondary {
          color: #ffffff;
          background-color: #6c757d;
          border: 1px solid #6c757d;
        }

        .btn-secondary:hover {
          background-color: #5c636a;
          border-color: #5c636a;
        }

        @media (max-width: 576px) {
          .modal-content {
            margin: 1rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default EventModal; 