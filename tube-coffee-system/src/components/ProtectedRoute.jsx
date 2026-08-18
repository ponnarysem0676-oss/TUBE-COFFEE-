import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <PageLoader />;
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

export function AdminRoute() {
  const { user, profile, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (profile?.role !== "Admin") return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export function PageLoader() {
  return <div className="min-h-screen grid place-items-center bg-[#faf7f2]"><div className="h-10 w-10 animate-spin rounded-full border-4 border-[#f4b400] border-t-transparent" /></div>;
}
