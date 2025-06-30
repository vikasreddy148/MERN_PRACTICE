import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../../config/config";
import { Modal } from "react-bootstrap";
function LinksDashboard() {
  const [errors, setErrors] = useState({});
  const [linksData, setLinksData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
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
      newErrors.campaignTitle = "CampaignTitle is mandatory";

      isValid = false;
    }

    if (formData.originalUrl.length === 0) {
      newErrors.originalUrl = "URL ismandatory";

      isValid = false;
    }

    if (formData.category.length === 0) {
      newErrors.category = "Category ismandatory";

      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validate()) {
      const body = {
        campaign_title: formData.campaignTitle.username,
        original_url: formData.originalUrl,
        category: formData.category,
      };
      const configuration = {
        withCredentials: true,
      };

      try {
        await axios.post(`${serverEndpoint}/links`, body, configuration);
        await fetchLinks();

        setFormData({
          campaign_title: "",
          original_url: "",
          category: "",
        });
      } catch (error) {
        setErrors({ message: "Unable to addthe Link, pleas try again " });
      } finally {
        handleCloseModal();
      }
    }
  };
  const fetchLinks = async () => {
    try {
      const response = await axios.get(`${serverEndpoint}/links`, {
        withCredentials: true,
      });
      setLinksData(response.data.data);
    } catch (error) {
      console.log(error);
      SetErrors({
        message: "unable to fetch links at the moment. please try again later",
      });
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);
  const columns = [
    { field: "campaignTitle", headerName: "Campaign", flex: 2 },
    { field: "originalUrl", headerName: "URL", flex: 3 },
    { field: "category", headerName: "Category", flex: 2 },
    { field: "clickCount", headerName: "Clicks", flex: 1 },
    {
      field: "action",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton>
            <EditIcon />
          </IconButton>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-3">
        <h1>Manage Affiliate Links</h1>
        <button className="btn btn-primary btn-sm" onClick={handleOpenModal}>
          + Add
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
          rows={linksData}
          columns={columns}
          intitialState={{
            pagination: {
              paginationModel: { pageSize: 20, page: 0 },
            },
          }}
          pageSizeOptions={[20, 50, 100]}
          disableRowSelectionOnClick
          sx={{
            fontFamily: "inherit",
          }}
        />
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Link</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleSubmit}>
            {/* Campaign Title */}
            <div className="mb-3">
              <label htmlFor="campaignTitle" className="form-label">
                Campaign Title
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.campaignTitle ? "is-invalid" : ""
                }`}
                id="campaignTitle"
                name="campaignTitle"
                value={formData.campaignTitle}
                onChange={handleChange}
              />
              {errors.campaignTitle && (
                <div className="invalid-feedback">{errors.campaignTitle}</div>
              )}
            </div>

            {/* Original URL */}
            <div className="mb-3">
              <label htmlFor="originalUrl" className="form-label">
                URL
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.originalUrl ? "is-invalid" : ""
                }`}
                id="originalUrl"
                name="originalUrl"
                value={formData.originalUrl}
                onChange={handleChange}
              />
              {errors.originalUrl && (
                <div className="invalid-feedback">{errors.originalUrl}</div>
              )}
            </div>

            {/* Category */}
            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.category ? "is-invalid" : ""
                }`}
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
              {errors.category && (
                <div className="invalid-feedback">{errors.category}</div>
              )}
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default LinksDashboard;
