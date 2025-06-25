import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serverEndpoint } from "../config";
import { useDispatch } from "react-redux";

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await axios.post(
        `${serverEndpoint}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      // updateUserDetails(null);
      dispatch({
        type: "CLEAR_USER",
      });
    } catch (error) {
      navigate("/error");
    }
  };
  useEffect(() => {
    handleLogout();
  }, []);
}

export default Logout;
