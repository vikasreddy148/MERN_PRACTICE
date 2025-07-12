import styles from "./UserFooter.module.css";

function UserFooter() {
  return (
    <div className={`container-fluid ${styles.userFooter}`}>
      All rights reserved.
    </div>
  );
}

export default UserFooter;
