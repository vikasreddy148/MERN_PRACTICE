import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/config";
import Modal from "./Modal";
import styles from "./LoginRegisterModal.module.css";

function ResetPasswordModal({ isOpen, onClose, email, onSuccess }) {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (email && isOpen) {
      startResendTimer();
    }
    // eslint-disable-next-line
  }, [email, isOpen]);

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
    try {
      await axios.post(`${serverEndpoint}/auth/send-reset-password-token`, {
        email,
      });
      setSuccess("Reset code resent to your email.");
      setShowResend(false);
      startResendTimer();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post(`${serverEndpoint}/auth/reset-password`, {
        email,
        code,
        newPassword,
      });
      setSuccess("Password reset successful!");
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    }
  };

  const handleClose = () => {
    setCode("");
    setNewPassword("");
    setError("");
    setSuccess("");
    if (timerRef.current) clearInterval(timerRef.current);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>Reset Password</h2>
        {error && <div className={styles.errorAlert}>{error}</div>}
        {success && <div className={styles.successAlert}>{success}</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="code">6-digit Code</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={error ? styles.invalid : ""}
              required
              maxLength={6}
              minLength={6}
              autoComplete="one-time-code"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={error ? styles.invalid : ""}
              required
              autoComplete="new-password"
            />
          </div>
          {email && (
            <div className={styles.resendWrapper}>
              <div className={styles.resendText}>Didn't receive code?</div>
              {showResend ? (
                <button
                  type="button"
                  className={styles.resendLink}
                  onClick={handleResend}
                >
                  Resend Code
                </button>
              ) : (
                <span className={styles.timerText}>
                  You can resend the code in {resendTimer}s
                </span>
              )}
            </div>
          )}
          <button type="submit" className={styles.submitBtn}>
            Reset Password
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default ResetPasswordModal;
