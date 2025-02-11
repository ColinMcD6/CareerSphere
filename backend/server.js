// An entry point for API
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import { EXPRESS_PORT,REACT_PORT,MONGO_URI } from '../settings.js';

const SECRET_KEY = "812CC751185FE96B71A9CA8A3F137";


const app = express();
 

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: `http://localhost:${REACT_PORT}`, credentials: true })); // Allow React app to access cookies

app.use(express.json()); // Middleware to parse JSON body

app.listen(EXPRESS_PORT, () => {
  console.log(
    `Express server started, and listening at localhost: ${EXPRESS_PORT}`
  );
});

app.use(cors({
  origin: `http://localhost:${REACT_PORT}`, 
  credentials: true 
}));

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

//ROUTES

 import  userRouter from './routes/user.js';
app.use("/api/users", userRouter);


import  loginRouter from './routes/login.js';
app.use("/api/login", loginRouter);

const VERBOSE = true;

app.get('/api/auth', (req, res) => {
  const token = req.cookies.token;

  if ( VERBOSE)
  {
    console.log("Trying to authenticate user with token:");
    console.log(req.cookies.token);
  }

  if (!token) 
  {
    if ( VERBOSE)
      console.log("Could not authenticate user, token does not exist");
    return res.status(401).json({ isAuthenticated: false });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ isAuthenticated: false });
    }

    if ( VERBOSE)
      console.log("User authentication successful!");

    res.status(200).json({ isAuthenticated: true, userId: decoded.userId });
  });
});

app.post('/api/logout', (req, res) => {
  
  // Clear the token cookie
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'strict',
  });

  if (VERBOSE) {
    console.log('User logged out successfully');
  }

  res.status(200).json({ message: 'Logged out successfully' });
});



