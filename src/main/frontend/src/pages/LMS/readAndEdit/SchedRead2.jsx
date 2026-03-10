import { DateTimeInput, FileList, FileUpload, FormInput, GrayBtn } from "../../../components/ui/UiComp"
import styles from "../../../styles/SchedListPopUp.module.css";
import React, { useEffect, useId, useRef, useState } from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useAccount} from "../../../auth/AuthContext";
import { deleteSchedule, detailSchedule, editSchedule } from "../../../services/calService";
import { toast } from "react-toastify";
import { useSelectedCompany } from "../../../contexts/SelectedCompanyContext";
import { buildScheduleUpdateBody, normalizeSchedulePayload } from "../../../utils/normalizeDto";
import layoutStyles from "../../../styles/layout.module.css"
import Dropdown from "../../../components/ui/Dropdown";
import GroupDropdown from "../../../components/ui/GroupDropdown";
import { Trash2Icon } from "lucide-react";

export default function SchedEdit2() {
  const domFormId = useId();
  const { user } = useAccount();
  const {calSn} = useParams();
  const userAuth = user.USER_AUTHRT_SN;
  const myName = user.USER_NM;
  const navigate = useNavigate();
  const [editToggle, setEdit] = useState(true);
  const {effectiveSn} = useSelectedCompany();
  const [files, setFiles] = useState([]);
  const coSn = user.USER_OGDP_CO_SN;
  const cohortSn = user.USER_COHORT_SN
  const locate = useLocation();
  const [prvToggle, setPrvToggle] = useState(0);
  const [cohrtSn, setCohortSn] = useState(null);
  const {pathname} = useLocation();
  
  
  // 일반 게시글
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "",
    typeNm: "",
    scope: "",
    detailScope: "",
    detailScopeNm: "",
    surveyStart: "",     // 설문조사
    surveyEnd: "",   // 설문조사
    coSn: effectiveSn,
    cohortSn: cohortSn,
    startDate: "", //일정 시작, 면담 시작
    endDate: "",
    startTime: "", //일정 시간, 면담 시간
    location: "", //일정 장소, 면담 장소
    author: user?.USER_NM, // 작성자
    mento: "-", // 담당자
    isPrivate: ""
  });
  
  const editMyData = (myName === (formData?.itvAplcntNm ?? formData?.userNm ) ? false : true);
  
  // const handleFixed = async() => {
    //   console.log("면담요청 확정 ㄱㄱ --> itvSn(면담신청SN 수동입력 필요)")
    //   let itvSn = prompt("면담신청한 시리얼넘버를 입력하세요, itvSn");
    //   let effectiveSn = "아직없음";
    
    //   try{
      //     const {data} = await readInterview({itvSn, effectiveSn})
      //     console.log(`data 확인: ${data}`);
      //     setFormData(data);
      //     console.log(`formData 확인`);
      //   } catch(err){
        //     toast.error(err.message);
        //   }
        // }
        
        useEffect(() => {
          let mounted = true; // 언마운트 후 setState 방지
          (async () => {
            try {
            const { data } = await detailSchedule(calSn);
            console.log(data);
            if (!mounted) return;
            const normalized = normalizeSchedulePayload(data);
            setFormData(prev => ({
              ...prev,
              ...normalized,
            }));
      } catch (err) {
        toast.error(err.message);
      }
    })();
  
    return () => { mounted = false; };
  }, [calSn, editToggle]);

const handleChange = (e) => {
  const { name, type, value, checked } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value,
  }));
};

  const saveSubmit = async (e) => {
    e.preventDefault();
  
    const snapshot = structuredClone
      ? structuredClone({ formData })
      : JSON.parse(JSON.stringify({ formData }));
  
    const body = buildScheduleUpdateBody(snapshot.formData);
  
    console.log("[PATCH body]", JSON.stringify(body, null, 2));
  
    try {
      const res = await editSchedule(calSn, body);    // <-- PATCH
      toast.success("일정 변경 완료");
  
      // 서버 응답을 다시 화면 모델로 정규화해서 반영(표시값 동기화)
      const normalized = normalizeSchedulePayload(res.data);
      setFormData((prev) => ({ ...prev, ...normalized }));
  
      navigate(-1);
    } catch (err) {
      toast.error(err.message);
      console.error("[schedRes] update error:", err);
    }
  };


  return (
    <div className="pageBox">
    <div className="formArea_L">
        <h4 style={{ fontWeight: "500", display:"flex", alignItems:"center"}}>
          <div style={{display:"flex", gap:"4px", alignItems:"baseline"}}>
            {`[${formData.calType}] ${formData.title}`}
            <span style={{border: "none", display: "flex", alignItems: "flex-end", height:"100%", gap: "4px", margin: "0 0 14px 4px"}}>
              { editToggle && formData?.postWriterName === user.USER_NM  || !editMyData || userAuth === 4 ?
                <button type='button' onClick={() => setEdit(false)} className={styles.grayBtn} style={{width:"3rem", fontSize:"1rem"}} >edit</button>
                :
                <></>
              }
              {pathname === "/adminHome/boardSet" || formData?.postWriterName === user.USER_NM || userAuth === 1 || !editMyData ?
                        <button type='button'
                          className={styles.redBtn}
                          onClick={async () => {
                            const ok = window.confirm("정말 삭제하시겠습니까?");
                            if (!ok) return; // 취소하면 아무것도 안 함
              
                            try {
                              await deleteSchedule(calSn);
                              toast.success("삭제되었습니다.", {
                                onClose: () => navigate(-1) // ✅ 토스트 닫힐 때 리로드
                              });
                            } catch (err) {
                              console.error(err);
                              toast.error("삭제 중 오류가 발생했습니다.");
                            }
                          }}
                        >
                          <Trash2Icon size={"1.4rem"} color={"var(--font-color-white)"}/>
                        </button>
                        : null}
                        </span>
          </div>       
          {editToggle ? 
          <button type='button' className={styles.grayBtn} onClick={()=>{navigate(-1); setEdit(true)}}>돌아가기</button>
          :
          <div style={{display: "flex", gap: "8px"}}>
            <button type="button" className={styles.grayBtn} onClick={() => setEdit(true)} > 취소 </button>
            <button type='button' className={styles.grayBtn} onClick={(e)=>{saveSubmit(e); navigate(-1); setEdit(true)}}>저장</button>
          </div>
          }
        </h4>
      
      <SchedRead
        type={formData.type}
        handleChange={handleChange}
        formId={formData.formUuid}
        formData={formData}
        FileList={FileList}
        files={files}
        setFiles={setFiles}
        editMyData={editMyData}
        editToggle={editToggle}
        setPrvToggle={setPrvToggle}
        prvToggle={prvToggle}
      />
      </div>
    {!editToggle ? 
    <div className="formArea_R">
            <div className="selectBoxArea" style={{ position: "relative" }}>
            {prvToggle ?
                  null :
              <div className="dropSet" style={{ zIndex: "2" }}>
                { (userAuth <=3  && (effectiveSn === coSn)) ? <> 
                <p>공개 범위</p>
                  <GroupDropdown setCohortSn={setCohortSn} className="dropset_dd" label={formData.scope || "---- 필수 선택 ----"}>
                  </GroupDropdown>
                  </>: null }
                <input type="hidden" name="scope" value={formData.scope} />
              </div> }
              <>
                <DateTimeInput type="date" labelNm="시작일" handleChange={handleChange} name="startDate" formData={formData} addLabelStyle="formLabel"  disabled={false}/>
                <DateTimeInput type="date" labelNm="종료일" handleChange={handleChange} name="endDate" formData={formData} addLabelStyle="formLabel"  disabled={false}/>
                <DateTimeInput type="time" labelNm="시간" handleChange={handleChange} name="startTime" formData={formData} addLabelStyle="formLabel"  disabled={false}/>
                <FormInput type="text" formData={formData} handleChange={handleChange} disabled={false} addLabelStyle="formLabel" name="location" labelNm="장소"/>        
              </>
            </div>
          </div> : null}
    </div>
  );
}

const SchedRead = ({formId, handleChange, formData = {}, prvToggle, setPrvToggle, setFormData, editToggle}) => {
    const {pathname} = useLocation();
    const {user} = useAccount();
    

  return (
    <>
      {!editToggle ?
        <div className='formHeader'>
            <div className='inputSet'>
              <label className='formLabel' htmlFor={`${formId}_title`}>제목</label>
              <input
                id={`${formId}_title`}
                className='formInput'
                name='title'
                placeholder='제목을 입력하세요.'
                value={formData.title}
                onChange={handleChange}
                disabled={ editToggle}
              />
            </div>
      <>
            { !editToggle && pathname !== "/adminHome" ? (
              <div className={styles.private}>
                  <label htmlFor="privateBox">개인</label>
                    <input
                        type="checkbox"
                        name="isPrivate"
                        checked={Boolean(formData.isPrivate)} 
                        onChange={(e) => {setPrvToggle(v => !v); handleChange(e);}}
                        id="privateBox"
                        />
                </div>
            ) : null}
            </>
        </div>
            : null}
        {/* 본문 */}
        <textarea
            id={`${formId}_content`}
            name="content"
            className='formTextarea'
            placeholder='본문을 입력하세요.'
            value={formData.content}
            onChange={handleChange}
            disabled={ editToggle}
            >
        </textarea>
    </>
  )
}