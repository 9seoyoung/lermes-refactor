// src/auth/AuthProvider.jsx
import { useEffect, useReducer, useMemo, useCallback } from 'react';
import { authReducer, initialAuthState } from './authReducer';
import { AuthContext } from './AuthContext';
import { bindUnauthorizedHandler } from './api';
import { fetchMe, login, logout } from './authService';
import { toast } from 'react-toastify';

export default function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  useEffect(() => {
    console.log("[AuthProvider] mounted");
    return () => console.log("[AuthProvider] unmounted");
  }, []);
  // 앱 부팅 시: 세션 유효하면 유저 로드
  useEffect(() => {
    (async () => {
      dispatch({ type: 'ME_LOADING' });
      try {
        const data = await fetchMe();
        dispatch({ type: 'ME_SUCCESS', payload: data });
      } catch {
        dispatch({ type: 'ME_ANON' });
      }
    })();
  }, []); // dispatch는 안정적이므로 deps 불필요

  // 401(세션 만료 등) → 전역 로그아웃 처리
  useEffect(() => {
    bindUnauthorizedHandler(() => {
      dispatch({ type: 'ME_ANON' });
    });
  }, []);

  const signIn = useCallback(async (cred) => {
    await login(cred);                 // 서버 세션 수립
    dispatch({ type: 'LOGIN_SUCCESS' });
    const data = await fetchMe();      // 즉시 me로 유저확정
    dispatch({ type: 'ME_SUCCESS', payload: data });
    return data;
  }, [dispatch]);

  const signOut = useCallback(async () => {
    try {
      await logout();
      toast.success('로그아웃 성공');
    } catch (e) {
      console.error(e);
    }
    dispatch({ type: 'LOGOUT' });
  }, [dispatch]);

  const refreshMe = useCallback(async () => {
    dispatch({ type: 'ME_LOADING' });
    try {
      const data = await fetchMe();
      dispatch({ type: 'ME_SUCCESS', payload: data });
      return data;
    } catch (e) {
      dispatch({ type: 'ME_ANON' });
      throw e;
    }
  }, [dispatch]);

  const hasRole = useCallback((roles) => {
    const r = state.user?.USER_AUTHRT_SN?.toString();
    return !!r && roles.map(String).includes(r);
  }, [state.user?.USER_AUTHRT_SN]);

  const patchUser = useCallback((partial) => {
    dispatch({ type: 'PATCH_USER', payload: partial });
  }, [dispatch]);

  const value = useMemo(() => ({
    user: state.user,
    loading: state.loading,
    fetchedOnce: state.fetchedOnce,
    signIn,
    signOut,
    refreshMe,
    hasRole,
    patchUser,
  }), [
    state.user,
    state.loading,
    state.fetchedOnce,
    signIn,
    signOut,
    refreshMe,
    hasRole,
    patchUser,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}