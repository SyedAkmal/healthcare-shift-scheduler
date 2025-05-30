import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AttendanceFilters = ({ filters, onFilterChange }) => {
  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  return (
    <div className="attendance-filters">
      <div className="row g-3">
        <div className="col-md-3">
          <label className="form-label">Date From</label>
          <DatePicker
            selected={filters.dateFrom}
            onChange={(date) => handleInputChange('dateFrom', date)}
            className="form-control"
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Date To</label>
          <DatePicker
            selected={filters.dateTo}
            onChange={(date) => handleInputChange('dateTo', date)}
            className="form-control"
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Shift Type</label>
          <select
            className="form-select"
            value={filters.shiftType}
            onChange={(e) => handleInputChange('shiftType', e.target.value)}
          >
            <option value="all">All Shifts</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Night">Night</option>
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={filters.attendanceStatus}
            onChange={(e) => handleInputChange('attendanceStatus', e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Not Marked">Not Marked</option>
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label">Search</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search staff..."
            value={filters.searchTerm}
            onChange={(e) => handleInputChange('searchTerm', e.target.value)}
          />
        </div>
      </div>

      <style jsx>{`
        .attendance-filters {
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
          .attendance-filters {
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AttendanceFilters; 