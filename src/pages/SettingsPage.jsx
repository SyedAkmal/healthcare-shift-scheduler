import React from 'react';
import { useSelector } from 'react-redux';

const SettingsPage = () => {
  const { user } = useSelector((state) => state.auth);

  if (user?.role !== 'admin') {
    return (
      <div className="settings-page">
        <div className="alert alert-danger">
          You don't have permission to access this page.
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Settings</h1>
      </div>

      <div className="row g-4">
        {/* General Settings */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">General Settings</h5>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Organization Name</label>
                  <input type="text" className="form-control" defaultValue="Healthcare Center" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contact Email</label>
                  <input type="email" className="form-control" defaultValue="admin@healthcare.com" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Time Zone</label>
                  <select className="form-select">
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="PST">Pacific Time</option>
                  </select>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Shift Settings */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Shift Settings</h5>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Default Shift Duration (hours)</label>
                  <input type="number" className="form-control" defaultValue={8} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Minimum Rest Period (hours)</label>
                  <input type="number" className="form-control" defaultValue={12} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Maximum Weekly Hours</label>
                  <input type="number" className="form-control" defaultValue={40} />
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Notification Settings</h5>
            </div>
            <div className="card-body">
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" id="emailNotifications" defaultChecked />
                <label className="form-check-label" htmlFor="emailNotifications">
                  Email Notifications
                </label>
              </div>
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" id="smsNotifications" />
                <label className="form-check-label" htmlFor="smsNotifications">
                  SMS Notifications
                </label>
              </div>
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" id="conflictAlerts" defaultChecked />
                <label className="form-check-label" htmlFor="conflictAlerts">
                  Scheduling Conflict Alerts
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">System Settings</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Data Retention Period (months)</label>
                <input type="number" className="form-control" defaultValue={12} />
              </div>
              <div className="mb-3">
                <label className="form-label">Session Timeout (minutes)</label>
                <input type="number" className="form-control" defaultValue={30} />
              </div>
              <button className="btn btn-danger">Clear System Cache</button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .settings-page {
          padding: 1.5rem;
        }

        .card {
          background-color: var(--background);
          border-color: var(--border);
        }

        .card-header {
          background-color: var(--background);
          border-bottom-color: var(--border);
        }

        .form-control,
        .form-select {
          background-color: var(--background);
          border-color: var(--border);
          color: var(--text);
        }

        .form-control:focus,
        .form-select:focus {
          background-color: var(--background);
          border-color: var(--primary);
          color: var(--text);
        }

        .form-check-input:checked {
          background-color: var(--primary);
          border-color: var(--primary);
        }

        @media (max-width: 768px) {
          .settings-page {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SettingsPage; 