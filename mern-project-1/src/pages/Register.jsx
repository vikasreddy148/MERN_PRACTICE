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
  FaUser,
  FaArrowRight,
  FaCheck,
} from "react-icons/fa";

function Register() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;

    if (formData.username.length === 0) {
      newErrors.username = "Email is mandatory";
      isValid = false;
    }

    if (formData.password.length === 0) {
      newErrors.password = "Password is mandatory";
      isValid = false;
    }

    if (formData.name.length === 0) {
      newErrors.name = "Name is mandatory";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validate()) {
      setIsLoading(true);
      const body = {
        username: formData.username,
        password: formData.password,
        name: formData.name,
      };
      const configuration = {
        withCredentials: true,
      };

      try {
        const response = await axios.post(
          `${serverEndpoint}/auth/register`,
          body,
          configuration
        );
        dispatch({
          type: SET_USER,
          payload: response.data.user,
        });
      } catch (error) {
        if (error?.response?.status === 401) {
          setErrors({ message: "An account already exists with this email" });
        } else {
          setErrors({ message: "Something went wrong, please try again" });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSignin = async (authResponse) => {
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
      setErrors({ message: "Something went wrong while Google sign-in" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSigninFailure = async (error) => {
    console.log(error);
    setErrors({ message: "Something went wrong while Google sign-in" });
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          {/* Header */}
          <div className="register-header">
            <div className="brand-container">
              <FaRocket className="brand-icon" />
              <span className="brand-text">Affiliate++</span>
            </div>
            <h1 className="register-title">Create Your Account</h1>
            <p className="register-subtitle">
              Join thousands of marketers and start optimizing your affiliate
              campaigns
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

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <FaUser className="label-icon" />
                Full Name
              </label>
              <input
                type="text"
                className={`form-input ${errors.name ? "error" : ""}`}
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={isLoading}
              />
              {errors.name && (
                <div className="error-message">{errors.name}</div>
              )}
            </div>

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
                  placeholder="Create a strong password"
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

            {/* Benefits List */}
            <div className="benefits-list">
              <div className="benefit-item">
                <FaCheck className="benefit-icon" />
                <span>Free to get started</span>
              </div>
              <div className="benefit-item">
                <FaCheck className="benefit-icon" />
                <span>Advanced analytics & insights</span>
              </div>
              <div className="benefit-item">
                <FaCheck className="benefit-icon" />
                <span>Secure & reliable platform</span>
              </div>
            </div>

            <button
              type="submit"
              className={`register-btn ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  Create Account
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
                onSuccess={handleGoogleSignin}
                onError={handleGoogleSigninFailure}
                disabled={isLoading}
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
                width="100%"
              />
            </GoogleOAuthProvider>
          </div>

          {/* Sign In Link */}
          <div className="signin-link">
            <span>Already have an account? </span>
            <Link to="/login" className="signin-text">
              Sign in here
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .register-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .register-page::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="%23ffffff" stop-opacity="0.1"/><stop offset="100%" stop-color="%23ffffff" stop-opacity="0"/></radialGradient></defs><circle cx="200" cy="200" r="100" fill="url(%23a)"/><circle cx="800" cy="300" r="150" fill="url(%23a)"/><circle cx="400" cy="700" r="120" fill="url(%23a)"/></svg>');
          opacity: 0.3;
        }

        .register-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 500px;
        }

        .register-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem 2rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .register-header {
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

        .register-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0 0 0.5rem 0;
        }

        .register-subtitle {
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

        .register-form {
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

        .benefits-list {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
          color: #495057;
        }

        .benefit-item:last-child {
          margin-bottom: 0;
        }

        .benefit-icon {
          color: #28a745;
          font-size: 0.875rem;
        }

        .register-btn {
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

        .register-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .register-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .register-btn.loading {
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

        .signin-link {
          text-align: center;
          color: #6c757d;
          font-size: 0.875rem;
        }

        .signin-text {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .signin-text:hover {
          color: #764ba2;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .register-page {
            padding: 1rem;
          }

          .register-card {
            padding: 2rem 1.5rem;
          }

          .register-title {
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

export default Register;
