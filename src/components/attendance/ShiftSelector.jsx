import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ShiftSelector = ({
  selectedDate,
  selectedShift,
  onDateChange,
  onShiftChange
}) => {
  return (
    <div className="shift-selector">
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={onDateChange}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            placeholderText="Select date"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Shift</label>
          <select
            className="form-select"
            value={selectedShift}
            onChange={(e) => onShiftChange(e.target.value)}
          >
            <option value="">All Shifts</option>
            <option value="Morning">Morning (6:00 - 14:00)</option>
            <option value="Afternoon">Afternoon (14:00 - 22:00)</option>
            <option value="Night">Night (22:00 - 6:00)</option>
          </select>
        </div>
      </div>

      <style jsx>{`
        .shift-selector {
          background-color: var(--background);
          padding: 1rem;
          border-radius: var(--border-radius);
          border: 1px solid var(--border);
        }

        .form-label {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        :global(.react-datepicker-wrapper) {
          width: 100%;
        }

        :global(.react-datepicker__input-container) {
          width: 100%;
        }

        @media (max-width: 768px) {
          .shift-selector {
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ShiftSelector; 