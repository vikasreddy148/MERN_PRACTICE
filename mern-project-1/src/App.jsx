import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Home"
import Login from "./Login"
import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

function App() {
  const [userDetails, setUserDetails] = useState(null);
  //Lifting the State Up from Log component  in to app component
  const updateUserDetails = (updateUserDetails) => {
    setUserDetails(updateUserDetails);
  };

  const isUserLoggedIn = async () => {
    const response = await axios.post(
      " http://localhost:5001/auth/is-user-logged-in",
      {},
      {
        withCredentials: true,
      }
    );
    updateUserDetails(response.data.user);
  };
  useEffect(() => {
    isUserLoggedIn();
  }, []);
  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <Routes>
          <Route
            path="/"
            element={
              userDetails ? (
                <Navigate to={"/dashboard"} />
              ) : (
                <AppLayout>
                  <Home />
                </AppLayout>
              )
            }
          />
          <Route
            path="/login"
            element={
              userDetails ? (
                <Navigate to={"/dashboard"} />
              ) : (
                <AppLayout>
                  <Login updateUserDetails={updateUserDetails} />
                </AppLayout>
              )
            }
          />
          <Route
            path="/dashboard"
            element={userDetails ? <Dashboard /> : <Navigate to={"/login"} />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
