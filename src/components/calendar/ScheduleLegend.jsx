import React from 'react';

const ScheduleLegend = () => {
  const shiftTypes = [
    { type: 'Morning', class: 'shift-morning' },
    { type: 'Afternoon', class: 'shift-afternoon' },
    { type: 'Night', class: 'shift-night' }
  ];

  const staffingStatus = [
    { status: 'Understaffed', class: 'status-understaffed' },
    { status: 'Optimal', class: 'status-optimal' },
    { status: 'Overstaffed', class: 'status-overstaffed' }
  ];

  return (
    <div className="schedule-legend">
      <div className="legend-section">
        <h6>Shift Types</h6>
        <div className="legend-items">
          {shiftTypes.map(({ type, class: className }) => (
            <div key={type} className="legend-item">
              <span className={`legend-badge ${className}`}></span>
              <span className="legend-label">{type}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="legend-section">
        <h6>Staffing Status</h6>
        <div className="legend-items">
          {staffingStatus.map(({ status, class: className }) => (
            <div key={status} className="legend-item">
              <span className={`legend-badge ${className}`}></span>
              <span className="legend-label">{status}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .schedule-legend {
          background: #ffffff;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          padding: 1rem;
        }

        .legend-section {
          margin-bottom: 1rem;

          &:last-child {
            margin-bottom: 0;
          }
        }

        .legend-section h6 {
          color: #6c757d;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .legend-items {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .legend-badge {
          width: 1rem;
          height: 1rem;
          border-radius: 4px;
        }

        .legend-label {
          font-size: 0.875rem;
          color: #212529;
        }

        .shift-morning {
          background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
          border: 1px solid #ffc107;
        }

        .shift-afternoon {
          background: linear-gradient(135deg, #cce5ff 0%, #a8d8ff 100%);
          border: 1px solid #007bff;
        }

        .shift-night {
          background: linear-gradient(135deg, #e2d5f1 0%, #d1c4e9 100%);
          border: 1px solid #6f42c1;
        }

        .status-understaffed {
          background-color: #dc3545;
        }

        .status-optimal {
          background-color: #28a745;
        }

        .status-overstaffed {
          background-color: #ffc107;
        }
      `}</style>
    </div>
  );
};

export default ScheduleLegend; 