import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedEvent } from '../../store/slices/calendarSlice';

const EventDetailsSidebar = () => {
  const dispatch = useDispatch();
  const { selectedEvent } = useSelector(state => state.calendar);

  const handleClose = () => {
    dispatch(setSelectedEvent(null));
  };

  if (!selectedEvent) {
    return null;
  }

  const {
    start,
    end,
    extendedProps: {
      shiftType,
      staffCount,
      capacity,
      conflicts,
      assignedStaff
    } = {}
  } = selectedEvent;

  return (
    <div className="event-details-sidebar">
      <div className="sidebar-header">
        <h5>Shift Details</h5>
        <button className="close-btn" onClick={handleClose}>
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      <div className="sidebar-content">
        <div className="detail-section">
          <h6>Time</h6>
          <p>
            {new Date(start).toLocaleString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
            {end && (
              <>
                {' - '}
                {new Date(end).toLocaleString(undefined, {
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </>
            )}
          </p>
        </div>

        <div className="detail-section">
          <h6>Shift Type</h6>
          <span className={`shift-badge shift-${shiftType?.toLowerCase()}`}>
            {shiftType}
          </span>
        </div>

        <div className="detail-section">
          <h6>Staff Coverage</h6>
          <div className="coverage-info">
            <div className="coverage-text">
              {staffCount || 0} / {capacity || 0} staff assigned
            </div>
            <div className="capacity-bar">
              <div
                className="capacity-fill"
                style={{ width: `${((staffCount || 0) / (capacity || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {conflicts && conflicts.length > 0 && (
          <div className="detail-section conflicts">
            <h6>Conflicts</h6>
            <ul className="conflict-list">
              {conflicts.map((conflict, index) => (
                <li key={index} className="conflict-item">
                  <i className="bi bi-exclamation-triangle text-warning"></i>
                  {conflict}
                </li>
              ))}
            </ul>
          </div>
        )}

        {assignedStaff && assignedStaff.length > 0 && (
          <div className="detail-section">
            <h6>Assigned Staff</h6>
            <ul className="staff-list">
              {assignedStaff.map((staff, index) => (
                <li key={index} className="staff-item">
                  <span className="staff-name">{staff.name}</span>
                  <span className="staff-role">{staff.role}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <style jsx>{`
        .event-details-sidebar {
          position: fixed;
          top: 0;
          right: 0;
          width: 320px;
          height: 100vh;
          background: #ffffff;
          box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }

        .sidebar-header {
          padding: 1rem;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-header h5 {
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

        .sidebar-content {
          padding: 1rem;
          overflow-y: auto;
          flex: 1;
        }

        .detail-section {
          margin-bottom: 1.5rem;
        }

        .detail-section h6 {
          color: #6c757d;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .detail-section p {
          margin: 0;
          color: #212529;
        }

        .shift-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .shift-morning {
          background-color: #fff3cd;
          color: #856404;
        }

        .shift-afternoon {
          background-color: #cce5ff;
          color: #004085;
        }

        .shift-night {
          background-color: #e2d5f1;
          color: #432874;
        }

        .coverage-info {
          margin-top: 0.5rem;
        }

        .coverage-text {
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .capacity-bar {
          height: 4px;
          background: #e9ecef;
          border-radius: 2px;
          overflow: hidden;
        }

        .capacity-fill {
          height: 100%;
          background: #28a745;
          transition: width 0.3s ease;
        }

        .conflict-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .conflict-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: #fff3cd;
          border-radius: 4px;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: #856404;
        }

        .staff-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .staff-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          border-bottom: 1px solid #e9ecef;
        }

        .staff-name {
          font-weight: 500;
        }

        .staff-role {
          font-size: 0.875rem;
          color: #6c757d;
        }

        @media (max-width: 768px) {
          .event-details-sidebar {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default EventDetailsSidebar; 