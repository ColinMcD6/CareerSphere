import React, { createContext, useContext, useEffect, useState } from "react";
import { EXPRESS_PORT } from "../../../settings.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  const checkAuth = async () => {
    try {
      console.log("Trying to authenticate user");

      const response = await fetch(`http://localhost:${EXPRESS_PORT}/api/auth`, {
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          "Network response to authenticate request was not ok! " + response.status
        );
      }

      console.log("Received authenticate response : " + data.isAuthenticated);

      setIsAuthenticated(data.isAuthenticated);
      setUserId(data.userId);
    } catch (error) {
      console.log("Error trying to authenticate user");
      console.log(error);
      setIsAuthenticated(false);
      setUserId(null);
    }
  };

  const logout = async () => {
    try {
      // Call your backend logout endpoint if needed
      await fetch(`http://localhost:${EXPRESS_PORT}/api/logout`, {
        method: "POST",
        credentials: "include",
      });

      // Update state
      setIsAuthenticated(false);
      setUserId(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Run checkAuth on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);