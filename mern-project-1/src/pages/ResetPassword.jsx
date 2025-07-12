import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { serverEndpoint } from "../config/config";
import LoadingButton from "../components/LoadingButton";
import { toast } from "react-toastify";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
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
    setIsResending(true);
    setError("");
    setSuccess("");
    try {
      await axios.post(`${serverEndpoint}/auth/send-reset-password-token`, {
        email,
      });
      setSuccess("Reset code resent to your email.");
      toast.success("Reset code resent to your email.");
      setShowResend(false);
      startResendTimer();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to resend code";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await axios.post(`${serverEndpoint}/auth/reset-password`, {
        email,
        code,
        newPassword,
      });
      setSuccess("Password reset successful! Redirecting to login...");
      toast.success("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to reset password";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center mb-4">Reset Password</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            {!location.state?.email && (
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="code" className="form-label">
                6-digit Code
              </label>
              <input
                type="text"
                className="form-control"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                maxLength={6}
                minLength={6}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            {/* Timer and resend link below new password */}
            {email && (
              <div className="mb-3 text-center">
                <div className="mb-1 fw-semibold">Didn't receive code?</div>
                {showResend ? (
                  <LoadingButton
                    className="btn btn-link"
                    onClick={handleResend}
                    disabled={resendTimer > 0}
                    loading={isResending}
                    loadingText="Sending..."
                  >
                    Resend Code
                  </LoadingButton>
                ) : (
                  <span className="text-muted">
                    You can resend the code in {resendTimer}s
                  </span>
                )}
              </div>
            )}
            <div className="d-grid">
              <LoadingButton
                type="submit"
                className="btn btn-primary"
                loading={isSubmitting}
                loadingText="Resetting..."
              >
                Reset Password
              </LoadingButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
