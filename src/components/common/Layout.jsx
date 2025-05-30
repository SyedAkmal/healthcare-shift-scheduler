import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { toggleSidebar } from '../../store/slices/uiSlice';
import Header from './Header';
import Sidebar from './Sidebar';
import LoadingSpinner from './LoadingSpinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/globals.css';

const Layout = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.ui);
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { theme } = useSelector((state) => state.ui);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <div className={`app-container ${theme}`} data-theme={theme}>
      <Header onToggleSidebar={handleToggleSidebar} />
      <div className="d-flex">
        <Sidebar isOpen={sidebarOpen} />
        <main className={`main-content p-4 ${sidebarOpen ? 'with-sidebar' : ''}`}>
          {isLoading && (
            <div className="loading-overlay">
              <LoadingSpinner />
            </div>
          )}
          <Outlet />
        </main>
      </div>

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .main-content {
          flex: 1;
          transition: margin-left var(--transition-speed) var(--transition-ease);
          position: relative;
        }

        .main-content.with-sidebar {
          margin-left: 250px;
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        @media (max-width: 768px) {
          .main-content.with-sidebar {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout; 