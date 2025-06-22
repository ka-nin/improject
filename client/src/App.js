import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./pages/AdminLogin"
import MainPage from "./pages/main"
import Dashboard from "./pages/ProjectsPrograms"
import Program from "./pages/program"
import Reports from "./pages/reports"
import Projects from "./pages/projects"
import NewProject from "./pages/newProject"
import EditProject from "./pages/editProject"
import CreateProgram from "./pages/createProgram"
import EditProgram from "./pages/editProgram"
import Residents from "./pages/residents"
import CreateResident from "./pages/createResidents"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/program" element={<Program />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/newProject" element={<NewProject />} />
        <Route path="/editProject/:projectId" element={<EditProject />} />
        <Route path="/createProgram" element={<CreateProgram />} />
        <Route path="/editProgram/:programId" element={<EditProgram />} />
        <Route path="/residents" element={<Residents />} />
        <Route path="/createResident" element={<CreateResident />} />
      </Routes>
    </Router>
  )
}

export default App
