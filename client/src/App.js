import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/AdminLogin";
import MainPage from "./pages/main"; // your existing page
import Dashboard from "./pages/ProjectsPrograms"; // your existing page
import Program from "./pages/program"; // your existing page


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/program" element={<Program/>} />
      </Routes>
    </Router>
  );
}

export default App;
