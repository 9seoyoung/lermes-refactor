import { useNavigate } from "react-router-dom";
import ListTable from "../../../components/ui/ListTable";
import uiStyle from "../../../styles/UiComp.module.css"
import FilterList from "../../../components/ui/FilterList";
import { use, useEffect, useState } from "react";
import { useSelectedCompany } from "../../../contexts/SelectedCompanyContext";
import { STUDENT_STUDY_MENU_FILTER, MENU_FILTER_COLUMNDATA, SELECT_POST_SN_KEY, SELECT_DETAIL_PAGE_PATH, SELECT_STD_DETAIL_PAGE_PATH, CHANGE_SCHEDULE_PAGE_BY_POST_TYPE, CHANGE_SCHEDULE_PAGE_BY_POST_TYPE_TUTOR, CHANGE_SCHEDULE_PAGE_BY_POST_TYPE_STD } from "../../../utils/studentStudyFilter";
import { callStudyPlanListByFilter } from "../../../services/postService";
import { formatDate } from "../../../utils/dateformat";
import { useAccount } from "../../../auth/AuthContext";
import { CHANGE_ADMIN_PAGE_BY_POST_TYPE } from "../../../utils/readPageTypeReturn";

function StudyPlan() {
    const navigate = useNavigate();
    const { effectiveSn } = useSelectedCompany();
    const {user} = useAccount();
    const filterArr = ["전체", "공식 일정", "내 일정", "면담"];
    const [selectedIdx, setSelected] = useState(0)
    const [pullList, setPullList] = useState([]);
    const [columnData, setColumnData] = useState([]);
    const [postKey, setPostKey] = useState("");
    const [whereTogo, setWhereToGo] = useState("");
    
  // useEffect(() => {
  //   const url = STUDENT_STUDY_MENU_FILTER[selectedIdx];
  //   const column = MENU_FILTER_COLUMNDATA[selectedIdx];
  //   const postSn = SELECT_POST_SN_KEY[selectedIdx];
  //   const path = SELECT_DETAIL_PAGE_PATH[selectedIdx];

  //     const params = {
  //         url: url,
  //         effectiveSn: effectiveSn,
  //         isPrivate: null,
  //         cohortSn: user.USER_OGDP_COHORT_SN
  //     };
  //     if (selectedIdx === 1) params.isPrivate = 0;
  //     if (selectedIdx === 2) params.isPrivate = 1;

  //   setColumnData(column);
  //   setPostKey(postSn);
  //   setWhereToGo(path);
  //   console.log(columnData);
  //   (async () => {
  //       try {
  //           const data = await callStudyPlanListByFilter(params);
  //           console.log(data.data);
  //           const formattedData = data.data.map(item => ({...item, formattedAplyDt:  formatDate(item.itvAplyDt),}));
  //           setPullList(formattedData);
  //     } catch (e) {
  //       console.log(e.message);
  //     }
  //   })();
  // }, [effectiveSn, selectedIdx]);

  useEffect(() => {
    const url = STUDENT_STUDY_MENU_FILTER[selectedIdx];
    const column = MENU_FILTER_COLUMNDATA[selectedIdx];
    const postSn = SELECT_POST_SN_KEY[selectedIdx];
    const path = SELECT_STD_DETAIL_PAGE_PATH[selectedIdx];

    const params = {
        url: url,
        effectiveSn: effectiveSn,
        isPrivate: null,
        cohortSn: user.USER_OGDP_COHORT_SN

    };
    if (selectedIdx === 1) params.isPrivate = 0;
    if (selectedIdx === 2) params.isPrivate = 1;

    setColumnData(column);
    setPostKey(postSn);
    setWhereToGo(path);
    console.log(columnData);
    (async () => {
        try {
            const data = await callStudyPlanListByFilter(params);
            console.log(data.data);
            const formattedData = data.data.map(item => ({...item, formattedAplyDt:  formatDate(item?.itvAplyDt || item?.regDt || item?.createdAt || item?.eventRegDt), renameBoardType: (item.boardType === "면담 요청" ? "면담신청" : item.boardType)}));
            setPullList(formattedData);
        } catch (e) {
            console.log(e.message);
        }
    })();
}, [effectiveSn, selectedIdx]);

  


    return (
        <div className="boardPage">
            <h2>학습 일정</h2>
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
                tableHead={['#', '유형', '제목', '작성일', '작성자', '조회수']}
                columnData={columnData}
                apiData={pullList}
                // 문자열로 지정
                gridTemplate="0.5fr 1fr 5fr 1.25fr 1fr 1fr"
                gap="12px"
                postKey={postKey}
                selectedIdx={selectedIdx}
                whereTogo={whereTogo}
                allPage={CHANGE_SCHEDULE_PAGE_BY_POST_TYPE_STD}
                typeKey={"boardType"}              /> 
            </div>
        </div>
    );
}

export default StudyPlan