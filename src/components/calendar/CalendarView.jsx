import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { setSelectedEvent } from '../../store/slices/calendarSlice';

const CalendarView = ({
  events,
  view,
  date,
  onEventClick,
  onViewChange,
  onDateChange
}) => {
  const dispatch = useDispatch();

  const handleEventContent = useCallback((eventInfo) => {
    const { event } = eventInfo;
    const shiftType = event.extendedProps.shiftType;
    const staffCount = event.extendedProps.staffCount || 0;
    const capacity = event.extendedProps.capacity || 0;
    const hasConflicts = event.extendedProps.conflicts?.length > 0;

    return {
      html: `
        <div class="shift-event shift-${shiftType?.toLowerCase()}">
          <div class="shift-header">
            <span class="shift-type">${shiftType}</span>
            ${hasConflicts ? '<i class="conflict-icon">⚠️</i>' : ''}
          </div>
          <div class="shift-details">
            <span class="staff-count">${staffCount}/${capacity}</span>
            <div class="capacity-bar">
              <div class="capacity-fill" style="width: ${(staffCount/capacity)*100}%"></div>
            </div>
          </div>
        </div>
      `
    };
  }, []);

  const handleEventClick = useCallback((clickInfo) => {
    dispatch(setSelectedEvent(clickInfo.event));
    onEventClick?.(clickInfo);
  }, [dispatch, onEventClick]);

  const handleDatesSet = useCallback((dateInfo) => {
    onDateChange?.(dateInfo.start);
  }, [onDateChange]);

  const handleViewDidMount = useCallback((viewInfo) => {
    onViewChange?.(viewInfo.view.type);
  }, [onViewChange]);

  return (
    <div className="calendar-view">
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          listPlugin,
          interactionPlugin
        ]}
        initialView={view}
        initialDate={date}
        events={events}
        eventContent={handleEventContent}
        eventClick={handleEventClick}
        datesSet={handleDatesSet}
        viewDidMount={handleViewDidMount}
        headerToolbar={false}
        height="100%"
        aspectRatio={1.8}
        firstDay={1}
        weekNumbers={true}
        editable={false}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={3}
        weekends={true}
        nowIndicator={true}
        slotEventOverlap={false}
        allDaySlot={false}
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }}
        views={{
          dayGridMonth: {
            titleFormat: { year: 'numeric', month: 'long' },
            dayMaxEventRows: 3,
            moreLinkClick: 'popover'
          },
          timeGridWeek: {
            slotDuration: '01:00:00',
            slotLabelFormat: {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }
          },
          timeGridDay: {
            slotDuration: '00:30:00',
            slotLabelFormat: {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }
          },
          listWeek: {
            listDayFormat: { weekday: 'long', month: 'short', day: 'numeric' },
            listDaySideFormat: { year: 'numeric' }
          }
        }}
      />

      <style jsx>{`
        .calendar-view {
          height: 100%;
          
          :global(.fc) {
            height: 100%;
            background-color: #ffffff;
            color: #212529;
          }

          :global(.fc-theme-standard) {
            --fc-border-color: #dee2e6;
            --fc-button-bg-color: #0d6efd;
            --fc-button-border-color: #0d6efd;
            --fc-button-hover-bg-color: #0a58ca;
            --fc-today-bg-color: #f8f9fa;
            --fc-page-bg-color: #ffffff;
            --fc-neutral-bg-color: #ffffff;
            --fc-list-event-hover-bg-color: #f8f9fa;
            --fc-highlight-color: rgba(13, 110, 253, 0.1);
          }

          :global(.fc-day-today) {
            background-color: var(--fc-today-bg-color) !important;
          }

          :global(.fc-button) {
            background-color: var(--fc-button-bg-color) !important;
            border-color: var(--fc-button-border-color) !important;
            color: #ffffff !important;
          }

          :global(.fc-button:hover) {
            background-color: var(--fc-button-hover-bg-color) !important;
            border-color: var(--fc-button-hover-bg-color) !important;
          }

          :global(.fc-button-active) {
            background-color: var(--fc-button-hover-bg-color) !important;
            border-color: var(--fc-button-hover-bg-color) !important;
          }

          :global(.fc-timegrid-slot-label),
          :global(.fc-timegrid-axis-cushion),
          :global(.fc-col-header-cell) {
            color: #212529;
          }

          :global(.fc-timegrid-slot) {
            height: 40px !important;
          }

          :global(.fc-list-day-cushion) {
            background-color: #f8f9fa !important;
          }

          :global(.fc-list-event:hover td) {
            background-color: #f8f9fa !important;
          }

          :global(.shift-event) {
            border-radius: 4px;
            padding: 2px 4px;
            margin: 1px 0;
            font-size: 11px;

            &.shift-morning {
              background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
              border-left: 3px solid #ffc107;
              color: #856404;
            }

            &.shift-afternoon {
              background: linear-gradient(135deg, #cce5ff 0%, #a8d8ff 100%);
              border-left: 3px solid #007bff;
              color: #004085;
            }

            &.shift-night {
              background: linear-gradient(135deg, #e2d5f1 0%, #d1c4e9 100%);
              border-left: 3px solid #6f42c1;
              color: #432874;
            }
          }

          :global(.capacity-bar) {
            width: 100%;
            height: 3px;
            background: rgba(0,0,0,0.1);
            border-radius: 2px;
            overflow: hidden;
            margin-top: 2px;

            .capacity-fill {
              height: 100%;
              background: currentColor;
              transition: width 0.3s ease;
            }
          }

          :global(.conflict-icon) {
            color: #dc3545;
            font-size: 10px;
            margin-left: 2px;
          }

          @media (max-width: 768px) {
            :global(.fc-toolbar) {
              flex-direction: column;
              gap: 10px;
            }

            :global(.fc-button-group) {
              display: flex;
              justify-content: center;
            }

            :global(.fc-timegrid-slot) {
              height: 35px !important;
            }
          }
        }
      `}</style>
    </div>
  );
};

export default CalendarView; 