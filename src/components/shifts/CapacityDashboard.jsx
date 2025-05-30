import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCapacityStatus } from '../../store/slices/shiftSlice';
import LoadingSpinner from '../common/LoadingSpinner';

const CapacityDashboard = () => {
  const dispatch = useDispatch();
  const { capacityStatus, selectedDate, loading } = useSelector((state) => state.shifts);

  useEffect(() => {
    if (selectedDate) {
      dispatch(fetchCapacityStatus(selectedDate));
    }
  }, [dispatch, selectedDate]);

  const getStatusColor = (percentage) => {
    if (percentage === 100) return '#28a745';
    if (percentage >= 75) return '#ffc107';
    return '#dc3545';
  };

  const getStatusText = (percentage) => {
    if (percentage === 100) return 'Optimal';
    if (percentage >= 75) return 'Near Capacity';
    return 'Understaffed';
  };

  if (loading.capacity) {
    return (
      <div className="capacity-dashboard card">
        <div className="card-body text-center">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="capacity-dashboard card">
      <div className="card-header">
        <h5 className="mb-0">Capacity Status</h5>
        <small className="text-muted">
          {new Date(selectedDate).toLocaleDateString()}
        </small>
      </div>

      <div className="card-body">
        {Object.entries(capacityStatus).map(([type, status]) => (
          <div key={type} className="capacity-section mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">{type.charAt(0).toUpperCase() + type.slice(1)} Shift</h6>
              <span className="status-badge" style={{ backgroundColor: getStatusColor(status.percentage) }}>
                {getStatusText(status.percentage)}
              </span>
            </div>

            <div className="progress mb-2">
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${status.percentage}%`,
                  backgroundColor: getStatusColor(status.percentage)
                }}
                aria-valuenow={status.percentage}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>

            <div className="d-flex justify-content-between">
              <small className="text-muted">
                {status.current} / {status.required} Staff
              </small>
              <small className="text-muted">
                {status.percentage}%
              </small>
            </div>

            {status.percentage < 75 && (
              <div className="alert alert-warning mt-2 mb-0 py-2 px-3">
                <small>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Need {status.required - status.current} more staff members
                </small>
              </div>
            )}
          </div>
        ))}

        <div className="capacity-summary">
          <div className="row g-2">
            <div className="col-6">
              <div className="summary-card bg-success bg-opacity-10">
                <div className="summary-value">
                  {Object.values(capacityStatus).reduce((acc, curr) => acc + curr.current, 0)}
                </div>
                <div className="summary-label">Total Assigned</div>
              </div>
            </div>
            <div className="col-6">
              <div className="summary-card bg-primary bg-opacity-10">
                <div className="summary-value">
                  {Object.values(capacityStatus).reduce((acc, curr) => acc + curr.required, 0)}
                </div>
                <div className="summary-label">Total Required</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .capacity-dashboard {
          background-color: var(--background);
          border-color: var(--border);
        }

        .card-header {
          background-color: var(--background);
          border-bottom-color: var(--border);
        }

        .capacity-section {
          padding: 1rem;
          border-radius: var(--border-radius);
          background-color: var(--background);
          border: 1px solid var(--border);
        }

        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          color: white;
        }

        .progress {
          height: 0.5rem;
          background-color: var(--border);
          border-radius: 1rem;
        }

        .progress-bar {
          border-radius: 1rem;
          transition: width 0.3s ease;
        }

        .alert {
          border-radius: var(--border-radius);
        }

        .capacity-summary {
          margin-top: 1.5rem;
        }

        .summary-card {
          padding: 1rem;
          border-radius: var(--border-radius);
          text-align: center;
        }

        .summary-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--text);
        }

        .summary-label {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .capacity-section {
            padding: 0.75rem;
          }

          .summary-value {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CapacityDashboard; 