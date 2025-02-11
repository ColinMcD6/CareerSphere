const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { render } = require("ejs");
const {
  passwordCheck,
  emailCheck,
  usernameCheck,
  validationCheck,
} = require("../../project-try/common/common.js");

module.exports = router;

// Create user
router.post("/", async (req, res) => {
  req.body.userName = req.body.userName.trim();
  req.body.email = req.body.email.trim();
  req.body.body = req.body.password.trim();

  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });

  try {

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) 
  {
    const messages = {};

    //USER NAME
    const usernameResults = usernameCheck(req.body.userName);
    if (!usernameResults.isValid())
        messages["username"]  =usernameResults.getMessage();
    else {
      const uniqueUserName = await checkUsernameExists(req.body.userName);
      if (!uniqueUserName.isValid()) 
         messages["username"] = uniqueUserName.getMessage();
    }

    // EMAIL CHECK
    const emailResults = emailCheck(req.body.email);
    if (!emailResults.isValid()) 
        messages["email"]  = emailResults.getMessage();
    else {
      const uniqueemail = await checkEmailExists(req.body.email);
      if (!uniqueemail.isValid()) 
         messages["email"] = uniqueemail.getMessage();
    }

    // PASSWORD CHECK
    const passwordResults = passwordCheck(req.body.password);
    if (!passwordResults.isValid()) 
      messages["password"] = passwordResults.getMessage();


    res.status(400).json(messages);
  }
});

async function checkUsernameExists(username) {
  try {
    const user = await User.findOne({ userName: username });
    return new validationCheck(user === null, "Username already Exists!"); // Returns true if username exists, otherwise false
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
