import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedStaff,
  setCurrentStaff,
  setShowModal,
  setModalMode,
  setSorting,
  deleteStaffMember,
  bulkDeleteStaffMembers,
  clearFilters
} from '../../store/slices/staffSlice';
import StaffCard from './StaffCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { showNotification } from '../../store/slices/uiSlice';

const StaffList = () => {
  const dispatch = useDispatch();
  const {
    staffList,
    loading,
    selectedStaff,
    sorting: { field, direction },
    filters
  } = useSelector((state) => state.staff);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  const handleSort = (sortField) => {
    const newDirection = field === sortField && direction === 'asc' ? 'desc' : 'asc';
    dispatch(setSorting({ field: sortField, direction: newDirection }));
  };

  const getSortIcon = (sortField) => {
    if (field !== sortField) return 'bi-arrow-down-up';
    return direction === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  };

  const handleEdit = (staff) => {
    dispatch(setCurrentStaff(staff));
    dispatch(setModalMode('edit'));
    dispatch(setShowModal(true));
  };

  const handleDelete = (staff) => {
    setStaffToDelete(staff);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      if (staffToDelete) {
        await dispatch(deleteStaffMember(staffToDelete.id)).unwrap();
      } else {
        await dispatch(bulkDeleteStaffMembers(selectedStaff)).unwrap();
      }
      setShowDeleteConfirm(false);
      setStaffToDelete(null);
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: 'Failed to delete staff member(s)'
      }));
    }
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    dispatch(setSelectedStaff(checked ? staffList.map(staff => staff.id) : []));
  };

  const handleSelectOne = (staffId) => {
    const newSelected = selectedStaff.includes(staffId)
      ? selectedStaff.filter(id => id !== staffId)
      : [...selectedStaff, staffId];
    dispatch(setSelectedStaff(newSelected));
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const isMobile = window.innerWidth < 768;
  const hasStaff = Array.isArray(staffList) && staffList.length > 0;
  const hasFilters = Object.values(filters).some(Boolean);

  const EmptyState = () => (
    <div className="empty-state text-center py-5">
      <i className="bi bi-people display-1 text-muted mb-4"></i>
      <h3 className="text-muted">No Staff Members Found</h3>
      <p className="text-muted mb-4">
        {hasFilters 
          ? "No staff members match your current filters. Try adjusting your search criteria."
          : "There are no staff members yet. Add your first staff member to get started."}
      </p>
      {hasFilters && (
        <button
          className="btn btn-outline-primary"
          onClick={() => dispatch(clearFilters())}
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  if (!hasStaff) {
    return <EmptyState />;
  }

  return (
    <>
      {isMobile ? (
        <div className="staff-cards">
          {staffList.map((staff) => (
            <StaffCard
              key={staff.id}
              staff={staff}
              onEdit={() => handleEdit(staff)}
              onDelete={() => handleDelete(staff)}
              selected={selectedStaff.includes(staff.id)}
              onSelect={() => handleSelectOne(staff.id)}
            />
          ))}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedStaff.length === staffList.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                  Name <i className={`bi ${getSortIcon('name')}`}></i>
                </th>
                <th onClick={() => handleSort('staffId')} style={{ cursor: 'pointer' }}>
                  Staff ID <i className={`bi ${getSortIcon('staffId')}`}></i>
                </th>
                <th onClick={() => handleSort('role')} style={{ cursor: 'pointer' }}>
                  Role <i className={`bi ${getSortIcon('role')}`}></i>
                </th>
                <th onClick={() => handleSort('department')} style={{ cursor: 'pointer' }}>
                  Department <i className={`bi ${getSortIcon('department')}`}></i>
                </th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <tr key={staff.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedStaff.includes(staff.id)}
                      onChange={() => handleSelectOne(staff.id)}
                    />
                  </td>
                  <td>{staff.name}</td>
                  <td>{staff.staffId}</td>
                  <td>{staff.role}</td>
                  <td>{staff.department}</td>
                  <td>{staff.contactNumber}</td>
                  <td>
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(staff)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(staff)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setStaffToDelete(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {staffToDelete ? (
                  <p>Are you sure you want to delete {staffToDelete.name}?</p>
                ) : (
                  <p>Are you sure you want to delete {selectedStaff.length} selected staff members?</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setStaffToDelete(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </div>
      )}

      <style jsx>{`
        .table {
          background-color: var(--background);
          color: var(--text);
        }

        .table th {
          border-color: var(--border);
          background-color: var(--background);
          color: var(--text);
        }

        .table td {
          border-color: var(--border);
          vertical-align: middle;
        }

        .table-hover tbody tr:hover {
          background-color: var(--hover);
        }

        .staff-cards {
          display: grid;
          gap: 1rem;
          padding: 1rem 0;
        }

        .modal-content {
          background-color: var(--background);
          color: var(--text);
        }

        .modal-header {
          border-bottom-color: var(--border);
        }

        .modal-footer {
          border-top-color: var(--border);
        }

        .empty-state {
          padding: 2rem;
          background-color: var(--background);
          border-radius: var(--border-radius);
          border: 1px dashed var(--border);
        }

        .empty-state i {
          opacity: 0.5;
        }

        @media (max-width: 768px) {
          .staff-cards {
            grid-template-columns: 1fr;
          }
        }

        @media (min-width: 769px) {
          .staff-cards {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          }
        }
      `}</style>
    </>
  );
};

export default StaffList; 