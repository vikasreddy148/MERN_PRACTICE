import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../../config/config";
import Modal from "../../components/Modal";
import { usePermission } from "../../rbac/usersPermissions";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaLink,
  FaChartLine,
  FaEye,
  FaTrash,
  FaEdit,
  FaCopy,
  FaExternalLinkAlt,
} from "react-icons/fa";
import styles from "./LinksDashboard.module.css";

function LinksDashboard() {
  const [errors, setErrors] = useState({});
  const [linksData, setLinksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const permission = usePermission();

  const handleShowDeleteModal = (linkId) => {
    setFormData({
      id: linkId,
    });
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${serverEndpoint}/links/${formData.id}`, {
        withCredentials: true,
      });
      await fetchLinks();
      handleCloseDeleteModal();
    } catch (error) {
      setErrors({ message: "Unable to delete the link, please try again" });
    }
  };

  const handleOpenModal = (isEdit, data = {}) => {
    if (isEdit) {
      setFormData({
        id: data._id,
        campaignTitle: data.campaignTitle,
        originalUrl: data.originalUrl,
        category: data.category,
      });
    } else {
      setFormData({
        campaignTitle: "",
        originalUrl: "",
        category: "",
      });
    }
    setIsEdit(isEdit);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setErrors({});
  };

  const [formData, setFormData] = useState({
    campaignTitle: "",
    originalUrl: "",
    category: "",
  });

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
    if (formData.campaignTitle.length === 0) {
      newErrors.campaignTitle = "Campaign Title is mandatory";
      isValid = false;
    }

    if (formData.originalUrl.length === 0) {
      newErrors.originalUrl = "URL is mandatory";
      isValid = false;
    } else {
      // Basic URL validation
      try {
        new URL(formData.originalUrl);
      } catch (e) {
        newErrors.originalUrl = "Please enter a valid URL";
        isValid = false;
      }
    }

    if (formData.category.length === 0) {
      newErrors.category = "Category is mandatory";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validate()) {
      const body = {
        campaign_title: formData.campaignTitle,
        original_url: formData.originalUrl,
        category: formData.category,
      };
      const configuration = {
        withCredentials: true,
      };
      try {
        if (isEdit) {
          await axios.put(
            `${serverEndpoint}/links/${formData.id}`,
            body,
            configuration
          );
        } else {
          await axios.post(`${serverEndpoint}/links`, body, configuration);
        }

        await fetchLinks();
        setFormData({
          campaignTitle: "",
          originalUrl: "",
          category: "",
        });
      } catch (error) {
        setErrors({ message: "Unable to add the Link, please try again" });
      } finally {
        handleCloseModal();
      }
    }
  };

  const fetchLinks = async () => {
    try {
      setLoading(true);
      setErrors({}); // Clear previous errors
      const response = await axios.get(`${serverEndpoint}/links`, {
        withCredentials: true,
      });
      setLinksData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch links:", error);
      let errorMessage =
        "Unable to fetch links at the moment. Please try again";

      if (error.response?.status === 401) {
        errorMessage = "Session expired. Please log in again.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (!error.response) {
        errorMessage = "Network error. Please check your connection.";
      }

      setErrors({ message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here for success
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
      } catch (fallbackError) {
        console.error("Fallback copy failed:", fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const columns = [
    {
      field: "campaignTitle",
      headerName: "Campaign",
      flex: 2,
      renderCell: (params) => (
        <div className={styles.campaignCell}>
          <FaLink className={styles.campaignIcon} />
          <span className={styles.campaignTitle}>
            {params.row.campaignTitle}
          </span>
        </div>
      ),
    },
    {
      field: "originalUrl",
      headerName: "URL",
      flex: 3,
      renderCell: (params) => (
        <div className={styles.urlCell}>
          <a
            href={`${serverEndpoint}/links/r/${params.row._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.urlLink}
          >
            {params.row.originalUrl}
            <FaExternalLinkAlt className={styles.externalIcon} />
          </a>
          <button
            className={styles.copyBtn}
            onClick={() =>
              copyToClipboard(`${serverEndpoint}/links/r/${params.row._id}`)
            }
            title="Copy link"
          >
            <FaCopy />
          </button>
        </div>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1.5,
      renderCell: (params) => (
        <span className={styles.categoryBadge}>{params.row.category}</span>
      ),
    },
    {
      field: "clickCount",
      headerName: "Clicks",
      flex: 1,
      renderCell: (params) => (
        <div className={styles.clicksCell}>
          <FaChartLine className={styles.clicksIcon} />
          <span className={styles.clicksCount}>
            {params.row.clickCount || 0}
          </span>
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Actions",
      flex: 1.5,
      renderCell: (params) => (
        <div className={styles.actionButtons}>
          {permission.canEditLink && (
            <button
              className={`${styles.actionBtn} ${styles.editBtn}`}
              onClick={() => handleOpenModal(true, params.row)}
              title="Edit link"
            >
              <FaEdit />
            </button>
          )}

          {permission.canDeleteLink && (
            <button
              className={`${styles.actionBtn} ${styles.deleteBtn}`}
              onClick={() => handleShowDeleteModal(params.row._id)}
              title="Delete link"
            >
              <FaTrash />
            </button>
          )}

          {permission.canViewLink && (
            <button
              className={`${styles.actionBtn} ${styles.viewBtn}`}
              onClick={() => navigate(`/analytics/${params.row._id}`)}
              title="View analytics"
            >
              <FaEye />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.linksDashboard}>
      {/* Header Section */}
      <div className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.dashboardTitle}>
              <FaLink className={styles.titleIcon} />
              Manage Affiliate Links
            </h1>
            <p className={styles.dashboardSubtitle}>
              Create, track, and optimize your affiliate marketing campaigns
            </p>
          </div>
          <div>
            {permission.canCreateLink && (
              <button
                className={styles.addLinkBtn}
                onClick={() => handleOpenModal(false)}
              >
                <FaPlus className={styles.btnIcon} />
                Add New Link
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaLink />
            </div>
            <div>
              <div className={styles.statNumber}>{linksData.length}</div>
              <div className={styles.statLabel}>Total Links</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaChartLine />
            </div>
            <div>
              <div className={styles.statNumber}>
                {linksData.reduce(
                  (sum, link) => sum + (link.clickCount || 0),
                  0
                )}
              </div>
              <div className={styles.statLabel}>Total Clicks</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaEye />
            </div>
            <div>
              <div className={styles.statNumber}>
                {linksData.filter((link) => (link.clickCount || 0) > 0).length}
              </div>
              <div className={styles.statLabel}>Active Links</div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errors.message && (
        <div className={styles.errorAlert}>
          <div className={styles.errorContent}>
            <span className={styles.errorIcon}>⚠️</span>
            <span className={styles.errorText}>{errors.message}</span>
          </div>
        </div>
      )}

      {/* Data Grid */}
      <div className={styles.dataGridContainer}>
        <DataGrid
          getRowId={(row) => row._id}
          rows={linksData}
          columns={columns}
          loading={loading}
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
              borderBottom: "1px solid #f0f0f0",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f8f9fa",
              borderBottom: "2px solid #e9ecef",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f8f9fa",
            },
          }}
          density="comfortable"
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={handleCloseModal}>
        <div className={styles.modalContent}>
          <h2 className={styles.heading}>
            {isEdit ? "Edit Link" : "Add New Link"}
          </h2>
          {errors.message && (
            <div className={styles.errorAlert}>{errors.message}</div>
          )}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="campaignTitle">Campaign Title</label>
              <input
                type="text"
                id="campaignTitle"
                name="campaignTitle"
                value={formData.campaignTitle}
                onChange={handleChange}
                className={errors.campaignTitle ? styles.invalid : ""}
              />
              {errors.campaignTitle && (
                <div className={styles.invalidFeedback}>
                  {errors.campaignTitle}
                </div>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="originalUrl">URL</label>
              <input
                type="text"
                id="originalUrl"
                name="originalUrl"
                value={formData.originalUrl}
                onChange={handleChange}
                className={errors.originalUrl ? styles.invalid : ""}
              />
              {errors.originalUrl && (
                <div className={styles.invalidFeedback}>
                  {errors.originalUrl}
                </div>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? styles.invalid : ""}
              />
              {errors.category && (
                <div className={styles.invalidFeedback}>{errors.category}</div>
              )}
            </div>
            <button type="submit" className={styles.submitBtn}>
              {isEdit ? "Update Link" : "Add Link"}
            </button>
          </form>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={handleCloseDeleteModal}>
        <div className={styles.modalContent}>
          <h2 className={styles.heading}>Confirm Delete</h2>
          <div
            style={{ margin: "1.5rem 0", textAlign: "center", color: "#333" }}
          >
            Are you sure you want to delete this link? This action cannot be
            undone.
          </div>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
          >
            <button
              className={styles.submitBtn}
              style={{ background: "#ccc", color: "#333" }}
              onClick={handleCloseDeleteModal}
            >
              Cancel
            </button>
            <button
              className={styles.submitBtn}
              style={{ background: "#e74c3c" }}
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default LinksDashboard;
