import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { serverEndpoint } from "../../config/config";
import { DataGrid } from "@mui/x-data-grid";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
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
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  PointElement,
  LineElement,
  Filler
);

import styles from "./AnalyticsDashboard.module.css";

const formatDate = (isoDateString) => {
  if (!isoDateString) return "";

  try {
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    console.log(error);
    return "";
  }
};

const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num);
};

function AnalyticsDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [linkData, setLinkData] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLinkData = async () => {
    try {
      const response = await axios.get(`${serverEndpoint}/links/${id}`, {
        withCredentials: true,
      });
      setLinkData(response.data.data);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch link data");
    }
  };

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
      setError(null);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch analytics data");
      navigate("/error");
    } finally {
      setLoading(false);
    }
  };

  const groupBy = (key) => {
    return analyticsData.reduce((acc, item) => {
      const label = item[key] || "Unknown";
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});
  };

  const groupByDate = () => {
    const grouped = analyticsData.reduce((acc, item) => {
      const date = new Date(item.clickedAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Sort by date
    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .reduce((acc, [date, count]) => {
        acc[date] = count;
        return acc;
      }, {});
  };

  const clicksByCity = groupBy("city");
  const clicksByBrowser = groupBy("browser");
  const clicksByDevice = groupBy("deviceType");
  const clicksByCountry = groupBy("country");
  const clicksByDate = groupByDate();

  // Calculate summary statistics
  const totalClicks = analyticsData.length;
  const uniqueVisitors = new Set(analyticsData.map((item) => item.ip)).size;
  const uniqueCities = Object.keys(clicksByCity).length;
  const uniqueCountries = Object.keys(clicksByCountry).length;

  // Get top performing data
  const topCities = Object.entries(clicksByCity)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const topBrowsers = Object.entries(clicksByBrowser)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const columns = [
    {
      field: "ip",
      headerName: "IP Address",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <div className={styles.ipCell}>
          <span className={styles.ipText}>{params.value}</span>
        </div>
      ),
    },
    {
      field: "city",
      headerName: "Location",
      flex: 1.2,
      minWidth: 100,
      renderCell: (params) => (
        <div className={styles.locationCell}>
          <span className={styles.cityText}>{params.value || "Unknown"}</span>
          <span className={styles.countryText}>{params.row.country}</span>
        </div>
      ),
    },
    {
      field: "deviceType",
      headerName: "Device",
      flex: 0.8,
      minWidth: 80,
      renderCell: (params) => (
        <div className={styles.deviceCell}>
          <span
            className={`${styles.deviceIcon} ${
              params.value === "mobile" ? styles.mobile : styles.desktop
            }`}
          >
            {params.value === "mobile" ? "📱" : "💻"}
          </span>
          <span className={styles.deviceText}>{params.value || "Unknown"}</span>
        </div>
      ),
    },
    {
      field: "browser",
      headerName: "Browser",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <div className={styles.browserCell}>
          <span className={styles.browserText}>
            {params.value || "Unknown"}
          </span>
        </div>
      ),
    },
    {
      field: "clickedAt",
      headerName: "Clicked At",
      flex: 1.2,
      minWidth: 140,
      renderCell: (params) => (
        <div className={styles.dateCell}>
          <span className={styles.dateText}>
            {formatDate(params.row.clickedAt)}
          </span>
        </div>
      ),
    },
  ];

  // Responsive columns for mobile
  const mobileColumns = [
    {
      field: "city",
      headerName: "Location",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <div className={styles.locationCell}>
          <span className={styles.cityText}>{params.value || "Unknown"}</span>
          <span className={styles.countryText}>{params.row.country}</span>
        </div>
      ),
    },
    {
      field: "deviceType",
      headerName: "Device",
      flex: 0.8,
      minWidth: 80,
      renderCell: (params) => (
        <div className={styles.deviceCell}>
          <span
            className={`${styles.deviceIcon} ${
              params.value === "mobile" ? styles.mobile : styles.desktop
            }`}
          >
            {params.value === "mobile" ? "📱" : "💻"}
          </span>
          <span className={styles.deviceText}>{params.value || "Unknown"}</span>
        </div>
      ),
    },
    {
      field: "clickedAt",
      headerName: "Time",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <div className={styles.dateCell}>
          <span className={styles.dateText}>
            {new Date(params.row.clickedAt).toLocaleDateString()}
          </span>
        </div>
      ),
    },
  ];

  // Function to get columns based on screen size
  const getColumns = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth <= 768 ? mobileColumns : columns;
    }
    return columns;
  };

  const [currentColumns, setCurrentColumns] = useState(getColumns());

  // Update columns on window resize
  useEffect(() => {
    const handleResize = () => {
      setCurrentColumns(getColumns());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchLinkData();
  }, [id]);

  useEffect(() => {
    fetchAnalytics();
  }, [fromDate, toDate, id]);

  if (error) {
    return (
      <div className={styles.analyticsDashboard}>
        <div className={styles.errorContainer}>
          <h2>Error Loading Analytics</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={styles.retryBtn}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.analyticsDashboard}>
      {/* Header Section */}
      <div className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1 className={styles.dashboardTitle}>
              <span className={styles.titleIcon}>📊</span>
              Analytics Dashboard
            </h1>
            <p className={styles.dashboardSubtitle}>
              {linkData ? `Campaign: ${linkData.campaignTitle}` : "Loading..."}
            </p>
          </div>
          <div className={styles.headerRight}>
            <Link to="/dashboard" className={styles.backBtn}>
              <span className={styles.btnIcon}>←</span>
              Back to Links
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👆</div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>
                {formatNumber(totalClicks)}
              </div>
              <div className={styles.statLabel}>Total Clicks</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>
                {formatNumber(uniqueVisitors)}
              </div>
              <div className={styles.statLabel}>Unique Visitors</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>🌍</div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{uniqueCountries}</div>
              <div className={styles.statLabel}>Countries</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>🏙️</div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{uniqueCities}</div>
              <div className={styles.statLabel}>Cities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className={styles.filtersSection}>
        <h3 className={styles.filtersTitle}>
          <span className={styles.filtersIcon}>🔍</span>
          Date Range Filter
        </h3>
        <div className={styles.filtersContent}>
          <div className={styles.datePickerContainer}>
            <label className={styles.datePickerLabel}>From Date</label>
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              className={styles.datePicker}
              placeholderText="Select start date"
              maxDate={new Date()}
            />
          </div>
          <div className={styles.datePickerContainer}>
            <label className={styles.datePickerLabel}>To Date</label>
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              className={styles.datePicker}
              placeholderText="Select end date"
              maxDate={new Date()}
              minDate={fromDate}
            />
          </div>
          <button
            onClick={() => {
              setFromDate(null);
              setToDate(null);
            }}
            className={styles.clearBtn}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsSection}>
        <div className={styles.chartsGrid}>
          {/* Clicks Over Time */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              <span className={styles.chartIcon}>📈</span>
              Clicks Over Time
            </h3>
            <div className={styles.chartDivider} />
            <div className={styles.chartContainer}>
              <Line
                data={{
                  labels: Object.keys(clicksByDate),
                  datasets: [
                    {
                      label: "Clicks",
                      data: Object.values(clicksByDate),
                      borderColor: "#667eea",
                      backgroundColor: "rgba(102, 126, 234, 0.1)",
                      fill: true,
                      tension: 0.4,
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
                      ticks: {
                        stepSize: 1,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Top Cities */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              <span className={styles.chartIcon}>🏙️</span>
              Top Cities
            </h3>
            <div className={styles.chartDivider} />
            <div className={styles.chartContainer}>
              <Bar
                data={{
                  labels: topCities.map(([city]) => city),
                  datasets: [
                    {
                      label: "Clicks",
                      data: topCities.map(([, count]) => count),
                      backgroundColor: "rgba(102, 126, 234, 0.8)",
                      borderRadius: 8,
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
                      ticks: {
                        stepSize: 1,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className={styles.chartsGrid}>
          {/* Browser Distribution */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              <span className={styles.chartIcon}>🌐</span>
              Browser Distribution
            </h3>
            <div className={styles.chartDivider} />
            <div className={styles.chartContainer}>
              <Doughnut
                data={{
                  labels: Object.keys(clicksByBrowser),
                  datasets: [
                    {
                      data: Object.values(clicksByBrowser),
                      backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                        "#FF9F40",
                        "#FF6384",
                        "#C9CBCF",
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
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Device Types */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              <span className={styles.chartIcon}>📱</span>
              Device Types
            </h3>
            <div className={styles.chartDivider} />
            <div className={styles.chartContainer}>
              <Pie
                data={{
                  labels: Object.keys(clicksByDevice),
                  datasets: [
                    {
                      data: Object.values(clicksByDevice),
                      backgroundColor: [
                        "#667eea",
                        "#764ba2",
                        "#f093fb",
                        "#f5576c",
                        "#4facfe",
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
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Data Grid Section */}
      <div className={styles.dataGridContainer}>
        <h3 className={styles.dataGridTitle}>
          <span className={styles.chartIcon}>📋</span>
          Detailed Click Data
        </h3>
        <div className={styles.dataGridWrapper}>
          <DataGrid
            getRowId={(row) => row._id}
            rows={analyticsData}
            columns={currentColumns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 20, page: 0 },
              },
            }}
            pageSizeOptions={[10, 20, 50, 100]}
            disableRowSelectionOnClick
            loading={loading}
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
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
