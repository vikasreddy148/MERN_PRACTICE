import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/config";
import Modal from "./Modal";
import styles from "./LoginRegisterModal.module.css";

function ForgotPasswordModal({ isOpen, onClose, onShowResetPassword }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post(`${serverEndpoint}/auth/send-reset-password-token`, {
        email,
      });
      setSuccess("Reset code sent to your email!");
      setTimeout(() => {
        onClose();
        onShowResetPassword(email);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset code");
    }
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    setSuccess("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>Forgot Password</h2>
        {error && <div className={styles.errorAlert}>{error}</div>}
        {success && <div className={styles.successAlert}>{success}</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={error ? styles.invalid : ""}
              required
              autoComplete="email"
            />
          </div>
          <button type="submit" className={styles.submitBtn}>
            Send Reset Code
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default ForgotPasswordModal;
