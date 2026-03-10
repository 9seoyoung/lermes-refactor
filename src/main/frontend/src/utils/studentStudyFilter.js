// 수강생 권한 / 학습 일정 메뉴 필터별 url

import { readInterview, pullAllBoardList } from "../services/postService"
import {pullToDoList} from "../services/calService";

//리스트 목록 api url
export const STUDENT_STUDY_MENU_FILTER = {
    // key는 선택한 필터의 인덱스 (=selectedIdx)
    0: "/studySchedule", // 전체
    1: "/calendar", // 공식
    2: "/calendar", //내 일정
    3: "/interview/my-requests", //면담
    4: "/interviewRecord", //면담
    5: "/interviewRecord"
}

export const MENU_FILTER_COLUMNDATA = {
    0: ["renameBoardType", "title", "formattedAplyDt", "userNm", "viewCnt"],
    1: ["postType", "title", "formattedAplyDt", "userNm", "viewCnt"],
    2: ["postType", "title", "formattedAplyDt", "userNm", "viewCnt"],
    3: ["postType", "itvAplyTtl", "formattedAplyDt", "itvAplcntNm", "viewCnt" ],
    4: ["postType", "itvRecordTtl", "formattedAplyDt", "itvPicNm", "viewCnt" ],
    5: ["postType", "itvRecordTtl", "formattedAplyDt", "itvPicNm", "viewCnt" ],
}


export const MENU_FILTER_COLUMNDATA_T = {
    0: ["boardType", "title", "formattedAplyDt", "userNm", "viewCnt"],
    1: ["postType", "title", "formattedAplyDt", "userNm", "viewCnt"],
    2: ["postType", "title", "formattedAplyDt", "userNm", "viewCnt"],
    3: ["postType", "itvAplyTtl", "formattedAplyDt", "itvAplcntNm", "viewCnt" ],
    4: ["postType", "itvRecordTtl", "formattedAplyDt", "itvPicNm", "viewCnt" ],
    5: ["postType", "itvRecordTtl", "formattedAplyDt", "itvPicNm", "viewCnt" ],
}


export const SELECT_POST_SN_KEY = {
    0: "scheduleSn",
    1: "calSn",
    2: "calSn",
    3: "itvSn",
    4: "itvRecordSn",
}

//상세보기 API
export const SELECT_DETAIL_API = {
    0: () => pullAllBoardList(),
    1: (params) => pullToDoList(params),
    2: (params) => pullToDoList(params),
    3: readInterview,
}

export const SELECT_TUTORS_DETAIL_PAGE_PATH = {
    0: 0,
    1: "/tutorHome/studySched/calendar",
    2: "/tutorHome/studySched/calendar",
    3: "/tutorHome/studySched/interview", //상세보기 뒷부분: :postSn은 navigate로 동적으로 추가
    4: "/tutorHome/studySched/readItvMemo" //상세보기 뒷부분: :postSn은 navigate로 동적으로 추가
}

export const SELECT_STD_DETAIL_PAGE_PATH = {
    0: 0,
    1: "/stdHome/studySched/calendar",
    2: "/stdHome/studySched/calendar",
    3: "/stdHome/studySched/interview", //상세보기 뒷부분: :postSn은 navigate로 동적으로 추가
    4: "/stdHome/studySched/readItvMemo", //상세보기 뒷부분: :postSn은 navigate로 동적으로 추가
}

export const CHANGE_SCHEDULE_PAGE_BY_POST_TYPE_TUTOR = {
    "공식일정": "/tutorHome/studySched/calendar",
    "개인일정": "/tutorHome/studySched/calendar",
    "면담 기록": "/tutorHome/studySched/readItvMemo",
    "면담 신청": "/tutorHome/studySched/interview"
  }

  export const CHANGE_SCHEDULE_PAGE_BY_POST_TYPE_STD = {
    "공식일정": "/stdHome/studySched/calendar",
    "개인일정": "/stdHome/studySched/calendar",
    "면담 신청": "/stdHome/studySched/interview"
  }