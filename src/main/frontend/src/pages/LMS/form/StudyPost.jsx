import React, { useEffect, useId, useState, useRef } from 'react'
import Dropdown from '../../../components/ui/Dropdown'
import layoutStyles from "../../../styles/layout.module.css"
import {FileUpload, FileList, FormInput } from '../../../components/ui/UiComp';
import { useAccount } from '../../../auth/AuthContext';
import { ArticlePost } from './ArticlePost';
import { hortlistByCpSn } from "../../../services/cohortService";
import {v4 as uuidv4} from "uuid";
import { createPost } from '../../../services/postService';

import SurveyPost from './SurveyPost';
import { DateTimeInput } from '../../../components/ui/UiComp';
import InterviewPost from './InterviewPost';
import Applier from '../../../components/ui/Applier';


// StudyPost.jsx

function StudyPost() {
  const domFormId = useId();
  const postId = useRef(uuidv4());
  const { user } = useAccount();
  const coSn = user.USER_OGDP_CO_SN;
  const userAuth = user.USER_AUTHRT_SN;
  const qAddRef = useRef(null);
  const scrollRef = useRef(null);
  // const [loading, setLoading] = useState(false);

  const [hortlist, setHortList] = useState([]);
  const [files, setFiles] = useState([]);

  // 일반 게시글
  const [formData, setFormData] = useState({
    id: postId.current,
    userSn: user.USER_SN,
    title: "",
    content: "",
    type: "",
    scope: "",
    detailScope: "",
    detailScopeNm: "",
    surveyStart: "",     // 설문조사
    surveyEnd: "",   // 설문조사
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const tempSubmit = () => {};
  const saveSubmit = async (e) => {
    e.preventDefault();

  // const payload = structuredClone
  //   ? structuredClone({ surveyForm, formData })
  //   : JSON.parse(JSON.stringify({ surveyForm, formData }));

  const snapshot = structuredClone
    ? structuredClone({ formData })
    : JSON.parse(JSON.stringify({ formData }));

  const body = { ...snapshot.formData };

  // console.groupCollapsed("[RecruitPost] createGroup payload");
  // console.table(
  //   payload.surveyForm?.pages?.[0]?.questions?.map((q, i) => ({
  //     idx: i + 1, qid: q.qid, type: q.type,
  //     title: q.title || "(제목 없음)", options: q.options?.length ?? 0,
  //   })) || []
  // );
  // console.groupEnd();

  // console.log("[payload snapshot]", snapshot);
  // console.log("[formData]", snapshot.formData);
  // console.log("[surveyForm]", snapshot.surveyForm);
  console.log("[will send to server]", JSON.stringify(body, null, 2));
  console.table(snapshot.formData);

  console.time("[RecruitPost] createGroup");
  try {
    // const res = await createGroup(payload);
    const res = await createPost(body);
    console.log(Object.keys(snapshot)); 
    console.log(Object.keys(snapshot.formData));
    console.log("[RecruitPost] createGroup response:", res);
  } catch (err) {
    console.error("[RecruitPost] createGroup error:", err);
  }
};

  useEffect(() => {
    (async () => {
      try {
        const data = await hortlistByCpSn(coSn);
        setHortList(data.data);
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, [coSn]);

  return (
    <div className="boardPage">
      <h2>수강생 관리</h2>
      <div className="limitedHeightBox" style={{height: "706px"}}>
        <h4 style={{ fontWeight: "500" }}>{formData.type} 등록하기</h4>

        <form className="formAreaRow" onSubmit={(e) => e.preventDefault()}>
          <div className="formArea_L">
            <InterviewForm
                type={formData.type}
                postId={postId.current}
                domFormId={domFormId}
                handleChange={handleChange}
                formData={formData}
                FileList={FileList}
                files={files}
                setFiles={setFiles}
                containerRef={scrollRef}
                questionAddRef={qAddRef}
                user={user}
            />
          </div>

          <div className="formArea_R">
            <div className="selectBoxArea" style={{ position: "relative" }}>
              <div className="dropSet" style={{ zIndex: "8" }}>
                <p>유형</p>
                <Dropdown className="dropset_dd" label={formData.type || "---- 필수 선택 ----"}>
                  {(userAuth === 2 || userAuth === 3) ?
                      <>
                        <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "면담신청" }))}>면담신청</p>
                        <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "자료실" }))}>자료실</p>
                        <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "설문조사" }))}>설문조사</p>
                        <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "FAQ" }))}>FAQ</p>
                        <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "일정" }))}>일정</p>
                        <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "면담기록" }))}>면담기록</p>
                      </>
                  : ""}
                  {(userAuth === 4 || userAuth === 5) ? (
                    <>
                      <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "일정" }))}>일정</p>
                      <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "학습일지" }))}>학습일지</p>
                      <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "면담신청" }))}>면담신청</p>
                      {userAuth === 4 ?
                      <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "면담기록" }))}>면담기록</p>
                      : null
                      }
                    </>
                  ) : ""}
                </Dropdown>
                <input type="hidden" name="type" value={formData.type} />
              </div>
              {formData.type === "면담신청" ? 
              <div className="dropSet" style={{ zIndex: "2" }}>
                <p>공개 범위</p>
                <Dropdown className="dropset_dd" label={formData.scope || "---- 필수 선택 ----"}>
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "관리자" }))}>관리자</p>
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "비공개" }))}>비공개</p>
                </Dropdown>
                <input type="hidden" name="scope" value={formData.scope} />
              </div> 
              :
              null}

              {formData.scope === "관리자" && (
                <div className="dropSet" style={{ zIndex: "1" }}>
                  <p>하위 그룹</p>
                  <Dropdown className="dropset_dd" label={formData.detailScopeNm || "---- 필수 선택 ----"}>
                    {hortlist.map((h, idx) => ( //hortList대신 관리자 list
                      <p
                        className={layoutStyles.subMenuList}
                        key={idx}
                        onClick={() => {
                          setFormData(s => ({ ...s, detailScope: h.cohortSn, detailScopeNm: String(h.cohortNm) }));

                        }}
                      >
                        {h.cohortNm //관리자 이름 표시 
                        }
                      </p>
                    ))}
                  </Dropdown>
                  <input type="hidden" name="detailScope" value={formData.detailScope} />
                </div>
              )}
            </div>

            <div className="r_bottom">
              <FileUpload files={files} setFiles={setFiles} />
              <div className="save_box">
                <button className="basicBtn saveBtn" type="button" onClick={saveSubmit}>저장</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudyPost;


export function InterviewForm({
  domFormId, handleChange, formData, files, formId, setFiles,
}) {
  // pages[0]이 항상 존재하도록 보장(상위 CreatePost에서 초기화함)
  // const firstPage = surveyForm.pages[0];
  const qContainerRef = useRef(null);

  return (
    <>
      <div className='formHeader'>
        <div className='inputSet'>
          <label className='formLabel' htmlFor={`${domFormId}_title`}>제목</label>
          <input
            id={`${domFormId}_title`}
            className='formInput'
            name='title'
            placeholder='제목을 입력하세요.'
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className='inputSet inputFlex1'>
          <FormInput type="text" labelNm="신청자" handleChange={handleChange} name="author" formData={formData} addLabelStyle="formLabel" addStyle="limitedInput" disabled={true}></FormInput>
          <FormInput type="text" labelNm="담당자" handleChange={handleChange} name="mento" formData={formData} addLabelStyle="formLabel" addStyle="limitedInput" disabled={true}></FormInput>
        </div>
      </div>

      <div className="formContent" ref={qContainerRef}>
            <textarea                 
                id={`${formId}_content`}
                name="content"
                className='formTextarea'
                placeholder='본문을 입력하세요.'
                value={formData.content}
                onChange={handleChange}>
            </textarea>
          <div className='inputSet'>
            <div className='inputSet inputFlex1'>
              <DateTimeInput type="date" addLabelStyle="formLabel" labelNm="면담일" handleChange={handleChange} name="strDate" formData={formData} disabled={true}></DateTimeInput>
              <DateTimeInput type="time" addLabelStyle="formLabel" labelNm="시간" handleChange={handleChange} name="promTime" formData={formData} disabled={true} ></DateTimeInput>
              <FormInput type="text" addLabelStyle="formLabel" labelNm="장소" handleChange={handleChange} name="promPlace" formData={formData} disabled={true}></FormInput>
              <FormInput type="text" addLabelStyle="formLabel" labelNm="요청사항" handleChange={handleChange} name="comment" formData={formData} disabled={true} ></FormInput>
              
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

export function InterviewMemo({
     domFormId, handleChange, formData, files, formId, setFiles, qContainerRef, setCohortSn
  }) {

    const {user} = useAccount();

  return (
      <>
        <div className='formHeader'>
          <div className='inputSet inputTitleSet'>
            <label className='formLabel' htmlFor={`${domFormId}_title`}>제목</label>
            <input
                id={`${domFormId}_title`}
                className='formInput'
                name='title'
                placeholder='제목을 입력하세요.'
                value={formData.title}
                onChange={handleChange}
            />
          </div>

          <div className='inputSet inputFlex1'>
            <label className='formLabel' htmlFor={`${domFormId}_applier`} style={{width: "100%"}}>신청자</label>
            <Applier handleChange={handleChange} setCohortSn={setCohortSn} />
          </div>
          <div className='inputSet inputFlex1'>
              <label className='formLabel' htmlFor={`${domFormId}_mento`}>담당자</label>
              <p>{user.USER_NM}</p>
            </div>
        </div>

        <div className="formContent" ref={qContainerRef}>
          <textarea
              id={`${formId}_content`}
              name="content"
              className='formTextarea'
              placeholder='본문을 입력하세요.'
              value={formData.content}
              onChange={handleChange}>
          </textarea>
          <div className='inputSet'>
          </div>
          <div className='inputSet'>
            <div className='inputSet inputFlex1'>
              <DateTimeInput type="date" labelNm="면담일" handleChange={handleChange} name="startDate" formData={formData} addLabelStyle="formLabel" ></DateTimeInput>
              <DateTimeInput type="time" labelNm="시간" handleChange={handleChange} name="startTime" formData={formData} addLabelStyle="formLabel" ></DateTimeInput>
              {/* <FormInput type="text" labelNm="장소" handleChange={handleChange} name="surveyStart" formData={formData} addLabelStyle="formLabel" disabled={true}></FormInput> */}
              {/* <FormInput type="text" labelNm="요청사항" handleChange={handleChange} name="surveyEnd" formData={formData} addLabelStyle="formLabel" disabled={true}></FormInput> */}

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