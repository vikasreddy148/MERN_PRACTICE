import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../../config/config";
import Modal from "../../components/Modal";
import styles from "./ManageUsersModal.module.css";

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

  const columns = [
    { field: "email", headerName: "Email", flex: 2 },
    { field: "name", headerName: "Name", flex: 2 },
    { field: "role", headerName: "Role", flex: 2 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <div className={styles.actionButtons}>
          <button
            className={styles.actionBtn + " " + styles.editBtn}
            onClick={() => handleModalShow(true, params.row)}
            title="Edit user"
          >
            <FaEdit />
          </button>
          <button
            className={styles.actionBtn + " " + styles.deleteBtn}
            onClick={() => handleDeleteModalShow(params.row._id)}
            title="Delete user"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Manage Users</h2>
        <button
          className={styles.addBtn}
          onClick={() => handleModalShow(false)}
        >
          <FaUserPlus className="me-2" /> Add
        </button>
      </div>

      {errors.message && (
        <div className="alert alert-danger" role="alert">
          {errors.message}
        </div>
      )}

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          getRowId={(row) => row._id}
          rows={usersData}
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
          }}
          loading={loading}
        />
      </div>

      {/* Add/Edit User Modal */}
      <Modal isOpen={showModal} onClose={handleModalClose}>
        <div className={styles.modalContent}>
          <h2 className={styles.heading}>
            {isEdit ? "Edit User" : "Add User"}
          </h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? styles.invalid : ""}
              />
              {errors.email && (
                <div className={styles.invalidFeedback}>{errors.email}</div>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? styles.invalid : ""}
              />
              {errors.name && (
                <div className={styles.invalidFeedback}>{errors.name}</div>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={errors.role ? styles.invalid : ""}
              >
                <option value="">Select Role</option>
                {USER_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
              {errors.role && (
                <div className={styles.invalidFeedback}>{errors.role}</div>
              )}
            </div>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={formLoading}
            >
              {isEdit ? "Update User" : "Add User"}
            </button>
          </form>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={handleDeleteModalClose}>
        <div className={styles.modalContent}>
          <h2 className={styles.heading}>Confirm Delete</h2>
          <div
            style={{ margin: "1.5rem 0", textAlign: "center", color: "#333" }}
          >
            Are you sure you want to delete this user? This action cannot be
            undone.
          </div>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
          >
            <button
              className={styles.submitBtn}
              style={{ background: "#ccc", color: "#333" }}
              onClick={handleDeleteModalClose}
            >
              Cancel
            </button>
            <button
              className={styles.submitBtn}
              style={{ background: "#e74c3c" }}
              onClick={handleDeleteSubmit}
              disabled={formLoading}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ManageUsers;
