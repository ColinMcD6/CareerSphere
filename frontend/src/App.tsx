import { Route, Routes } from "react-router-dom";
import Welcome from "./pages/welcome.pages.tsx";
import Account from "./pages/account.pages.tsx";
import LogIn from "./pages/logIn.pages.tsx";
import SignUp from "./pages/signUp.pages.tsx";
import "./styles/frontPage.styles.css"
import ForgotPassword from "./pages/ForgotPassword.pages.tsx";
import ResetPassword from "./pages/resetPassword.pages.tsx";
import EmailVerify from "./pages/emailVerify.pages.tsx";
import CreateJobPost from "./pages/createJobPost.pages.tsx"
import ViewJobPosting from "./pages/viewJobPosting.pages.tsx"
import ViewAllJobs from "./pages/viewAllJobs.pages.tsx"
import NavBar from "./pages/navigationBar.pages.tsx";
import CreateQuiz from "./pages/createQuiz.pages.tsx";
import TakeQuiz from "./pages/takeQuiz.pages.tsx";
import { CareerSphereApp } from "./components/careersphereApp.components.tsx";


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
        <Route path="/Create-Quiz-For-Job" element={<CreateQuiz />} />
        <Route path="/Take-Quiz" element={<TakeQuiz />} />
      </Routes>
    </>
  );
}

export default App;
