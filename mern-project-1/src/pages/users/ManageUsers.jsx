import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../../config/config";
import { Modal } from "react-bootstrap";
import {
  FaUsers,
  FaPlus,
  FaEnvelope,
  FaUser,
  FaShieldAlt,
  FaSearch,
  FaFilter,
  FaArrowRight,
} from "react-icons/fa";

const USER_ROLES = ["viewer", "developer"];

function ManageUsers() {
  const [errors, setErrors] = useState({});
  const [usersData, setUsersData] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");

  const handleModalShow = (isEdit, data = {}) => {
    if (isEdit) {
      setFormData({
        id: data._id,
        email: data.email,
        role: data.role,
        name: data.name,
      });
    } else {
      setFormData({
        email: "",
        role: "",
        name: "",
      });
    }
    setIsEdit(isEdit);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteModalShow = (userId) => {
    setFormData({
      id: userId,
    });
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteSubmit = async () => {
    try {
      setFormLoading(true);
      await axios.delete(`${serverEndpoint}/users/${formData.id}`, {
        withCredentials: true,
      });
      setFormData({
        email: "",
        role: "",
        name: "",
      });
      fetchUsers();
    } catch (error) {
      setErrors({ message: "Something went wrong, please try again" });
    } finally {
      handleDeleteModalClose();
      setFormLoading(false);
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;
    if (formData.email.length === 0) {
      newErrors.email = "Email is mandatory";
      isValid = false;
    }

    if (formData.role.length === 0) {
      newErrors.role = "Role is mandatory";
      isValid = false;
    }

    if (formData.name.length === 0) {
      newErrors.name = "Name is mandatory";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validate()) {
      setFormLoading(true);
      const body = {
        email: formData.email,
        name: formData.name,
        role: formData.role,
      };
      const configuration = {
        withCredentials: true,
      };
      try {
        if (isEdit) {
          await axios.put(
            `${serverEndpoint}/users/${formData.id}`,
            body,
            configuration
          );
        } else {
          await axios.post(`${serverEndpoint}/users`, body, configuration);
        }

        setFormData({
          email: "",
          name: "",
          role: "",
        });
        fetchUsers();
      } catch (error) {
        setErrors({ message: "Something went wrong, please try again" });
      } finally {
        handleModalClose();
        setFormLoading(false);
      }
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverEndpoint}/users`, {
        withCredentials: true,
      });
      setUsersData(response.data);
    } catch (error) {
      console.log(error);
      setErrors({
        message: "Unable to fetch users at the moment, please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and role filter
  const filteredUsers = usersData.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const columns = [
    {
      field: "email",
      headerName: "Email",
      flex: 2,
      renderCell: (params) => (
        <div className="user-email">
          <FaEnvelope className="email-icon" />
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 2,
      renderCell: (params) => (
        <div className="user-name">
          <FaUser className="name-icon" />
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: (params) => (
        <div className={`role-badge role-${params.value}`}>
          <FaShieldAlt className="role-icon" />
          <span>
            {params.value.charAt(0).toUpperCase() + params.value.slice(1)}
          </span>
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div className="action-buttons">
          <IconButton
            className="edit-btn"
            onClick={() => handleModalShow(true, params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            className="delete-btn"
            onClick={() => handleDeleteModalShow(params.row._id)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="manage-users-page">
      <div className="manage-users-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-left">
              <FaUsers className="header-icon" />
              <div className="header-text">
                <h1 className="page-title">Manage Users</h1>
                <p className="page-subtitle">
                  Manage user accounts, roles, and permissions
                </p>
              </div>
            </div>
            <button
              className="add-user-btn"
              onClick={() => handleModalShow(false)}
            >
              <FaPlus className="btn-icon" />
              Add User
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{usersData.length}</h3>
              <p className="stat-label">Total Users</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaShieldAlt />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">
                {usersData.filter((user) => user.role === "developer").length}
              </h3>
              <p className="stat-label">Developers</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaUser />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">
                {usersData.filter((user) => user.role === "viewer").length}
              </h3>
              <p className="stat-label">Viewers</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-box">
            <FaFilter className="filter-icon" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="">All Roles</option>
              {USER_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Alert */}
        {errors.message && (
          <div className="error-alert">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{errors.message}</span>
            </div>
          </div>
        )}

        {/* Data Grid */}
        <div className="data-grid-container">
          <DataGrid
            getRowId={(row) => row._id}
            rows={filteredUsers}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 20, page: 0 },
              },
            }}
            pageSizeOptions={[20, 50, 100]}
            disableRowSelectionOnClick
            showToolbar
            sx={{
              fontFamily: "inherit",
              border: "none",
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #e9ecef",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f8f9fa",
                borderBottom: "2px solid #e9ecef",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f8f9fa",
              },
            }}
            loading={loading}
          />
        </div>
      </div>

      {/* Add/Edit User Modal */}
      <Modal
        show={showModal}
        onHide={handleModalClose}
        className="modern-modal"
      >
        <Modal.Header closeButton className="modal-header">
          <Modal.Title className="modal-title">
            {isEdit ? "Edit User" : "Add New User"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <FaEnvelope className="label-icon" />
                Email Address
              </label>
              <input
                type="email"
                className={`form-input ${errors.email ? "error" : ""}`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter user's email"
                disabled={formLoading}
              />
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <FaUser className="label-icon" />
                Full Name
              </label>
              <input
                type="text"
                className={`form-input ${errors.name ? "error" : ""}`}
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter user's full name"
                disabled={formLoading}
              />
              {errors.name && (
                <div className="error-message">{errors.name}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="role" className="form-label">
                <FaShieldAlt className="label-icon" />
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`form-input ${errors.role ? "error" : ""}`}
                disabled={formLoading}
              >
                <option value="">Select a role</option>
                {USER_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
              {errors.role && (
                <div className="error-message">{errors.role}</div>
              )}
            </div>

            <button
              type="submit"
              className={`submit-btn ${formLoading ? "loading" : ""}`}
              disabled={formLoading}
            >
              {formLoading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  {isEdit ? "Update User" : "Add User"}
                  <FaArrowRight className="btn-icon" />
                </>
              )}
            </button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={handleDeleteModalClose}
        className="modern-modal"
      >
        <Modal.Header closeButton className="modal-header">
          <Modal.Title className="modal-title">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <div className="delete-confirmation">
            <div className="delete-icon">🗑️</div>
            <h4>Are you sure you want to delete this user?</h4>
            <p>
              This action cannot be undone. The user will lose access to the
              system immediately.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <button
            className="cancel-btn"
            onClick={handleDeleteModalClose}
            disabled={formLoading}
          >
            Cancel
          </button>
          <button
            className={`delete-btn ${formLoading ? "loading" : ""}`}
            onClick={handleDeleteSubmit}
            disabled={formLoading}
          >
            {formLoading ? <div className="spinner"></div> : "Delete User"}
          </button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .manage-users-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 2rem;
        }

        .manage-users-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-icon {
          font-size: 2.5rem;
          color: #667eea;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0 0 0.25rem 0;
        }

        .page-subtitle {
          color: #6c757d;
          margin: 0;
        }

        .add-user-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .add-user-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-icon {
          font-size: 0.875rem;
        }

        .stats-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }

        .stat-icon {
          font-size: 2rem;
          color: #667eea;
        }

        .stat-content {
          flex: 1;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0 0 0.25rem 0;
        }

        .stat-label {
          color: #6c757d;
          margin: 0;
          font-weight: 500;
        }

        .filters-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .search-box {
          flex: 1;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .filter-box {
          position: relative;
        }

        .filter-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          z-index: 1;
        }

        .filter-select {
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 1rem;
          background: white;
          min-width: 150px;
          transition: all 0.3s ease;
        }

        .filter-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .error-alert {
          background: #fee;
          border: 1px solid #fcc;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .error-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .error-icon {
          font-size: 1.25rem;
        }

        .error-text {
          color: #dc3545;
          font-weight: 500;
        }

        .data-grid-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .user-email,
        .user-name {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .email-icon,
        .name-icon {
          color: #667eea;
          font-size: 0.875rem;
        }

        .role-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .role-developer {
          background: #e3f2fd;
          color: #1976d2;
        }

        .role-viewer {
          background: #f3e5f5;
          color: #7b1fa2;
        }

        .role-icon {
          font-size: 0.75rem;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .edit-btn {
          color: #667eea !important;
        }

        .delete-btn {
          color: #dc3545 !important;
        }

        .edit-btn:hover,
        .delete-btn:hover {
          background: rgba(0, 0, 0, 0.04) !important;
        }

        /* Modal Styles */
        .modern-modal .modal-content {
          border-radius: 16px;
          border: none;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .modal-header {
          border-bottom: 1px solid #e9ecef;
          padding: 1.5rem;
        }

        .modal-title {
          font-weight: 600;
          color: #2c3e50;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #495057;
          font-size: 0.9rem;
        }

        .label-icon {
          color: #667eea;
          font-size: 0.875rem;
        }

        .form-input {
          padding: 0.875rem 1rem;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-input.error {
          border-color: #dc3545;
        }

        .form-input:disabled {
          background: #f8f9fa;
          cursor: not-allowed;
        }

        .error-message {
          color: #dc3545;
          font-size: 0.875rem;
        }

        .submit-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .delete-confirmation {
          text-align: center;
          padding: 1rem 0;
        }

        .delete-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .delete-confirmation h4 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .delete-confirmation p {
          color: #6c757d;
          margin: 0;
        }

        .modal-footer {
          border-top: 1px solid #e9ecef;
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .cancel-btn {
          background: #6c757d;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover:not(:disabled) {
          background: #5a6268;
        }

        .delete-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .delete-btn:hover:not(:disabled) {
          background: #c82333;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .manage-users-page {
            padding: 1rem;
          }

          .header-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .filters-section {
            flex-direction: column;
          }

          .stats-section {
            grid-template-columns: repeat(2, 1fr);
          }

          .page-title {
            font-size: 1.75rem;
          }
        }

        @media (max-width: 480px) {
          .stats-section {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default ManageUsers;
