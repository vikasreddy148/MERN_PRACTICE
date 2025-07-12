import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./SkeletonLoader.module.css";

const SkeletonLoader = ({
  type = "table",
  rows = 5,
  columns = 4,
  height = 20,
  className = "",
}) => {
  const renderTableSkeleton = () => (
    <div className={`${styles.tableSkeleton} ${className}`}>
      {/* Header */}
      <div className={styles.tableHeader}>
        {Array.from({ length: columns }).map((_, index) => (
          <div key={index} className={styles.headerCell}>
            <Skeleton height={height} />
          </div>
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className={styles.tableRow}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className={styles.tableCell}>
              <Skeleton height={height - 4} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderCardSkeleton = () => (
    <div className={`${styles.cardSkeleton} ${className}`}>
      <Skeleton height={200} />
      <div className={styles.cardContent}>
        <Skeleton height={24} width="60%" />
        <Skeleton height={16} width="100%" count={3} />
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className={`${styles.listSkeleton} ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className={styles.listItem}>
          <Skeleton height={height} />
        </div>
      ))}
    </div>
  );

  const renderFormSkeleton = () => (
    <div className={`${styles.formSkeleton} ${className}`}>
      <Skeleton height={24} width="30%" />
      <Skeleton height={40} />
      <Skeleton height={24} width="25%" />
      <Skeleton height={40} />
      <Skeleton height={24} width="35%" />
      <Skeleton height={40} />
      <Skeleton height={48} width="120px" />
    </div>
  );

  switch (type) {
    case "table":
      return renderTableSkeleton();
    case "card":
      return renderCardSkeleton();
    case "list":
      return renderListSkeleton();
    case "form":
      return renderFormSkeleton();
    default:
      return <Skeleton height={height} />;
  }
};

export default SkeletonLoader;
