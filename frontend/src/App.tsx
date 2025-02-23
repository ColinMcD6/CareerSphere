import { Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Account from "./pages/Account";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import "./pages/FrontPage.css";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerify from "./pages/emailVerify";
import { CareerSphereApp } from "./components/careersphereApp";

function App() {
  return (
    <Routes>
      <Route path= "/" element={<CareerSphereApp/>}>
        <Route index element={<Welcome/>} />
      </Route>
      <Route path="/login" element={<LogIn />} />
      <Route path="/account" element={<Account />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/email/verify/:code" element={<EmailVerify />} />
      <Route path="/password/forgot" element={<ForgotPassword />} />
      <Route path="/password/reset" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;
