import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { setFilters, clearFilters } from '../../store/slices/staffSlice';

const StaffFilters = () => {
  const dispatch = useDispatch();
  const { 
    filters, 
    roles = [], 
    departments = [], 
    rolesLoading, 
    departmentsLoading 
  } = useSelector((state) => state.staff);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      dispatch(setFilters({ search: value }));
    }, 300),
    [dispatch]
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ [name]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    // Clear the search input value
    document.getElementById('searchInput').value = '';
  };

  const renderSelectOptions = (items, loading, type) => {
    if (loading) {
      return <option value="">Loading {type}...</option>;
    }
    
    if (!Array.isArray(items) || items.length === 0) {
      return <option value="">No {type} available</option>;
    }

    return (
      <>
        <option value="">All {type}s</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </>
    );
  };

  return (
    <div className="staff-filters mb-4">
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              id="searchInput"
              type="text"
              className="form-control"
              placeholder="Search by name or staff ID..."
              defaultValue={filters.search}
              onChange={handleSearchChange}
            />
            {filters.search && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => {
                  document.getElementById('searchInput').value = '';
                  dispatch(setFilters({ search: '' }));
                }}
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>

        <div className="col-12 col-md-2">
          <select
            className="form-select"
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            disabled={rolesLoading}
          >
            {renderSelectOptions(roles, rolesLoading, 'Role')}
          </select>
        </div>

        <div className="col-12 col-md-2">
          <select
            className="form-select"
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            disabled={departmentsLoading}
          >
            {renderSelectOptions(departments, departmentsLoading, 'Department')}
          </select>
        </div>

        <div className="col-12 col-md-2">
          <select
            className="form-select"
            name="shiftPreference"
            value={filters.shiftPreference}
            onChange={handleFilterChange}
          >
            <option value="">All Shifts</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Night">Night</option>
            <option value="Flexible">Flexible</option>
          </select>
        </div>

        <div className="col-12 col-md-2">
          <button
            className="btn btn-secondary w-100"
            onClick={handleClearFilters}
            disabled={!Object.values(filters).some(Boolean)}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <style jsx>{`
        .staff-filters {
          background-color: var(--background);
          padding: 1rem;
          border-radius: var(--border-radius);
          border: 1px solid var(--border);
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

        .form-control:disabled,
        .form-select:disabled {
          background-color: var(--hover);
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .staff-filters {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default StaffFilters; 