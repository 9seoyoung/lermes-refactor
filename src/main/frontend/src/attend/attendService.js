import { api } from '../auth/api';

// 공통 헬퍼: axios 응답에서 data만 꺼내는 래퍼
const ok = (p) => p.then(({ data }) => data);

// 강사: 출결 코드 생성
/* 1. 실패: { ok:false, message:"실패 에러 메시지" }
   2. 성공: { ok:true, message:"코드 생성 완료 65" } */
export const createAttendCode = (code) => ok(api.post('/attend/code', code));

// export const createAttendCode = (payload) =>
//   api.post('/attend/code', payload).then((res) => res.data);

// 학생: 입실
/* 1. 실패: { ok:false, message:"실패 에러 메시지" }
   2. 성공: { ok:true, message:"입실", checkinTime:"2025-09-15T15:02:21.4331259" } */
export const checkin = (code) => ok(api.post('/attend/checkin', code));

// 학생: 퇴실
/* 1. 실패: { ok:false, message:"실패 에러 메시지" }
   2. 성공: { ok:true, message:"퇴실", checkoutTime:"2025-09-15T15:06:16.0482305" } */
export const checkout = () => ok(api.post('/attend/checkout'));

// 학생 당일 입퇴실시간 데이터 가져오는 함수
export const getTodayStatus = () => ok(api.get('/attend/status/today'));

// 강사가 만든 코드, 강사랑 학생한테 보여주는 함수
export const getActiveAttendCode = () => ok(api.get('/attend/code'));

// 오늘 출결 현황 조회(강사용)
export const fetchTodayAttendance = () =>
  api
    .get('/attend/today/list', { withCredentials: true })
    .then(({ data }) => data?.data ?? []);

// 오늘 출결 현황 조회(관리자용)
export const fetchTodayAttendanceByCohort = (cohortSn) =>
  api
    .get(`/attend/today/list/cohort/${cohortSn}`)
    .then(({ data }) => data?.data ?? []);

// 단위기간 별 출결 현황 조회(학생 마이페이지 용)
// SimpleResponse { ok, message, data } 중 data만 꺼내서 반환
export const getAttendSummary = () =>
  api.get('/attend/summary').then(({ data }) => data.data);

// 금일 모든 기수 출결 현황 조회(관리자용)
export const getAbsenceByCohortToday = () =>
  api.get('/attend/absence/by-cohort/today').then(({ data }) => data.data);

// 출결 인정 요청 생성
export const createAttendAdjust = (payload) =>
  api.post('/attend/adjust', payload).then(({ data }) => data);

// 내 요청 목록(페이징)
export const getMyAttendAdjustPage = ({ page = 0, size = 7 } = {}) =>
  api
    .get('/attend/adjust/my', { params: { page, size } })
    .then(({ data }) => data);

// 파일 업로드
export const uploadEvidenceFile = (file, formUuid) => {
  const fd = new FormData();
  fd.append('files', file); // 백엔드가 List<MultipartFile> 받으니까 key는 "files"
  if (formUuid) fd.append('formUuid', formUuid);

  return api
    .post('/files', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(({ data }) => {
      // 서버가 배열을 내려주면 첫 번째만 리턴
      return Array.isArray(data) ? data[0] : data;
    });
};

// 관리자: 출석 인정 요청 전체 조회 (회사 기준)
export const getAdminAttendAdjustPage = ({ page = 0, size = 7 } = {}) =>
  ok(api.get('/attend/adjust/admin', { params: { page, size } }));

// 관리자: 승인여부 변경 (Y/N)
export const updateAttendAdjustStatus = (id, status) =>
  ok(api.put(`/attend/adjust/${id}/status`, { status }));
