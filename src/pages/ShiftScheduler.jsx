import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import { fetchShifts, setSelectedDate, setCalendarView, assignStaff, unassignStaff, checkConflicts } from '../store/slices/shiftSlice';
import ShiftCreator from '../components/shifts/ShiftCreator';
import StaffAssignment from '../components/shifts/StaffAssignment';
import ShiftCalendar from '../components/shifts/ShiftCalendar';
import CapacityDashboard from '../components/shifts/CapacityDashboard';
import ConflictAlert from '../components/shifts/ConflictAlert';
import StaffPool from '../components/shifts/StaffPool';
import websocketService from '../services/websocketService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ShiftScheduler = () => {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState('calendar');
  
  const shiftState = useSelector((state) => state.shifts);
  const isLoading = shiftState?.loading?.shifts || false;
  const shifts = shiftState?.shifts || [];
  const selectedDate = shiftState?.selectedDate;
  const calendarView = shiftState?.calendarView;
  const activeConflicts = shiftState?.activeConflicts || [];

  useEffect(() => {
    // Connect to WebSocket
    websocketService.connect();

    // Fetch initial data
    dispatch(fetchShifts({
      date: selectedDate,
      range: calendarView === 'week' ? 7 : 30
    }));

    // Cleanup WebSocket connection
    return () => {
      websocketService.disconnect();
    };
  }, [dispatch, selectedDate, calendarView]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDateChange = (date) => {
    dispatch(setSelectedDate(date));
  };

  const handleViewChange = (view) => {
    dispatch(setCalendarView(view));
  };

  const handleDragEnd = async (result) => {
    if (!result.destination || !shiftState.selectedShift) return;

    const staffId = result.draggableId;
    const shiftId = shiftState.selectedShift.id;

    if (result.source.droppableId === 'staffPool' &&
        result.destination.droppableId === 'assigned') {
      // Check for conflicts before assigning
      const conflicts = await dispatch(checkConflicts({ shiftId, staffId })).unwrap();
      if (conflicts.length > 0) {
        // Conflicts are handled by the ConflictAlert component
        return;
      }
      await dispatch(assignStaff({ shiftId, staffId }));
    } else if (result.source.droppableId === 'assigned' &&
               result.destination.droppableId === 'staffPool') {
      await dispatch(unassignStaff({ shiftId, staffId }));
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const renderEmptyState = () => (
    <div className="text-center my-5">
      <div className="mb-4">
        <i className="bi bi-calendar3 fs-1 text-muted"></i>
      </div>
      <h3>No Shifts Scheduled</h3>
      <p className="text-muted">
        There are no shifts scheduled for this period. Use the shift creator to add new shifts.
      </p>
      {!isMobile && (
        <button
          className="btn btn-primary"
          onClick={() => document.querySelector('.shift-creator form')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Create New Shift
        </button>
      )}
    </div>
  );

  const renderMobileView = () => (
    <div className="mobile-scheduler">
      <nav className="nav nav-pills nav-justified mb-3">
        <button
          className={`nav-link ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          Calendar
        </button>
        <button
          className={`nav-link ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create
        </button>
        <button
          className={`nav-link ${activeTab === 'assign' ? 'active' : ''}`}
          onClick={() => setActiveTab('assign')}
        >
          Assign
        </button>
        <button
          className={`nav-link ${activeTab === 'status' ? 'active' : ''}`}
          onClick={() => setActiveTab('status')}
        >
          Status
        </button>
      </nav>

      {activeTab === 'calendar' && (
        shifts.length === 0 ? renderEmptyState() : <ShiftCalendar />
      )}
      {activeTab === 'create' && <ShiftCreator />}
      {activeTab === 'assign' && (
        shifts.length === 0 ? renderEmptyState() : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <StaffPool />
            <StaffAssignment />
          </DragDropContext>
        )
      )}
      {activeTab === 'status' && (
        <>
          <CapacityDashboard />
          {activeConflicts.length > 0 && <ConflictAlert />}
        </>
      )}
    </div>
  );

  const renderDesktopView = () => (
    <div className="desktop-scheduler d-flex">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="left-panel">
          <ShiftCreator />
          <StaffPool />
        </div>
        
        <div className="center-panel">
          {shifts.length === 0 ? renderEmptyState() : (
            <>
              <ShiftCalendar
                onDateChange={handleDateChange}
                onViewChange={handleViewChange}
              />
              <StaffAssignment />
            </>
          )}
        </div>
      </DragDropContext>
      
      <div className="right-panel">
        <CapacityDashboard />
        {activeConflicts.length > 0 && <ConflictAlert />}
      </div>
    </div>
  );

  return (
    <div className="shift-scheduler">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Shift Scheduler</h1>
      </div>

      {isMobile ? renderMobileView() : renderDesktopView()}

      <style jsx>{`
        .shift-scheduler {
          padding: 1.5rem;
          min-height: calc(100vh - 64px);
          background-color: var(--background);
        }

        .desktop-scheduler {
          gap: 1.5rem;
          height: calc(100vh - 160px);
        }

        .left-panel {
          width: 25%;
          overflow-y: auto;
        }

        .center-panel {
          width: 50%;
          overflow-y: auto;
        }

        .right-panel {
          width: 25%;
          overflow-y: auto;
        }

        .mobile-scheduler {
          height: calc(100vh - 160px);
          overflow-y: auto;
        }

        .nav-pills .nav-link {
          color: var(--text);
          background-color: var(--background);
          border: 1px solid var(--border);
        }

        .nav-pills .nav-link.active {
          background-color: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        @media (max-width: 768px) {
          .shift-scheduler {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ShiftScheduler; 