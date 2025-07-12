import React from "react";
import { Spinner } from "react-bootstrap";
import styles from "./LoadingButton.module.css";

const LoadingButton = ({
  children,
  loading = false,
  disabled = false,
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  onClick,
  loadingText = "Loading...",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${styles.loadingButton} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          className={styles.spinner}
        />
      )}
      <span className={styles.buttonText}>
        {loading ? loadingText : children}
      </span>
    </button>
  );
};

export default LoadingButton;
