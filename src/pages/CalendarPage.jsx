import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CalendarView from '../components/calendar/CalendarView';
import CalendarToolbar from '../components/calendar/CalendarToolbar';
import EventDetailsSidebar from '../components/calendar/EventDetailsSidebar';
import MiniCalendar from '../components/calendar/MiniCalendar';
import ScheduleLegend from '../components/calendar/ScheduleLegend';
import EventModal from '../components/calendar/EventModal';
import { fetchEvents, setCurrentView, setCurrentDate } from '../store/slices/calendarSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CalendarPage = () => {
  const dispatch = useDispatch();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const {
    events,
    currentView,
    currentDate,
    selectedEvent,
    loading,
    filters
  } = useSelector(state => state.calendar);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Fetch events for the current view's date range
    dispatch(fetchEvents({
      start: currentDate,
      view: currentView,
      filters
    }));
  }, [dispatch, currentDate, currentView, filters]);

  const handleViewChange = (view) => {
    dispatch(setCurrentView(view));
  };

  const handleDateChange = (date) => {
    // Convert Date object to ISO string before dispatching
    const isoDate = date instanceof Date ? date.toISOString() : date;
    dispatch(setCurrentDate(isoDate));
  };

  const handleEventClick = (eventInfo) => {
    setSidebarOpen(true);
  };

  if (loading.events) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="calendar-page">
      <div className="calendar-container">
        <div className="calendar-header">
          <CalendarToolbar
            view={currentView}
            date={currentDate}
            onViewChange={handleViewChange}
            onDateChange={handleDateChange}
          />
        </div>

        <div className="calendar-content">
          <div className="calendar-sidebar">
            <MiniCalendar
              selectedDate={currentDate}
              onDateSelect={handleDateChange}
              events={events}
            />
            <ScheduleLegend />
          </div>

          <div className="calendar-main">
            <CalendarView
              events={events}
              view={currentView}
              date={currentDate}
              onEventClick={handleEventClick}
              onViewChange={handleViewChange}
              onDateChange={handleDateChange}
            />
          </div>

          <EventDetailsSidebar
            isOpen={isSidebarOpen}
            onClose={() => setSidebarOpen(false)}
            event={selectedEvent}
          />
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        event={selectedEvent}
      />

      <style jsx>{`
        .calendar-page {
          height: calc(100vh - 64px);
          background-color: #ffffff;
          padding: 1.5rem;
        }

        .calendar-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .calendar-header {
          background-color: #ffffff;
          border-bottom: 1px solid #dee2e6;
          padding-bottom: 1rem;
        }

        .calendar-content {
          flex: 1;
          display: flex;
          gap: 1.5rem;
          min-height: 0; /* Important for Firefox */
        }

        .calendar-sidebar {
          width: ${isMobile ? '0' : '300px'};
          display: ${isMobile ? 'none' : 'flex'};
          flex-direction: column;
          gap: 1.5rem;
          overflow-y: auto;
        }

        .calendar-main {
          flex: 1;
          min-width: 0; /* Important for Firefox */
          background-color: #ffffff;
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .calendar-page {
            padding: 1rem;
          }

          .calendar-content {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default CalendarPage; 