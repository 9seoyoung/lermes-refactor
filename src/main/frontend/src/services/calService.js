import {api} from "../auth/api.js";


// 일정 조회(SchedList에서 땡겨옴)
export const pullToDoList = (params) => api.get('/calendar',{params});


//일정 등록(SchedListPopUp & 게시글)
export const registToDo = (payload) => api.post('/calendar', payload, {
  headers: { "Content-Type": "application/json" }
});

/**
 * 일정 상세 조회
 * @param {Number} calSn
 * @returns 일정 상세 내용
 */
export const detailSchedule = (calSn) => api.get(`/calendar/${calSn}`);

/**
 * 일정 업데이트
 * @param {Number} calSn
 * @param {Object} formData
 */
export const editSchedule = (calSn, payload) => api.patch(`/calendar/${calSn}`, payload,  {
  headers: { "Content-Type": "application/json" }});

  /** 일정 삭제
   * 
   */
export const deleteSchedule = (calSn) => api.delete(`/calendar/${calSn}`);