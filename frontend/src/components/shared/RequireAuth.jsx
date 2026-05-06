import { useEffect, useState } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const hasValidToken = () => {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("access_token");
  return Boolean(token && token !== "null" && token !== "undefined" && token.trim() !== "");
};

export default function RequireAuth() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(hasValidToken);

  useEffect(() => {
    const checkToken = () => setIsAuthenticated(hasValidToken());

    checkToken();
    const handleStorage = () => checkToken();
    window.addEventListener("storage", handleStorage);

    const timer = window.setInterval(checkToken, 1000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.clearInterval(timer);
    };
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
