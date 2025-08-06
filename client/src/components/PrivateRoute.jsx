// src/components/PrivateRoute.jsx

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    // Optional: Show a loader while checking auth
    return <div className="text-center text-white mt-10">Loading...</div>;
  }

  // If user is logged in, render the requested page
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
