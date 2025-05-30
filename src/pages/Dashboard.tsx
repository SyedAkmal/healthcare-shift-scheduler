import React from 'react';
import AdminAddStaff from '../components/Admin/AdminAddStaff';
import ShiftScheduler from '../components/ShiftScheduler/ShiftScheduler';
import AttendanceTracker from '../components/AttendanceTracker/AttendanceTracker';
import StaffList from '../components/StaffList/StaffList';

const Dashboard: React.FC = () => {
    return (
        <div>
            <h1>Healthcare Staff Dashboard</h1>
            <AdminAddStaff />
            <ShiftScheduler />
            <AttendanceTracker />
            <StaffList />
        </div>
    );
};

export default Dashboard;