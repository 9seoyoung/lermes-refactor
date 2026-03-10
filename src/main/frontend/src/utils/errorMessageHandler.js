export function getErrorMessage(e) {
  // 서버 표준 에러 바디
  const data = e?.response?.data;
  if (data) {
    // 우리 형식 { ok, status, message }
    if (typeof data.message === "string" && data.message.trim()) return data.message;
    // Spring ProblemDetail { detail }
    if (typeof data.detail === "string" && data.detail.trim()) return data.detail;
    // 그 외 에러 포맷
    if (typeof data.error_description === "string") return data.error_description;
    if (typeof data.error === "string") return data.error;
  }
  // 네트워크/타임아웃 등
  if (typeof e?.message === "string" && e.message.trim()) return e.message;
  return "요청 처리 중 오류가 발생했어요.";
}

// 사용 
/**
 * try {
  await api.get("/...");
} catch (e) {
  toast.error(getErrorMessage(e));
}
 */