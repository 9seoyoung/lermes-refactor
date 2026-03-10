// 강사: 출결 코드 생성
/* 1. 실패: { ok:false, message:"실패 에러 메시지" }
   2. 성공: { ok:true, message:"코드 생성 완료 65" } */
export const createAttendCode = (payload) =>
  ok(api.post("/attend/code", payload));

// 학생: 입실
/* 1. 실패: { ok:false, message:"실패 에러 메시지" }
   2. 성공: { ok:true, message:"입실", checkinTime:"2025-09-15T15:02:21.4331259" } */
export const checkin = (payload) =>
  ok(api.post("/attend/checkin", payload));

// 학생: 퇴실
/* 1. 실패: { ok:false, message:"실패 에러 메시지" }
   2. 성공: { ok:true, message:"퇴실", checkoutTime:"2025-09-15T15:06:16.0482305" } */
export const checkout = () =>
  ok(api.post("/attend/checkout"));
