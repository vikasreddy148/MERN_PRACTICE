import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { serverEndpoint } from "../config/config";
import {
  FaEnvelope,
  FaRocket,
  FaArrowRight,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaArrowLeft,
  FaClock,
} from "react-icons/fa";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (email) {
      startResendTimer();
    }
    // eslint-disable-next-line
  }, [email]);

  const startResendTimer = () => {
    setResendTimer(30);
    setShowResend(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setShowResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      await axios.post(`${serverEndpoint}/auth/send-reset-password-token`, {
        email,
      });
      setSuccess("Reset code resent to your email.");
      setShowResend(false);
      startResendTimer();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      await axios.post(`${serverEndpoint}/auth/reset-password`, {
        email,
        code,
        newPassword,
      });
      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-card">
          {/* Header */}
          <div className="reset-password-header">
            <div className="brand-container">
              <FaRocket className="brand-icon" />
              <span className="brand-text">Affiliate++</span>
            </div>
            <h1 className="reset-password-title">Reset Your Password</h1>
            <p className="reset-password-subtitle">
              Enter the 6-digit code sent to your email and create a new
              password
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
          <form onSubmit={handleSubmit} className="reset-password-form">
            {!location.state?.email && (
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
            )}

            <div className="form-group">
              <label htmlFor="code" className="form-label">
                <FaKey className="label-icon" />
                6-digit Verification Code
              </label>
              <input
                type="text"
                className="form-input"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                required
                maxLength={6}
                minLength={6}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">
                <FaLock className="label-icon" />
                New Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create a new password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Resend Code Section */}
            {email && (
              <div className="resend-section">
                <div className="resend-header">
                  <FaClock className="resend-icon" />
                  <span>Didn't receive the code?</span>
                </div>
                {showResend ? (
                  <button
                    type="button"
                    className="resend-btn"
                    onClick={handleResend}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="spinner"></div>
                    ) : (
                      "Resend Code"
                    )}
                  </button>
                ) : (
                  <div className="timer-display">
                    <span className="timer-text">
                      You can resend the code in <strong>{resendTimer}s</strong>
                    </span>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              className={`submit-btn ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  Reset Password
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

          {/* Security Tips */}
          <div className="security-tips">
            <h4 className="tips-title">Password Security Tips</h4>
            <div className="tips-list">
              <div className="tip-item">
                <span className="tip-bullet">•</span>
                <span>Use at least 8 characters</span>
              </div>
              <div className="tip-item">
                <span className="tip-bullet">•</span>
                <span>Include uppercase and lowercase letters</span>
              </div>
              <div className="tip-item">
                <span className="tip-bullet">•</span>
                <span>Add numbers and special characters</span>
              </div>
              <div className="tip-item">
                <span className="tip-bullet">•</span>
                <span>Avoid common words or phrases</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .reset-password-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .reset-password-page::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="%23ffffff" stop-opacity="0.1"/><stop offset="100%" stop-color="%23ffffff" stop-opacity="0"/></radialGradient></defs><circle cx="200" cy="200" r="100" fill="url(%23a)"/><circle cx="800" cy="300" r="150" fill="url(%23a)"/><circle cx="400" cy="700" r="120" fill="url(%23a)"/></svg>');
          opacity: 0.3;
        }

        .reset-password-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 500px;
        }

        .reset-password-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem 2rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .reset-password-header {
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

        .reset-password-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0 0 0.5rem 0;
        }

        .reset-password-subtitle {
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

        .reset-password-form {
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

        .password-input-wrapper {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .password-toggle:hover {
          color: #667eea;
          background: rgba(102, 126, 234, 0.1);
        }

        .password-toggle:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .resend-section {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .resend-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          color: #6c757d;
          font-weight: 500;
        }

        .resend-icon {
          color: #667eea;
          font-size: 0.875rem;
        }

        .resend-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .resend-btn:hover:not(:disabled) {
          background: #5a6fd8;
          transform: translateY(-1px);
        }

        .resend-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .timer-display {
          color: #6c757d;
          font-size: 0.875rem;
        }

        .timer-text strong {
          color: #667eea;
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

        .security-tips {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .tips-title {
          margin: 0 0 1rem 0;
          color: #2c3e50;
          font-size: 1rem;
          font-weight: 600;
        }

        .tips-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .tip-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6c757d;
          font-size: 0.875rem;
        }

        .tip-bullet {
          color: #667eea;
          font-weight: bold;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .reset-password-page {
            padding: 1rem;
          }

          .reset-password-card {
            padding: 2rem 1.5rem;
          }

          .reset-password-title {
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

export default ResetPassword;
