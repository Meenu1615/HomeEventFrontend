import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("authUser");

  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userData);

    const role = String(user.utype || user.role || "")
      .trim()
      .toLowerCase();

    const allowed = allowedRoles.some((item) => item.toLowerCase() === role);

    if (!allowed) {
      if (role === "vendor") {
        return <Navigate to="/vendor-dashboard" replace />;
      }

      if (role === "user" || role === "admin") {
        return <Navigate to="/admin-dashboard" replace />;
      }

      return <Navigate to="/login" replace />;
    }

    return <Outlet />;
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");

    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;
