// RoleRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function RoleRoute({ roles, children }) {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    console.error("[RoleRoute] AuthContext 없음 → Provider 바깥에서 렌더됨");
    return null;
  }

  const { user, loading, fetchedOnce, hasRole } = ctx;

  if (!fetchedOnce || loading) return <div className="center">로딩...</div>;
  if (!user || !hasRole(roles)) return <Navigate to="/welcome/login" replace />;
  return children ?? <Outlet />;
}