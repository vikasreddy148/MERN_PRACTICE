import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../../config/config";
import { Modal } from "react-bootstrap";
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
    }

    setIsEdit(isEdit);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
    // You could add a toast notification here
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
        <div className="campaign-cell">
          <FaLink className="campaign-icon" />
          <span className="campaign-title">{params.row.campaignTitle}</span>
        </div>
      ),
    },
    {
      field: "originalUrl",
      headerName: "URL",
      flex: 3,
      renderCell: (params) => (
        <div className="url-cell">
          <a
            href={`${serverEndpoint}/links/r/${params.row._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="url-link"
          >
            {params.row.originalUrl}
            <FaExternalLinkAlt className="external-icon" />
          </a>
          <button
            className="copy-btn"
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
        <span className="category-badge">{params.row.category}</span>
      ),
    },
    {
      field: "clickCount",
      headerName: "Clicks",
      flex: 1,
      renderCell: (params) => (
        <div className="clicks-cell">
          <FaChartLine className="clicks-icon" />
          <span className="clicks-count">{params.row.clickCount || 0}</span>
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Actions",
      flex: 1.5,
      renderCell: (params) => (
        <div className="action-buttons">
          {permission.canEditLink && (
            <button
              className="action-btn edit-btn"
              onClick={() => handleOpenModal(true, params.row)}
              title="Edit link"
            >
              <FaEdit />
            </button>
          )}

          {permission.canDeleteLink && (
            <button
              className="action-btn delete-btn"
              onClick={() => handleShowDeleteModal(params.row._id)}
              title="Delete link"
            >
              <FaTrash />
            </button>
          )}

          {permission.canViewLink && (
            <button
              className="action-btn view-btn"
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
    <div className="links-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">
              <FaLink className="title-icon" />
              Manage Affiliate Links
            </h1>
            <p className="dashboard-subtitle">
              Create, track, and optimize your affiliate marketing campaigns
            </p>
          </div>
          <div className="header-right">
            {permission.canCreateLink && (
              <button
                className="add-link-btn"
                onClick={() => handleOpenModal(false)}
              >
                <FaPlus className="btn-icon" />
                Add New Link
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FaLink />
            </div>
            <div className="stat-content">
              <div className="stat-number">{linksData.length}</div>
              <div className="stat-label">Total Links</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FaChartLine />
            </div>
            <div className="stat-content">
              <div className="stat-number">
                {linksData.reduce(
                  (sum, link) => sum + (link.clickCount || 0),
                  0
                )}
              </div>
              <div className="stat-label">Total Clicks</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FaEye />
            </div>
            <div className="stat-content">
              <div className="stat-number">
                {linksData.filter((link) => (link.clickCount || 0) > 0).length}
              </div>
              <div className="stat-label">Active Links</div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
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
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit Link" : "Add New Link"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="campaignTitle">Campaign Title</label>
              <input
                type="text"
                className={`form-control ${
                  errors.campaignTitle ? "is-invalid" : ""
                }`}
                id="campaignTitle"
                name="campaignTitle"
                value={formData.campaignTitle}
                onChange={handleChange}
                placeholder="Enter campaign title"
              />
              {errors.campaignTitle && (
                <div className="invalid-feedback">{errors.campaignTitle}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="originalUrl">Original URL</label>
              <input
                type="url"
                className={`form-control ${
                  errors.originalUrl ? "is-invalid" : ""
                }`}
                id="originalUrl"
                name="originalUrl"
                value={formData.originalUrl}
                onChange={handleChange}
                placeholder="https://example.com"
              />
              {errors.originalUrl && (
                <div className="invalid-feedback">{errors.originalUrl}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                className={`form-control ${
                  errors.category ? "is-invalid" : ""
                }`}
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter category"
              />
              {errors.category && (
                <div className="invalid-feedback">{errors.category}</div>
              )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {isEdit ? "Update" : "Create"}
          </button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this link? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={handleCloseDeleteModal}
          >
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .links-dashboard {
          padding: 2rem;
          background: #f8f9fa;
          min-height: calc(100vh - 80px);
        }

        .dashboard-header {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dashboard-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
        }

        .title-icon {
          color: #667eea;
          font-size: 1.5rem;
        }

        .dashboard-subtitle {
          color: #6c757d;
          margin: 0.5rem 0 0 0;
          font-size: 1rem;
        }

        .add-link-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .add-link-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-icon {
          font-size: 0.875rem;
        }

        .stats-section {
          margin-bottom: 2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.25rem;
        }

        .stat-number {
          font-size: 1.75rem;
          font-weight: 700;
          color: #2c3e50;
          line-height: 1;
        }

        .stat-label {
          color: #6c757d;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .error-alert {
          background: #fee;
          border: 1px solid #fcc;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 2rem;
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
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .campaign-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .campaign-icon {
          color: #667eea;
          font-size: 0.875rem;
        }

        .campaign-title {
          font-weight: 500;
          color: #2c3e50;
        }

        .url-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .url-link {
          color: #667eea;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
        }

        .url-link:hover {
          text-decoration: underline;
        }

        .external-icon {
          font-size: 0.75rem;
        }

        .copy-btn {
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .copy-btn:hover {
          background: #f8f9fa;
          color: #667eea;
        }

        .category-badge {
          background: #e3f2fd;
          color: #1976d2;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .clicks-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .clicks-icon {
          color: #28a745;
          font-size: 0.875rem;
        }

        .clicks-count {
          font-weight: 600;
          color: #2c3e50;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          background: none;
          border: none;
          padding: 0.5rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.875rem;
        }

        .edit-btn {
          color: #ffc107;
        }

        .edit-btn:hover {
          background: #fff3cd;
        }

        .delete-btn {
          color: #dc3545;
        }

        .delete-btn:hover {
          background: #f8d7da;
        }

        .view-btn {
          color: #17a2b8;
        }

        .view-btn:hover {
          background: #d1ecf1;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .links-dashboard {
            padding: 1rem;
          }

          .header-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default LinksDashboard;
