import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { debounce } from 'lodash';
import { setFilters } from '../../store/slices/shiftSlice';
import LoadingSpinner from '../common/LoadingSpinner';

const StaffPool = () => {
  const dispatch = useDispatch();
  const shiftState = useSelector((state) => state.shifts);
  const availableStaff = shiftState?.availableStaff || [];
  const staffAvailability = shiftState?.staffAvailability || {};
  const selectedShift = shiftState?.selectedShift;
  const isLoading = shiftState?.loading?.staff || false;
  const filters = shiftState?.filters || {};
  const [searchTerm, setSearchTerm] = useState('');

  // Debounced search handler
  const debouncedSearch = debounce((value) => {
    dispatch(setFilters({ search: value }));
  }, 300);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ [name]: value }));
  };

  const getAvailabilityStatus = (staffId) => {
    if (!selectedShift || !staffAvailability[staffId]) return 'unknown';
    const availability = staffAvailability[staffId];
    
    if (availability.conflicts.length > 0) return 'unavailable';
    if (availability.partiallyAvailable) return 'partial';
    return 'available';
  };

  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'available':
        return '#28a745';
      case 'partial':
        return '#ffc107';
      case 'unavailable':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  if (isLoading) {
    return (
      <div className="staff-pool card">
        <div className="card-body text-center">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="staff-pool card">
      <div className="card-header">
        <h5 className="mb-0">Available Staff</h5>
      </div>

      <div className="card-body">
        <div className="filters mb-3">
          <div className="search-box mb-2">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    dispatch(setFilters({ search: '' }));
                  }}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>

          <div className="row g-2">
            <div className="col-6">
              <select
                className="form-select"
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
              >
                <option value="">All Roles</option>
                <option value="nurse">Nurse</option>
                <option value="doctor">Doctor</option>
                <option value="specialist">Specialist</option>
              </select>
            </div>
            <div className="col-6">
              <select
                className="form-select"
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
              >
                <option value="">All Departments</option>
                <option value="emergency">Emergency</option>
                <option value="surgery">Surgery</option>
                <option value="pediatrics">Pediatrics</option>
              </select>
            </div>
          </div>
        </div>

        <Droppable droppableId="staffPool">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`staff-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
            >
              {availableStaff.length === 0 ? (
                <div className="text-center text-muted p-3">
                  <p>No staff members found</p>
                  <small>Try adjusting your filters</small>
                </div>
              ) : (
                availableStaff.map((staff, index) => {
                  const availabilityStatus = getAvailabilityStatus(staff.id);
                  return (
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
                            <div className="staff-name">
                              {staff.name}
                              <span
                                className="availability-indicator"
                                style={{
                                  backgroundColor: getAvailabilityColor(availabilityStatus)
                                }}
                                title={`${availabilityStatus.charAt(0).toUpperCase()}${availabilityStatus.slice(1)}`}
                              ></span>
                            </div>
                            <div className="staff-details">
                              <span className="badge bg-primary me-2">{staff.role}</span>
                              <small className="text-muted">{staff.department}</small>
                            </div>
                          </div>
                          <div className="staff-preferences">
                            {staff.shiftPreference && (
                              <span className="badge bg-secondary">
                                Prefers {staff.shiftPreference}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>

      <style jsx>{`
        .staff-pool {
          background-color: var(--background);
          border-color: var(--border);
        }

        .card-header {
          background-color: var(--background);
          border-bottom-color: var(--border);
        }

        .input-group-text {
          background-color: var(--background);
          border-color: var(--border);
          color: var(--text);
        }

        .form-control,
        .form-select {
          background-color: var(--background);
          border-color: var(--border);
          color: var(--text);
        }

        .form-control:focus,
        .form-select:focus {
          background-color: var(--background);
          border-color: var(--primary);
          color: var(--text);
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }

        .staff-list {
          max-height: 400px;
          overflow-y: auto;
          padding: 0.5rem;
          border: 2px dashed var(--border);
          border-radius: var(--border-radius);
        }

        .staff-list.dragging-over {
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
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .availability-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }

        .staff-details {
          margin-top: 0.25rem;
        }

        .staff-preferences {
          margin-left: 1rem;
        }

        @media (max-width: 768px) {
          .staff-list {
            max-height: 300px;
          }

          .staff-card {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default StaffPool; 