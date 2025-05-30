import React, { useState, useEffect, useCallback } from 'react';
import AttendanceFilters from '../components/attendance/AttendanceFilters';
import AttendanceTable from '../components/attendance/AttendanceTable';
import AttendanceModal from '../components/attendance/AttendanceModal';
import ShiftSelector from '../components/attendance/ShiftSelector';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import api from '../services/api';

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedShift, setSelectedShift] = useState('');
  const [filters, setFilters] = useState({
    searchTerm: '',
    attendanceStatus: 'all',
    dateFrom: new Date(),
    dateTo: new Date(),
    shiftType: 'all'
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Fetch shifts and attendance data
  const fetchAttendanceData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/shifts/${selectedDate.toISOString().split('T')[0]}/`);
      setAttendanceData(data.shifts);
    } catch (error) {
      toast.error('Failed to fetch attendance data');
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedDate, selectedShift, fetchAttendanceData]);

  // Handle attendance marking
  const handleMarkAttendance = async (staffId, status, remarks) => {
    try {
      await api.post(`/attendance/${staffId}/`, {
        status,
        remarks
      });
      toast.success('Attendance marked successfully');
      fetchAttendanceData(); // Refresh data
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to mark attendance');
      console.error('Error marking attendance:', error);
    }
  };

  // Check if attendance can be edited
  const canEditAttendance = (shiftEndTime) => {
    const now = new Date();
    const oneHourAfterShift = new Date(shiftEndTime.getTime() + 60 * 60 * 1000);
    return now <= oneHourAfterShift;
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  // Handle staff selection for attendance marking
  const handleStaffSelect = (staff) => {
    setSelectedStaff(staff);
    setShowModal(true);
  };

  return (
    <div className="attendance-page">
      <div className="container-fluid py-4">
        <div className="row mb-4">
          <div className="col">
            <h2>Attendance Management</h2>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12 col-lg-8">
            <AttendanceFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
          <div className="col-12 col-lg-4">
            <ShiftSelector
              selectedDate={selectedDate}
              selectedShift={selectedShift}
              onDateChange={setSelectedDate}
              onShiftChange={setSelectedShift}
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            {loading ? (
              <div className="text-center py-5">
                <LoadingSpinner />
              </div>
            ) : (
              <AttendanceTable
                data={attendanceData}
                onMarkAttendance={handleStaffSelect}
                canEditAttendance={canEditAttendance}
                filters={filters}
              />
            )}
          </div>
        </div>
      </div>

      <AttendanceModal
        show={showModal}
        onHide={() => setShowModal(false)}
        staff={selectedStaff}
        onSubmit={handleMarkAttendance}
        canEdit={selectedStaff ? canEditAttendance(selectedStaff.shiftEndTime) : false}
      />

      <style jsx>{`
        .attendance-page {
          min-height: calc(100vh - 64px);
          background-color: var(--background);
        }

        @media (max-width: 768px) {
          .container-fluid {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AttendancePage; 