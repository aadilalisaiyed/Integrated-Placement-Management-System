import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import Applications from "./pages/Applications";
import Students from "./pages/Students";
import PublicApply from "./pages/PublicApply";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/apply" element={<PublicApply />} />
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/companies"
          element={<ProtectedRoute><Companies /></ProtectedRoute>}
        />
        <Route
          path="/applications"
          element={<ProtectedRoute><Applications /></ProtectedRoute>}
        />
        <Route
          path="/students"
          element={<ProtectedRoute><Students /></ProtectedRoute>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
