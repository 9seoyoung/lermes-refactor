import { api } from '../auth/api';

export const pullAllAccount = (params) =>
  api.get('/users/by-company-role', { params });

/**
 * 유저TB COSN 제거
 * @param {Number} id 유저SN 
 * @returns 
 */
export const deleteAccount = (id) => api.put(`/users/${id}/company`, {id});

export const approveAccount = (companyMemberSn) =>
  api.post(`/company-members/${companyMemberSn}/approve`, {params: companyMemberSn},    {headers: { 'Content-Type': 'application/json' },});

export const rejectAccount = (companyMemberSn) =>
  api.post(`/company-members/${companyMemberSn}/reject`, {companyMemberSn: companyMemberSn},  { headers: { 'Content-Type': 'application/json' },});

export const applyEmp = (params) =>
  api.post('/company-members/apply', params, {
    headers: { 'Content-Type': 'application/json' },
  });

export const pullApplyEmp = (effectiveSn) =>
  api.get('/company-members', { params: { effectiveSn } });

/**
 *
 * @param {Number} ogdpCoSn
 * @param {Number} ogdpCohortSn
 * @param {Number} userAuthrtSn
 * @returns
 */
export const pullTeacherAccount = (params) =>
  api.get('/users/by-company-cohort-role', { params });

/**
 * 기수 신청자 리스트 api
 * @param {Number} cohortSn
 */
export const pullCohortApplicants = (cohortSn) =>
  api.get(`/cohort-member/cohort/${cohortSn}/applicants`);

/**
 * 기수 신청 api
 * @param {Number} userSn
 * @param {Number} cohortSn
 */
export const applyLecture = (params) =>
  api.post('/cohort-member/apply', params, {
    headers: { 'Content-Type': 'application/json' },
  });

/**
 * 기수 승인 api
 * @param {Number} memberId 뭔데이거 유저 SN임?
 */
// export const approveCohort = (memberId) =>
//   api.post(`/cohort-member/${memberId}/approve`);

export const approveCohort = (memberId, companySn, cohortSn) =>
  api.post(`/cohort-member/${memberId}/approve`, { companySn, cohortSn });

/**
 * 기수 거절 api
 * @param {Number} memberId
 */
export const denyCohort = (memberId) =>
  api.post(`/cohort-member/${memberId}/reject`);

/**
 * 유저 상세 조회 api
 * @param {Number} userSn
 */
export const userInfo = (userSn) => api.get(`/users/${userSn}`);
