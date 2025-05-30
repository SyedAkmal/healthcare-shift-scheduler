import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ShiftScheduler from './components/ShiftScheduler/ShiftScheduler';
import AttendanceTracker from './components/AttendanceTracker/AttendanceTracker';
import StaffList from './components/StaffList/StaffList';
import AdminAddStaff from './components/Admin/AdminAddStaff';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/login" component={Login} />
        <Route path="/shifts" component={ShiftScheduler} />
        <Route path="/attendance" component={AttendanceTracker} />
        <Route path="/staff" component={StaffList} />
        <Route path="/admin/add-staff" component={AdminAddStaff} />
      </Switch>
    </Router>
  );
};

export default App;