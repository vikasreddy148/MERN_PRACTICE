import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from "react";
import axios from "axios";
import Error from "./pages/Error";
import Logout from "./pages/Logout";
import { serverEndpoint } from "./config/config";
import { useDispatch, useSelector } from "react-redux";
import { SET_USER } from "./redux/user/actions";
import UserLayout from "./layout/UserLayout";
import { Spinner } from "react-bootstrap";
import ManageUsers from "./pages/users/ManageUsers";
import UnauthorizedAccess from "./components/UnauthorizedAccess";
import ProtectedRoute from "./rbac/ProtectedRoute";
import ManagePayments from "./pages/payments/ManagePayments";
import AnalyticsDashboard from "./pages/links/AnalyticsDashboard";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
function App() {
  // const [userDetails, setUserDetails] = useState(null);
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const [loading, setLoading] = useState(true);

  const isUserLoggedIn = async () => {
    try {
      const response = await axios.post(
        `${serverEndpoint}/auth/is-user-logged-in`,
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isUserLoggedIn();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
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
      <Route path="/login" element={<Navigate to="/?modal=login" replace />} />
      <Route
        path="/register"
        element={<Navigate to="/?modal=register" replace />}
      />
      {/* Removed /login and /register routes */}
      <Route
        path="/dashboard"
        element={
          userDetails ? (
            <UserLayout>
              <Dashboard />
            </UserLayout>
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/logout"
        element={userDetails ? <Logout /> : <Navigate to="/" />}
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
      <Route
        path="/users"
        element={
          userDetails ? (
            <ProtectedRoute roles={["admin"]}>
              <UserLayout>
                <ManageUsers />
              </UserLayout>
            </ProtectedRoute>
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/unauthorized-access"
        element={
          userDetails ? (
            <UserLayout>
              <UnauthorizedAccess />
            </UserLayout>
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/manage-payments"
        element={
          userDetails ? (
            <ProtectedRoute roles={["admin", "developer"]}>
              <UserLayout>
                <ManagePayments />
              </UserLayout>
            </ProtectedRoute>
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/analytics/:id"
        element={
          userDetails ? (
            <UserLayout>
              <AnalyticsDashboard />
            </UserLayout>
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/forget-password"
        element={
          <AppLayout>
            <ForgetPassword />
          </AppLayout>
        }
      />
      <Route
        path="/reset-password"
        element={
          <AppLayout>
            <ResetPassword />
          </AppLayout>
        }
      />
    </Routes>
  );
}

export default App;
