import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverEndpoint } from "../../config/config";
import { DataGrid } from "@mui/x-data-grid";
import { Bar, Pie } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import {
  FaChartBar,
  FaGlobe,
  FaDesktop,
  FaMobile,
  FaChrome,
  FaFirefox,
  FaSafari,
  FaEdge,
  FaCalendarAlt,
  FaFilter,
  FaDownload,
  FaArrowLeft,
} from "react-icons/fa";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const formatDate = (isoDateString) => {
  if (!isoDateString) return "";

  try {
    const date = new Date(isoDateString);

    // July 10, 2025
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch (error) {
    console.log(error);
    return "";
  }
};

function AnalyticsDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverEndpoint}/links/analytics`, {
        params: {
          linkId: id,
          from: fromDate,
          to: toDate,
        },
        withCredentials: true,
      });
      setAnalyticsData(response.data);
    } catch (error) {
      console.log(error);
      navigate("/error");
    } finally {
      setLoading(false);
    }
  };

  const groupBy = (key) => {
    return analyticsData.reduce((acc, item) => {
      const label = item[key] || "unknown";
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});
  };

  const clicksByCity = groupBy("city");
  const clicksByBrowser = groupBy("browser");
  const clicksByDevice = groupBy("deviceType");
  const clicksByCountry = groupBy("country");

  const columns = [
    {
      field: "ip",
      headerName: "IP Address",
      flex: 1,
      renderCell: (params) => (
        <div className="ip-cell">
          <FaGlobe className="cell-icon" />
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
      renderCell: (params) => (
        <div className="location-cell">
          <span className="city-name">{params.value}</span>
        </div>
      ),
    },
    {
      field: "country",
      headerName: "Country",
      flex: 1,
      renderCell: (params) => (
        <div className="country-cell">
          <span className="country-name">{params.value}</span>
        </div>
      ),
    },
    {
      field: "region",
      headerName: "Region",
      flex: 1,
    },
    {
      field: "isp",
      headerName: "ISP",
      flex: 1,
    },
    {
      field: "deviceType",
      headerName: "Device",
      flex: 1,
      renderCell: (params) => (
        <div className="device-cell">
          {params.value === "desktop" ? (
            <FaDesktop className="device-icon desktop" />
          ) : (
            <FaMobile className="device-icon mobile" />
          )}
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      field: "browser",
      headerName: "Browser",
      flex: 1,
      renderCell: (params) => (
        <div className="browser-cell">
          {params.value?.toLowerCase().includes("chrome") && (
            <FaChrome className="browser-icon chrome" />
          )}
          {params.value?.toLowerCase().includes("firefox") && (
            <FaFirefox className="browser-icon firefox" />
          )}
          {params.value?.toLowerCase().includes("safari") && (
            <FaSafari className="browser-icon safari" />
          )}
          {params.value?.toLowerCase().includes("edge") && (
            <FaEdge className="browser-icon edge" />
          )}
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      field: "clickedAt",
      headerName: "Clicked At",
      flex: 1,
      renderCell: (params) => (
        <div className="date-cell">
          <FaCalendarAlt className="date-icon" />
          <span>{formatDate(params.row.clickedAt)}</span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [fromDate, toDate, id]);

  const totalClicks = analyticsData.length;
  const uniqueCities = Object.keys(clicksByCity).length;
  const uniqueCountries = Object.keys(clicksByCountry).length;
  const uniqueBrowsers = Object.keys(clicksByBrowser).length;

  return (
    <div className="analytics-page">
      <div className="analytics-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-left">
              <button className="back-btn" onClick={() => navigate(-1)}>
                <FaArrowLeft className="back-icon" />
                Back
              </button>
              <div className="header-text">
                <h1 className="page-title">Analytics Dashboard</h1>
                <p className="page-subtitle">
                  Detailed insights for Link ID: {id}
                </p>
              </div>
            </div>
            <div className="header-actions">
              <button className="export-btn">
                <FaDownload className="btn-icon" />
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">
              <FaChartBar />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{totalClicks}</h3>
              <p className="stat-label">Total Clicks</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaGlobe />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{uniqueCities}</h3>
              <p className="stat-label">Cities Reached</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaGlobe />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{uniqueCountries}</h3>
              <p className="stat-label">Countries</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaChrome />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{uniqueBrowsers}</h3>
              <p className="stat-label">Browsers Used</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-header">
            <FaFilter className="filter-icon" />
            <h3>Date Filters</h3>
          </div>
          <div className="date-filters">
            <div className="date-picker-group">
              <label className="date-label">From Date</label>
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
                className="date-picker"
                placeholderText="Select start date"
                dateFormat="MMM dd, yyyy"
          />
        </div>
            <div className="date-picker-group">
              <label className="date-label">To Date</label>
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
                className="date-picker"
                placeholderText="Select end date"
                dateFormat="MMM dd, yyyy"
              />
            </div>
            <button
              className="apply-filters-btn"
              onClick={fetchAnalytics}
              disabled={loading}
            >
              {loading ? <div className="spinner"></div> : "Apply Filters"}
            </button>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-container">
            <div className="chart-header">
              <h3>Clicks by City</h3>
              <p>Geographic distribution of clicks</p>
      </div>
            <div className="chart-content">
          <Bar
            data={{
              labels: Object.keys(clicksByCity),
              datasets: [
                {
                  label: "Clicks",
                  data: Object.values(clicksByCity),
                      backgroundColor: "rgba(102, 126, 234, 0.8)",
                      borderColor: "rgba(102, 126, 234, 1)",
                      borderWidth: 1,
                },
              ],
            }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: "rgba(0, 0, 0, 0.1)",
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </div>
        </div>

          <div className="chart-container">
            <div className="chart-header">
              <h3>Clicks by Browser</h3>
              <p>Browser usage distribution</p>
            </div>
            <div className="chart-content">
          <Pie
            data={{
              labels: Object.keys(clicksByBrowser),
              datasets: [
                {
                      data: Object.values(clicksByBrowser),
                  backgroundColor: [
                        "#667eea",
                        "#764ba2",
                        "#f093fb",
                        "#f5576c",
                        "#4facfe",
                        "#00f2fe",
                      ],
                      borderWidth: 2,
                      borderColor: "#fff",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>
        </div>
      </div>

        {/* Data Grid */}
        <div className="data-grid-section">
          <div className="grid-header">
            <h3>Detailed Click Data</h3>
            <p>Complete analytics data for this link</p>
          </div>
          <div className="grid-container">
      <DataGrid
        getRowId={(row) => row._id}
        rows={analyticsData}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 20, page: 0 },
          },
        }}
        pageSizeOptions={[20, 50, 100]}
        disableRowSelectionOnClick
        showToolbar
              loading={loading}
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
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .analytics-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 2rem;
        }

        .analytics-container {
          max-width: 1400px;
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
          gap: 1.5rem;
        }

        .back-btn {
          background: #6c757d;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .back-btn:hover {
          background: #5a6268;
          transform: translateX(-2px);
        }

        .back-icon {
          font-size: 0.875rem;
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

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .export-btn {
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

        .export-btn:hover {
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
        }

        .filters-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .filter-icon {
          color: #667eea;
          font-size: 1.25rem;
        }

        .filters-header h3 {
          margin: 0;
          color: #2c3e50;
          font-weight: 600;
        }

        .date-filters {
          display: flex;
          gap: 1rem;
          align-items: end;
        }

        .date-picker-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .date-label {
          font-weight: 600;
          color: #495057;
          font-size: 0.9rem;
        }

        .date-picker {
          padding: 0.75rem 1rem;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          min-width: 150px;
        }

        .date-picker:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .apply-filters-btn {
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

        .apply-filters-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .apply-filters-btn:disabled {
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

        .charts-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .chart-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .chart-header {
          margin-bottom: 1.5rem;
        }

        .chart-header h3 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
          font-weight: 600;
        }

        .chart-header p {
          margin: 0;
          color: #6c757d;
          font-size: 0.9rem;
        }

        .chart-content {
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .data-grid-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .grid-header {
          margin-bottom: 1.5rem;
        }

        .grid-header h3 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
          font-weight: 600;
        }

        .grid-header p {
          margin: 0;
          color: #6c757d;
          font-size: 0.9rem;
        }

        .grid-container {
          height: 500px;
        }

        /* Data Grid Cell Styles */
        .ip-cell,
        .location-cell,
        .country-cell,
        .device-cell,
        .browser-cell,
        .date-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cell-icon,
        .date-icon {
          color: #667eea;
          font-size: 0.875rem;
        }

        .device-icon {
          font-size: 1rem;
        }

        .device-icon.desktop {
          color: #667eea;
        }

        .device-icon.mobile {
          color: #764ba2;
        }

        .browser-icon {
          font-size: 1rem;
        }

        .browser-icon.chrome {
          color: #4285f4;
        }

        .browser-icon.firefox {
          color: #ff7139;
        }

        .browser-icon.safari {
          color: #006cff;
        }

        .browser-icon.edge {
          color: #0078d4;
        }

        .city-name,
        .country-name {
          font-weight: 500;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .charts-section {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .analytics-page {
            padding: 1rem;
          }

          .header-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .date-filters {
            flex-direction: column;
            align-items: stretch;
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

export default AnalyticsDashboard;
