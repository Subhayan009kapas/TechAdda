// src/pages/NotFound.jsx

import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for doesn't exist.</p>
      <Link to="/feed" className="back-home-link">← Go back to Feed</Link>
    </div>
  );
};

export default NotFound;
