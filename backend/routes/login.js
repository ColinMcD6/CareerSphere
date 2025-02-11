import express from "express";
import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";


const router = express.Router();
const VERBOSE = true;
const SECRET_KEY = "812CC751185FE96B71A9CA8A3F137";
 
router.post("/", async (req, res) => 
{
    try {

        if (VERBOSE)
        {
          console.log("Attemping to log in")
          console.log(req.body);
        }
        const { email, password } = req.body;

        const user = await User.findOne({ email : email });
    
        if (!user) {
          if (VERBOSE)
            console.log("Failed to log in user, Invalid email");
          return res.status(400).json({ error: "Incorrect email or password" });
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          if (VERBOSE)
            console.log("Failed to log in user, incorrect password");
          return res.status(400).json({ error: "Incorrect email or password" });
        }
    
        
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });
    
        // Set the token in a cookie
        res.cookie("token", token, {
          httpOnly: true, 
          maxAge: 3600000, // 1 hour
          secure: false,
           sameSite: "lax",
        });

        if (VERBOSE)
          console.log("Was able to log in user sucessfully!");
    
        res.status(200).json({ message: "Login successful" });

      } catch (err) {
        if (VERBOSE)
        {
          console.log("Failed to log in user, Unknown error has occured");
          console.log(err);
        }
        
        res.status(500).json({ error: "Error logging in" });
      }
});

export default router;
