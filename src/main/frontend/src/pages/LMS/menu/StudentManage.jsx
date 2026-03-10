import { useNavigate } from "react-router-dom";
import ListTable from "../../../components/ui/ListTable";
// import uiStyle from "../../../styles/UiComp.module.css"
import FilterList from "../../../components/ui/FilterList";
import { useEffect, useState } from "react";
import { useAccount } from "../../../auth/AuthContext";
import { useSelectedCompany } from "../../../contexts/SelectedCompanyContext";
import { TEACHER_DETAIL_PATH_BY_FORM_TYPE, TEACHER_LIST_API_BY_FILTER, TEACHER_STUDENTMANAGE_MENU_FILTER, TEACHER_STUDENTMANAGE_MENU_FILTER_COLUMNDATA, TEACHER_STUDENTMANAGE_POST_SN_KEY } from "../../../utils/teacherInterviewFilter";
import { formatDate } from "../../../utils/dateformat";
import { toast } from "react-toastify";

function StudentManage() {
  const navigate = useNavigate();
  const {effectiveSn} = useSelectedCompany();
  const {user} = useAccount();
  const [selectedIdx, setSelected] = useState(0) 
  const [pullList, setPullList] = useState([]);
  const [columnData, setColumnData] = useState([]);
  const [postKey, setPostKey] = useState("");
  const [whereTogo, setWhereToGo] = useState("");
  const [cohortSn, setCohortSn] = useState(null);
  const filterArr = ["전체", "면담 신청", "면담 요청", "면담 기록"];
        
    //게시물 목록 불러오기
    useEffect(() => {
        const userCohortSn = user?.USER_COHORT_SN;
        const bbsType = TEACHER_STUDENTMANAGE_MENU_FILTER[selectedIdx];
        const api = TEACHER_LIST_API_BY_FILTER[selectedIdx];

        // console.log(cohortSn, bbsType, api);

        setWhereToGo("/");
        console.log(filterArr[selectedIdx]);
        setColumnData(TEACHER_STUDENTMANAGE_MENU_FILTER_COLUMNDATA[selectedIdx]);
        setPostKey(TEACHER_STUDENTMANAGE_POST_SN_KEY[selectedIdx]);
        setWhereToGo(TEACHER_DETAIL_PATH_BY_FORM_TYPE[selectedIdx])

        const params = {};

        if(userCohortSn != null) params.cohortSn = userCohortSn;
        if(bbsType != "전체") params.bbsType = bbsType;
        if(effectiveSn != null) params.effectiveSn = effectiveSn;
        console.log(params);
        console.log(user);

        (async () => {



            try{
                console.log("시작")
                const {data} = await api(params);
                console.log(data);
                const formattedData = data.map(item => ({...item, formattedAPostFrstDt:  formatDate(item.postFrstWrtDt),}));
                setPullList(formattedData);
            } catch(err) {
                toast.error(err.message);
            }
        }
    )();
    }, [selectedIdx, cohortSn])


    return (
        <div className="boardPage">
            <h2>수강생 관리</h2>
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
                tableHead={['#', '유형', '제목', '면담일', '신청자', '담당자', '조회수', '작성일']}
                columnData={columnData}
                apiData={pullList}
                // 문자열로 지정
                postKey={postKey}
                whereTogo={whereTogo}
                gridTemplate="1fr 1fr 4.25fr 1.25fr 1.25fr 1.25fr 1fr 1fr"
                gap="12px"
              /> 
            </div>
        </div>
    );
}

export default StudentManage