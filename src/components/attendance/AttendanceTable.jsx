import React from 'react';

const AttendanceTable = ({ data = [], onMarkAttendance, canEditAttendance, filters }) => {
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'present':
        return 'bg-success';
      case 'absent':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const getShiftColorClass = (shiftType) => {
    switch (shiftType?.toLowerCase()) {
      case 'morning':
        return 'shift-morning';
      case 'afternoon':
        return 'shift-afternoon';
      case 'night':
        return 'shift-night';
      default:
        return '';
    }
  };

  const filterData = (shifts) => {
    if (!Array.isArray(shifts) || shifts.length === 0) {
      return [];
    }

    return shifts.flatMap(shift => {
      if (!shift || !Array.isArray(shift.assignments)) {
        return [];
      }

      return shift.assignments.filter(assignment => {
        if (!assignment || !assignment.staff) {
          return false;
        }

        const matchesSearch = filters.searchTerm
          ? (assignment.staff.name?.toLowerCase() || '').includes(filters.searchTerm.toLowerCase()) ||
            (assignment.staff.staffId?.toLowerCase() || '').includes(filters.searchTerm.toLowerCase())
          : true;

        const matchesStatus = filters.attendanceStatus === 'all'
          ? true
          : assignment.attendance?.status === filters.attendanceStatus;

        const matchesShift = filters.shiftType === 'all'
          ? true
          : shift.shiftType === filters.shiftType;

        return matchesSearch && matchesStatus && matchesShift;
      }).map(assignment => ({
        ...assignment,
        shiftType: shift.shiftType || 'Unknown',
        shiftDate: shift.date || new Date(),
        shiftEndTime: shift.date ? new Date(shift.date) : new Date()
      }));
    });
  };

  const filteredData = filterData(data);

  return (
    <div className="attendance-table">
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Shift</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No attendance records found
                </td>
              </tr>
            ) : (
              filteredData.map((assignment) => (
                <tr key={assignment.id}>
                  <td>{assignment.staff.staffId}</td>
                  <td>{assignment.staff.name}</td>
                  <td>{assignment.staff.role}</td>
                  <td>
                    <span className={`shift-badge ${getShiftColorClass(assignment.shiftType)}`}>
                      {assignment.shiftType}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(assignment.attendance?.status)}`}>
                      {assignment.attendance?.status || 'Not Marked'}
                    </span>
                  </td>
                  <td>
                    <span className="remarks-text">
                      {assignment.attendance?.remarks || '-'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onMarkAttendance(assignment)}
                      disabled={!canEditAttendance(assignment.shiftEndTime)}
                    >
                      {assignment.attendance?.status ? 'Update' : 'Mark'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .attendance-table {
          background-color: #ffffff;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          overflow: hidden;
        }

        .table {
          margin-bottom: 0;
        }

        .table th {
          background-color: #f8f9fa;
          border-bottom-color: #e9ecef;
          color: #6c757d;
          font-weight: 500;
          white-space: nowrap;
        }

        .table td {
          vertical-align: middle;
          color: #212529;
          border-bottom-color: #e9ecef;
        }

        .shift-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 1rem;
          font-size: 0.75rem;
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

        .remarks-text {
          display: block;
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 768px) {
          .table {
            font-size: 0.875rem;
          }

          .btn-sm {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AttendanceTable; 