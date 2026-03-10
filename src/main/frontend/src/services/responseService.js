import {api} from "../auth/api";

/**
 * 설문 응답 제출 및 수정
 * @param {Object} dto {srvySn, parentType = "SURVEY", response = JSON }
 */
export const submitSurvey = (srvySn, dto) => api.post(`/surveys/${srvySn}/responses`, dto, 
    {headers: { 'Content-Type': 'application/json' },}
)

/**
 * 설문 응답 리스트 조회 >>  뭔 차이지 두개
 * @param {Number} srvySn
 * @returns 관리자 -> 전체 유저 응답, 그 외 -> 본인만 
 */
export const pullSurveyResList = (srvySn) => api.get(`surveys/${srvySn}/list`) //얘는 원래꺼 원래부터 정상작동(관리자용)
export const pullSurveyResListAuthor = (srvySn) => api.get(`/surveys/${srvySn}/responses/all`) //얘는 관리자인데 조회 안되나봄 작성자만 되나봄

/**
 * 설문 응답 단건 조회 // 설문읽기 폼 마운트 시 >> 이거 땡기고 있으면 얘를 데이터로 셋팅 >> 제출하기 버튼으로
 * @param {Number} srvySn
 * @returns 본인 응답
 */
export const readSurveyRes = (srvySn) => api.get(`/surveys/${srvySn}/detail`);

/**
 * 설문 응답 삭제 => 관리자 및 본인만
 * @param {Number} srvySn
 */
export const deleteSurveyRes = (responseSn) => api.delete(`/surveys/responses/${responseSn}`)


/**
 * 모집 공고 응답 제출
 * @param {Object} dto
 */
export const submitRecruitForm = (params) => api.post('/cohort-responses', params, 
    {headers: { 'Content-Type': 'application/json' },}
)

/**
 * 모집 응답 단건 조회
 * @param {Number} id 리스폰스 SN
 */
export const readApplierResult = (id) => api.get(`/cohort-responses/${id}`);