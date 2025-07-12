import { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { serverEndpoint } from "../config/config";
import { useDispatch } from "react-redux";
import { SET_USER } from "../redux/user/actions";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaRocket,
  FaGoogle,
  FaArrowRight,
} from "react-icons/fa";

function Login() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let isValid = true;
    let newErrors = {};

    if (formData.username.length === 0) {
      isValid = false;
      newErrors.username = "Username is mandatory";
    }

    if (formData.password.length === 0) {
      isValid = false;
      newErrors.password = "Password is mandatory";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setIsLoading(true);
      const body = {
        username: formData.username,
        password: formData.password,
      };
      const config = {
        withCredentials: true,
      };
      try {
        const response = await axios.post(
          `${serverEndpoint}/auth/login`,
          body,
          config
        );
        dispatch({
          type: SET_USER,
          payload: response.data.user,
        });
      } catch (error) {
        console.log(error);
        setErrors({ message: "Invalid credentials. Please try again." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSuccess = async (authResponse) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${serverEndpoint}/auth/google-auth`,
        {
          idToken: authResponse.credential,
        },
        {
          withCredentials: true,
        }
      );
      dispatch({
        type: SET_USER,
        payload: response.data.user,
      });
    } catch (error) {
      console.log(error);
      setErrors({ message: "Error processing Google auth, please try again" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = async (error) => {
    console.log(error);
    setErrors({
      message: "Error in Google authorization flow, please try again",
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="brand-container">
              <FaRocket className="brand-icon" />
              <span className="brand-text">Affiliate++</span>
            </div>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">
              Sign in to your account to continue managing your affiliate links
            </p>
          </div>

          {/* Error Alert */}
          {errors.message && (
            <div className="error-alert">
              <div className="error-content">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{errors.message}</span>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                <FaEnvelope className="label-icon" />
                Email Address
              </label>
              <input
                type="email"
                className={`form-input ${errors.username ? "error" : ""}`}
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={isLoading}
              />
              {errors.username && (
                <div className="error-message">{errors.username}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <FaLock className="label-icon" />
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-input ${errors.password ? "error" : ""}`}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
            </div>

            <div className="form-options">
              <Link to="/forget-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className={`login-btn ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  Sign In
                  <FaArrowRight className="btn-icon" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span className="divider-text">or continue with</span>
          </div>

          {/* Google Login */}
          <div className="google-login-container">
            <GoogleOAuthProvider
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                disabled={isLoading}
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
                width="100%"
              />
            </GoogleOAuthProvider>
          </div>

          {/* Sign Up Link */}
          <div className="signup-link">
            <span>Don't have an account? </span>
            <Link to="/register" className="signup-text">
              Sign up for free
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .login-page::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="%23ffffff" stop-opacity="0.1"/><stop offset="100%" stop-color="%23ffffff" stop-opacity="0"/></radialGradient></defs><circle cx="200" cy="200" r="100" fill="url(%23a)"/><circle cx="800" cy="300" r="150" fill="url(%23a)"/><circle cx="400" cy="700" r="120" fill="url(%23a)"/></svg>');
          opacity: 0.3;
        }

        .login-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 450px;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem 2rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .login-header {
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

        .login-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0 0 0.5rem 0;
        }

        .login-subtitle {
          color: #6c757d;
          font-size: 1rem;
          margin: 0;
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

        .login-form {
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

        .form-input.error {
          border-color: #dc3545;
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

        .error-message {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .form-options {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 1.5rem;
        }

        .forgot-password {
          color: #667eea;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .forgot-password:hover {
          color: #764ba2;
        }

        .login-btn {
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

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .login-btn.loading {
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

        .divider {
          text-align: center;
          margin: 2rem 0;
          position: relative;
        }

        .divider::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e9ecef;
        }

        .divider-text {
          background: rgba(255, 255, 255, 0.95);
          padding: 0 1rem;
          color: #6c757d;
          font-size: 0.875rem;
          position: relative;
        }

        .google-login-container {
          margin-bottom: 2rem;
        }

        .signup-link {
          text-align: center;
          color: #6c757d;
          font-size: 0.875rem;
        }

        .signup-text {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .signup-text:hover {
          color: #764ba2;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .login-page {
            padding: 1rem;
          }

          .login-card {
            padding: 2rem 1.5rem;
          }

          .login-title {
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

export default Login;
