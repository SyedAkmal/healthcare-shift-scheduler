import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { FaBars, FaUser } from 'react-icons/fa';

const Header = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      navigate('/login');
    });
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
          background-color: #ffffff;
          border-bottom: 1px solid #dee2e6;
          padding: 0.5rem 1rem;
          z-index: 1000;
        }

        .navbar-brand {
          color: #212529;
          font-weight: 600;
          text-decoration: none;
        }

        .btn-link {
          color: #212529;
          text-decoration: none;
        }

        .btn-link:hover {
          color: #0d6efd;
        }

        .dropdown-menu {
          background-color: #ffffff;
          border-color: #dee2e6;
        }

        .dropdown-item {
          color: #212529;
        }

        .dropdown-item:hover {
          background-color: #f8f9fa;
        }

        .dropdown-divider {
          border-color: #dee2e6;
        }
      `}</style>
    </header>
  );
};

export default Header; 