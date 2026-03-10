import { pullToDoList } from "../services/calService";
import { readInterviewList, readInterview, callBoardList, readPostByPostSn, callSurveyList, pullInterviewRecordList, readInterviewRecord } from "../services/postService";


const PATH_BY_FILTER = {
  // '공지': readNoticeList,
  // '일정': readScheduleList,
  // '자료실': readDocsList,
  // '설문': readSurveyList,
  // 'FAQ': readFaqList,
  // 'Q&A': readQnaList,
  '면담요청': "/adminHome/boardSet/readInterview",
  // '면담기록': readInterviewListByCoSn,
  // '임시저장': readDraftList,
};

const API_BY_FILTER = {
  // '공지': readNoticeList,
  // '일정': readScheduleList,
  // '자료실': readDocsList,
  // '설문': readSurveyList,
  // 'FAQ': readFaqList,
  // 'Q&A': readQnaList,
  '면담요청': readInterviewList,
  // '면담기록': "",
  // '임시저장': readDraftList,
};

const DETAIL_API_BY_FILTER = {
  '공지': readPostByPostSn,
  '일정': readPostByPostSn,
  '자료실': readPostByPostSn,
  '설문': readPostByPostSn,
  'FAQ': readPostByPostSn,
  'Q&A': readPostByPostSn,
  '면담요청': readInterview,
  '면담기록': readInterviewRecord,
  // '임시저장': readDraftList,
};


export function matchedPathAdminBoardFilter (filter) {
  return PATH_BY_FILTER[filter] || "" ; //없으면 빈값 (현재페이지)
  }
  
export function matchedListAPIAdminBoardFilter(filter) {
  return API_BY_FILTER[filter] || ""; // 없으면 null
}

export function matchedPostAPIAdminBoardFilter(filter) {
  return DETAIL_API_BY_FILTER[filter] || ""; // 없으면 null
}


// 관리자 권한 / 게시판 메뉴 필터별 url
export const ADMIN_BOARD_MENU_FILTER = {
    // key는 선택한 필터의 인덱스 (=selectedIdx)
    0: null, // 전체
    1: "NOTICE", // 공지
    2: "일정", // 공지
    3: "CLASS_MATERIAL", //자료실
    4: "SURVEY", //설문
    5: "FAQ", //FAQ
    6: "QNA", //문의
    7: "면담요청", //면담요청들어온 것
    8: "면담기록", //면담확정후 기록한 것
}

export const ADMIN_BOARD_MENU_FILTER_COLUMNDATA = {
    0: ["bbsType", "postTtl", "formattedAPostFrstDt", "postWriterName", "viewCnt"],
    1: ["bbsType", "postTtl", "formattedAPostFrstDt", "postWriterName", "viewCnt"],
    2: ["postType", "title", "formattedAPostFrstDt", "userNm", "viewCnt"],
    3: ["bbsType", "postTtl", "formattedAPostFrstDt", "postWriterName", "viewCnt"],
    4: ["bbsType", "srvyTtl", "formattedAPostFrstDt", "userNm", "viewCnt"],
    5: ["bbsType", "postTtl", "formattedAPostFrstDt", "postWriterName", "viewCnt"],
    6: ["bbsType", "postTtl", "formattedAPostFrstDt", "postWriterName", "viewCnt"],
    7: ["postType", "itvAplyTtl", "formattedAPostFrstDt", "itvAplcntNm", "viewCnt"],
    8: ["postType", "itvRecordTtl", "formattedAPostFrstDt", "itvPicNm", "viewCnt"],
}

export const ADMIN_SELECT_POST_SN_KEY = {
    0: "sn",
    1: "postSn",
    2: "calSn",
    3: "postSn",
    4: "srvySn",
    5: "postSn",
    6: "postSn",
    7: "itvSn",
    8: "itvRecordSn",

}

export const ADMIN_SELECT_DETAIL_PAGE_PATH = {
    0: 0,
    1: "/adminHome/boardSet/read",
    2: "/adminHome/boardSet/readSchedule",
    3: "/adminHome/boardSet/read",
    4: "/adminHome/boardSet/survey", //상세보기 뒷부분: :postSn은 navigate로 동적으로 추가
    5: "/adminHome/boardSet/read",
    6: "/adminHome/boardSet/read",
    7: "/adminHome/boardSet/readInterview",
    8: "/adminHome/boardSet/readItvMemo",

}

export const ADMIN_BOARD_API_FILTER = {
  0: 0,
  1: callBoardList,
  2: pullToDoList,
  3: callBoardList,
  4: callSurveyList,
  5: callBoardList,
  6: callBoardList,
  7: readInterviewList,
  8: pullInterviewRecordList,
}

export const CHANGE_ADMIN_PAGE_BY_POST_TYPE = {
  "NOTICE": "/adminHome/boardSet/read",
  "CLASS_MATERIAL": "/adminHome/boardSet/read",
  "QNA": "/adminHome/boardSet/read",
  "SURVEY": "/adminHome/boardSet/survey",
  "FAQ": "/adminHome/boardSet/read",
  "면담 신청": "/adminHome/boardSet/readInterview",
  // "면담확정": "/adminHome/boardSet/readInterview",
  "면담 기록": "/adminHome/boardSet/readItvMemo",
  "공식일정": "/adminHome/boardSet/readSchedule"
}

