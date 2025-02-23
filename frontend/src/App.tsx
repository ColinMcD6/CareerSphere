import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Welcome from "./pages/Welcome"
import CreateJobPositing from "./pages/CreateJobPost.tsx"
import ViewJobPosting from "./pages/ViewJobPosting.tsx"
import ViewAllJobs from "./pages/ViewAllJobs.tsx"
function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/create-job-posting" element={<CreateJobPositing />} />
            <Route path="/view-all-jobs" element={<ViewAllJobs/>} />
            <Route path="/view-job-posting" element={<ViewJobPosting/>} />
        </Routes>
    )
}

export default App
