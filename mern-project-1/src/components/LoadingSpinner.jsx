import React from "react";
import { Spinner } from "react-bootstrap";
import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = ({
  variant = "primary",
  size = "md",
  text = "Loading...",
  fullScreen = false,
  overlay = false,
}) => {
  if (fullScreen) {
    return (
      <div className={styles.fullScreenOverlay}>
        <div className={styles.fullScreenContent}>
          <Spinner animation="border" variant={variant} size={size} />
          {text && <p className={styles.loadingText}>{text}</p>}
        </div>
      </div>
    );
  }

  if (overlay) {
    return (
      <div className={styles.overlay}>
        <div className={styles.overlayContent}>
          <Spinner animation="border" variant={variant} size={size} />
          {text && <p className={styles.loadingText}>{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.inlineSpinner}>
      <Spinner animation="border" variant={variant} size={size} />
      {text && <span className={styles.loadingText}>{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
