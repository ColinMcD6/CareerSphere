import express from "express";
import User from "../models/User.js";
import bcrypt from 'bcrypt';

const router = express.Router();
const DEBUG_MODE = true;

import {
  passwordCheck,
  emailCheck,
  nameCheck,
  validationCheck,
} from "../../common/common.js";

// Create user
router.post("/", async (req, res) => {
  const messages = {};

  try {
    if (DEBUG_MODE) {
      console.log("Request to create new user : ");
      console.log(req.body);
    }


    let fullyValidated = true;

    //Account type
    if ( req.body.accountType !== "candidate" &&req.body.accountType !== "employer")
    {
      messages["generalError"] = "Invalid account Type"
      fullyValidated = false;
    }

    // First NAME
    const firstNameResults = nameCheck(req.body.firstName);
    if (!firstNameResults.isValid()) {
      // If first Name is not valid, attach message
      messages["firstNameError"] = firstNameResults.getMessage();
      fullyValidated = false;
    }

    // Last NAME
    const lastNameResults = nameCheck(req.body.lastName);
    if (!lastNameResults.isValid()) {
      // If last Name is not valid, attach message
      messages["lastNameError"] = lastNameResults.getMessage();
      fullyValidated = false;
    }

    // EMAIL CHECK
    const emailResults = emailCheck(req.body.email);
    if (!emailResults.isValid()) {
      messages["emailError"] = emailResults.getMessage();
      fullyValidated = false;
    } else {
      const uniqueEmail = await checkEmailExists(req.body.email);
      if (!uniqueEmail.isValid()) {
        messages["emailError"] = uniqueEmail.getMessage();
        fullyValidated = false;
      }
    }

    // PASSWORD CHECK
    const passwordResults = passwordCheck(req.body.password);
    if (!passwordResults.isValid())
    {    
      messages["passwordError"] = passwordResults.getMessage();
      fullyValidated = false;
    }



    if ( fullyValidated)
    {
       // Hash and salt the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const user = new User({
        accountType: req.body.accountType,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword
        });

      const newUser = await user.save();
      res.status(201).json(newUser);

      if (DEBUG_MODE) {
        console.log("Successfully created new User");
      }
    }
    else {
      res.status(400).json(messages);
      if (DEBUG_MODE )
      {
        console.log("Could not create new User");
        console.log(messages);
      }
    }
  } catch (err) {
    console.error("Error creating user:", err);
    messages["generalError"] = "An unexpected error occurred!";
    res.status(500).json(messages);
  }
});

async function checkUsernameExists(usernameInput) {
  try {
    const user = await User.findOne({ username: usernameInput });
    return new validationCheck(user == null, "Username already Exists!"); // Returns true if username exists, otherwise false
  } catch (error) {
    return new validationCheck(false, "Error checking if username is unique");
  }
}

async function checkEmailExists(email) {
  try {
    const user = await User.findOne({ email: email });
    return new validationCheck(
      user === null,
      "An account with that Email already Exists!"
    ); // Returns true if username exists, otherwise false
  } catch (error) {
    return new validationCheck(
      false,
      "Error checking if Email is already used"
    );
  }
}

export default router;
