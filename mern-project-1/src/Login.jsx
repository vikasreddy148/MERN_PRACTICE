import { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import { serverEndpoint } from "./config";
import { useDispatch } from "react-redux";
import { SET_USER } from "./redux/user/actions";

const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const validate = () => {
    let isValid = true;
    let newErrors = {};
    if (formData.username.length === 0) {
      isValid = false;
      newErrors.username = "username is mandatory";
    }
    if (formData.password.length === 0) {
      isValid = false;
      newErrors.password = "Password is mandatory";
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      //data to be sent to the server
      const body = {
        username: formData.username,
        password: formData.password,
      };
      const config = {
        //Tells axios to include cookie in the request
        withCredentials: true,
      };
      try {
        const response = await axios.post(
          `${serverEndpoint}/auth/login`,
          body,
          config
        );
        // updateUserDetails(response.data.user);
        dispatch({
          type: SET_USER,
          payload: response.data.user,
        });
      } catch (error) {
        console.log(error);
        setErrors({ message: "Something went wrong, please try again later" });
      }
    }
  };
  const handleGoogleSuccess = async (authResponse) => {
    try {
      const response = await axios.post(
        `${serverEndpoint}/auth/google-auth`,
        {
          idToken: authResponse.credential,
        },
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
      setErrors({ message: "Error processing google auth, please try again" });
    }
  };
  const handleGoogleError = async (error) => {
    console.log(error);
    setErrors({
      message: "Error in google authorization flow, please try again",
    });
  };
  return (
    <div className="container-fluid py-4 px-3 ">
      {/* Alert Messages */}
      {message && (
        <div className="alert alert-success text-center" role="alert">
          {message}
        </div>
      )}
      {errors.message && (
        <div className="alert alert-danger text-center" role="alert">
          {errors.message}
        </div>
      )}

      {/* Card Wrapper */}
      <div className="d-flex justify-content-center">
        <div
          className="card shadow-sm "
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <div className="card-body">
            <h2 className="text-center mb-4">Log In</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  onChange={handleChange}
                  value={formData.username}
                  className="form-control"
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <small className="text-danger">{errors.username}</small>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <small className="text-danger">{errors.password}</small>
                )}
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Log In
                </button>
              </div>
            </form>

            {/* Register Prompt */}
            <div className="text-center mt-3">
              <p className="mb-1">Don't have an account?</p>
              <Link
                to="/register"
                className="text-primary fw-semibold text-decoration-none"
              >
                Register
              </Link>
            </div>

            {/* Divider */}
            <div className="d-flex align-items-center my-3">
              <hr className="flex-grow-1" />
              <span className="mx-2 text-muted">or</span>
              <hr className="flex-grow-1" />
            </div>

            {/* Google Login */}
            <div className="d-flex justify-content-center">
              <GoogleOAuthProvider
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              >
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </GoogleOAuthProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
