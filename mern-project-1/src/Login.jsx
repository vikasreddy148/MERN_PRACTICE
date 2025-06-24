import { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const Login = ({ updateUserDetails }) => {
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
          "http://localhost:5001/auth/login",
          body,
          config
        );
        updateUserDetails(response.data.user);
      } catch (error) {
        console.log(error);
        setErrors({ message: "Something went wrong, please try again later" });
      }
    }
  };
  const handleGoogleSuccess = async (authResponse) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/auth/google-auth",
        {
          idToken: authResponse.credential,
        },
        {
          withCredentials: true,
        }
      );
      updateUserDetails(response.data.user);
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
    <div className="container-fluid text-center p-3">
      {message && message}
      {errors.message && errors.message}
      <h1>Log in page</h1>
      <form action="" onSubmit={handleSubmit}>
        <div className="mt-3 p-1">
          <label htmlFor="">UserName:</label>
          <input
            type="text"
            name="username"
            onChange={handleChange}
            value={formData.username}
          />
          {errors.username && errors.username}
        </div>
        <div className="mt-3">
          <label htmlFor="">Password: </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <span className="text-danger">
            {errors.password && errors.password}{" "}
          </span>
        </div>
        <div className="mt-3">
          <button className="btn btn-primary">Submit</button>
        </div>
      </form>
      <h2>Or</h2>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default Login;
