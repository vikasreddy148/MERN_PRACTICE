import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { serverEndpoint } from "../../config/config";
import styles from "./SubscriptionSummary.module.css";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaCreditCard,
  FaHourglassHalf,
} from "react-icons/fa";

function formatDate(isoDateString) {
  if (!isoDateString) return "";
  try {
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Invalid date:", isoDateString);
    return "";
  }
}

function Subscription() {
  const userDetails = useSelector((state) => state.userDetails);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const subscription = userDetails.subscription;
  const status = subscription?.status || "unknown";
  const isActive = status === "active";
  const progress =
    subscription && subscription.paymentsMade && subscription.paymentsRemaining
      ? (subscription.paymentsMade /
          (subscription.paymentsMade + subscription.paymentsRemaining)) *
        100
      : 0;

  const handleCancel = async () => {
    try {
      const response = await axios.post(
        `${serverEndpoint}/payments/cancel-subscription`,
        {
          subscription_id: userDetails.subscription?.id,
        },
        {
          withCredentials: true,
        }
      );
      setMessage(
        "Subscription cancelled, it can take up to 5 minutes to reflect the status"
      );
    } catch (error) {
      setErrors({ message: "Unable to cancel subscription" });
    }
  };

  return (
    <div className={styles.container}>
      {errors.message && (
        <div className={styles.errorAlert}>{errors.message}</div>
      )}
      {message && <div className={styles.successAlert}>{message}</div>}
      <div className={styles.card}>
        <div className={styles.header}>
          <FaCreditCard className={styles.headerIcon} />
          <span>Subscription Summary</span>
          <span
            className={isActive ? styles.statusActive : styles.statusInactive}
          >
            {isActive ? <FaCheckCircle /> : <FaTimesCircle />}{" "}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <div className={styles.body}>
          <div className={styles.detailRow}>
            <FaCalendarAlt className={styles.icon} />
            <strong>Start Date:</strong> {formatDate(subscription.start)}
          </div>
          <div className={styles.detailRow}>
            <FaCalendarAlt className={styles.icon} />
            <strong>End Date:</strong> {formatDate(subscription.end)}
          </div>
          <div className={styles.detailRow}>
            <FaCalendarAlt className={styles.icon} />
            <strong>Last Payment Date:</strong>{" "}
            {formatDate(subscription.lastBillDate)}
          </div>
          <div className={styles.detailRow + " " + styles.nextPayment}>
            <FaHourglassHalf className={styles.icon} />
            <strong>Next Payment Date:</strong>{" "}
            {formatDate(subscription.nextBillDate)}
          </div>
          <div className={styles.detailRow}>
            <strong>Total Payments Made:</strong> {subscription.paymentsMade}
          </div>
          <div className={styles.detailRow}>
            <strong>Payments Remaining:</strong>{" "}
            {subscription.paymentsRemaining}
          </div>
          <div className={styles.progressBarWrapper}>
            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className={styles.progressText}>
              {subscription.paymentsMade} /{" "}
              {subscription.paymentsMade + subscription.paymentsRemaining}{" "}
              payments
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <button
            className={styles.cancelBtn}
            onClick={handleCancel}
            disabled={!isActive}
          >
            Cancel Subscription
          </button>
        </div>
      </div>
    </div>
  );
}

export default Subscription;
