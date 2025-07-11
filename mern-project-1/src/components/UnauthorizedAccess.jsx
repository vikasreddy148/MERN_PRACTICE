import { Link } from "react-router-dom";

function UnauthorizedAccess() {
  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "70vh" }}
    >
      <div className="card shadow p-4" style={{ maxWidth: 400, width: "100%" }}>
        <div className="text-center mb-3">
          <span style={{ fontSize: 48, color: "#dc3545" }}>
            <i className="bi bi-shield-lock-fill"></i>
          </span>
          <h2 className="mt-2 text-danger">Unauthorized Access</h2>
        </div>
        <p className="text-muted mb-4">
          You do not have permission to view this page or perform this action.
          <br />
          If you believe this is a mistake, please contact your administrator.
        </p>
        <Link to="/dashboard" className="btn btn-primary w-100">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default UnauthorizedAccess;
