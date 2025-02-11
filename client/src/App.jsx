import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import TopNavbar from "./components/TopNavbar.jsx";
import MainHomePage from "./components/MainHomePage.jsx";


import { AuthProvider, useAuth } from "./components/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <TopNavbar /> {/* Render the navbar outside of the Routes */}
          <Routes>
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Home" element={<MainHomePage />} />
            <Route path="/" element={<ProtectedRoute />} />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
   return isAuthenticated ? <Navigate to="/Home" />: <Navigate to="/login" />;
};

export default App;
