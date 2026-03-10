// src/auth/authReducer.js
export const initialAuthState = {
  user: null,         // {유저테이블 컬럼 }
  loading: true,      // 앱 부팅/갱신 중
  fetchedOnce: false, // 최초 fetchMe 완료 여부
};

export function authReducer(state, action) {
  switch (action.type) {
    case "ME_LOADING":
      return { ...state, loading: true };
    case "ME_SUCCESS":
      return { ...state, loading: false, user: action.payload, fetchedOnce: true };
    case "ME_ANON":
      return { ...state, user: null, loading: false, fetchedOnce: true };
    case "LOGIN_SUCCESS":
      // 로그인은 성공했지만 유저는 fetchMe에서 확정
      return { ...state, loading: true };
    case "LOGOUT":
      return { ...initialAuthState, loading: false, fetchedOnce: true };
    case 'PATCH_USER':
      return { ...state, user: state.user ? { ...state.user, ...action.payload } : state.user };    
    default:
      return state;
  }
}
