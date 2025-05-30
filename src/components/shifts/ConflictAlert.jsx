import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resolveConflict } from '../../store/slices/shiftSlice';

const ConflictAlert = () => {
  const dispatch = useDispatch();
  const { activeConflicts } = useSelector((state) => state.shifts);

  const getConflictIcon = (type) => {
    switch (type) {
      case 'DOUBLE_BOOKING':
        return 'bi-calendar-x';
      case 'UNAVAILABLE':
        return 'bi-person-x';
      case 'GAP_TOO_SMALL':
        return 'bi-clock-history';
      case 'MAX_HOURS_EXCEEDED':
        return 'bi-exclamation-octagon';
      case 'SKILL_MISMATCH':
        return 'bi-person-exclamation';
      default:
        return 'bi-exclamation-triangle';
    }
  };

  const getConflictSeverity = (type) => {
    switch (type) {
      case 'DOUBLE_BOOKING':
      case 'MAX_HOURS_EXCEEDED':
        return 'danger';
      case 'GAP_TOO_SMALL':
      case 'UNAVAILABLE':
        return 'warning';
      case 'SKILL_MISMATCH':
        return 'info';
      default:
        return 'warning';
    }
  };

  const getConflictMessage = (conflict) => {
    switch (conflict.type) {
      case 'DOUBLE_BOOKING':
        return `${conflict.staffName} is already assigned to another shift at this time`;
      case 'UNAVAILABLE':
        return `${conflict.staffName} is not available during this shift`;
      case 'GAP_TOO_SMALL':
        return `Insufficient rest period for ${conflict.staffName} between shifts`;
      case 'MAX_HOURS_EXCEEDED':
        return `${conflict.staffName} would exceed maximum working hours`;
      case 'SKILL_MISMATCH':
        return `${conflict.staffName} may not have required skills for this shift`;
      default:
        return conflict.message;
    }
  };

  if (activeConflicts.length === 0) {
    return null;
  }

  return (
    <div className="conflict-alert card">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Scheduling Conflicts
        </h5>
      </div>

      <div className="card-body p-0">
        <div className="list-group list-group-flush">
          {activeConflicts.map((conflict) => {
            const severity = getConflictSeverity(conflict.type);
            return (
              <div
                key={conflict.id}
                className={`list-group-item conflict-item border-${severity}`}
              >
                <div className="d-flex align-items-start">
                  <div className={`conflict-icon text-${severity} me-3`}>
                    <i className={`bi ${getConflictIcon(conflict.type)}`}></i>
                  </div>
                  <div className="conflict-content flex-grow-1">
                    <div className="conflict-message">
                      {getConflictMessage(conflict)}
                    </div>
                    <small className="text-muted">
                      {new Date(conflict.date).toLocaleDateString()}
                    </small>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => dispatch(resolveConflict(conflict.id))}
                  >
                    Dismiss
                  </button>
                </div>

                {conflict.suggestion && (
                  <div className="conflict-suggestion mt-2">
                    <small className="text-muted">
                      <i className="bi bi-lightbulb me-2"></i>
                      Suggestion: {conflict.suggestion}
                    </small>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .conflict-alert {
          background-color: var(--background);
          border-color: var(--border);
        }

        .card-header {
          background-color: var(--background);
          border-bottom-color: var(--border);
        }

        .list-group-item {
          background-color: var(--background);
          border-left-width: 4px;
          padding: 1rem;
        }

        .conflict-icon {
          font-size: 1.25rem;
          line-height: 1;
        }

        .conflict-message {
          margin-bottom: 0.25rem;
          color: var(--text);
        }

        .conflict-suggestion {
          padding-left: 2.5rem;
        }

        .border-danger {
          border-left-color: var(--danger);
        }

        .border-warning {
          border-left-color: var(--warning);
        }

        .border-info {
          border-left-color: var(--info);
        }

        .text-danger {
          color: var(--danger) !important;
        }

        .text-warning {
          color: var(--warning) !important;
        }

        .text-info {
          color: var(--info) !important;
        }

        @media (max-width: 768px) {
          .list-group-item {
            padding: 0.75rem;
          }

          .conflict-icon {
            font-size: 1rem;
          }

          .conflict-suggestion {
            padding-left: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ConflictAlert; 