import { readInterviewList, readInterview, callBoardList, readPostByPostSn, pullInterviewRecordList } from "../services/postService";


export const TEACHER_DETAIL_PATH_BY_FORM_TYPE = {
  '면담요청': "/tutorHome/studentManage/readInterview",
  // '면담기록': readInterviewListByCoSn,
  // '임시저장': readDraftList,
};

export const TEACHER_LIST_API_BY_FILTER = {
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

export const TEACHER_DETAIL_API_BY_FORM_TYPE = {
  '공지': readPostByPostSn,
  '일정': readPostByPostSn,
  '자료실': readPostByPostSn,
  '설문': readPostByPostSn,
  'FAQ': readPostByPostSn,
  'Q&A': readPostByPostSn,
  '면담요청': readInterview,
  // '면담기록': ,
  // '임시저장': readDraftList,
};

// 관리자 권한 / 게시판 메뉴 필터별 url
export const TEACHER_STUDENTMANAGE_MENU_FILTER = {
    // key는 선택한 필터의 인덱스 (=selectedIdx)
    0: null, // 전체
    1: "면담신청", // 공지
    2: "면담요청", // 공지
    3: "면담기록", //자료실
}

export const TEACHER_STUDENTMANAGE_MENU_FILTER_COLUMNDATA = {
    0: ["bbsType", "postTtl", "formattedAPostFrstDt", "postWriterName", "view_CNT"],
    1: ["postType", "itvAplyTtl", "formattedAPostFrstDt", "itvAplcntNm", "viewCnt"],
    2: ["bbsType", "postTtl", "formattedAPostFrstDt", "postWriterName", "viewCnt"],
    3: ["bbsType", "postTtl", "formattedAPostFrstDt", "postWriterName", "viewCnt"],
}

export const TEACHER_STUDENTMANAGE_POST_SN_KEY = {
    0: "postSn",
    1: "itvSn",
    2: "postSn",
    3: "postSn",

}

export const ADMIN_SELECT_DETAIL_PAGE_PATH = {
    0: 0,
    1: "/tutorHome/studySched/interview",
    2: "/tutorHome/studySched/interview",
    3: "/adminHome/board",

}

export const ADMIN_BOARD_API_FILTER = {
  0: 0,
  1: callBoardList,
  2: callBoardList,
  3: callBoardList,
  4: callBoardList,
  5: callBoardList,
  6: callBoardList,
  7: readInterviewList,
  8: pullInterviewRecordList,
  9: ""
}