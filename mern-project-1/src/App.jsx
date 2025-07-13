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
import ResetPasswordPage from "./pages/ResetPasswordPage";
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
      dispatch({
        type: SET_USER,
        payload: response.data.user,
      });
    } catch (error) {
      console.error("Auth check failed:", error);
      // Don't set user to null on network errors, only on auth failures
      if (error.response?.status === 401) {
        dispatch({ type: SET_USER, payload: null });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isUserLoggedIn();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" role="status" />
          <div className="mt-3">Loading...</div>
        </div>
      </div>
    );
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
        path="/reset-password"
        element={
          userDetails ? (
            <UserLayout>
              <ResetPasswordPage />
            </UserLayout>
          ) : (
            <Navigate to="/" />
          )
        }
      />
      {/* 404 Route - must be last */}
      <Route
        path="*"
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
  );
}

export default App;
