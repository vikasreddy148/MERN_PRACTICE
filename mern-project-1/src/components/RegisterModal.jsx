import { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { serverEndpoint } from "../config/config";
import { useDispatch } from "react-redux";
import { SET_USER } from "../redux/user/actions";
import Modal from "./Modal";
import styles from "./LoginRegisterModal.module.css";

function RegisterModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;
    if (formData.username.length === 0) {
      newErrors.username = "Username is mandatory";
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
      const body = {
        username: formData.username,
        password: formData.password,
        name: formData.name,
      };
      const configuration = { withCredentials: true };
      try {
        const response = await axios.post(
          `${serverEndpoint}/auth/register`,
          body,
          configuration
        );
        dispatch({ type: SET_USER, payload: response.data.user });
        onClose();
      } catch (error) {
        if (error?.response?.status === 401) {
          setErrors({ message: "User exists with the given email" });
        } else {
          setErrors({ message: "Something went wrong, please try again" });
        }
      }
    }
  };

  const handleGoogleSignin = async (authResponse) => {
    try {
      const response = await axios.post(
        `${serverEndpoint}/auth/google-auth`,
        { idToken: authResponse.credential },
        { withCredentials: true }
      );
      dispatch({ type: SET_USER, payload: response.data.user });
      onClose();
    } catch (error) {
      setErrors({ message: "Something went wrong while Google sign-in" });
    }
  };

  const handleGoogleSigninFailure = async (error) => {
    setErrors({ message: "Something went wrong while Google sign-in" });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>Sign up with a new account</h2>
        {errors.message && (
          <div className={styles.errorAlert}>{errors.message}</div>
        )}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? styles.invalid : ""}
              autoComplete="name"
            />
            {errors.name && (
              <div className={styles.invalidFeedback}>{errors.name}</div>
            )}
          </div>
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
              autoComplete="new-password"
            />
            {errors.password && (
              <div className={styles.invalidFeedback}>{errors.password}</div>
            )}
          </div>
          <button type="submit" className={styles.submitBtn}>
            Register
          </button>
        </form>
        <div className={styles.orDivider}>
          <span>OR</span>
        </div>
        <div className={styles.googleLoginWrapper}>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleSignin}
              onError={handleGoogleSigninFailure}
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </Modal>
  );
}

export default RegisterModal;
