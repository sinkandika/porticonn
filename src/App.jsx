import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import RegisterSuccess from "./pages/RegisterSuccess";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Account from "./pages/Account";

function App() {
  return (
    <Routes>

      <Route
      path="/"
      element={<Navigate to="/login" replace /> } // make login as main page
      />
      
      <Route 
      path="/login" 
      element={<Login />} 
      />

      <Route 
      path="/register" 
      element={<Register />} 
      />

      <Route
      path="/registerSuccess"
      element={<RegisterSuccess />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route 
      path="/projects"
      element={
        <ProtectedRoute>
          <Projects />
        </ProtectedRoute>
      }
      />

      <Route
      path="/projects/:projectId" // origin of projectId (must same with useParams)
      element={
        <ProtectedRoute>
          <ProjectDetails />
        </ProtectedRoute>
      } 
      />

      <Route
      path="/account"
      element={
      <ProtectedRoute>
        <Account />
      </ProtectedRoute>
      } 
      />

    </Routes>
  );
}

export default App;
