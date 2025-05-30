import React from 'react';
import PropTypes from 'prop-types';

const StaffCard = ({ staff, onEdit, onDelete, selected, onSelect }) => {
  return (
    <div className={`staff-card ${selected ? 'selected' : ''}`}>
      <div className="card-header">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={selected}
            onChange={() => onSelect(staff.id)}
          />
        </div>
        <div className="staff-photo">
          <i className="bi bi-person-circle"></i>
        </div>
        <div className="staff-info">
          <h5 className="staff-name">{staff.name}</h5>
          <span className="staff-id">{staff.staffId}</span>
        </div>
      </div>
      
      <div className="card-body">
        <div className="info-row">
          <i className="bi bi-person-badge"></i>
          <span>{staff.role}</span>
        </div>
        <div className="info-row">
          <i className="bi bi-building"></i>
          <span>{staff.department}</span>
        </div>
        <div className="info-row">
          <i className="bi bi-telephone"></i>
          <span>{staff.contactNumber}</span>
        </div>
        {staff.email && (
          <div className="info-row">
            <i className="bi bi-envelope"></i>
            <span>{staff.email}</span>
          </div>
        )}
        {staff.shiftPreference && (
          <div className="info-row">
            <i className="bi bi-clock"></i>
            <span>{staff.shiftPreference}</span>
          </div>
        )}
      </div>

      <div className="card-footer">
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => onEdit(staff)}
        >
          <i className="bi bi-pencil"></i> Edit
        </button>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => onDelete(staff)}
        >
          <i className="bi bi-trash"></i> Delete
        </button>
      </div>

      <style jsx>{`
        .staff-card {
          background-color: var(--background);
          border: 1px solid var(--border);
          border-radius: var(--border-radius);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .staff-card.selected {
          border-color: var(--primary);
          box-shadow: 0 0 0 1px var(--primary);
        }

        .card-header {
          display: flex;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid var(--border);
          background-color: var(--background);
        }

        .form-check {
          margin-right: 1rem;
        }

        .staff-photo {
          width: 48px;
          height: 48px;
          margin-right: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--hover);
          border-radius: 50%;
        }

        .staff-photo i {
          font-size: 1.5rem;
          color: var(--text);
        }

        .staff-info {
          flex: 1;
        }

        .staff-name {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text);
        }

        .staff-id {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .card-body {
          padding: 1rem;
        }

        .info-row {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
          color: var(--text);
        }

        .info-row i {
          width: 20px;
          margin-right: 0.5rem;
          color: var(--text-muted);
        }

        .card-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          padding: 1rem;
          border-top: 1px solid var(--border);
          background-color: var(--background);
        }

        @media (hover: hover) {
          .staff-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
        }
      `}</style>
    </div>
  );
};

StaffCard.propTypes = {
  staff: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    staffId: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    contactNumber: PropTypes.string.isRequired,
    email: PropTypes.string,
    shiftPreference: PropTypes.string
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default StaffCard; 