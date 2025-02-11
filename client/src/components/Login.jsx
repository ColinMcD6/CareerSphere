import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState ,useEffect} from "react";
import { EXPRESS_PORT } from '../../../settings.js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from "./AuthContext";



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [generalError, setGeneralError] = useState(false);
  const [errorMesssage, serErrorMessage] = useState("");

  const { isAuthenticated, checkAuth } = useAuth();
  

  const navigate = useNavigate(); // Initialize useNavigate hook - THIS WAS MISSING

  useEffect(() => {
    // Redirect to home if the user is already authenticated
    if (isAuthenticated) {
      navigate("/home"); // Replace "/home" with your home route
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your login logic here (e.g., API call)

    try {
        const response = await fetch(`http://localhost:${EXPRESS_PORT}/api/login`, {
         method: "POST",
         credentials: "include", 
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({email,password}),
       });

       const data = await response.json(); 

       if ( response.ok)
       {
          await checkAuth(); // Call checkAuth to revalidate authentication
       }
       else
       {
        serErrorMessage(data["error"]);
        setGeneralError(true);
       }

     }
    catch(err)
    {
        console.log(err);
        serErrorMessage("Unknown error has occured");
        setGeneralError(true);
    }
  
    };

  return (
    <div className="container d-flex justify-content-center align-items-center login-div" style={{  marginTop: '100px'}}>
      <div className="card shadow-sm" style={{ width: "100%", maxWidth: "400px"}}  >
        <div className="card-body" >
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
          
          <div className="text-center mt-3">
            <a href="/Signup" className="text-decoration-none">
              Don't have an account? Sign up
            </a>
          </div>
        </div>
          <p
              className={`general-error-feedback text-center mt-3 alert alert-danger ${
                generalError ? "" : "d-none"
              }`}
            >
              {errorMesssage}
            </p>
      </div>

    
      
    </div>
  );
};

export default Login;