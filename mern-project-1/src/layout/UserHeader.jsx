import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Can from "../rbac/Can";
import axios from "axios";
import { serverEndpoint } from "../config/config";
import {
  FaRocket,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaKey,
  FaCreditCard,
  FaUsers,
  FaBars,
  FaTimes,
  FaBell,
  FaSearch,
} from "react-icons/fa";

function UserHeader() {
  const userDetails = useSelector((state) => state.userDetails);
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleResetPassword = async () => {
    if (!userDetails?.email) return;
    try {
      await axios.post(`${serverEndpoint}/auth/send-reset-password-token`, {
        email: userDetails.email,
      });
      navigate("/reset-password", { state: { email: userDetails.email } });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send reset code");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`user-header ${isScrolled ? "scrolled" : ""} ${
        isMobileMenuOpen ? "menu-open" : ""
      }`}
    >
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          {/* Logo */}
          <Link className="navbar-brand" to="/dashboard">
            <div className="brand-container">
              <FaRocket className="brand-icon" />
              <span className="brand-text">Affiliate++</span>
            </div>
          </Link>
          {/* Mobile Menu Button */}
          <button
            className="navbar-toggler mobile-menu-btn"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          {/* Overlay for mobile menu */}
          {isMobileMenuOpen && (
            <div
              className="mobile-menu-overlay"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
          )}
          {/* Navigation Menu */}
          <div className={`navbar-collapse ${isMobileMenuOpen ? "show" : ""}`}>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    isActive("/dashboard") ? "active" : ""
                  }`}
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    isActive("/manage-payments") ? "active" : ""
                  }`}
                  to="/manage-payments"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Payments
                </Link>
              </li>
              <Can permission="canViewUser">
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/users") ? "active" : ""}`}
                    to="/users"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Users
                  </Link>
                </li>
              </Can>
            </ul>

            {/* Right Side Actions */}
            <div className="navbar-nav ms-auto align-items-center">
              {/* Search */}
              <div className="search-container me-3">
                <div className="search-input-wrapper">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search links..."
                  />
                </div>
              </div>

              {/* Notifications */}
              <div className="notification-icon me-3">
                <FaBell />
                <span className="notification-badge">3</span>
              </div>

              {/* User Profile Dropdown */}
              <div className="user-dropdown">
                <button
                  className="user-dropdown-toggle"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="user-avatar">
                    <FaUser />
                  </div>
                  <div className="user-info">
                    <span className="user-name">
                      {userDetails?.name || "User"}
                    </span>
                    <span className="user-role">
                      {userDetails?.role || "User"}
                    </span>
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="dropdown-menu show">
                    <div className="dropdown-header">
                      <div className="user-avatar-large">
                        <FaUser />
                      </div>
                      <div className="user-details">
                        <span className="user-name-large">
                          {userDetails?.name || "User"}
                        </span>
                        <span className="user-email">{userDetails?.email}</span>
                      </div>
                    </div>

                    <div className="dropdown-divider"></div>

                    <Link
                      className="dropdown-item"
                      to="/manage-payments"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaCreditCard className="dropdown-icon" />
                      Manage Payments
                    </Link>

                    <Can permission="canViewUser">
                      <Link
                        className="dropdown-item"
                        to="/users"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaUsers className="dropdown-icon" />
                        Manage Users
                      </Link>
                    </Can>

                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => {
                        handleResetPassword();
                        setIsDropdownOpen(false);
                      }}
                    >
                      <FaKey className="dropdown-icon" />
                      Reset Password
                    </Link>

                    <div className="dropdown-divider"></div>

                    <Link
                      className="dropdown-item text-danger"
                      to="/logout"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaSignOutAlt className="dropdown-icon" />
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .user-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .user-header.scrolled {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }

        .navbar {
          padding: 1rem 0;
        }

        .brand-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .brand-icon {
          font-size: 1.5rem;
          color: #667eea;
        }

        .brand-text {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .navbar-nav .nav-link {
          color: #495057;
          font-weight: 500;
          padding: 0.5rem 1rem;
          margin: 0 0.25rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          position: relative;
        }

        .navbar-nav .nav-link:hover {
          color: #667eea;
          background: rgba(102, 126, 234, 0.1);
        }

        .navbar-nav .nav-link.active {
          color: #667eea;
          background: rgba(102, 126, 234, 0.1);
        }

        .navbar-nav .nav-link.active::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2px;
          background: #667eea;
          border-radius: 1px;
        }

        .search-container {
          position: relative;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: #6c757d;
          font-size: 0.875rem;
        }

        .search-input {
          padding: 0.5rem 1rem 0.5rem 2.5rem;
          border: 1px solid #dee2e6;
          border-radius: 20px;
          background: #f8f9fa;
          font-size: 0.875rem;
          width: 200px;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .notification-icon {
          position: relative;
          color: #6c757d;
          font-size: 1.1rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .notification-icon:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .notification-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: #e74c3c;
          color: white;
          font-size: 0.7rem;
          padding: 0.1rem 0.3rem;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
        }

        .user-dropdown {
          position: relative;
        }

        .user-dropdown-toggle {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: none;
          border: none;
          padding: 0.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .user-dropdown-toggle:hover {
          background: rgba(102, 126, 234, 0.1);
        }

        .user-avatar {
          width: 35px;
          height: 35px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.875rem;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .user-name {
          font-weight: 600;
          color: #495057;
          font-size: 0.875rem;
        }

        .user-role {
          font-size: 0.75rem;
          color: #6c757d;
          text-transform: capitalize;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(0, 0, 0, 0.05);
          min-width: 250px;
          padding: 0;
          margin-top: 0.5rem;
          z-index: 1000;
        }

        .dropdown-header {
          padding: 1rem;
          border-bottom: 1px solid #f1f3f4;
        }

        .user-avatar-large {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name-large {
          font-weight: 600;
          color: #495057;
          font-size: 1rem;
        }

        .user-email {
          font-size: 0.875rem;
          color: #6c757d;
        }

        .dropdown-divider {
          height: 1px;
          background: #f1f3f4;
          margin: 0.5rem 0;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: #495057;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 0.875rem;
        }

        .dropdown-item:hover {
          background: #f8f9fa;
          color: #667eea;
        }

        .dropdown-item.text-danger:hover {
          background: #fee;
          color: #dc3545;
        }

        .dropdown-icon {
          font-size: 1rem;
          width: 16px;
        }

        .mobile-menu-btn {
          border: none;
          background: none;
          color: #495057;
          font-size: 1.25rem;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .mobile-menu-btn:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        /* Mobile Styles */
        @media (max-width: 991.98px) {
          .navbar-collapse {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            margin-top: 1rem;
            padding: 1rem;
          }

          .navbar-nav .nav-link {
            padding: 0.75rem 1rem;
            margin: 0.25rem 0;
          }

          .navbar-nav .nav-link.active::after {
            display: none;
          }

          .search-container {
            margin: 1rem 0;
          }

          .search-input {
            width: 100%;
          }

          .notification-icon {
            margin: 1rem 0;
          }

          .user-dropdown {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
          }

          .dropdown-menu {
            position: static;
            box-shadow: none;
            border: none;
            margin-top: 1rem;
          }
        }

        /* Animation for mobile menu */
        .navbar-collapse.show {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.3);
          z-index: 999;
          display: block;
        }
        .menu-open {
          overflow: hidden;
        }
        @media (max-width: 991.98px) {
          .navbar-collapse {
            position: fixed;
            top: 0;
            right: 0;
            width: 80vw;
            max-width: 350px;
            height: 100vh;
            background: #fff;
            border-radius: 0 0 0 16px;
            box-shadow: -2px 0 30px rgba(0, 0, 0, 0.15);
            margin-top: 0;
            padding: 2rem 1.5rem 1.5rem 1.5rem;
            z-index: 1001;
            transform: translateX(0);
            animation: slideInRight 0.3s;
          }
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
          .mobile-menu-btn {
            z-index: 1100;
          }
        }
        /* Fix color contrast for buttons on purple backgrounds */
        .btn-primary,
        .stat-card,
        .add-link-btn {
          color: #fff !important;
        }
      `}</style>
    </header>
  );
}

export default UserHeader;
