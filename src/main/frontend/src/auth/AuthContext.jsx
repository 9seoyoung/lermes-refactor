// 전역 상태 + 헬퍼
import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

export function useAccount() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider 밖에서 useAccount 사용됨");
  return ctx; // { user, loading, signIn, signOut, refreshMe, hasRole }
}


export function useAuth() {
  return useContext(AuthContext);
}
