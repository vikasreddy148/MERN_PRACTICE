import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { serverEndpoint } from "../config/config";
import {
  FaEnvelope,
  FaRocket,
  FaArrowRight,
  FaLock,
  FaArrowLeft,
} from "react-icons/fa";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await axios.post(`${serverEndpoint}/auth/send-reset-password-token`, {
        email,
      });
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forget-password-page">
      <div className="forget-password-container">
        <div className="forget-password-card">
          {/* Header */}
          <div className="forget-password-header">
            <div className="brand-container">
              <FaRocket className="brand-icon" />
              <span className="brand-text">Affiliate++</span>
            </div>
            <h1 className="forget-password-title">Forgot Password?</h1>
            <p className="forget-password-subtitle">
              No worries! Enter your email and we'll send you a reset code.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="error-alert">
              <div className="error-content">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{error}</span>
              </div>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="success-alert">
              <div className="success-content">
                <span className="success-icon">✅</span>
                <span className="success-text">{success}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="forget-password-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <FaEnvelope className="label-icon" />
                Email Address
              </label>
              <input
                type="email"
                className="form-input"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className={`submit-btn ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  Send Reset Code
                  <FaArrowRight className="btn-icon" />
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="back-to-login">
            <Link to="/login" className="back-link">
              <FaArrowLeft className="back-icon" />
              Back to Login
            </Link>
          </div>

          {/* Help Section */}
          <div className="help-section">
            <div className="help-item">
              <FaLock className="help-icon" />
              <div className="help-content">
                <h4>Secure Reset Process</h4>
                <p>We'll send a secure code to your email address</p>
              </div>
            </div>
            <div className="help-item">
              <FaEnvelope className="help-icon" />
              <div className="help-content">
                <h4>Check Your Email</h4>
                <p>Look for the reset code in your inbox or spam folder</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .forget-password-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .forget-password-page::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="%23ffffff" stop-opacity="0.1"/><stop offset="100%" stop-color="%23ffffff" stop-opacity="0"/></radialGradient></defs><circle cx="200" cy="200" r="100" fill="url(%23a)"/><circle cx="800" cy="300" r="150" fill="url(%23a)"/><circle cx="400" cy="700" r="120" fill="url(%23a)"/></svg>');
          opacity: 0.3;
        }

        .forget-password-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 500px;
        }

        .forget-password-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem 2rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .forget-password-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .brand-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .brand-icon {
          font-size: 2rem;
          color: #667eea;
        }

        .brand-text {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .forget-password-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0 0 0.5rem 0;
        }

        .forget-password-subtitle {
          color: #6c757d;
          font-size: 1rem;
          margin: 0;
          line-height: 1.6;
        }

        .error-alert {
          background: #fee;
          border: 1px solid #fcc;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .error-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .error-icon {
          font-size: 1.25rem;
        }

        .error-text {
          color: #dc3545;
          font-weight: 500;
        }

        .success-alert {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .success-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .success-icon {
          font-size: 1.25rem;
        }

        .success-text {
          color: #155724;
          font-weight: 500;
        }

        .forget-password-form {
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #495057;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .label-icon {
          color: #667eea;
          font-size: 0.875rem;
        }

        .form-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-input:disabled {
          background: #f8f9fa;
          cursor: not-allowed;
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .submit-btn.loading {
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .btn-icon {
          font-size: 0.875rem;
        }

        .back-to-login {
          text-align: center;
          margin-bottom: 2rem;
        }

        .back-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .back-link:hover {
          color: #764ba2;
          transform: translateX(-2px);
        }

        .back-icon {
          font-size: 0.875rem;
        }

        .help-section {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .help-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .help-item:last-child {
          margin-bottom: 0;
        }

        .help-icon {
          color: #667eea;
          font-size: 1.25rem;
          margin-top: 0.25rem;
        }

        .help-content h4 {
          margin: 0 0 0.25rem 0;
          color: #2c3e50;
          font-size: 1rem;
          font-weight: 600;
        }

        .help-content p {
          margin: 0;
          color: #6c757d;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .forget-password-page {
            padding: 1rem;
          }

          .forget-password-card {
            padding: 2rem 1.5rem;
          }

          .forget-password-title {
            font-size: 1.75rem;
          }

          .brand-text {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
}

export default ForgetPassword;
