import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/uiSlice';
import { FaBars, FaSun, FaMoon, FaUser } from 'react-icons/fa';

const Header = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      navigate('/login');
    });
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <header className="navbar navbar-expand-lg sticky-top">
      <div className="container-fluid">
        <button
          className="btn btn-link sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>

        <Link to="/" className="navbar-brand">
          Healthcare Shift Scheduler
        </Link>

        <div className="ms-auto d-flex align-items-center">
          <button
            className="btn btn-link theme-toggle me-3"
            onClick={handleThemeToggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>

          <div className="dropdown">
            <button
              className="btn btn-link dropdown-toggle"
              type="button"
              id="userMenu"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FaUser className="me-2" />
              {user?.name || 'User'}
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
              <li>
                <Link to="/profile" className="dropdown-item">
                  Profile
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          background-color: var(--background);
          border-bottom: 1px solid var(--border);
          padding: 0.5rem 1rem;
          z-index: 1000;
        }

        .navbar-brand {
          color: var(--text);
          font-weight: 600;
          text-decoration: none;
        }

        .btn-link {
          color: var(--text);
          text-decoration: none;
        }

        .btn-link:hover {
          color: var(--primary);
        }

        .dropdown-menu {
          background-color: var(--background);
          border-color: var(--border);
        }

        .dropdown-item {
          color: var(--text);
        }

        .dropdown-item:hover {
          background-color: var(--hover);
        }

        .dropdown-divider {
          border-color: var(--border);
        }
      `}</style>
    </header>
  );
};

export default Header; 