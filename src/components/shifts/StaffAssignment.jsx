import React from 'react';
import { useSelector } from 'react-redux';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import LoadingSpinner from '../common/LoadingSpinner';

const StaffAssignment = () => {
  const shiftState = useSelector((state) => state.shifts);
  const selectedShift = shiftState?.selectedShift;
  const assignedStaff = shiftState?.assignedStaff || {};
  const isLoading = shiftState?.loading?.assignment || false;
  const activeConflicts = shiftState?.activeConflicts || [];

  if (!selectedShift) {
    return (
      <div className="staff-assignment card">
        <div className="card-body text-center text-muted">
          <i className="bi bi-calendar-plus display-4"></i>
          <p className="mt-3">Select a shift to manage staff assignments</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="staff-assignment card">
        <div className="card-body text-center">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  const assignedStaffList = assignedStaff[selectedShift.id] || [];
  const hasConflicts = activeConflicts.some(c => 
    c.shiftId === selectedShift.id && !c.resolved
  );

  return (
    <div className="staff-assignment card">
      <div className="card-header">
        <h5 className="mb-0">Staff Assignment</h5>
        <div className="shift-info">
          <span className="badge bg-primary me-2">{selectedShift.type}</span>
          <small>
            {new Date(selectedShift.startTime).toLocaleTimeString()} - 
            {new Date(selectedShift.endTime).toLocaleTimeString()}
          </small>
        </div>
      </div>

      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="assignment-section">
              <h6 className="section-title">
                Assigned Staff ({assignedStaffList.length}/{selectedShift.capacity})
              </h6>
              <Droppable droppableId="assigned">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`assignment-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                  >
                    {assignedStaffList.length === 0 ? (
                      <div className="text-center text-muted p-3">
                        <p>No staff assigned yet</p>
                        <small>Drag staff members here to assign them</small>
                      </div>
                    ) : (
                      assignedStaffList.map((staff, index) => (
                        <Draggable
                          key={staff.id}
                          draggableId={staff.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`staff-card ${snapshot.isDragging ? 'dragging' : ''}`}
                            >
                              <div className="staff-info">
                                <div className="staff-name">{staff.name}</div>
                                <div className="staff-role">{staff.role}</div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
      </div>

      {hasConflicts && (
        <div className="card-footer text-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          There are unresolved conflicts for this shift
        </div>
      )}

      <style jsx>{`
        .staff-assignment {
          background-color: var(--background);
          border-color: var(--border);
        }

        .card-header {
          background-color: var(--background);
          border-bottom-color: var(--border);
        }

        .card-footer {
          background-color: var(--background);
          border-top-color: var(--border);
        }

        .shift-info {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .section-title {
          margin-bottom: 1rem;
          color: var(--text);
        }

        .assignment-list {
          min-height: 200px;
          padding: 1rem;
          border: 2px dashed var(--border);
          border-radius: var(--border-radius);
          background-color: var(--background);
        }

        .assignment-list.dragging-over {
          border-color: var(--primary);
          background-color: var(--hover);
        }

        .staff-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          background-color: var(--background);
          border: 1px solid var(--border);
          border-radius: var(--border-radius);
          cursor: grab;
        }

        .staff-card.dragging {
          opacity: 0.5;
        }

        .staff-info {
          flex: 1;
        }

        .staff-name {
          font-weight: 500;
          color: var(--text);
        }

        .staff-role {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .assignment-list {
            min-height: 150px;
          }
        }
      `}</style>
    </div>
  );
};

export default StaffAssignment; 