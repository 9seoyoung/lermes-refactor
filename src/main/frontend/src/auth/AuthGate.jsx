// AuthGate.jsx
import { useAuth } from "./AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function AuthGate({ children }) {
  const { user, loading, fetchedOnce } = useAuth();
  const loc = useLocation();

  if (loading && !fetchedOnce) return null; // 스켈레톤/스피너
  if (!user) {
    // 로그인 안됨 → 로그인 페이지로. 돌아올 경로 저장
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }
  return children;
}