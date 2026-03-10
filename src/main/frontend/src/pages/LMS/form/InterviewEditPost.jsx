import React, { useId, useState, useRef, useEffect } from 'react'
import styles from "../../../styles/UiComp.module.css"
import { FileList, FormInput } from '../../../components/ui/UiComp';
import { useAccount } from '../../../auth/AuthContext';
import {v4 as uuidv4} from "uuid";
import { readInterview, editInterview } from '../../../services/postService';

import { DateTimeInput } from '../../../components/ui/UiComp';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelectedCompany } from '../../../contexts/SelectedCompanyContext';
import { normalizeInterviewPayload } from "../../../utils/normalizeDto";

// 예: 상세 조회 직후



// InterviewPost.jsx

function InterviewEditPost() {
  const domFormId = useId();
  const postId = useRef(uuidv4());
  const { user } = useAccount();
  const {itvSn} = useParams();
  const userAuth = user.USER_AUTHRT_SN;
  const myName = user.USER_NM;
  const navigate = useNavigate();
  const [editToggle, setEdit] = useState(true);
  const [postType, setPostType] = useState("면담신청");
  const {effectiveSn} = useSelectedCompany();
  const [files, setFiles] = useState([]);
  
  // 일반 게시글
  const [formData, setFormData] = useState({
    __note: "id: 게시글uuid, userSn: 작성자 유저SN, itvAplyTtl: 제목, itvAplyCn: textarea 내용, type: 면담신청 or 면담요청 or 면담기록, itvPicAuthrt: 공개범위, itvDay: 면담확정일, itvTime: 면담예정시간, itvAplcntNm: 작성자 유저이름, mento: 담당자, itvPicAns: 수신측 기타요청메모",
    formUuid: postId.current,
    userSn: user.USER_SN,
    itvAplyTtl: "",
    itvAplyCn: "", //내용
    type: "",
    itvPicAuthrt: "", //공개범위
    itvDay: "",     // 면담확정일
    itvTime: "", //면담예정시간
    itvAplcntNm: "", // 작성자
    mento: "", // 담당자
    place: "", //장소
    itvPicAns: "", //기타 요청(수신측)
    files: files
  });
  
  const editMyData = (myName === formData.itvAplcntNm ? false : true);
  const fixedInterviewData = (userAuth <= 4 ? false : true);
  
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
              const { data } = await readInterview(itvSn, effectiveSn);
              setFormData(prev => ({ ...prev, ...normalizeInterviewPayload(data) }));
              console.log(data);
              if (mounted) setFormData(prev => ({...prev, data
                

        }));
      } catch (err) {
        toast.error(err.message);
      }
    })();
  
    return () => { mounted = false; };
  }, [itvSn, effectiveSn]);

  const handleChange = (e) => {

    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const tempSubmit = () => {};
  const saveSubmit = async (e) => {
    e.preventDefault();

  const snapshot = structuredClone
    ? structuredClone({ formData })
    : JSON.parse(JSON.stringify({ formData }));

    const body = { ...snapshot.formData };
    console.log("[will send to server]", JSON.stringify(body, null, 2));
    console.table(snapshot.formData);
    console.time("[RecruitPost] createGroup");

   try {
    const res = await editInterview(itvSn, body);
    toast.success("면담을 확정했습니다.")
    console.log(Object.keys(snapshot)); 
    console.log(Object.keys(snapshot.formData));
    console.log("[RecruitPost] createGroup response:", res);
    navigate(-1);
  } catch (err) {
    toast.error(err.message);
    console.error("[RecruitPost] createGroup error:", err);
  }
};


  return (
    <div className="BigListBox">
        <h4 style={{ fontWeight: "500", display:"flex", alignItems:"center"}}>
          <div style={{display:"flex", gap:"4px", alignItems:"baseline"}}>
            {!editMyData ? "면담 신청" : "면담 요청"}
            {editToggle ? 
            <button type='button'  className={styles.grayBtn} style={{width:"3rem", fontSize:"1rem"}} onClick={() => setEdit(false)}>edit</button>
            :
            null
            }
          </div>       
          {editToggle ? 
          <button type='button' className={styles.grayBtn} onClick={()=>{navigate(-1); setEdit(true)}}>돌아가기</button>
          :
          <div style={{display:"flex", gap:"4px"}}>
          <button type='button' className={styles.grayBtn} onClick={(e)=>{setEdit(true)}}>취소</button>
          <button type='button' className={styles.grayBtn} onClick={(e)=>{saveSubmit(e); navigate(-1); setEdit(true)}}>저장</button>
          </div>
          }
        </h4>
      
      <InterviewEditForm
        type={formData.type}
        postId={postId.current}
        domFormId={domFormId}
        handleChange={handleChange}
        formData={formData}
        FileList={FileList}
        files={files}
        setFiles={setFiles}
        editMyData={editMyData}
        fixedInterviewData={fixedInterviewData}
        editToggle={editToggle}
      />
    </div>
          
  );
}

export default InterviewEditPost;


function InterviewEditForm({
  domFormId, handleChange, formData, files, formId, setFiles, editMyData, fixedInterviewData, editToggle
}) {

  return (
    <>
      <div className='formHeader'>
        <div className='inputSet inputTitleSet'>
          <label className='formLabel' htmlFor={`${domFormId}_itvAplyTtl`}>제목</label>
          <input
            id={`${domFormId}_itvAplyTtl`}
            className='formInput'
            name='itvAplyTtl'
            placeholder='제목을 입력하세요.'
            value={formData.itvAplyTtl}
            onChange={handleChange}
            disabled={ editToggle || editMyData}
          />
        </div>

        <div className='inputSetMini inputFlex1'>
          <FormInput type="text" labelNm="작성자" handleChange={handleChange} name="itvAplcntNm" formData={formData} addLabelStyle="formLabel"  disabled={ editToggle || true}></FormInput>
          <FormInput type="text" labelNm="담당자" handleChange={handleChange} name="mento" formData={formData} addLabelStyle="formLabel"  disabled={ editToggle || fixedInterviewData}></FormInput>
        </div>
      </div>

      <div className="formContent">
            <textarea                 
                id={`${formId}_itvAplyCn`}
                name="itvAplyCn"
                className='formTextarea'
                placeholder='본문을 입력하세요.'
                value={formData.itvAplyCn}
                onChange={handleChange}
                disabled={ editToggle || editMyData}
            >
            </textarea>
            <div className='inputSet'>
          </div>
          <div className='inputSet'>
            <div className='inputSet inputFlex1'>
              <DateTimeInput type="date" labelNm="면담일" handleChange={handleChange} name="itvDay" formData={formData} addLabelStyle="formLabel" disabled={ editToggle || fixedInterviewData}></DateTimeInput>
              <DateTimeInput type="time" labelNm="시간" handleChange={handleChange} name="itvTime" formData={formData} addLabelStyle="formLabel" disabled={ editToggle || fixedInterviewData}></DateTimeInput>
              <FormInput type="text" labelNm="장소" handleChange={handleChange} name="itvPlc" formData={formData} addLabelStyle="formLabel" disabled={ editToggle || fixedInterviewData}></FormInput>
              <FormInput type="text" labelNm="요청사항" handleChange={handleChange} name="itvPicAns" formData={formData} addLabelStyle="formLabel" disabled={ editToggle || fixedInterviewData}></FormInput>
              
            </div>
          </div>
          <div className='inputSet'>
              <label className='formLabel' htmlFor={`${formId}_file`}>파일</label>
              <FileList files={files} setFiles={setFiles} noShow={editToggle || fixedInterviewData}></FileList>
          </div>
      </div>
      </>
  );
}