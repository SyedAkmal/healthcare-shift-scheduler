import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaUsers,
  FaCalendarAlt,
  FaClock,
  FaChartBar,
  FaCog
} from 'react-icons/fa';

const Sidebar = ({ isOpen }) => {
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    // { path: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/staff', icon: <FaUsers />, label: 'Staff Management' },
    { path: '/shifts', icon: <FaClock />, label: 'Shift Management' },
    { path: '/calendar', icon: <FaCalendarAlt />, label: 'Calendar' },
    { path: '/attendance', icon: <FaChartBar />, label: 'Attendance' },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ path: '/settings', icon: <FaCog />, label: 'Settings' });
  }

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        {/* <div className="app-brand">
          Healthcare
          <span className="brand-accent">Scheduler</span>
        </div> */}
      </div>

      <div className="sidebar-content">
        <nav className="nav flex-column">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <NavLink to="/profile" className="nav-link">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-role">{user?.role || 'Staff'}</div>
            </div>
          </div>
        </NavLink>
      </div>

      <style jsx>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 250px;
          background-color: var(--background);
          border-right: 1px solid var(--border);
          transform: translateX(-100%);
          transition: transform var(--transition-speed) var(--transition-ease);
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }

        .sidebar.open {
          transform: translateX(0);
        }

        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .app-brand {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text);
        }

        .brand-accent {
          color: var(--primary);
          margin-left: 0.25rem;
        }

        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 0;
        }

        .nav-link {
          display: flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          color: var(--text);
          text-decoration: none;
          transition: all var(--transition-speed) var(--transition-ease);
        }

        .nav-link:hover {
          background-color: var(--hover);
          color: var(--primary);
        }

        .nav-link.active {
          background-color: var(--primary);
          color: white;
        }

        .icon {
          margin-right: 1rem;
          width: 20px;
          text-align: center;
          font-size: 1.1rem;
        }

        .label {
          font-size: 0.9rem;
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid var(--border);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .user-details {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: capitalize;
        }

        @media (min-width: 768px) {
          .sidebar {
            transform: translateX(0);
          }

          .sidebar:not(.open) {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar; 