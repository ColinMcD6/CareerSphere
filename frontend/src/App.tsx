import { Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Account from "./pages/Account";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import "./pages/FrontPage.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/account" element={<Account />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;
