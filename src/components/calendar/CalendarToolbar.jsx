import React from 'react';
import { useSelector } from 'react-redux';

const CalendarToolbar = ({
  view,
  date,
  onViewChange,
  onDateChange
}) => {
  const { loading } = useSelector(state => state.calendar);

  const handlePrevClick = () => {
    const newDate = new Date(date);
    switch (view) {
      case 'dayGridMonth':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'timeGridWeek':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'timeGridDay':
      case 'listWeek':
        newDate.setDate(newDate.getDate() - 1);
        break;
      default:
        break;
    }
    onDateChange(newDate.toISOString());
  };

  const handleNextClick = () => {
    const newDate = new Date(date);
    switch (view) {
      case 'dayGridMonth':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'timeGridWeek':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'timeGridDay':
      case 'listWeek':
        newDate.setDate(newDate.getDate() + 1);
        break;
      default:
        break;
    }
    onDateChange(newDate.toISOString());
  };

  const handleTodayClick = () => {
    onDateChange(new Date().toISOString());
  };

  const formatDate = () => {
    const dateObj = new Date(date);
    const options = {
      month: 'long',
      year: 'numeric'
    };

    if (view === 'timeGridDay') {
      options.day = 'numeric';
    } else if (view === 'timeGridWeek') {
      const endDate = new Date(dateObj);
      endDate.setDate(endDate.getDate() + 6);
      return `${dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }

    return dateObj.toLocaleDateString(undefined, options);
  };

  return (
    <div className="calendar-toolbar">
      <div className="toolbar-section">
        <button
          className="btn btn-outline-primary"
          onClick={handleTodayClick}
          disabled={loading.events}
        >
          Today
        </button>
        <div className="btn-group mx-2">
          <button
            className="btn btn-outline-secondary"
            onClick={handlePrevClick}
            disabled={loading.events}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={handleNextClick}
            disabled={loading.events}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
        <h4 className="current-date mb-0">{formatDate()}</h4>
      </div>

      <div className="toolbar-section">
        <div className="btn-group">
          <button
            className={`btn btn-outline-primary ${view === 'dayGridMonth' ? 'active' : ''}`}
            onClick={() => onViewChange('dayGridMonth')}
            disabled={loading.events}
          >
            Month
          </button>
          <button
            className={`btn btn-outline-primary ${view === 'timeGridWeek' ? 'active' : ''}`}
            onClick={() => onViewChange('timeGridWeek')}
            disabled={loading.events}
          >
            Week
          </button>
          <button
            className={`btn btn-outline-primary ${view === 'timeGridDay' ? 'active' : ''}`}
            onClick={() => onViewChange('timeGridDay')}
            disabled={loading.events}
          >
            Day
          </button>
          <button
            className={`btn btn-outline-primary ${view === 'listWeek' ? 'active' : ''}`}
            onClick={() => onViewChange('listWeek')}
            disabled={loading.events}
          >
            Agenda
          </button>
        </div>

        <div className="toolbar-actions ms-3">
          <button
            className="btn btn-outline-secondary"
            onClick={() => window.print()}
            disabled={loading.events}
          >
            <i className="bi bi-printer"></i>
          </button>
          <button
            className="btn btn-outline-secondary ms-2"
            onClick={() => {}} // TODO: Implement export
            disabled={loading.events}
          >
            <i className="bi bi-download"></i>
          </button>
        </div>
      </div>

      <style jsx>{`
        .calendar-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 0;
        }

        .toolbar-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .current-date {
          font-weight: 500;
          color: #212529;
          margin-left: 0.5rem;
          font-size: 1.1rem;
        }

        .btn-outline-primary {
          color: #0d6efd;
          border-color: #0d6efd;
          background-color: transparent;
        }

        .btn-outline-primary:hover,
        .btn-outline-primary.active {
          color: #ffffff;
          background-color: #0d6efd;
          border-color: #0d6efd;
        }

        .btn-outline-secondary {
          color: #6c757d;
          border-color: #6c757d;
          background-color: transparent;
        }

        .btn-outline-secondary:hover {
          color: #ffffff;
          background-color: #6c757d;
          border-color: #6c757d;
        }

        .btn-group {
          display: inline-flex;
        }

        .btn-group .btn {
          border-radius: 0;
        }

        .btn-group .btn:first-child {
          border-top-left-radius: 0.375rem;
          border-bottom-left-radius: 0.375rem;
        }

        .btn-group .btn:last-child {
          border-top-right-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
        }

        @media (max-width: 768px) {
          .calendar-toolbar {
            flex-direction: column;
            gap: 1rem;
          }

          .toolbar-section {
            width: 100%;
            justify-content: center;
          }

          .current-date {
            font-size: 1rem;
          }

          .toolbar-actions {
            display: none;
          }

          .btn-group {
            flex-wrap: nowrap;
            width: 100%;
          }

          .btn-group .btn {
            flex: 1;
            padding: 0.375rem 0.5rem;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CalendarToolbar; 