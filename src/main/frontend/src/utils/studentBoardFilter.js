// 수강생 권한 / 학습 일정 메뉴 필터별 url

import { readInterview } from "../services/postService"

export const STUDENT_BOARD_MENU_FILTER = {
    // key는 선택한 필터의 인덱스 (=selectedIdx)
    0: null, // 전체
    1: "NOTICE", // 공지
    2: "CLASS_MATERIAL", //자료실
    3: "SURVEY", //설문
    4: "FAQ", //FAQ
    5: "QNA", //Q&A
    6: "PRIVATE" //임시저장
}

export const BOARD_MENU_FILTER_COLUMNDATA = {
    0: ["renamePostType", "title", "formattedAPostFrstDt", "writerName", "viewCnt"],
    1: ["bbsType", "postTtl", "formattedAPostFrstDt", "postWriterName", "viewCnt"],
    2: ["bbsType", "postTtl", "formattedAPostFrstDt", "postWriterName", "viewCnt"],
    3: ["bbsType", "srvyTtl", "formattedAPostFrstDt", "userNm", "viewCnt"],
    4: ["bbsType", "postTtl", "formattedAPostFrstDt", "postWriterName", "viewCnt"],
    5: ["bbsType", "postTtl", "formattedAPostFrstDt", "postWriterName", "viewCnt"],
    6: ["bbsType", "postTtl", "formattedAPostFrstDt", "postWriterName", "viewCnt"]
}

export const SELECT_POST_SN_KEY = {
    0: "contentSn",
    1: "postSn",
    2: "postSn",
    3: "srvySn",
    4: "postSn",
    5: "postSn",
    6: "postSn"
}

export const SELECT_DETAIL_PAGE_PATH = {
    0: "/stdHome/board/read",
    1: "/stdHome/board/read",
    2: "/stdHome/board/read",
    3: "/stdHome/board/survey",
    4: "/stdHome/board/read", //상세보기 뒷부분: :postSn은 navigate로 동적으로 추가
    5: "/stdHome/board/read",
    6: ""

}

export const CHANGE_POST_TYPE_NAME = {
    "NOTICE": "공지사항",
    "CLASS_MATERIAL": "자료실",
    "QNA": "문의",
    "SURVEY": "설문조사",
    "FAQ": "FAQ",
    "면담 신청": "면담요청",
    "면담 확정": "면담확정",
    "면담 기록": "면담기록",
    "공식일정": "공식일정"
}

export const CHANGE_PAGE_BY_POST_TYPE= {
    "NOTICE": "/stdHome/board/read",
    "CLASS_MATERIAL": "/stdHome/board/read",
    "QNA": "/stdHome/board/read",
    "SURVEY": "/stdHome/board/survey",
    "FAQ": "/stdHome/board/read",
}


export const CHANGE_PAGE_BY_POST_TYPE_S = {
    "NOTICE": "/stdHome/board/read",
    "CLASS_MATERIAL": "/stdHome/board/read",
    "QNA": "/stdHome/board/read",
    "SURVEY": "/stdHome/board/survey",
    "FAQ": "/stdHome/board/read",
}

export const CHANGE_PAGE_BY_POST_TYPE_T = {
    "NOTICE": "/tutorHome/board/read",
    "CLASS_MATERIAL": "/tutorHome/board/read",
    "QNA": "/tutorHome/board/read",
    "SURVEY": "/tutorHome/board/survey",
    "FAQ": "/tutorHome/board/read",
}

