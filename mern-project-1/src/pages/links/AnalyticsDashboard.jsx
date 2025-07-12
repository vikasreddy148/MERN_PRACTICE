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
  FaArrowLeft,
  FaChartBar,
  FaFilter,
  FaGlobe,
  FaDesktop,
  FaMobile,
  FaTablet,
  FaUsers,
  FaMapMarkerAlt,
  FaEye,
  FaTable,
} from "react-icons/fa";
import styles from "./AnalyticsDashboard.module.css";

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
  const [loading, setLoading] = useState(true);

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

  // Calculate additional statistics
  const totalClicks = analyticsData.length;
  const uniqueCountries = new Set(analyticsData.map((item) => item.country))
    .size;
  const uniqueCities = new Set(analyticsData.map((item) => item.city)).size;
  const deviceTypes = groupBy("deviceType");

  // Get device type counts
  const desktopClicks = deviceTypes.desktop || 0;
  const mobileClicks = deviceTypes.mobile || 0;
  const tabletClicks = deviceTypes.tablet || 0;

  const columns = [
    { field: "ip", headerName: "IP Address", flex: 1 },
    { field: "city", headerName: "City", flex: 1 },
    { field: "country", headerName: "Country", flex: 1 },
    { field: "region", headerName: "Region", flex: 1 },
    { field: "isp", headerName: "ISP", flex: 1 },
    { field: "deviceType", headerName: "Device", flex: 1 },
    { field: "browser", headerName: "Browser", flex: 1 },
    {
      field: "clickedAt",
      headerName: "Clicked At",
      flex: 1,
      renderCell: (params) => <>{formatDate(params.row.clickedAt)}</>,
    },
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [fromDate, toDate, id]);

  return (
    <div className={styles.analyticsDashboard}>
      {/* Header Section */}
      <div className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1 className={styles.dashboardTitle}>
              <FaChartBar className={styles.titleIcon} />
              Link Analytics
            </h1>
            <p className={styles.dashboardSubtitle}>
              Detailed insights and performance metrics for your affiliate link
            </p>
          </div>
          <div className={styles.headerRight}>
            <button
              className={styles.backBtn}
              onClick={() => navigate("/dashboard")}
            >
              <FaArrowLeft className={styles.btnIcon} />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaEye />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{totalClicks}</div>
              <div className={styles.statLabel}>Total Clicks</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaGlobe />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{uniqueCountries}</div>
              <div className={styles.statLabel}>Countries</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaMapMarkerAlt />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{uniqueCities}</div>
              <div className={styles.statLabel}>Cities</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaUsers />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>
                {Object.keys(clicksByBrowser).length}
              </div>
              <div className={styles.statLabel}>Browsers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className={styles.filtersSection}>
        <h3 className={styles.filtersTitle}>
          <FaFilter className={styles.filtersIcon} />
          Date Filters
        </h3>
        <div className={styles.filtersContent}>
          <div className={styles.datePickerContainer}>
            <label className={styles.datePickerLabel}>From Date</label>
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              className={styles.datePicker}
              placeholderText="Select start date"
              dateFormat="MMM dd, yyyy"
            />
          </div>
          <div className={styles.datePickerContainer}>
            <label className={styles.datePickerLabel}>To Date</label>
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              className={styles.datePicker}
              placeholderText="Select end date"
              dateFormat="MMM dd, yyyy"
            />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsSection}>
        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              <FaMapMarkerAlt className={styles.chartIcon} />
              Clicks by City
            </h3>
            <div className={styles.chartDivider}></div>
            <div className={styles.chartContainer}>
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
                  maintainAspectRatio: false,
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

          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              <FaGlobe className={styles.chartIcon} />
              Clicks by Browser
            </h3>
            <div className={styles.chartDivider}></div>
            <div className={styles.chartContainer}>
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
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        padding: 20,
                        usePointStyle: true,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Device Type Chart */}
        <div className={styles.chartCard} style={{ marginTop: "2rem" }}>
          <h3 className={styles.chartTitle}>
            <FaDesktop className={styles.chartIcon} />
            Clicks by Device Type
          </h3>
          <div className={styles.chartDivider}></div>
          <div className={styles.chartContainer} style={{ height: "250px" }}>
            <Bar
              data={{
                labels: ["Desktop", "Mobile", "Tablet"],
                datasets: [
                  {
                    label: "Clicks",
                    data: [desktopClicks, mobileClicks, tabletClicks],
                    backgroundColor: [
                      "rgba(102, 126, 234, 0.8)",
                      "rgba(118, 75, 162, 0.8)",
                      "rgba(240, 147, 251, 0.8)",
                    ],
                    borderColor: [
                      "rgba(102, 126, 234, 1)",
                      "rgba(118, 75, 162, 1)",
                      "rgba(240, 147, 251, 1)",
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
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
      </div>

      {/* Data Grid Section */}
      <div className={styles.dataGridContainer}>
        <h3 className={styles.dataGridTitle}>
          <FaTable className={styles.dataGridIcon} />
          Click Details
        </h3>
        <DataGrid
          getRowId={(row) => row._id}
          rows={analyticsData}
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
    </div>
  );
}

export default AnalyticsDashboard;
