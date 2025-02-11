class validationCheck {
  #valid;
  #message;

  constructor(inputvalid, inputMessage) {
    this.#valid = inputvalid;
    this.#message = inputMessage;
  }

  isValid() {
    return this.#valid;
  }

  getMessage() {
    return this.#message;
  }
}

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 20;

const USERNAME_MIN_LENGTH = 5;
const USERNAME_MAX_LENGTH = 25;

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 45;

function passwordCheck(password) {
  let verified = true;
  let message = "";

  if (typeof password != "string") {
    verified = false;
    message = "Invalid Password";
  } else if (password.length < PASSWORD_MIN_LENGTH) {
    verified = false;
    message =
      "Password must be a mininmum of " +
      PASSWORD_MIN_LENGTH +
      " Characters long";
  } else if (password.length > PASSWORD_MAX_LENGTH) {
    verified = false;
    message =
      "Password can be a maximum of " +
      PASSWORD_MAX_LENGTH +
      " Characters long";
  } else if (!/[A-Z]/.test(password)) {
    // One upper case
    verified = false;
    message = "Password must have at least one upper case character";
  } else if (!/[a-z]/.test(password)) {
    // One lower case
    verified = false;
    message = "Password must have at least one lower case character";
  } else if (!/[!@#$%^&*()_+<>?:"{}|]/.test(password)) {
    verified = false;
    message =
      'Password must have at least one of the following special characters (!@#$%^&*()_+<>?:\\"{})';
  }

  return new validationCheck(verified, message);
}

function nameCheck(name) {
  
  let verified = true;
  let message = "";

  if (typeof name != "string") {
    verified = false;
    message = "Invalid name";
  } else if (name < NAME_MIN_LENGTH) {
    verified = false;
    message =
      "name must be a mininmum of " +
      NAME_MIN_LENGTH +
      " Characters long";
  } else if (name.length > NAME_MAX_LENGTH) {
    verified = false;
    message =
      "Name can be a maximum of " +
      NAME_MAX_LENGTH +
      " Characters long";
  } 
  else if ( /[^a-zA-Z]/.test(name))
  {
    verified = false;
    message = "Name can only contain alphabetic characters"
  }
  return new validationCheck(verified, message);
}



function emailCheck(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let verified = true;
  let message = "";

  if (typeof email != "string") {
    verified = false;
    message = "Invalid email input";
  } else if (email.trim() == "") {
    verified = false;
    message = "Must enter email";
  } else if (!pattern.test(email)) {
    verified = false;
    message = "Invalid email format";
  }

  return new validationCheck(verified, message);
}

function usernameCheck(username) {
  username = username.trim();
  let verified = true;
  let message = "";

  if (typeof username != "string") {
    verified = false;
    message = "Invalid username";
  } else if (username.trim() == "") {
    verified = false;
    message = "Must enter user name!";
  } else if (username.length < USERNAME_MIN_LENGTH) {
    verified = false;
    message =
      "User name must have a minimum of " + USERNAME_MIN_LENGTH + " characters";
  } else if (username.length > USERNAME_MAX_LENGTH) {
    verified = false;
    message =
      "User name can have a maximum of " + USERNAME_MAX_LENGTH + " characters";
  }

  return new validationCheck(verified, message);
}

export { passwordCheck, emailCheck, usernameCheck, nameCheck, validationCheck };
