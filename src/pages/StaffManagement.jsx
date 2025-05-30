import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStaff,
  fetchRoles,
  fetchDepartments,
  setShowModal,
  setModalMode,
  bulkDeleteStaffMembers
} from '../store/slices/staffSlice';
import StaffFilters from '../components/staff/StaffFilters';
import StaffList from '../components/staff/StaffList';
import StaffForm from '../components/staff/StaffForm';
import { showNotification } from '../store/slices/uiSlice';

const StaffManagement = () => {
  const dispatch = useDispatch();
  const {
    loading,
    error,
    filters,
    sorting,
    pagination,
    selectedStaff,
    showModal
  } = useSelector((state) => state.staff);

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchRoles());
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    // Fetch staff list when filters, sorting, or pagination changes
    const params = {
      ...filters,
      ...sorting,
      page: pagination.currentPage,
      limit: pagination.itemsPerPage
    };
    dispatch(fetchStaff(params));
  }, [dispatch, filters, sorting, pagination.currentPage]);

  const handleAddStaff = () => {
    dispatch(setModalMode('add'));
    dispatch(setShowModal(true));
  };

  const handleBulkDelete = async () => {
    if (selectedStaff.length === 0) {
      dispatch(showNotification({
        type: 'warning',
        message: 'Please select staff members to delete'
      }));
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedStaff.length} staff members?`)) {
      try {
        await dispatch(bulkDeleteStaffMembers(selectedStaff)).unwrap();
      } catch (error) {
        // Error handling is done in the thunk
      }
    }
  };

  return (
    <div className="staff-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Staff Management</h1>
        <div className="btn-group">
          <button
            className="btn btn-danger me-2"
            onClick={handleBulkDelete}
            disabled={selectedStaff.length === 0}
          >
            <i className="bi bi-trash me-2"></i>
            Delete Selected ({selectedStaff.length})
          </button>
          <button
            className="btn btn-primary"
            onClick={handleAddStaff}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Staff
          </button>
        </div>
      </div>

      <StaffFilters />

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <StaffList />

      {showModal && <StaffForm />}

      <style jsx>{`
        .staff-management {
          padding: 1.5rem;
        }

        h1 {
          color: var(--text);
        }

        @media (max-width: 768px) {
          .staff-management {
            padding: 1rem;
          }

          .btn-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .btn-group .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default StaffManagement; 