import React, { useEffect, useId, useRef, useState } from 'react'
import { DateTimeInput, FileList, FormInput, SaveBtn } from '../../../components/ui/UiComp';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelectedCompany } from '../../../contexts/SelectedCompanyContext';
import { deleteItvRecord, editItvRecord, readInterviewRecord } from '../../../services/postService';
import { toast } from 'react-toastify';
import { useAccount } from '../../../auth/AuthContext';
import {v4 as uuidv4} from "uuid";
import { findFileSnByFormUuid } from '../../../services/fileService';
import styles2 from "../../../styles/SchedListPopUp.module.css";
import { Trash2Icon } from 'lucide-react';



export default function InterviewMemoRead() {
  const {itvRecordSn} = useParams();
  const {effectiveSn} = useSelectedCompany();
  const [formData, setFormData] = useState({});
    const domFormId = useId();
    const postId = useRef(uuidv4());
    const { user } = useAccount();
    const coSn = user.USER_OGDP_CO_SN;
    const cohortSn = user.USER_COHORT_SN;
    const userAuth = user.USER_AUTHRT_SN;
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const [hortlist, setHortList] = useState([]);
    const [files, setFiles] = useState([]);
    const [prvToggle, setPrvToggle] = useState(0);
    const [recordCohortSn, setCohortSn] = useState(null);
    const [editToggle, setEditToggle] = useState(true);

  useEffect(()=>{
    (async () => {
      try {
        const {data}  = await readInterviewRecord(itvRecordSn);
        console.log(data);
        setFormData(data);
        const fileData = await findFileSnByFormUuid(data.formUuid);
    console.log(files);
        setFiles(fileData.data.map((v) => ({"name":v.orgnlFileNm, "fileSn": v.fileSn})));
        console.log(fileData.data);
        console.log(files);
      } catch(err) {
        toast.error(err);
      }
    })();


  },[effectiveSn, itvRecordSn])


 const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const saveSubmit = async (e) => {
    e.preventDefault();

    const formUuid = postId.current || uuidv4();


    if (formData.type === "면담신청") {
      setFormData(prev => ({
        ...prev,
        // nextType 은 이 스코프에 없음. 필요하다면 prev.type 또는 "면담신청" 고정.
        // type: prev.type,
        itvRecordTtl: prev.title,      // 제목
        itvRecordCn: prev.content,       // 내용
        itvPicAuthrt: (prev.scope === "강사" ? "INSTRUCTOR" : (prev.scope === "직원" ? "EMPLOYEE" : "REPRESENTATIVE")),    // 공개범위
      }));
    }
    
    if (formData.type === "면담기록") {
      setFormData(prev => ({
        ...prev,
        // type: prev.type,
        itvRecordTtl: prev.title,      // 제목
        itvRecordCn: prev.content,       // 내용
        itvPicAuthrt: (prev.scope === "강사" ? "INSTRUCTOR" : (prev.scope === "직원" ? "EMPLOYEE" : "REPRESENTATIVE")),    // 공개범위
        itvPicSn: prev.userSn, //담당자
        itvTrprSn: prev.itvTrprNmSn, //신청자
        date: prev.startDate,
        time: prev.startTime,
        coSn: effectiveSn,
        itvSn: null,
        cohortSn: recordCohortSn
      }));
    }


    // 2) 게시글 JSON (File 객체 넣지 말기!)
    const postJson = {
      ...formData
  };


  try {
    const req = editItvRecord(itvRecordSn, postJson)

    alert("저장 완료!");
    navigate(-1);
  } catch (err) {
    console.error(err);
    toast.error(err.message);
    alert("저장 실패");
    // 옵션) 실패 시 formUuid로 업로드 롤백 API가 있으면 호출
  }
};


  return (
  <>
    <div className="boardPage">
      <h2>게시물 관리</h2>
            <div className="limitedHeightBox" style={{height: "706px"}}>
        <h4 style={{ fontWeight: "500" }}>
          <div boxType="row">
          {`[ 면담기록 ] ${formData?.itvRecordTtl}`}
          <span style={{border: "none", display: "flex", alignItems: "flex-end", height:"100%", gap: "4px", margin: "0 0 14px 4px"}}>
                    { editToggle && formData?.itvPicNm === user.USER_NM ?
                      <button type='button' onClick={() => setEditToggle(false)} className={styles2.grayBtn} style={{width:"3rem", fontSize:"1rem"}} >edit</button>
                      :
                      <></>
                    }
                    {pathname === "/adminHome/boardSet" || formData?.itvPicNm === user.USER_NM || userAuth === 1?
                    <button type='button'
                    className={styles2.redBtn}
                    onClick={async () => {
                      const ok = window.confirm("정말 삭제하시겠습니까?");
                      if (!ok) return; // 취소하면 아무것도 안 함
                      
                      try {
                        await deleteItvRecord(itvRecordSn);
                        toast.success("삭제되었습니다.", {
                          onClose: () => navigate(-1) 
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
            <button type='button' onClick={() => navigate(-1)} className={styles2.grayBtn}>back</button>
            :
            <SaveBtn type='button' onClick={(e) => {setEditToggle(true); saveSubmit(e)}} style={{color: "#fff", marginTop: "4px"}} textType={"저장"}></SaveBtn>
          }
        </h4>
      <div className="formAreaRow">
      <form className="formAreaRow" onSubmit={(e) => e.preventDefault()}>
      <div className="formArea_L">
  <div className='formHeader'>
      {!editToggle ? 
    <div className='inputSet inputTitleSet'>
      <label className='formLabel' htmlFor={`${domFormId}_itvRecordTtl`}>제목</label>
        <input
          id={`${domFormId}_itvRecordTtl`}
          className='formInput'
          name='itvRecordTtl'
          placeholder='제목을 입력하세요.'
          value={formData.itvRecordTtl}
          onChange={handleChange}
          />
      </div>
      : null}
    </div>
    <div className='inputSet inputFlex1'>
      <DateTimeInput type="date" labelNm="면담일" handleChange={handleChange} name="date" formData={formData} addLabelStyle="formLabel" disabled={editToggle}></DateTimeInput>
      <DateTimeInput type="time" labelNm="시간" handleChange={handleChange} name="time" formData={formData} addLabelStyle="formLabel" disabled={editToggle}></DateTimeInput>
    </div>
    <div className="formContent">
          <textarea
              id={`${domFormId}_itvRecordCn`}
              name="itvRecordCn"
              className='formTextarea'
              placeholder='본문을 입력하세요.'
              value={formData.itvRecordCn}
              disabled = {editToggle}
              onChange={handleChange}>
          </textarea>
          <div className='inputSet'>
        </div>
        <div className='inputSet'>
        </div>
        <div className='inputSet'>
            <label className='formLabel' htmlFor={`${domFormId}_file`}>파일</label>
            <FileList files={files} setFiles={setFiles} ></FileList>
        </div>
    </div>
                </div>
                </form>
                </div>
            </div>
            </div>
  </>
  );
}