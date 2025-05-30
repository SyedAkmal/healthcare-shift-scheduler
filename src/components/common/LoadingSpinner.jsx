import React from 'react';

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return '1rem';
      case 'large':
        return '3rem';
      default:
        return '2rem';
    }
  };

  return (
    <div
      className={`loading-spinner ${className}`}
      role="status"
      aria-label="Loading"
      style={{ width: getSize(), height: getSize() }}
    >
      <span className="visually-hidden">Loading...</span>

      <style jsx>{`
        .loading-spinner {
          display: inline-block;
          border: 3px solid var(--border);
          border-radius: 50%;
          border-top-color: var(--primary);
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner; 