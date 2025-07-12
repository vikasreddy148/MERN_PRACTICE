import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaRocket, FaBars, FaTimes } from "react-icons/fa";

function Header() {
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
      className={`modern-header ${isScrolled ? "scrolled" : ""} ${
        isMobileMenuOpen ? "menu-open" : ""
      }`}
    >
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          {/* Logo */}
          <Link className="navbar-brand" to="/">
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
                  className={`nav-link ${isActive("/") ? "active" : ""}`}
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/login") ? "active" : ""}`}
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    isActive("/register") ? "active" : ""
                  }`}
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </li>
            </ul>

            {/* CTA Buttons */}
            <div className="navbar-nav ms-auto">
              <Link
                to="/login"
                className="btn btn-outline-primary me-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .modern-header {
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

        .modern-header.scrolled {
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

        .btn {
          border-radius: 8px;
          font-weight: 500;
          padding: 0.5rem 1.5rem;
          transition: all 0.3s ease;
        }

        .btn-outline-primary {
          border-color: #667eea;
          color: #667eea;
        }

        .btn-outline-primary:hover {
          background: #667eea;
          border-color: #667eea;
          color: white;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
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

        /* Mobile Styles */
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
          .navbar-nav .nav-link {
            padding: 0.75rem 1rem;
            margin: 0.25rem 0;
          }

          .navbar-nav .nav-link.active::after {
            display: none;
          }

          .navbar-nav.ms-auto {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
          }

          .btn {
            width: 100%;
            margin: 0.25rem 0;
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

export default Header;
