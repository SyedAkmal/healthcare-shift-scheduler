import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaClock,
  FaChartBar,
  FaCog,
} from 'react-icons/fa';

const Sidebar = ({ isOpen }) => {
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { path: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
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

      <style jsx>{`
        .sidebar {
          position: fixed;
          top: 56px;
          left: 0;
          bottom: 0;
          width: 250px;
          background-color: var(--background);
          border-right: 1px solid var(--border);
          transform: translateX(-100%);
          transition: transform var(--transition-speed) var(--transition-ease);
          z-index: 900;
          overflow-y: auto;
        }

        .sidebar.open {
          transform: translateX(0);
        }

        .nav-link {
          display: flex;
          align-items: center;
          padding: 1rem;
          color: var(--text);
          text-decoration: none;
          transition: background-color var(--transition-speed) var(--transition-ease);
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
        }

        .label {
          font-size: 0.9rem;
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