 import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";


const MainHomePage = () => {
  
  const { isAuthenticated } = useAuth();
  

  const navigate = useNavigate(); // Initialize useNavigate hook - THIS WAS MISSING

  useEffect(() => {
    // Redirect to home if the user is already authenticated
    if (!isAuthenticated) {
      navigate("/"); // Replace "/home" with your home route
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
    </div>
  );
};

export default MainHomePage;
