import { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { serverEndpoint, googleClientId } from "../config/config";
import { useDispatch } from "react-redux";
import { SET_USER } from "../redux/user/actions";
import Modal from "./Modal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import ResetPasswordModal from "./ResetPasswordModal";
import styles from "./LoginRegisterModal.module.css";

function LoginModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const handleForgotPassword = () => {
    onClose(); // Close the login modal
    setShowForgotPassword(true);
  };

  const handleShowResetPassword = (email) => {
    setResetEmail(email);
    setShowResetPassword(true);
  };

  const handleResetPasswordSuccess = () => {
    // Optionally show a success message or redirect
    console.log("Password reset successful");
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
      const body = {
        username: formData.username,
        password: formData.password,
      };
      const config = { withCredentials: true };
      try {
        const response = await axios.post(
          `${serverEndpoint}/auth/login`,
          body,
          config
        );
        dispatch({ type: SET_USER, payload: response.data.user });
        onClose();
      } catch (error) {
        setErrors({ message: "Something went wrong, please try again" });
      }
    }
  };

  const handleGoogleSuccess = async (authResponse) => {
    try {
      const response = await axios.post(
        `${serverEndpoint}/auth/google-auth`,
        { idToken: authResponse.credential },
        { withCredentials: true }
      );
      dispatch({ type: SET_USER, payload: response.data.user });
      onClose();
    } catch (error) {
      setErrors({ message: "Error processing Google auth, please try again" });
    }
  };

  const handleGoogleError = async (error) => {
    setErrors({
      message: "Error in Google authorization flow, please try again",
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className={styles.modalContent}>
          <h2 className={styles.heading}>Sign in to Continue</h2>
          {errors.message && (
            <div className={styles.errorAlert}>{errors.message}</div>
          )}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? styles.invalid : ""}
                autoComplete="username"
              />
              {errors.username && (
                <div className={styles.invalidFeedback}>{errors.username}</div>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? styles.invalid : ""}
                autoComplete="current-password"
              />
              {errors.password && (
                <div className={styles.invalidFeedback}>{errors.password}</div>
              )}
            </div>
            <div className={styles.forgotPasswordWrapper}>
              <button
                type="button"
                onClick={handleForgotPassword}
                className={styles.forgotPasswordLink}
              >
                Forgot Password?
              </button>
            </div>
            <button type="submit" className={styles.submitBtn}>
              Sign In
            </button>
          </form>
          <div className={styles.orDivider}>
            <span>OR</span>
          </div>
          <div className={styles.googleLoginWrapper}>
            <GoogleOAuthProvider clientId={googleClientId}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </Modal>
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onShowResetPassword={handleShowResetPassword}
      />
      <ResetPasswordModal
        isOpen={showResetPassword}
        onClose={() => setShowResetPassword(false)}
        email={resetEmail}
        onSuccess={handleResetPasswordSuccess}
      />
    </>
  );
}

export default LoginModal;
