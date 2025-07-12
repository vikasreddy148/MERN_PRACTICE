import UserFooter from "./UserFooter";
import UserHeader from "./UserHeader";

function UserLayout({ children }) {
  return (
    <div className="user-layout">
      <UserHeader />
      <main className="user-main-content">{children}</main>
      <UserFooter />

      <style jsx>{`
        .user-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .user-main-content {
          flex: 1;
          padding-top: 80px; /* Account for fixed header */
        }

        /* Ensure footer stays at bottom */
        .modern-footer {
          margin-top: auto;
        }
      `}</style>
    </div>
  );
}

export default UserLayout;
