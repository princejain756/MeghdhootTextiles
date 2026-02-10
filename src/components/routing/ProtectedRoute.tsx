import { Navigate, useLocation } from "react-router-dom";
import FullScreenLoader from "@/components/FullScreenLoader";
import { useAuth } from "@/context/AuthContext";
import type { Role, Permission } from "@/types/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: Role[];
  permissions?: Permission[]; // allow access if user has any of these
}

const ProtectedRoute = ({ children, roles, permissions }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <FullScreenLoader label="Checking your session" />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    const perms = user.permissions ?? [];
    if (!permissions || !permissions.some((p) => perms.includes(p))) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
