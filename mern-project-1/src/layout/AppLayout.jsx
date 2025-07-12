import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import styles from "./AppLayout.module.css";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";

function AppLayout({ children }) {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);

  const openLogin = () => setLoginOpen(true);
  const closeLogin = () => setLoginOpen(false);
  const openRegister = () => setRegisterOpen(true);
  const closeRegister = () => setRegisterOpen(false);

  return (
    <div className={styles.appLayout}>
      <Header onLoginClick={openLogin} onRegisterClick={openRegister} />
      <main className={styles.main}>{children}</main>
      <Footer />
      <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
      <RegisterModal isOpen={isRegisterOpen} onClose={closeRegister} />
    </div>
  );
}

export default AppLayout;
