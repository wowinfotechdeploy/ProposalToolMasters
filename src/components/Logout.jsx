import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { resetState, updateState } from "../redux/Persist";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("userAccess");
    localStorage.removeItem("OrganisationLocalList");
    localStorage.removeItem("userThemeSettingLocalStorage");
    localStorage.removeItem("logoutMilliseconds");
    localStorage.removeItem("subscriptionPlan");
    localStorage.removeItem("accessCount");
    dispatch(resetState());
    navigate("/login");
  };

  // Call handleLogout when component mounts
  useEffect(() => {
    handleLogout();
  }, []); // Empty dependency array ensures it runs only once when component mounts

  // This component doesn't render anything, it just performs logout logic on mount
  return null;
};

export default Logout;

