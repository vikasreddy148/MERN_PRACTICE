import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../../config/config";
import Modal from "../../components/Modal";
import LoadingButton from "../../components/LoadingButton";
import SkeletonLoader from "../../components/SkeletonLoader";
import { usePermission } from "../../rbac/usersPermissions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
import styles from "./LinkModal.module.css";
import dashboardStyles from "./LinksDashboard.module.css";

function LinksDashboard() {
  const [errors, setErrors] = useState({});
  const [linksData, setLinksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
    setIsDeleting(true);
    try {
      await axios.delete(`${serverEndpoint}/links/${formData.id}`, {
        withCredentials: true,
      });
      await fetchLinks();
      toast.success("Link deleted successfully!");
      handleCloseDeleteModal();
    } catch (error) {
      const errorMessage = "Unable to delete the link. Please try again.";
      setErrors({ message: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
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
      setIsSubmitting(true);
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
          toast.success("Link updated successfully!");
        } else {
          await axios.post(`${serverEndpoint}/links`, body, configuration);
          toast.success("Link created successfully!");
        }

        await fetchLinks();
        setFormData({
          campaignTitle: "",
          originalUrl: "",
          category: "",
        });
      } catch (error) {
        const errorMessage = "Unable to save the link. Please try again.";
        setErrors({ message: errorMessage });
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
        handleCloseModal();
      }
    }
  };

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverEndpoint}/links`, {
        withCredentials: true,
      });
      setLinksData(response.data.data);
    } catch (error) {
      console.log(error);
      setErrors({
        message: "Unable to fetch links at the moment. Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
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
        <div className={dashboardStyles.campaignCell}>
          <FaLink className={dashboardStyles.campaignIcon} />
          <span className={dashboardStyles.campaignTitle}>
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
        <div className={dashboardStyles.urlCell}>
          <a
            href={`${serverEndpoint}/links/r/${params.row._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={dashboardStyles.urlLink}
          >
            {params.row.originalUrl}
            <FaExternalLinkAlt className={dashboardStyles.externalIcon} />
          </a>
          <button
            className={dashboardStyles.copyBtn}
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
        <span className={dashboardStyles.categoryBadge}>
          {params.row.category}
        </span>
      ),
    },
    {
      field: "clickCount",
      headerName: "Clicks",
      flex: 1,
      renderCell: (params) => (
        <div className={dashboardStyles.clicksCell}>
          <FaChartLine className={dashboardStyles.clicksIcon} />
          <span className={dashboardStyles.clicksCount}>
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
        <div className={dashboardStyles.actionButtons}>
          {permission.canEditLink && (
            <button
              className={`${dashboardStyles.actionBtn} ${dashboardStyles.editBtn}`}
              onClick={() => handleOpenModal(true, params.row)}
              title="Edit link"
            >
              <FaEdit />
            </button>
          )}

          {permission.canDeleteLink && (
            <button
              className={`${dashboardStyles.actionBtn} ${dashboardStyles.deleteBtn}`}
              onClick={() => handleShowDeleteModal(params.row._id)}
              title="Delete link"
            >
              <FaTrash />
            </button>
          )}

          {permission.canViewLink && (
            <button
              className={`${dashboardStyles.actionBtn} ${dashboardStyles.viewBtn}`}
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
    <div className={dashboardStyles.linksDashboard}>
      {/* Header Section */}
      <div className={dashboardStyles.dashboardHeader}>
        <div className={dashboardStyles.headerContent}>
          <div className={dashboardStyles.headerLeft}>
            <h1 className={dashboardStyles.dashboardTitle}>
              <FaLink className={dashboardStyles.titleIcon} />
              Manage Affiliate Links
            </h1>
            <p className={dashboardStyles.dashboardSubtitle}>
              Create, track, and optimize your affiliate marketing campaigns
            </p>
          </div>
          <div className={dashboardStyles.headerRight}>
            {permission.canCreateLink && (
              <button
                className={dashboardStyles.addLinkBtn}
                onClick={() => handleOpenModal(false)}
              >
                <FaPlus className={dashboardStyles.btnIcon} />
                Add New Link
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={dashboardStyles.statsSection}>
        <div className={dashboardStyles.statsGrid}>
          <div className={dashboardStyles.statCard}>
            <div className={dashboardStyles.statIcon}>
              <FaLink />
            </div>
            <div className={dashboardStyles.statContent}>
              <div className={dashboardStyles.statNumber}>
                {linksData.length}
              </div>
              <div className={dashboardStyles.statLabel}>Total Links</div>
            </div>
          </div>
          <div className={dashboardStyles.statCard}>
            <div className={dashboardStyles.statIcon}>
              <FaChartLine />
            </div>
            <div className={dashboardStyles.statContent}>
              <div className={dashboardStyles.statNumber}>
                {linksData.reduce(
                  (sum, link) => sum + (link.clickCount || 0),
                  0
                )}
              </div>
              <div className={dashboardStyles.statLabel}>Total Clicks</div>
            </div>
          </div>
          <div className={dashboardStyles.statCard}>
            <div className={dashboardStyles.statIcon}>
              <FaEye />
            </div>
            <div className={dashboardStyles.statContent}>
              <div className={dashboardStyles.statNumber}>
                {linksData.filter((link) => (link.clickCount || 0) > 0).length}
              </div>
              <div className={dashboardStyles.statLabel}>Active Links</div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errors.message && (
        <div className={dashboardStyles.errorAlert}>
          <div className={dashboardStyles.errorContent}>
            <span className={dashboardStyles.errorIcon}>⚠️</span>
            <span className={dashboardStyles.errorText}>{errors.message}</span>
          </div>
        </div>
      )}

      {/* Data Grid */}
      <div className={dashboardStyles.dataGridContainer}>
        {loading ? (
          <SkeletonLoader type="table" rows={8} columns={5} height={60} />
        ) : (
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
        )}
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
            <LoadingButton
              type="submit"
              className={styles.submitBtn}
              loading={isSubmitting}
              loadingText={isEdit ? "Updating..." : "Creating..."}
            >
              {isEdit ? "Update Link" : "Add Link"}
            </LoadingButton>
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
            <LoadingButton
              className={styles.submitBtn}
              style={{ background: "#e74c3c" }}
              onClick={handleDelete}
              loading={isDeleting}
              loadingText="Deleting..."
            >
              Delete
            </LoadingButton>
          </div>
        </div>
      </Modal>


    </div>
  );
}

export default LinksDashboard;
