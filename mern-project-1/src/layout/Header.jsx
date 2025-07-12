import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaRocket, FaBars, FaTimes } from "react-icons/fa";
import styles from "./Header.module.css";

function Header({ onLoginClick, onRegisterClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`${styles.modernHeader} ${isScrolled ? styles.scrolled : ""}`}
    >
      <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
        <div className="container">
          {/* Logo */}
          <Link className="navbar-brand" to="/">
            <div className={styles.brandContainer}>
              <FaRocket className={styles.brandIcon} />
              <span className={styles.brandText}>Affiliate++</span>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className={`navbar-toggler ${styles.mobileMenuBtn}`}
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
                    isActive("/") ? styles.active : ""
                  }`}
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${styles.navLink} ${
                    isActive("/login") ? styles.active : ""
                  } btn btn-link`}
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLoginClick();
                  }}
                  style={{ textDecoration: "none" }}
                >
                  Login
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${styles.navLink} ${
                    isActive("/register") ? styles.active : ""
                  } btn btn-link`}
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onRegisterClick();
                  }}
                  style={{ textDecoration: "none" }}
                >
                  Register
                </button>
              </li>
            </ul>

            {/* CTA Buttons */}
            <div className="navbar-nav ms-auto">
              <button
                type="button"
                className={`btn ${styles.btn} ${styles.btnOutlinePrimary} me-2`}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLoginClick();
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`btn ${styles.btn} ${styles.btnPrimary}`}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onRegisterClick();
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
