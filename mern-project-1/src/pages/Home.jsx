import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaLink,
  FaChartLine,
  FaCreditCard,
  FaShieldAlt,
  FaRocket,
  FaUsers,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import styles from "./Home.module.css";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";

function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Open modal if ?modal=login or ?modal=register is present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modal = params.get("modal");
    if (modal === "login") {
      setShowLogin(true);
      setShowRegister(false);
    } else if (modal === "register") {
      setShowRegister(true);
      setShowLogin(false);
    }
  }, [location.search]);

  // Close modal and remove query param
  const handleCloseLogin = () => {
    setShowLogin(false);
    const params = new URLSearchParams(location.search);
    if (params.get("modal")) {
      params.delete("modal");
      navigate({ pathname: "/", search: params.toString() });
    }
  };
  const handleCloseRegister = () => {
    setShowRegister(false);
    const params = new URLSearchParams(location.search);
    if (params.get("modal")) {
      params.delete("modal");
      navigate({ pathname: "/", search: params.toString() });
    }
  };

  const openLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
    navigate("/?modal=login", { replace: true });
  };
  const openRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
    navigate("/?modal=register", { replace: true });
  };

  const features = [
    {
      icon: <FaLink className="text-primary" size={40} />,
      title: "Smart Link Management",
      description:
        "Create, organize, and manage your affiliate links with our intuitive dashboard. Track performance and optimize your campaigns in real-time.",
      color: "primary",
    },
    {
      icon: <FaChartLine className="text-success" size={40} />,
      title: "Advanced Analytics",
      description:
        "Get detailed insights into click patterns, conversion rates, and revenue tracking. Make data-driven decisions to maximize your earnings.",
      color: "success",
    },
    {
      icon: <FaCreditCard className="text-warning" size={40} />,
      title: "Flexible Payments",
      description:
        "Choose between pay-per-use credits or unlimited subscriptions. Secure payment processing with multiple options available.",
      color: "warning",
    },
    {
      icon: <FaShieldAlt className="text-info" size={40} />,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with role-based access control. Your data is protected with industry-standard encryption.",
      color: "info",
    },
  ];

  const benefits = [
    "Real-time click tracking and analytics",
    "Custom link branding and optimization",
    "Multi-user collaboration with role management",
    "Automated reporting and insights",
    "Mobile-responsive dashboard",
    "24/7 customer support",
  ];

  return (
    <div className={styles.landingPage}>
      <LoginModal isOpen={showLogin} onClose={handleCloseLogin} />
      <RegisterModal isOpen={showRegister} onClose={handleCloseRegister} />
      {/* Hero Section */}
      <section
        className={`${styles.heroSection} text-white position-relative overflow-hidden`}
      >
        <div className={styles.heroBg}></div>
        <div className="container position-relative">
          <div className="row min-vh-100 align-items-center">
            <div className="col-lg-6">
              <div
                className={`${styles.heroContent} ${
                  isVisible ? styles.fadeIn : ""
                }`}
              >
                <h1 className="display-4 fw-bold mb-4">
                  Transform Your
                  <span className={styles.textGradient}>
                    {" "}
                    Affiliate Marketing
                  </span>
                </h1>
                <p className="lead mb-4 opacity-75">
                  The ultimate platform for managing, tracking, and optimizing
                  your affiliate links. Boost your revenue with intelligent
                  analytics and powerful tools designed for modern marketers.
                </p>
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <button
                    className="btn btn-primary btn-lg px-4 py-3"
                    onClick={openRegister}
                  >
                    <FaRocket className="me-2" />
                    Get Started Free
                  </button>
                  <button
                    className="btn btn-outline-light btn-lg px-4 py-3"
                    onClick={openLogin}
                  >
                    Sign In
                    <FaArrowRight className="ms-2" />
                  </button>
                </div>
                <div className="d-flex align-items-center gap-4 text-sm">
                  <div className="d-flex align-items-center">
                    <FaUsers className="me-2" />
                    <span>10,000+ Active Users</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaCheckCircle className="me-2" />
                    <span>99.9% Uptime</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div
                className={`${styles.heroVisual} ${
                  isVisible ? styles.slideIn : ""
                }`}
              >
                <div className={styles.dashboardMockup}>
                  <div className={styles.mockupHeader}>
                    <div className={styles.mockupDots}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div className={styles.mockupContent}>
                    <div className={styles.mockupChart}></div>
                    <div className={styles.mockupStats}>
                      <div className={styles.statItem}>
                        <div className={styles.statNumber}>2.4M</div>
                        <div className={styles.statLabel}>Total Clicks</div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statNumber}>$45K</div>
                        <div className={styles.statLabel}>Revenue</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`${styles.featuresSection} py-5`}>
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <h2 className="display-5 fw-bold mb-3">
                Everything You Need to Succeed
              </h2>
              <p className="lead text-muted">
                Powerful features designed to help you maximize your affiliate
                marketing potential
              </p>
            </div>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-6 col-xl-3">
                <div
                  className={`${styles.featureCard} h-100 ${
                    isVisible ? styles.fadeInUp : ""
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`${styles.featureIcon} mb-3`}>
                    {feature.icon}
                  </div>
                  <h4 className="fw-bold mb-3">{feature.title}</h4>
                  <p className="text-muted mb-0">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={`${styles.benefitsSection} py-5 bg-light`}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-4">
                Why Choose Affiliate++?
              </h2>
              <p className="lead text-muted mb-4">
                Join thousands of successful marketers who trust our platform to
                grow their business.
              </p>
              <div className={styles.benefitsList}>
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className={`${styles.benefitItem} d-flex align-items-center mb-3`}
                  >
                    <FaCheckCircle className="text-success me-3" size={20} />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={openRegister}
                className="btn btn-primary btn-lg mt-4"
              >
                Start Your Free Trial
                <FaArrowRight className="ms-2" />
              </button>
            </div>
            <div className="col-lg-6">
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>2.4M+</div>
                  <div className={styles.statLabel}>Links Tracked</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>$2.1M</div>
                  <div className={styles.statLabel}>Revenue Generated</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>10K+</div>
                  <div className={styles.statLabel}>Active Users</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>99.9%</div>
                  <div className={styles.statLabel}>Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`${styles.ctaSection} py-5 text-white`}>
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-3">
            Ready to Boost Your Revenue?
          </h2>
          <p className="lead mb-4 opacity-75">
            Join thousands of successful marketers and start optimizing your
            affiliate campaigns today.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <button
              onClick={openRegister}
              className="btn btn-primary btn-lg px-4 py-3"
            >
              <FaRocket className="me-2" />
              Get Started Now
            </button>
            <button
              onClick={openLogin}
              className="btn btn-outline-light btn-lg px-4 py-3"
            >
              Sign In to Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
