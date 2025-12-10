import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import type { Role } from "@/lib/validations";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  const role = user?.role; // ✅ FIX: read role from user object

  // While user loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not logged in
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If route has role restrictions
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    const redirectPath =
      role === "admin"
        ? "/admin"
        : role === "owner"
        ? "/owner"
        : "/user";

    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
