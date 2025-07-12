import { Link } from "react-router-dom";
import styles from "./UnauthorizedAccess.module.css";

function UnauthorizedAccess() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className="text-center mb-3">
          <span className={styles.icon}>
            <i className="bi bi-shield-lock-fill"></i>
          </span>
          <h2 className={styles.title}>Unauthorized Access</h2>
        </div>
        <p className={styles.description}>
          You do not have permission to view this page or perform this action.
          <br />
          If you believe this is a mistake, please contact your administrator.
        </p>
        <Link to="/dashboard" className={"btn btn-primary " + styles.button}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default UnauthorizedAccess;
