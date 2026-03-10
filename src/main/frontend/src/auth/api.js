// src/auth/api.js
import axios from 'axios';

// 배포용

// 아이피타임 포트포워드인가 그것도 맞춰줘야하는듯? 그것도 맞췄음.
// 배치파일도 포트번호 맞춰줘야되는듯? 일단 맞췃음.
// 배포는 https로 443
//const deployURL = 'http://localhost:940'
 const developURL = 'http://localhost:940'

export const api = axios.create({
  baseURL: `${developURL}/api`,
  withCredentials: true, // 세션쿠키 자동 전송
  xsrfCookieName: 'XSRF-TOKEN', // 시큐리티 쿠키 기본 토큰
  xsrfHeaderName: 'X-XSRF-TOKEN', //시큐리티
});

// 공통 에러/세션 만료 처리
let onUnauthorized = null;
export function bindUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

if (typeof window !== "undefined") {
  api.interceptors.request.use((config) => {
    const finalUrl = api.getUri(config);
    console.log("[REQ]", (config.method || "get").toUpperCase(), finalUrl);
    return config;
  });

  api.interceptors.response.use(
    (res) => {
      console.log("[RES]", res.status, api.getUri(res.config));
      return res;
    },
    (err) => {
      try {
        console.log("[ERR]", err.response?.status, api.getUri(err.config));
      } catch (err) {console.log(err)}
      return Promise.reject(err);
    }
  );
}

export default api;
