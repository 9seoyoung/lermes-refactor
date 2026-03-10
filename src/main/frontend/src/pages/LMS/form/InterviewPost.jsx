import React, { useEffect, useId, useState, useRef } from 'react'
import Dropdown from '../../../components/ui/Dropdown'
import layoutStyles from "../../../styles/layout.module.css"
import {FileUpload, FileList, FormInput } from '../../../components/ui/UiComp';
import { useAccount } from '../../../auth/AuthContext';
import {v4 as uuidv4} from "uuid";
import { createInterview, createInterviewMemo } from '../../../services/postService';

import { DateTimeInput } from '../../../components/ui/UiComp';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


// InterviewPost.jsx

function InterviewPost() {
  const domFormId = useId();
  const postId = useRef(uuidv4());
  const { user } = useAccount();
  const userAuth = user.USER_AUTHRT_SN;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [postType, setPostType] = useState("면담신청");

  const [files, setFiles] = useState([]);

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
    files: files
  });

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
      <div className="limitedHeightBox" style={{height: "702px"}}>
        <h4 style={{ fontWeight: "500" }}>{formData.type} 등록하기</h4>

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
              />
            }
          </div>

          <div className="formArea_R">
            <div className="selectBoxArea" style={{ position: "relative" }}>
              <div className="dropSet" style={{ zIndex: "8" }}>
                <p>유형</p>
                <Dropdown className="dropset_dd" label={formData.type|| "---- 필수 선택 ----"}>
                  {(userAuth === 4 || userAuth === 1) ? (
                    <>
                      <p className={layoutStyles.subMenuList} onClick={() => {
                                                                              changeType("면담신청");
                                                                              }}>면담신청</p>
                      <p className={layoutStyles.subMenuList} onClick={() => {
                                                                                changeType("면담기록");
                                                                              }}>면담기록</p>
                    </>
                  ) : null}
                  {(userAuth === 5 || userAuth === 1) ? (
                    <>
                      <p className={layoutStyles.subMenuList} onClick={() => {
                                                                              changeType("면담신청");
                                                                              }}>면담신청</p>
                    </>
                  ): null }
                </Dropdown>
                <input type="hidden" name="type" value={postType} />
              </div>
              {formData.type === "면담신청" ?
              <div className="dropSet" style={{ zIndex: "2" }}>
                <p>공개 범위</p>
                <Dropdown className="dropset_dd" label={formData.scope || "---- 필수 선택 ----"}>
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "REPRESENTATIVE" }))}>대표</p>
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "EMPLOYEE" }))}>직원</p>
                  {(userAuth === 5 || userAuth === 1) ? (
                    <>
                      <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "강사" }))}>강사</p>
                    </>
                  ) : null}
                </Dropdown>
                <input type="hidden" name="scope" value={formData.scope} />
              </div>
              :
              null}
            </div>

            <div className="r_bottom">
              <FileUpload files={files} setFiles={setFiles} />
              <div className="save_box">
                <button className="basicBtn tempBtn" type="button" onClick={tempSubmit}>임시 저장</button>
                <button className="basicBtn saveBtn" type="button" onClick={(e) => {
                                                                                    saveSubmit(e);
                                                                                  }}>{loading ? "저장 중..." : "저장"}</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InterviewPost;


function InterviewForm({
  domFormId, handleChange, formData, files, formId, setFiles,
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
          <FormInput type="text" labelNm="작성자" handleChange={handleChange} name="author" formData={formData} addLabelStyle="formLabel" addStyle="limitedInput" disabled={true}></FormInput>
          <FormInput type="text" labelNm="담당자" handleChange={handleChange} name="mento" formData={formData} addLabelStyle="formLabel" addStyle="limitedInput" disabled={true}></FormInput>
        </div>
      </div>

      <div className="formContent">
            <textarea
                id={`${formId}_itvAplyCn`}
                name="itvAplyCn"
                className='formTextarea'
                placeholder='본문을 입력하세요.'
                value={formData.itvAplyCn}
                onChange={handleChange}>
            </textarea>
            <div className='inputSet'>
          </div>
          <div className='inputSet'>
            <div className='inputSet inputFlex1'>
              <DateTimeInput type="date" labelNm="면담일" handleChange={handleChange} name="strDate" formData={formData} addLabelStyle="formLabel" disabled={true}></DateTimeInput>
              <DateTimeInput type="time" labelNm="시간" handleChange={handleChange} name="promTime" formData={formData} addLabelStyle="formLabel" disabled={true}></DateTimeInput>
              <FormInput type="text" labelNm="장소" handleChange={handleChange} name="promPlace" formData={formData} addLabelStyle="formLabel" disabled={true}></FormInput>
              <FormInput type="text" labelNm="요청사항" handleChange={handleChange} name="surveyEnd" formData={formData} addLabelStyle="formLabel" disabled={true}></FormInput>

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
  domFormId, handleChange, formData, files, formId, setFiles,
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
          required
        />
      </div>

      <div className='inputSet inputFlex1'>
        <FormInput type="text" labelNm="작성자" handleChange={handleChange} name="author" formData={formData} addLabelStyle="formLabel" addStyle="limitedInput" disabled={true}></FormInput>
        <FormInput type="text" labelNm="담당자" handleChange={handleChange} name="mento" formData={formData} addLabelStyle="formLabel" addStyle="limitedInput" disabled={true}></FormInput>
      </div>
    </div>

    <div className="formContent">
          <textarea
              id={`${formId}_itvAplyCn`}
              name="itvAplyCn"
              className='formTextarea'
              placeholder='본문을 입력하세요.'
              value={formData.itvAplyCn}
              onChange={handleChange}>
          </textarea>
          <div className='inputSet'>
        </div>
        <div className='inputSet'>
          <div className='inputSet inputFlex1'>
            <DateTimeInput type="date" labelNm="면담일" handleChange={handleChange} name="surveyStart" formData={formData} addLabelStyle="formLabel" disabled={true}></DateTimeInput>
            <DateTimeInput type="time" labelNm="시간" handleChange={handleChange} name="surveyEnd" formData={formData} addLabelStyle="formLabel" disabled={true}></DateTimeInput>

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