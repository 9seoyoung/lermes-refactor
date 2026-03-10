import {api} from "../auth/api";

export function createSurvey(body) {
  return api.post('/survey/post', body, {
    headers: { 'Content-Type': 'application/json' },
  });
}

// export const createGroup = (payload) => api.post('/cohort/setgroup', payload)
export function createGroup(body) {
  return api.post('/cohorts/setgroup', body, {
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * @param {Number} cohortSn
 * @returns 기수 모집 내용 수정
 */
export const editGroup = (cohortSn, body) => api.put(`/cohorts/${cohortSn}`, body, {
  headers: {'Content-Type': 'application/json'}
})

/**
 * @param {Number} cohortSn
 * @returns 기수 삭제
 */
export const deleteGroup = (cohortSn) => api.delete(`/cohorts/${cohortSn}`);

export const applyGroup = ({ userSn, cohortSn }) =>  api.post('/cohort-member/apply', null, { params: { userSn, cohortSn }});



export const readRecruitPoster = (id) => api.get(`/cohorts/${id}`)


export function createInterview(body) {
  return api.post('/interview/apply', body, {
    headers: { 'Content-Type': 'application/json' },
  });
}

export function createInterviewMemo(body) {
  return api.post('/interview/memo', body, {
    headers: { 'Content-Type': 'application/json' },
  });
}

export const createPost = (params) => api.post(`/posts`, params, {
  headers: { 'Content-Type': 'application/json' },
});




/**
 * 
 * @param {Object} params
 * @param {Number} itvSn 면담신청SN
 * @param {Number} effectiveSn LMS 회사 시리얼 넘버 고정값 => 상준이가 수퍼메인페이지 API 만들고 나면 정해질 예정
 * @returns {Object} itvSn 에 해당하는 면담신청 데이터
 */
export const readInterview = (itvSn) => api.get(`interview/read/${itvSn}`);

  // 면담신청 리스트 조회(관리자)
// postService.js
export const readInterviewList = ({ roleType, cohortSn }) => {
  // INSTRUCTOR(4): cohortSn 없으면 /my-requests
  // TENANT/EMPLOYEE(2/3): cohortSn 필수 → /my-requests/{cohortSn}
  const base = '/interview/my-requests';
  const url = (roleType === 4 && !cohortSn)
    ? `${base}`
    : `${base}/${cohortSn}`;
  return api.get(url); // filter는 쓰면 되고, 안 쓰면 백에서 무시 가능
};


/**
 * 면담 수정(확정) API 
 * @param {Number} itvSn 면담신청SN
 * @param {Number} effectiveSn LMS 회사 시리얼 넘버 고정값
 * @param {Object} formData 변경(확정)된 내용
 * @returns 1
 */
export function editInterview( itvSn, formData ) {
  return api.put(`/interview/confirm/${itvSn}`, formData, {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

/**
 * 면담 기록 API
 * @param {Object} dto
 */
export const createInterviewRecord = (params) => api.post("/interviewRecord", params, {      headers: { 'Content-Type': 'application/json' }});

/**
 * 면담 기록 리스트 API
 * @param {Number} cohortSn 관리자만
 */
export const pullInterviewRecordList = (params) => api.get("/interviewRecord", {params});

/**
 * 면담 기록 상세 API
 * @param {Number} itvRecordSn
 */
export const readInterviewRecord = (itvRecordSn) => api.get(`/interviewRecord/${itvRecordSn}`);

/**
 * 면담 기록 수정 API
 * @param {Number} itvRecordSn
 * @param {Object} params
 */
export const editItvRecord = (itvRecordSn, params) => api.patch(`/interviewRecord/${itvRecordSn}`, params, {
  headers: { 'Content-Type': 'application/json' },
})

/**
 * 면담 기록 삭제 API
 * @param {Number} itvRecordSn
 */
export const deleteItvRecord = (itvRecordSn) => api.delete(`/interviewRecord/${itvRecordSn}`);

/**
 * 관리자 게시글 관리 메뉴 - 전체 게시글 리스트(모집공고 제외)
 * 
 * @param {Number} effectiveSn LMS 회사 시리얼 넘버 고정값 => 상준이가 수퍼메인페이지 API 만들고 나면 정해질 예정
 * @returns {Array<Object>>} 전체 게시글 응답
 */
export const readAllOfPostList = ({effectiveSn}) => api.get('/posts/all', {params: {effectiveSn}});

/**
 * 관리자 게시글 관리 메뉴 - 필터링 게시글 리스트
 * @param {string} [filter] - 필터링 기준 (게시글 유형: 공지 / 일정 / 자료실 / 설문 / FAQ / Q&A / 면담요청 / 면담기록  )
 * @param {Number} effectiveSn LMS 회사 시리얼 넘버 고정값 => 상준이가 수퍼메인페이지 API 만들고 나면 정해질 예정
 * @returns {Array<Object>} 전체 게시글 중 필터링 된 것
 */
export const readPostlistByfilter = ({filter, effectiveSn}) => api.get('/posts/list/{filter}',{params: {filter, effectiveSn}});



/**
 * 게시글 상세보기
 * @param {Number} postSn 게시글 시리얼번호
 * @param {Number} effectiveSn 선택되어있는 회사 시리얼 번호
 * @param {String} type 요청한 게시글 유형
 * @returns {Object} 게시글 내용
 */
export const readPostByPostSn = ({postSn, effectiveSn, type}) => api.get(`/posts/${postSn}`,{params: {postSn, effectiveSn, type}});

/**
 * 게시글 수정하기
 * @param {Number} postSn 게시글 시리얼 번호
 * @param {Number} effectiveSn 회사 시리얼 번호
 * @param {Object} formData 게시글 데이터
 * @returns 
 */
export const editPostByPostSn = ({postSn, effectiveSn, formData}) => api.put(`/posts/${postSn}`, formData, {params: {effectiveSn}});

//관리자 게시글 전체 조회
export const pullAdminBoardList = (cohortSn) => api.get(`/admin/boardList/${cohortSn}`)

/**
 * 게시글 목록 전체 조회(bbs + 설문)
 */
export const pullAllBoardList = () => api.get('/bbs/all/list');

/**
 * 게시글 목록 조회
 * @param {Number} cohortSn 선택한 기수 시리얼번호
 * @param {String} filter 게시글 유형 필터
 * @param {Number} effectiveSn 클릭으로 들어온 회사시리얼번호 or 내가 속한 회사 시리얼번호
 * @returns {Array<Object>} 게시글 목록
 */
export const callBoardList = ({cohortSn, bbsType, effectiveSn, coSn}) => api.get(`/posts`, {params: {cohortSn, bbsType, effectiveSn, coSn}})

/**
 * 설문 목록 조회
 * @param {Number} coSn
 * @param {Number} cohortSn
 * @param {String} bbsType
 */
export const callSurveyList = ({cohortSn, bbsType, coSn}) => api.get(`/survey/list/${coSn}`)

/**
 * 설문 단건 조회
 * @param {Number} srvySn
 */
export const readSurvey = (srvySn) => api.get(`/survey/${srvySn}`);


/**
 * 수강생 권한 - 학습 일정 메뉴, 필터별 API요청
 * @param {String} url API요청 URL
 * @returns {Array<Objects>} 전체 / 공식 / 내 일정/ 일지 / 면담 / 임시저장에 해당하는 게시물 목록
 */
export const callStudyPlanListByFilter = ({url, effectiveSn, isPrivate, cohortSn}) => api.get(`${url}`, (url === "/interviewRecord") ? {params: {cohortSn: cohortSn }}: {params: {isPrivate, effectiveSn}});


/**
 * 학습일정 전체 게시글
 * @param {Number} cohortSn 강사 이상 필수
 */




// 관리자 권한 게시물 관리 메뉴 ------------------------------------------------------------------------
/**
 * 게시물 유형 + 기수별 조회 기능(슈퍼관리자, 대표, 직원 조회 가능 / cohortSn(기수) 값 필수!)
 * @param {Number} cohortSn 기수 시리얼 번호
 * @returns {Array<Object>} 전체 / 공지 / 일정 / 자료실 / 설문 / FAQ / Q&A / 면담요청 / 면담기록 / 임시저장에 해당하는 게시물 목록
 */
export const callAllPostByTypeAndCohortSn = (params) => api.get(`admin/boardList/${params.cohortSn}`);

/**
 * 게시글 삭제 컨트롤러들
 */
export const deletePost = (postSn) => api.delete(`/posts/${postSn}`)


/**
 * 일반 게시글 댓글 전체 조회
 * @param {Number} postSn 게시글SN
 */
export const pullCommentList = (postSn) => api.get(`/comments/${postSn}`);

export const createComment = (postSn, requestDto) => api.post(`/comments/${postSn}`, requestDto );

/**
 * @author 구서영
 * @since 2025-10-16
 * @description 주어진 댓글 번호를 기반으로 서버에서 댓글을 삭제한다.
 * @param {Number} cmntSn 댓글SN
 * @return {status} 삭제 결과 응답 코드 204
 */
export const deleteComment = (cmntSn) => api.delete(`/comments/${cmntSn}`);