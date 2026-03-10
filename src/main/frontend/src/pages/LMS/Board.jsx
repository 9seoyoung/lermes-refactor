// 페이지찾기 - 게시판
import { useLocation, useNavigate } from "react-router-dom";
import ListTable from "../../components/ui/ListTable";
import uiStyle from "../../styles/UiComp.module.css"
import FilterList from "../../components/ui/FilterList";
import { useEffect, useState } from "react";
import { BOARD_MENU_FILTER_COLUMNDATA, CHANGE_PAGE_BY_POST_TYPE, CHANGE_PAGE_BY_POST_TYPE_S, CHANGE_PAGE_BY_POST_TYPE_T, CHANGE_POST_TYPE_NAME, SELECT_DETAIL_PAGE_PATH, SELECT_POST_SN_KEY, STUDENT_BOARD_MENU_FILTER } from "../../utils/studentBoardFilter";
import { callBoardList, callSurveyList, pullAllBoardList } from "../../services/postService";
import { useSelectedCompany } from "../../contexts/SelectedCompanyContext";
import { useAccount } from "../../auth/AuthContext";
import { toast } from "react-toastify";
import { formatDate } from "../../utils/dateformat";
import {SELECT_TEACHER_DETAIL_PAGE_PATH} from "../../utils/teacherBoardFilter";

export default function Board(){
    const navigate = useNavigate();
    const {effectiveSn} = useSelectedCompany();
    const {user} = useAccount();
    const [selectedIdx, setSelected] = useState(0) 
    const [pullList, setPullList] = useState([]);
    const [columnData, setColumnData] = useState([]);
    const [postKey, setPostKey] = useState("");
    const [whereTogo, setWhereToGo] = useState("");
    const filterArr = ["전체", "공지", "자료실", "설문", "FAQ", "Q&A"]
    const {pathname} = useLocation();
    const homeRoot = pathname.split('/')[1];
    const [catAllPage, setCatAllPage] = useState({});

    const chgPageUrlByHomeRoot = (root) => {
        switch(root){
            case "tutorHome":
                return CHANGE_PAGE_BY_POST_TYPE_T;
            case "stdHome":
                return CHANGE_PAGE_BY_POST_TYPE_S;
            default :
                return new Error("잘못된 접근입니다.");
        }
    }
    console.log(homeRoot);

    //게시물 목록 불러오기
    useEffect(() => {
        setCatAllPage(chgPageUrlByHomeRoot(homeRoot));
        let cancelled = false; 
          setPullList([]);   
        const cohortSn = user?.USER_COHORT_SN;
        const bbsType = STUDENT_BOARD_MENU_FILTER[selectedIdx];
        setWhereToGo(user.USER_AUTHRT_SN === 4 ? SELECT_TEACHER_DETAIL_PAGE_PATH[selectedIdx] : SELECT_DETAIL_PAGE_PATH[selectedIdx]);
        console.log(filterArr[selectedIdx]);
        setColumnData(BOARD_MENU_FILTER_COLUMNDATA[selectedIdx]);
        setPostKey(SELECT_POST_SN_KEY[selectedIdx]);
        const params = {
        }

        if(cohortSn != null) params.cohortSn = cohortSn;
        if(bbsType != "전체") params.bbsType = bbsType;
        // if(effectiveSn != null) params.effectiveSn = effectiveSn

        console.log(user);

        (async () => {
            try{
                const {data} = (selectedIdx === 3 ? await callSurveyList({coSn:effectiveSn, cohortSn: cohortSn, bbsType: "설문"}) : (selectedIdx === 0 ?
                    await pullAllBoardList()
                    : await callBoardList(params)));
                console.log(data);
                const formattedData = data.map(item => ({...item, formattedAPostFrstDt:  formatDate(item.postFrstWrtDt ?? item.srvyFrstWrtDt ?? item.createdAt),
                    renamePostType: CHANGE_POST_TYPE_NAME[item.bbsType]
                }));
                setPullList(formattedData);
            } catch(err) {
                toast.error(err.message);
            }
        }
    )();
    }, [selectedIdx])

    return (
        <div className="boardPage">
            <h2>게시판</h2>
            <div className="filterList">
                <ul className="ftList_L">
                    <FilterList arr={filterArr} selectedIdx={selectedIdx} setSelected={setSelected}></FilterList>
                </ul>
                <div className="ftList_R">
                    <div className="createBtn " onClick={() => navigate('createPost')}>
                        + 등록하기
                    </div>
                </div>
            </div>
            <div className="BigListBox">
                <ListTable
                key={`board-${selectedIdx}`}
                tableHead={['#', '유형', '제목', '작성일', '작성자', '조회수']}
                columnData={columnData}
                apiData={pullList}
                // 문자열로 지정
                gridTemplate="0.5fr 1fr 5fr 1.25fr 1fr 1fr"
                gap="12px"
                postKey={postKey}
                whereTogo={whereTogo}
                allPage={catAllPage}
                selectedIdx={selectedIdx}
                typeKey={"bbsType"}
              /> 
            </div>
        </div>
    );
}