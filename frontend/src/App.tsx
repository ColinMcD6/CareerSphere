import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import Account from "./pages/Account";
import "./pages/FrontPage.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/account" element={<Account />} />
    </Routes>
  );
}

export default App;
