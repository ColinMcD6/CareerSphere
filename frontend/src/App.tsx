import { Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Account from "./pages/Account";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import "./pages/FrontPage.css";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerify from "./pages/emailVerify";
import CreateJobPost from "./pages/CreateJobPost.tsx"
import ViewJobPosting from "./pages/ViewJobPosting.tsx"
import ViewAllJobs from "./pages/ViewAllJobs.tsx"
import { CareerSphereApp } from "./components/careersphereApp";
import NavBar from "./pages/NavigationBar.tsx";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        {/* Nested Route for Welcome under CareerSphereApp */}
        <Route path="/" element={<CareerSphereApp />}>
          <Route index element={<Welcome />} />
        </Route>

        {/* Other Routes */}
        <Route path="/login" element={<LogIn />} />
        <Route path="/account" element={<Account />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/email/verify/:code" element={<EmailVerify />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset" element={<ResetPassword />} />
        <Route path="/create-job-posting" element={<CreateJobPost />} />
        <Route path="/view-all-jobs" element={<ViewAllJobs />} />
        <Route path="/view-job-posting" element={<ViewJobPosting />} />
      </Routes>
    </>
  );
}

export default App;
