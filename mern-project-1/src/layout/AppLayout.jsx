import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />

      <style jsx>{`
        .app-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .main-content {
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

export default AppLayout;
