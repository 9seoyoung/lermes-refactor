import React, { useEffect, useId, useState, useRef } from 'react'
import Dropdown from '../../../components/ui/Dropdown'
import layoutStyles from "../../../styles/layout.module.css"
import {FileUpload, FileList, FormInput } from '../../../components/ui/UiComp';
import { useAccount } from '../../../auth/AuthContext';
import {v4 as uuidv4} from "uuid";
import { createInterview, createInterviewMemo, readInterview } from '../../../services/postService';

import { DateTimeInput } from '../../../components/ui/UiComp';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Trash2Icon } from 'lucide-react';
import { deleteSchedule } from '../../../services/calService';
import styles2 from "../../../styles/SchedListPopUp.module.css";


// Interview.jsx

function InterviewRead() {
  const domFormId = useId();
  const postId = useRef(uuidv4());
  const { user } = useAccount();
  const {postSn} = useParams();
  const userAuth = user.USER_AUTHRT_SN;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [postType, setPostType] = useState("면담신청");
  const [editToggle, setEditToggle] = useState(false);
  const [files, setFiles] = useState([]);
  const {pathname} = useLocation();

  // 일반 게시글
  const [formData, setFormData] = useState({
    __note: "id: 게시글uuid, userSn: 작성자 유저SN, itvAplyTtl: 제목, itvAplyCn: textarea 내용, type: 면담신청 or 면담요청 or 면담기록, itvPicAuthrt: 공개범위, interviewDate: 면담확정일, interviewTime: 면담예정시간, author: 작성자 유저이름, mento: 담당자, comment: 수신측 기타요청메모",
    formUuid: postId.current,
    userSn: user.USER_SN,
    itvAplyTtl: "",
    itvAplyCn: "", //내용
    type: postType,
    itvPicAuthrt: "", //공개범위
    interviewDate: "",     // 면담확정일
    interviewTime: "", //면담예정시간
    author: user?.USER_NM, // 작성자
    mento: "-", // 담당자
    place: "", //장소
    comment: "", //기타 요청(수신측)
    files: files,
    viewCnt: 0,
    itvSn: 0
  });

  useEffect(()=>{
    (async () => {
      try {
        const {data}  = await readInterview(postSn);
        toast.success("불러오기 성공");
        setFormData((prev)=> ({...prev, itvAplyCn: data.itvAplyCn, itvAplyTtl: data.itvAplyTtl, itvPicAutht: data.itvPicAutht ,itvAplcntNm: data.itvAplcntNm, itvSn: data.itvSn, viewCnt: data.viewCnt}))
      } catch(err) {
        toast.error(err);
      }
    })();
  }, [])

  const changeType = (nextType) => {
    setPostType(nextType);                  // 라벨에만 쓰고 싶으면 유지, 아니면 없애도 됨
    setFormData(prev => ({
      ...prev,
      type: nextType,
      itvAplyTtl: "",//제목
      itvAplyCn: "",//내용
      itvPicAuthrt: "",  //공개범위
      interviewDate: "",//면담확정일
      interviewTime: "",//면담예정시간
      mento: "-", // 담당자
      place: "",//장소
      comment: "",//기타내용
    }));
    setFiles([]); // 파일도 초기화하려면 같이
  };


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
    const res = await createInterview(body);
    toast.success("신청등록 되었습니다.")
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
    <div className="boardPage">
      <h2>학습 일정</h2>
      <div className="limitedHeightBox" style={{height: "706px"}}>
        <h4 style={{ fontWeight: "500" }}>
          <div boxType="row">
          { formData?.itvPicAutht === userAuth ? "면담 요청 내역" : `[면담 신청] ${formData?.itvAplyTtl} `}
          <p style={{fontSize: "1.2rem"}}>{`담당자: ${formData?.mento === '-' ? "미정": formData?.mento}`}</p>
          <span style={{border: "none", display: "flex", alignItems: "flex-end", height:"100%", gap: "4px", margin: "0 0 14px 4px"}}>
            { !editToggle && (formData?.postWriterName === user.USER_NM || formData.itvPicAutht === 4) ?
              <button type='button' onClick={() => setEditToggle(true)} className={styles2.grayBtn} style={{width:"3rem", fontSize:"1rem"}} >edit</button>
              :
              <></>
            }
          </span>

          </div>
          <button type='button' onClick={() => navigate(-1)}>back</button>
          </h4>
        <form className="formAreaRow" onSubmit={(e) => e.preventDefault()}>
          <div className="formArea_L">
            {formData?.type === "면담신청" ?
              <InterviewForm
                  type={formData.type}
                  postId={postId.current}
                  domFormId={domFormId}
                  handleChange={handleChange}
                  formData={formData}
                  FileList={FileList}
                  files={files}
                  setFiles={setFiles}
                  editToggle={editToggle}
                  userAuth={userAuth}
              />
              :
              <InterviewMemo
                  type={formData.type}
                  postId={postId.current}
                  domFormId={domFormId}
                  handleChange={handleChange}
                  formData={formData}
                  FileList={FileList}
                  files={files}
                  setFiles={setFiles}
                  userAuth={userAuth}
              />
            }
          </div>

          
        </form>
      </div>
    </div>
  );
}

export default InterviewRead;


function InterviewForm({
  domFormId, handleChange, formData, files, formId, setFiles, editToggle, userAuth
}) {

  return (
    <>
      <div className='formHeader'>
        {/* <div className='inputSet inputTitleSet'>
          <label className='formLabel' htmlFor={`${domFormId}_itvAplyTtl`}>제목</label>
          <input
            id={`${domFormId}_itvAplyTtl`}
            className='formInput'
            name='itvAplyTtl'
            placeholder='제목을 입력하세요.'
            value={formData.itvAplyTtl}
            onChange={handleChange}
            disabled = {editToggle}
          />
        </div> */}
        {/* <div className='inputSet inputFlex1'>
          <FormInput type="text" labelNm="작성자" handleChange={handleChange} name="author" formData={formData} addLabelStyle="formLabel" disabled={true}></FormInput>
          <FormInput type="text" labelNm="담당자" handleChange={handleChange} name="mento" formData={formData} addLabelStyle="formLabel"  disabled={true}></FormInput>
        </div> */}
      </div>

      <div className="formContent">
            <textarea                 
                id={`${formId}_itvAplyCn`}
                name="itvAplyCn"
                className='formTextarea'
                placeholder='본문을 입력하세요.'
                value={formData.itvAplyCn}
                onChange={handleChange}
                disabled={true}>
            </textarea>
            <div className='inputSet'>
          </div>
          <div className='inputSet'>
            <div className='inputSet inputFlex1'>
              <DateTimeInput type="date" labelNm="면담일" handleChange={handleChange} name="surveyStart" formData={formData} addLabelStyle="formLabel" disabled={!editToggle}></DateTimeInput>
              <DateTimeInput type="time" labelNm="시간" handleChange={handleChange} name="surveyEnd" formData={formData} addLabelStyle="formLabel" disabled={!editToggle}></DateTimeInput>
              <FormInput type="text" labelNm="장소" handleChange={handleChange} name="surveyStart" formData={formData} addLabelStyle="formLabel" disabled={!editToggle}></FormInput>
              <FormInput type="text" labelNm="요청사항" handleChange={handleChange} name="surveyEnd" formData={formData} addLabelStyle="formLabel" disabled={!editToggle}></FormInput>
            </div>
          </div>
          <div className='inputSet'>
              <label className='formLabel' htmlFor={`${formId}_file`}>파일</label>
              <FileList files={files} setFiles={setFiles}></FileList>
          </div>
      </div>
      </>
  );
}

function InterviewMemo({
  domFormId, handleChange, formData, files, formId, setFiles,editToggle, userAuth
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
        />
      </div>

      <div className='inputSet inputFlex1'>
        <FormInput type="text" labelNm="작성자" handleChange={handleChange} name="author" formData={formData} addLabelStyle="formLabel" addStyle="limitedInput" disabled={(formData?.itvPicAutht === userAuth ? editToggle : false )}></FormInput>
        <FormInput type="text" labelNm="담당자" handleChange={handleChange} name="mento" formData={formData} addLabelStyle="formLabel" addStyle="limitedInput" disabled={(formData?.itvPicAutht === userAuth ? editToggle : false )}></FormInput>
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
              disabled= {editToggle}>
          </textarea>
          <div className='inputSet'>
        </div>
        <div className='inputSet'>
          <div className='inputSet inputFlex1'>
            <DateTimeInput type="date" labelNm="면담일" handleChange={handleChange} name="surveyStart" formData={formData} addLabelStyle="formLabel" disabled={(formData?.itvPicAutht === userAuth ? editToggle : false )}></DateTimeInput>
            <DateTimeInput type="time" labelNm="시간" handleChange={handleChange} name="surveyEnd" formData={formData} addLabelStyle="formLabel" disabled={(formData?.itvPicAutht === userAuth ? editToggle : false )}></DateTimeInput>
            <FormInput type="text" labelNm="장소" handleChange={handleChange} name="surveyStart" formData={formData} addLabelStyle="formLabel" disabled={(formData?.itvPicAutht === userAuth ? editToggle : false )}></FormInput>
            <FormInput type="text" labelNm="요청사항" handleChange={handleChange} name="surveyEnd" formData={formData} addLabelStyle="formLabel" disabled={(formData?.itvPicAutht === userAuth ? editToggle : false )}></FormInput>
          </div>
        </div>
        <div className='inputSet'>
            <label className='formLabel' htmlFor={`${formId}_file`}>파일</label>
            <FileList files={files} setFiles={setFiles}></FileList>
        </div>
    </div>
  </>
  );
}