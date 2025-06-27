import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from './pages/Login';
import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Error";
import Logout from "./pages/Logout";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { serverEndpoint } from "./config/config";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "./layout/UserLayout";
import Register from "./pages/Register";

import { SET_USER } from "./redux/user/actions";

function App() {
  // const [userDetails, setUserDetails] = useState(null);
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  //Lifting the State Up from Log component  in to app component

  const isUserLoggedIn = async () => {
    try {
      const response = await axios.post(
        ` ${serverEndpoint}/auth/is-user-logged-in`,
        {},
        {
          withCredentials: true,
        }
      );
      // updateUserDetails(response.data.user);
      dispatch({
        type: SET_USER,
        payload: response.data.user,
      });
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
                <UserLayout>
                  <Navigate to="/dashboard" />
                </UserLayout>
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
                <UserLayout>
                  <Dashboard />
                </UserLayout>
              ) : (
                <AppLayout>
                  <Login />
                </AppLayout>
              )
            }
          />
          <Route path ="/register" element = {userDetails ? 
            <Navigate to="/dashboard" />: 
            <AppLayout>
              <Register />
            </AppLayout>
          }/>
          <Route
            path="/dashboard"
            element={userDetails ? <Dashboard /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/logout"
            element={userDetails ? <Logout /> : <Navigate to="/login" />}
          />
          <Route
            path="/error"
            element={
              userDetails ? (
                <UserLayout>
                  <Error />
                </UserLayout>
                
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
