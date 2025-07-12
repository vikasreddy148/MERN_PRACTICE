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
import styles from "./UserHeader.module.css";

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`${styles.userHeader} ${isScrolled ? styles.scrolled : ""}`}
    >
      <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
        <div className="container">
          {/* Logo */}
          <Link className="navbar-brand" to="/dashboard">
            <div className={styles.brandContainer}>
              <FaRocket className={styles.brandIcon} />
              <span className={styles.brandText}>Affiliate++</span>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className={`navbar-toggler ${styles.mobileMenuBtn}`}
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Navigation Menu */}
          <div
            className={`navbar-collapse ${styles.navbarCollapse} ${
              isMobileMenuOpen ? styles.show : ""
            }`}
          >
            <ul
              className={`navbar-nav me-auto mb-2 mb-lg-0 ${styles.navbarNav}`}
            >
              <li className="nav-item">
                <Link
                  className={`nav-link ${styles.navLink} ${
                    isActive("/dashboard") ? styles.active : ""
                  }`}
                  to="/dashboard"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${styles.navLink} ${
                    isActive("/manage-payments") ? styles.active : ""
                  }`}
                  to="/manage-payments"
                  onClick={closeMobileMenu}
                >
                  Payments
                </Link>
              </li>
              <Can permission="canViewUser">
                <li className="nav-item">
                  <Link
                    className={`nav-link ${styles.navLink} ${
                      isActive("/users") ? styles.active : ""
                    }`}
                    to="/users"
                    onClick={closeMobileMenu}
                  >
                    Users
                  </Link>
                </li>
              </Can>
            </ul>

            {/* Right Side Actions */}
            <div className="navbar-nav ms-auto align-items-center">
              {/* Search */}
              <div className={`${styles.searchContainer} me-3`}>
                <div className={styles.searchInputWrapper}>
                  <FaSearch className={styles.searchIcon} />
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search links..."
                  />
                </div>
              </div>

              {/* Notifications */}
              <div className={`${styles.notificationIcon} me-3`}>
                <FaBell />
                <span className={styles.notificationBadge}>3</span>
              </div>

              {/* User Profile Dropdown */}
              <div className={styles.userDropdown}>
                <button
                  className={styles.userDropdownToggle}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className={styles.userAvatar}>
                    <FaUser />
                  </div>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>
                      {userDetails?.name || "User"}
                    </span>
                    <span className={styles.userRole}>
                      {userDetails?.role || "User"}
                    </span>
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <div className={styles.dropdownHeader}>
                      <div className={styles.userAvatarLarge}>
                        <FaUser />
                      </div>
                      <div className={styles.userDetails}>
                        <span className={styles.userNameLarge}>
                          {userDetails?.name || "User"}
                        </span>
                        <span className={styles.userEmail}>
                          {userDetails?.email}
                        </span>
                      </div>
                    </div>

                    <div className={styles.dropdownDivider}></div>

                    <Link
                      className={styles.dropdownItem}
                      to="/manage-payments"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        closeMobileMenu();
                      }}
                    >
                      <FaCreditCard className={styles.dropdownIcon} />
                      Manage Payments
                    </Link>

                    <Can permission="canViewUser">
                      <Link
                        className={styles.dropdownItem}
                        to="/users"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          closeMobileMenu();
                        }}
                      >
                        <FaUsers className={styles.dropdownIcon} />
                        Manage Users
                      </Link>
                    </Can>

                    <Link
                      className={styles.dropdownItem}
                      to="#"
                      onClick={() => {
                        handleResetPassword();
                        setIsDropdownOpen(false);
                        closeMobileMenu();
                      }}
                    >
                      <FaKey className={styles.dropdownIcon} />
                      Reset Password
                    </Link>

                    <div className={styles.dropdownDivider}></div>

                    <Link
                      className={`${styles.dropdownItem} text-danger`}
                      to="/logout"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        closeMobileMenu();
                      }}
                    >
                      <FaSignOutAlt className={styles.dropdownIcon} />
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default UserHeader;
