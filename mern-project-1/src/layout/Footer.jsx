import React from "react";
import { Link } from "react-router-dom";
import {
  FaRocket,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Features", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "API", href: "#" },
      { name: "Documentation", href: "#" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "#" },
    ],
    support: [
      { name: "Help Center", href: "#" },
      { name: "Community", href: "#" },
      { name: "Status", href: "#" },
      { name: "Security", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "GDPR", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: <FaTwitter />, href: "#", label: "Twitter" },
    { icon: <FaLinkedin />, href: "#", label: "LinkedIn" },
    { icon: <FaGithub />, href: "#", label: "GitHub" },
    {
      icon: <FaEnvelope />,
      href: "mailto:contact@affiliateplus.com",
      label: "Email",
    },
  ];

  return (
    <footer className="modern-footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container">
          <div className="row g-4">
            {/* Brand Section */}
            <div className="col-lg-4 col-md-6">
              <div className="footer-brand">
                <div className="brand-container mb-3">
                  <FaRocket className="brand-icon" />
                  <span className="brand-text">Affiliate++</span>
                </div>
                <p className="brand-description">
                  The ultimate platform for managing, tracking, and optimizing
                  your affiliate links. Boost your revenue with intelligent
                  analytics and powerful tools.
                </p>
                <div className="social-links">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="social-link"
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Links */}
            <div className="col-lg-2 col-md-6">
              <h5 className="footer-heading">Product</h5>
              <ul className="footer-links">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer-link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className="col-lg-2 col-md-6">
              <h5 className="footer-heading">Company</h5>
              <ul className="footer-links">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer-link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div className="col-lg-2 col-md-6">
              <h5 className="footer-heading">Support</h5>
              <ul className="footer-links">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer-link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="col-lg-2 col-md-6">
              <h5 className="footer-heading">Legal</h5>
              <ul className="footer-links">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer-link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="copyright">
                © {currentYear} Affiliate++. Made with{" "}
                <FaHeart className="heart-icon" /> by the Affiliate++ team.
              </p>
            </div>
            <div className="col-md-6">
              <div className="footer-bottom-links">
                <a href="#" className="footer-bottom-link">
                  Privacy
                </a>
                <a href="#" className="footer-bottom-link">
                  Terms
                </a>
                <a href="#" className="footer-bottom-link">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modern-footer {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          color: #ecf0f1;
          margin-top: auto;
        }

        .footer-main {
          padding: 4rem 0 2rem;
        }

        .footer-brand {
          margin-bottom: 2rem;
        }

        .brand-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .brand-icon {
          font-size: 1.5rem;
          color: #3498db;
        }

        .brand-text {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #3498db 0%, #9b59b6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-description {
          color: #bdc3c7;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: #ecf0f1;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 1.1rem;
        }

        .social-link:hover {
          background: #3498db;
          color: white;
          transform: translateY(-2px);
        }

        .footer-heading {
          color: #ecf0f1;
          font-weight: 600;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 0.75rem;
        }

        .footer-link {
          color: #bdc3c7;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }

        .footer-link:hover {
          color: #3498db;
          padding-left: 5px;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2rem 0;
          background: rgba(0, 0, 0, 0.2);
        }

        .copyright {
          color: #bdc3c7;
          margin: 0;
          font-size: 0.9rem;
        }

        .heart-icon {
          color: #e74c3c;
          margin: 0 0.25rem;
          animation: heartbeat 1.5s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .footer-bottom-links {
          display: flex;
          justify-content: flex-end;
          gap: 2rem;
        }

        .footer-bottom-link {
          color: #bdc3c7;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }

        .footer-bottom-link:hover {
          color: #3498db;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .footer-main {
            padding: 3rem 0 1.5rem;
          }

          .footer-bottom-links {
            justify-content: flex-start;
            margin-top: 1rem;
          }

          .social-links {
            justify-content: center;
          }

          .footer-heading {
            margin-top: 2rem;
          }
        }

        @media (max-width: 576px) {
          .footer-bottom-links {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
