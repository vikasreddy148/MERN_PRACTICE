import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serverEndpoint } from "../config";

function Logout({ updateUserDetails }) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.post(
        `${serverEndpoint}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      updateUserDetails(null);
    } catch (error) {
      navigate("/error");
    }
  };
  useEffect(() => {
    handleLogout();
  }, []);
}

export default Logout;
