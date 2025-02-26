import { Navigate } from "react-router-dom";
import useUser from "../hooks/user";
import Welcome from "../pages/Welcome";

export const CareerSphereApp = () => {
    const { user, isLoading } = useUser();
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    // If no user, redirect to login page
    if (!user) {
      return <Navigate to="/login" />;
    }
  
    return (
      <div>
        <Welcome/>
      </div>
    );
  };
