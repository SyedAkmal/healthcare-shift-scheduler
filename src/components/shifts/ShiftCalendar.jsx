import React from 'react';
import { useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import LoadingSpinner from '../common/LoadingSpinner';

const ShiftCalendar = ({ onDateChange, onViewChange }) => {
  const shiftState = useSelector((state) => state.shifts);
  const calendarEvents = shiftState?.calendarEvents || [];
  const selectedDate = shiftState?.selectedDate;
  const calendarView = shiftState?.calendarView;
  const isLoading = shiftState?.loading?.shifts || false;

  if (isLoading) {
    return (
      <div className="shift-calendar card">
        <div className="card-body text-center">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="shift-calendar card">
      <div className="card-body">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={calendarView}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={calendarEvents}
          initialDate={selectedDate}
          editable={false}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          datesSet={(dateInfo) => {
            onDateChange?.(dateInfo.start);
          }}
          viewDidMount={(view) => {
            onViewChange?.(view.view.type);
          }}
        />
      </div>

      <style jsx>{`
        .shift-calendar {
          background-color: var(--background);
          border-color: var(--border);
        }

        .card-body {
          padding: 1rem;
        }

        :global(.fc) {
          background-color: var(--background);
          color: var(--text);
        }

        :global(.fc-toolbar-title) {
          color: var(--text);
        }

        :global(.fc-button) {
          background-color: var(--primary) !important;
          border-color: var(--primary) !important;
        }

        :global(.fc-button:hover) {
          background-color: var(--primary-dark) !important;
          border-color: var(--primary-dark) !important;
        }

        :global(.fc-day) {
          background-color: var(--background);
        }

        :global(.fc-day-today) {
          background-color: var(--hover) !important;
        }

        :global(.fc-event) {
          cursor: pointer;
          border-radius: var(--border-radius);
        }

        :global(.fc-event:hover) {
          filter: brightness(0.9);
        }

        @media (max-width: 768px) {
          .card-body {
            padding: 0.5rem;
          }

          :global(.fc-toolbar) {
            flex-direction: column;
            gap: 0.5rem;
          }

          :global(.fc-toolbar-title) {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ShiftCalendar; 