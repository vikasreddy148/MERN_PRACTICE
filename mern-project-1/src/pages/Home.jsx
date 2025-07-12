import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
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

function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section text-white position-relative overflow-hidden">
        <div className="hero-bg"></div>
        <div className="container position-relative">
          <div className="row min-vh-100 align-items-center">
            <div className="col-lg-6">
              <div className={`hero-content ${isVisible ? "fade-in" : ""}`}>
                <h1 className="display-4 fw-bold mb-4">
                  Transform Your
                  <span className="text-gradient"> Affiliate Marketing</span>
                </h1>
                <p className="lead mb-4 opacity-75">
                  The ultimate platform for managing, tracking, and optimizing
                  your affiliate links. Boost your revenue with intelligent
                  analytics and powerful tools designed for modern marketers.
                </p>
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <Link
                    to="/register"
                    className="btn btn-primary btn-lg px-4 py-3"
                  >
                    <FaRocket className="me-2" />
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-outline-light btn-lg px-4 py-3"
                  >
                    Sign In
                    <FaArrowRight className="ms-2" />
                  </Link>
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
              <div className={`hero-visual ${isVisible ? "slide-in" : ""}`}>
                <div className="dashboard-mockup">
                  <div className="mockup-header">
                    <div className="mockup-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div className="mockup-content">
                    <div className="mockup-chart"></div>
                    <div className="mockup-stats">
                      <div className="stat-item">
                        <div className="stat-number">2.4M</div>
                        <div className="stat-label">Total Clicks</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">$45K</div>
                        <div className="stat-label">Revenue</div>
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
      <section className="features-section py-5">
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
                  className={`feature-card h-100 ${
                    isVisible ? "fade-in-up" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="feature-icon mb-3">{feature.icon}</div>
                  <h4 className="fw-bold mb-3">{feature.title}</h4>
                  <p className="text-muted mb-0">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section py-5 bg-light">
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
              <div className="benefits-list">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="benefit-item d-flex align-items-center mb-3"
                  >
                    <FaCheckCircle className="text-success me-3" size={20} />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              <Link to="/register" className="btn btn-primary btn-lg mt-4">
                Start Your Free Trial
                <FaArrowRight className="ms-2" />
              </Link>
            </div>
            <div className="col-lg-6">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">2.4M+</div>
                  <div className="stat-label">Links Tracked</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">$2.1M</div>
                  <div className="stat-label">Revenue Generated</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Active Users</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">99.9%</div>
                  <div className="stat-label">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 text-white">
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-3">
            Ready to Boost Your Revenue?
          </h2>
          <p className="lead mb-4 opacity-75">
            Join thousands of successful marketers and start optimizing your
            affiliate campaigns today.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link to="/register" className="btn btn-primary btn-lg px-4 py-3">
              <FaRocket className="me-2" />
              Get Started Now
            </Link>
            <Link
              to="/login"
              className="btn btn-outline-light btn-lg px-4 py-3"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .landing-page {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
        }

        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="%23ffffff" stop-opacity="0.1"/><stop offset="100%" stop-color="%23ffffff" stop-opacity="0"/></radialGradient></defs><circle cx="200" cy="200" r="100" fill="url(%23a)"/><circle cx="800" cy="300" r="150" fill="url(%23a)"/><circle cx="400" cy="700" r="120" fill="url(%23a)"/></svg>');
          opacity: 0.3;
        }

        .text-gradient {
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dashboard-mockup {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .mockup-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }

        .mockup-dots {
          display: flex;
          gap: 8px;
        }

        .mockup-dots span {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
        }

        .mockup-content {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          padding: 20px;
        }

        .mockup-chart {
          height: 120px;
          background: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.05)
          );
          border-radius: 10px;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
        }

        .mockup-chart::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-50%);
        }

        .mockup-stats {
          display: flex;
          gap: 20px;
        }

        .stat-item {
          flex: 1;
          text-align: center;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: #fff;
        }

        .stat-label {
          font-size: 0.875rem;
          opacity: 0.7;
        }

        .feature-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .feature-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .benefits-section {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .benefit-item {
          font-size: 1.1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .stat-card {
          background: white;
          border-radius: 15px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
        }

        .stat-card .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 5px;
        }

        .stat-card .stat-label {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .cta-section {
          background: linear-gradient(135deg, #495057 0%, #343a40 100%);
        }

        /* Animations */
        .fade-in {
          animation: fadeIn 1s ease-out;
        }

        .slide-in {
          animation: slideIn 1s ease-out;
        }

        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-section {
            text-align: center;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .mockup-stats {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
