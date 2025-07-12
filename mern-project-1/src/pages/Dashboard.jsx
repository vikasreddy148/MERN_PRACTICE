import { useSelector } from "react-redux";
import LinksDashboard from "./links/LinksDashboard";
import {
  FaRocket,
  FaChartLine,
  FaLink,
  FaUsers,
  FaDollarSign,
  FaArrowRight,
} from "react-icons/fa";

function Dashboard({ userDetails, setUserDetails }) {
  const user = useSelector((state) => state.user);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <div className="welcome-header">
              <FaRocket className="welcome-icon" />
              <h1 className="welcome-title">
                Welcome back, {user?.name || "User"}! 🚀
              </h1>
            </div>
            <p className="welcome-subtitle">
              Ready to boost your affiliate marketing performance? Let's dive
              into your dashboard.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <FaLink />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">0</h3>
                <p className="stat-label">Active Links</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FaChartLine />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">0</h3>
                <p className="stat-label">Total Clicks</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">0</h3>
                <p className="stat-label">Visitors</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FaDollarSign />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">$0</h3>
                <p className="stat-label">Revenue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="dashboard-content">
          <LinksDashboard />
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3 className="actions-title">Quick Actions</h3>
          <div className="actions-grid">
            <button className="action-btn">
              <FaLink className="action-icon" />
              <span>Create New Link</span>
              <FaArrowRight className="action-arrow" />
            </button>

            <button className="action-btn">
              <FaChartLine className="action-icon" />
              <span>View Analytics</span>
              <FaArrowRight className="action-arrow" />
            </button>

            <button className="action-btn">
              <FaUsers className="action-icon" />
              <span>Manage Users</span>
              <FaArrowRight className="action-arrow" />
            </button>

            <button className="action-btn">
              <FaDollarSign className="action-icon" />
              <span>Payment Settings</span>
              <FaArrowRight className="action-arrow" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 2rem;
        }

        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .welcome-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .welcome-content {
          margin-bottom: 2rem;
        }

        .welcome-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .welcome-icon {
          font-size: 2.5rem;
          color: #667eea;
        }

        .welcome-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .welcome-subtitle {
          color: #6c757d;
          font-size: 1.1rem;
          margin: 0;
          line-height: 1.6;
        }

        .quick-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1.5rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 30px rgba(102, 126, 234, 0.3);
        }

        .stat-icon {
          font-size: 2rem;
          opacity: 0.9;
        }

        .stat-content {
          flex: 1;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.25rem 0;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.9;
          margin: 0;
        }

        .dashboard-content {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .quick-actions {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .actions-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 1.5rem 0;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .action-btn {
          background: white;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
          font-weight: 500;
          color: #495057;
        }

        .action-btn:hover {
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
        }

        .action-icon {
          font-size: 1.5rem;
          color: #667eea;
        }

        .action-arrow {
          margin-left: auto;
          font-size: 0.875rem;
          color: #6c757d;
          transition: transform 0.3s ease;
        }

        .action-btn:hover .action-arrow {
          transform: translateX(4px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .dashboard-page {
            padding: 1rem;
          }

          .welcome-section {
            padding: 1.5rem;
          }

          .welcome-title {
            font-size: 2rem;
          }

          .welcome-header {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }

          .quick-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .stat-card {
            padding: 1rem;
          }

          .stat-number {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .quick-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
