import UserFooter from "./UserFooter";
import UserHeader from "./UserHeader";
import styles from "./UserLayout.module.css";

function UserLayout({ children }) {
  return (
    <div className={styles.userLayout}>
      <UserHeader />
      <main className={styles.main}>{children}</main>
      <UserFooter />
    </div>
  );
}

export default UserLayout;
