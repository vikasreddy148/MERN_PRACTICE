import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard";
 import Error from "./pages/Error";
import Logout from "./pages/Logout";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { serverEndpoint } from "./config";

function App() {
  const [userDetails, setUserDetails] = useState(null);
  //Lifting the State Up from Log component  in to app component
  const updateUserDetails = (updateUserDetails) => {
    setUserDetails(updateUserDetails);
  };

  const isUserLoggedIn = async () => {
    try {
      const response = await axios.post(
        ` ${serverEndpoint}/auth/is-user-logged-in`,
        {},
        {
          withCredentials: true,
        }
      );
      updateUserDetails(response.data.user);
    } catch (error) {
      console.log(error);
    }
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
          <Route
            path="/logout"
            element={
              userDetails ? (
                <Logout updateUserDetails={updateUserDetails} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/error"
            element={
              userDetails ? (
                <Error />
              ) : (
                <AppLayout>
                  <Error />
                </AppLayout>
              )
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
