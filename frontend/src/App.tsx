import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Welcome from "./pages/Welcome"
import CreateJobsPosting from "./pages/CreateJobPositing"

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/Create-Job-Posting" element={<CreateJobsPosting />} / >
        </Routes>
    )
}

export default App
