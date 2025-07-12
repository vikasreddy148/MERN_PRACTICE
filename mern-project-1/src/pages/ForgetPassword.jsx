import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { serverEndpoint } from "../config/config";
import LoadingButton from "../components/LoadingButton";
import { toast } from "react-toastify";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await axios.post(`${serverEndpoint}/auth/send-reset-password-token`, {
        email,
      });
      toast.success("Reset code sent to your email!");
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to send reset code";
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
          <h2 className="text-center mb-4">Forgot Password</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
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
            <div className="d-grid">
              <LoadingButton
                type="submit"
                className="btn btn-primary"
                loading={isSubmitting}
                loadingText="Sending..."
              >
                Send Reset Code
              </LoadingButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
