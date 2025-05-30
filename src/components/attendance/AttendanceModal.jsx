import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const AttendanceModal = ({ show, onHide, staff, onSubmit, canEdit }) => {
  const [formData, setFormData] = useState({
    status: '',
    remarks: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (staff?.attendance) {
      setFormData({
        status: staff.attendance.status || '',
        remarks: staff.attendance.remarks || ''
      });
    } else {
      setFormData({
        status: '',
        remarks: ''
      });
    }
  }, [staff]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.status) {
      newErrors.status = 'Please select attendance status';
    }
    if (formData.remarks && formData.remarks.length > 200) {
      newErrors.remarks = 'Remarks must be less than 200 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(staff.id, formData.status, formData.remarks);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {staff?.attendance?.status ? 'Update Attendance' : 'Mark Attendance'}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {staff && (
            <div className="staff-info mb-4">
              <h6 className="mb-3">Staff Details</h6>
              <div className="row g-2">
                <div className="col-6">
                  <label className="text-muted small">Staff ID</label>
                  <p className="mb-1">{staff.staff.staffId}</p>
                </div>
                <div className="col-6">
                  <label className="text-muted small">Name</label>
                  <p className="mb-1">{staff.staff.name}</p>
                </div>
                <div className="col-6">
                  <label className="text-muted small">Role</label>
                  <p className="mb-1">{staff.staff.role}</p>
                </div>
                <div className="col-6">
                  <label className="text-muted small">Shift</label>
                  <p className="mb-1">{staff.shiftType}</p>
                </div>
              </div>
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Attendance Status</Form.Label>
            <Form.Select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              isInvalid={!!errors.status}
              disabled={!canEdit}
            >
              <option value="">Select Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.status}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Remarks</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Add remarks (optional)"
              value={formData.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
              isInvalid={!!errors.remarks}
              disabled={!canEdit}
            />
            <Form.Text className="text-muted">
              {formData.remarks.length}/200 characters
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {errors.remarks}
            </Form.Control.Feedback>
          </Form.Group>

          {!canEdit && (
            <div className="alert alert-warning">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Attendance can only be marked/updated within 1 hour after shift end.
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={!canEdit}
          >
            {staff?.attendance?.status ? 'Update' : 'Mark Attendance'}
          </Button>
        </Modal.Footer>
      </Form>

      <style jsx>{`
        :global(.modal-content) {
          background-color: var(--background);
          border-color: var(--border);
        }

        :global(.modal-header) {
          border-bottom-color: var(--border);
        }

        :global(.modal-footer) {
          border-top-color: var(--border);
        }

        .staff-info {
          background-color: var(--background-light);
          padding: 1rem;
          border-radius: var(--border-radius);
        }

        .staff-info label {
          display: block;
          margin-bottom: 0.25rem;
        }

        .staff-info p {
          font-weight: 500;
          color: var(--text);
        }
      `}</style>
    </Modal>
  );
};

export default AttendanceModal; 