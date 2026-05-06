import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./components/shared/RequireAuth";

// Public / Landing
import LandingPage from "./components/landing/LandingPage";
import AboutPage from "./components/about/AboutPage";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

// Dashboard pages
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Billing from "./pages/Billing";
import NewCheck from "./pages/NewCheck";
import Processing from "./pages/Processing";
import Results from "./pages/Results";

import { Toaster } from "react-hot-toast";

function App() {
  return (

    <>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111827",
            color: "#f9fafb",
            border: "1px solid rgba(255,255,255,0.08)",
          },
        }}
      />
      
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* App / Dashboard */}
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/new-check" element={<NewCheck />} />
        <Route path="/processing" element={<Processing />} />
        <Route path="/results" element={<Results />} />
      </Route>
      <Route path="/history" element={<Navigate to="/settings" replace />} />
    </Routes>

    </>
    
  );
}

export default App;