import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const MiniCalendar = ({ date, onDateSelect }) => {
  const handleDateSelect = (selectInfo) => {
    onDateSelect?.(selectInfo.start.toISOString());
  };

  return (
    <div className="mini-calendar">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate={date}
        headerToolbar={false}
        height="auto"
        selectable={true}
        select={handleDateSelect}
        dayMaxEvents={0}
        showNonCurrentDates={false}
      />

      <style jsx>{`
        .mini-calendar {
          background: #ffffff;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          padding: 1rem;
          margin-bottom: 1rem;

          :global(.fc) {
            font-size: 0.875rem;
          }

          :global(.fc-theme-standard) {
            --fc-border-color: #e9ecef;
            --fc-today-bg-color: #f8f9fa;
          }

          :global(.fc-daygrid-day) {
            height: 2rem !important;
          }

          :global(.fc-daygrid-day-frame) {
            min-height: auto !important;
          }

          :global(.fc-daygrid-day-top) {
            justify-content: center;
            padding-top: 0.25rem;
          }

          :global(.fc-day-today) {
            background-color: var(--fc-today-bg-color) !important;
          }

          :global(.fc-day-other) {
            background-color: #f8f9fa;
          }

          :global(.fc-col-header-cell) {
            padding: 0.5rem 0;
            font-weight: 500;
            color: #6c757d;
          }

          :global(.fc-daygrid-day-number) {
            padding: 0;
            color: #212529;
          }

          :global(.fc-highlight) {
            background-color: rgba(13, 110, 253, 0.1) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MiniCalendar; 