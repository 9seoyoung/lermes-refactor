// ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const ctx = useContext(AuthContext);

  // ✅ Provider 바깥이면 여기서 걸림
  if (!ctx) {
    console.error("[ProtectedRoute] AuthContext 없음 → Provider 바깥에서 렌더됨");
    return null;
  }

  const { user, loading, fetchedOnce } = ctx;
  const loc = useLocation();

  if (!fetchedOnce || loading) return <div className="center">로딩...</div>;
  if (!user) return <Navigate to="/welcome/login" replace state={{ from: loc }} />;
  return children ?? <Outlet />;
}