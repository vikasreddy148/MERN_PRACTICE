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
import styles from "./Footer.module.css";

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
    <footer className={styles.modernFooter}>
      {/* Main Footer Content */}
      <div className={styles.footerMain}>
        <div className="container">
          <div className="row g-4">
            {/* Brand Section */}
            <div className="col-lg-4 col-md-6">
              <div className={styles.footerBrand}>
                <div className={`${styles.brandContainer} mb-3`}>
                  <FaRocket className={styles.brandIcon} />
                  <span className={styles.brandText}>Affiliate++</span>
                </div>
                <p className={styles.brandDescription}>
                  The ultimate platform for managing, tracking, and optimizing
                  your affiliate links. Boost your revenue with intelligent
                  analytics and powerful tools.
                </p>
                <div className={styles.socialLinks}>
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className={styles.socialLink}
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
              <h5 className={styles.footerHeading}>Product</h5>
              <ul className={styles.footerLinks}>
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className={styles.footerLink}>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className="col-lg-2 col-md-6">
              <h5 className={styles.footerHeading}>Company</h5>
              <ul className={styles.footerLinks}>
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className={styles.footerLink}>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div className="col-lg-2 col-md-6">
              <h5 className={styles.footerHeading}>Support</h5>
              <ul className={styles.footerLinks}>
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className={styles.footerLink}>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="col-lg-2 col-md-6">
              <h5 className={styles.footerHeading}>Legal</h5>
              <ul className={styles.footerLinks}>
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className={styles.footerLink}>
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
      <div className={styles.footerBottom}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className={styles.copyright}>
                © {currentYear} Affiliate++. Made with{" "}
                <FaHeart className={styles.heartIcon} /> by the Affiliate++
                team.
              </p>
            </div>
            <div className="col-md-6">
              <div className={styles.footerBottomLinks}>
                <a href="#" className={styles.footerBottomLink}>
                  Privacy
                </a>
                <a href="#" className={styles.footerBottomLink}>
                  Terms
                </a>
                <a href="#" className={styles.footerBottomLink}>
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
