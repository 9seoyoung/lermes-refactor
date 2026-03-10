import React, { useEffect, useId, useState, useRef } from 'react'
import Dropdown from '../../../components/ui/Dropdown'
import layoutStyles from "../../../styles/layout.module.css"
import {FileUpload, FileList, GrayBtn, BackBtn, DateTimeInput, FormInput} from '../../../components/ui/UiComp';
import { useAccount } from '../../../auth/AuthContext';
import { ArticlePost } from './ArticlePost';
import { hortlistByCpSn } from "../../../services/cohortService";
import SurveyPost from './SurveyPost';
import {v4 as uuidv4} from "uuid";
import { createSurvey, createPost, createInterview, createInterviewMemo, createInterviewRecord } from '../../../services/postService';
import { uploadFiles } from '../../../services/fileService';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelectedCompany } from '../../../contexts/SelectedCompanyContext';
import {InterviewForm, InterviewMemo} from './StudyPost';
import { SchedPost } from './SchedPost';
import {registToDo} from "../../../services/calService";
import {
  buildPostJson,
  buildInterviewJson,
  buildScheduleJson,
} from "../../../utils/normalizeDto";


// BoardPost.jsx
// ...import 생략

function PostStatus(props) {
  const { type,userAuth ,postId, domFormId, commentToggle, setCommentToggle, handleChange, formData, setFormData, FileList, files, setFiles, surveyForm, setSurveyForm, containerRef, questionAddRef, prvToggle, setPrvToggle, setCohortSn } = props;
  switch (type) {
    case "공지사항":
    case "자료실":
      case "FAQ":
      case "학습일지":
      return (
          <ArticlePost
              postId={postId.current}
              domFormId={domFormId}
              handleChange={handleChange}
              formData={formData}
              FileList={FileList}
              files={files}
              setFiles={setFiles}
              commentToggle={commentToggle}
              setCommentToggle={setCommentToggle}
          />
      );
    case "설문조사":
      return (
          <SurveyPost
              postId={postId.current}
              domFormId={domFormId}
              handleChange={handleChange}
              formData={formData}
              surveyForm={surveyForm}
              setSurveyForm={setSurveyForm}
              FileList={FileList}
              files={files}
              setFiles={setFiles}
              questionAddRef = {questionAddRef}
              containerRef={containerRef}
          />
      );
    case "일정":
      return (
        <SchedPost
          postId={postId.current}
          domFormId={domFormId}
          handleChange={handleChange}
          formData={formData}
          FileList={FileList}
          files={files}
          setFiles={setFiles}
          prvToggle={prvToggle}
          setPrvToggle={setPrvToggle}
          setFormData={setFormData}
        />
      )
    case "면담신청":
      return (
        <InterviewForm
          postId={postId.current}
          domFormId={domFormId}
          handleChange={handleChange}
          formData={formData}
          FileList={FileList}
          files={files}
          setFiles={setFiles}
        />
      );
    case "면담기록":
      return (
        <InterviewMemo
            postId={postId.current}
            domFormId={domFormId}
            handleChange={handleChange}
            formData={formData}
            FileList={FileList}
            files={files}
            setFiles={setFiles}
            setCohortSn={setCohortSn}
        />
      )
    default:
      return (
          <ArticlePost
              postId={postId.current}
              domFormId={domFormId}
              handleChange={handleChange}
              formData={formData}
              FileList={FileList}
              files={files}
              setFiles={setFiles}
          />
      );
  }
}



function BoardPost() {
  const domFormId = useId();
  const postId = useRef(uuidv4());
  const { user } = useAccount();
  const coSn = user.USER_OGDP_CO_SN;
  const cohortSn = user.USER_COHORT_SN;
  const userAuth = user.USER_AUTHRT_SN;
  const qAddRef = useRef(null);
  const scrollRef = useRef(null);
  const locate = useLocation();
  const {effectiveSn} = useSelectedCompany();
  const navigate = useNavigate();
  const [hortlist, setHortList] = useState([]);
  const [files, setFiles] = useState([]);
  const [prvToggle, setPrvToggle] = useState(0);
  const [recordCohortSn, setCohortSn] = useState(null);
  const [commentToggle, setCommentToggle] = useState(false);


  // 설문 폼 (초기 페이지 하나 생성)
  const [surveyForm, setSurveyForm] = useState({
    id: postId.current,
    pages: [{ id: uuidv4(), questions: [] }],
  });

  // 일반 게시글
  const [formData, setFormData] = useState({
    id: postId.current,
    userSn: user.USER_SN,
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
    isPrivate: (userAuth <=3 ? prvToggle : 1),
    authorSn: null,
  });

  console.log(user)
// BoardPost.jsx 내부(컴포넌트 함수 안)

const selectType = (nextType) => {
  // 같은 타입이면 아무 것도 안 함
  setFormData(prev => {
    if (prev.type === nextType) return prev;

    return {
      ...prev,
      type: nextType,
      // 공통 필드 초기화
      title: "",
      content: "",
      surveyStart: "",
      surveyEnd: "",
      // 그룹 선택은 타입별로 의미 달라질 수 있으니 하위 그룹만 비움
      detailScope: "",
      detailScopeNm: "",
      startDate: "",
      endDate: "",
      startTime: "",
      location: ""
    };
  });

  // 실제 업로드 파일 상태도 비움
  setFiles([]);

  // 설문 타입 전환 시 설문 폼 초기화 / 비설문이면 비워두기
  setSurveyForm(
    nextType === "설문조사"
      ? { id: postId.current, pages: [{ id: uuidv4(), questions: [] }] }
      : { id: postId.current, pages: [] }
  );
};
  
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
        itvAplyTtl: prev.title,      // 제목
        itvAplyCn: prev.content,       // 내용
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
        itvTrprSn: prev.authorSn, //신청자
        date: prev.startDate,
        time: prev.startTime,
        coSn: effectiveSn,
        itvSn: null,
        cohortSn: recordCohortSn
      }));
    }


    // 2) 게시글 JSON (File 객체 넣지 말기!)
    const postJson = (formData.type !== "설문조사" ? {
      id: formData.id,
      surveyStart: formData.surveyStart,
      surveyEnd: formData.surveyEnd,
      userSn: formData.userSn,
      title: formData.title,
      content: formData.content,
      coSn: formData.coSn,
      type: formData.type,
      cohortSn: (formData.type === "면담기록" ? recordCohortSn : cohortSn),
      scope: formData.scope,
      detailScope: (formData.scope === "그룹공개" && userAuth > 3 ? cohortSn : formData.detailScope),
      detailScopeNm: formData.detailScopeNm,
      startDate: formData.startDate,
      endDate: formData.endDate,
      startTime: formData.startTime,
      location: formData.location,
      isPrivate: (formData.type === "일정" && userAuth <=3 ? formData.isPrivate : 1),    
      itvPicAuthrt: formData.scope,
    //   attachments: uploads.map(u => ({
    //   storedFileName: u.storedFileName,
    //   originalFileName: u.originalFileName,
    //   size: u.size,
    //   // fileSn 내려오면 그걸 써도 OK
    // })),
    // ...(formData.type === "설문조사" ? { surveyForm: JSON.stringify(surveyForm) } : {}),
    // formUuid, // 서버가 필요하면 같이 보내서 귀속 처리
  } : {
      id: formData.id,
      userSn: formData.userSn,
      title: formData.title,
      content: formData.content,
      coSn: formData.coSn,
      type: formData.type,
      cohortSn: (formData.type === "면담기록" ? recordCohortSn : formData.cohortSn),
      scope: (formData.type === "설문조사" ? "기수전체" : (userAuth <=3 ?  "그룹공개" : formData.scope)),
      detailScope: (formData.scope === "그룹공개" && userAuth <= 3 ? cohortSn : formData.detailScope),
      detailScopeNm: formData.detailScopeNm,
      surveyStart: formData.surveyStart,
      surveyEnd: formData.surveyEnd,
      startTime: formData.startTime,
      location: formData.location,
      isPrivate: formData.isPrivate,
      itvPicAuthrt: formData.scope,
    //   attachments: uploads.map(u => ({
    //   storedFileName: u.storedFileName,
    //   originalFileName: u.originalFileName,
    //   size: u.size,
    //   // fileSn 내려오면 그걸 써도 OK
    // })),
    ...(formData.type === "설문조사" ? { surveyForm: JSON.stringify(surveyForm), srvyBgngDt: formData.surveyStart, srvyEndDt: formData.surveyEnd} : {}),
    formUuid, // 서버가 필요하면 같이 보내서 귀속 처리
  });


  const snapshot = structuredClone
    ? structuredClone({ surveyForm, formData })
    : JSON.parse(JSON.stringify({ surveyForm, formData }));

  const body = { ...snapshot.formData, 
      surveyForm:
    typeof snapshot.surveyForm === 'string'
      ? snapshot.surveyForm
      : JSON.stringify(snapshot.surveyForm),
   };

  console.log("[will send to server]", JSON.stringify(body, null, 2));
  console.log("[FILES state]", files.map(f => ({ name: f.name, size: f.size })));
  console.table(snapshot.formData);

  console.log("DEBUG scope typeof/value:", typeof formData.scope, formData.scope);
  console.log("DEBUG cohortSn typeof/value:", typeof formData.cohortSn, formData.cohortSn);
  console.log("DEBUG payload:", JSON.stringify(postJson, null, 2));

  // 3) 게시글 저장 (설문이면 createSurvey, 일반이면 createPost)
  try {
    const type = String(formData.type).trim();
    console.log(type);

    const { data } = await (async () => {
      switch (type) {
        case "설문조사":
          return createSurvey(postJson);
        case "면담신청":
          return createInterview(postJson);
        case "일정":
          return registToDo(postJson);
        case "면담기록":
          return createInterviewRecord(formData);
        default:
          return createPost(postJson); // 규약대로
      }
    })();

    console.log("saved:", data);
      if(!(postJson.type === "일정" || postJson.type === "면담기록")) {
        const serverFormUuid = data?.formUuid || data?.result?.formUuid;
        // if (!serverFormUuid) {
        //   toast.error("서버에서 formUuid를 받지 못했어요.");
        //   console.error("[createPost 응답]", data);
        //   return; // 업로드 중단
        // }

        let uploads = [];
        if (Array.isArray(files) && files.length > 0) {
          uploads = await uploadFiles(files, {
            formUuid: serverFormUuid ?? postJson.id,
            onProgress: pct => console.log("upload:", pct + "%"),
          });
        }
      }
    alert("저장 완료!");
    navigate(-1);
  } catch (err) {
    console.error(err);
    toast.error(err.message);
    alert("저장 실패");
    // 옵션) 실패 시 formUuid로 업로드 롤백 API가 있으면 호출
  }
};

  useEffect(() => {
    (async () => {
      try {
        const {data} = await hortlistByCpSn(effectiveSn);
        setHortList(data.cohorts);
        console.log(data.cohorts);
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, [effectiveSn]);

  useEffect(() => {
    
  },[formData.type])

  return (
    <div className="boardPage">
      {/* <h2>게시판</h2> */}
      <div className="limitedHeightBox">
        <h4 style={{ fontWeight: "500" }}>{formData.type} 등록하기 
          <GrayBtn textType={"← back"} onClick={(e) => {e.preventDefault(); navigate(-1);}}></GrayBtn>
        </h4>

        <form className="formAreaRow" onSubmit={(e) => e.preventDefault()}>
          <div className="formArea_L">
            <PostStatus
                type={formData.type}
                postId={postId.current}
                domFormId={domFormId}
                userAuth={userAuth}
                handleChange={handleChange}
                formData={formData}
                surveyForm={surveyForm}
                setSurveyForm={setSurveyForm}
                files={files}
                setFiles={setFiles}
                containerRef={scrollRef}
                questionAddRef={qAddRef}
                setPrvToggle={setPrvToggle}
                prvToggle={prvToggle}
                setCohortSn={setCohortSn}
                commentToggle={commentToggle}
                setCommentToggle={setCommentToggle}
            />
          </div>

          <div className="formArea_R">
            <div className="selectBoxArea" style={{ position: "relative" }}>
              <div className="dropSet" style={{ zIndex: "8" }}>
                <p>유형</p>
                <Dropdown className="dropset_dd" label={formData.type || "---- 필수 선택 ----"}>
                  {(userAuth === 2 || userAuth === 3 || userAuth === 1) ?
                  // 관리자들은 등록하기 이거밖에 없지 않나! 이거 고정
                      <>
                        {/* 관리자 예시 */}
                        <p data-dd-select className={layoutStyles.subMenuList} onClick={() => selectType("공지사항")}>공지사항</p>
                        <p data-dd-select className={layoutStyles.subMenuList} onClick={() => selectType("자료실")}>자료실</p>
                        <p data-dd-select className={layoutStyles.subMenuList} onClick={() => selectType("설문조사")}>설문조사</p>
                        <p data-dd-select className={layoutStyles.subMenuList} onClick={() => selectType("FAQ")}>FAQ</p>
                        <p data-dd-select className={layoutStyles.subMenuList} onClick={() => selectType("문의")}>문의</p>
                        <p data-dd-select className={layoutStyles.subMenuList} onClick={() => selectType("일정")}>일정</p>
                        <p data-dd-select className={layoutStyles.subMenuList} onClick={() => selectType("면담기록")}>면담기록</p>
                      </>
                  : 
                  // 관리자 외
                  <>
                  {/* 4, 5 권한은 페이지 별로 줘야지 */}
                  {/* 강사일 경우 */}
                  {(userAuth === 4) ?
                    <>
                      { locate.pathname === "/tutorHome/board/createPost"  ? 
                        <>
                          <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "자료실" }))}>자료실</p>
                          <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "설문조사" }))}>설문조사</p>
                          <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "문의" }))}>문의</p>                    
                        </> : <></> }

                      { locate.pathname === "/tutorHome/studySched/createPost"  ? 
                        <>
                          <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "일정" }))}>일정</p>
                          <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "면담신청" }))}>면담신청</p>
                          <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "면담기록" }))}>면담기록</p>
                        </> : <></> } 
                    </>
                    :
                      null
                  }
                  {/* 학생일 경우 */}
                  {(userAuth === 5) ?
                    <>
                      { locate.pathname === "/stdHome/board/createPost"  ? 
                        <>
                          <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "자료실" }))}>자료실</p>
                          <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "설문조사" }))}>설문조사</p>
                          <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "문의" }))}>문의</p>                    
                        </> : <></> }

                      { locate.pathname === "/stdHome/studySched/createPost"  ? 
                        <>
                          <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "일정" }))}>일정</p>
                          {/* <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "학습일지" }))}>학습일지</p> */}
                          <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "면담신청" }))}>면담신청</p>
                        </> : <></> } 
                    </>
                    :
                    null
                  }
                  </>
                }
                </Dropdown>
                <input type="hidden" name="type" value={formData.type} />
              </div>
              {formData.type === "일정"?
              <>
                <DateTimeInput type="date" labelNm="시작일" handleChange={handleChange} name="startDate" formData={formData} addLabelStyle="formLabel"  disabled={false}/>
                <DateTimeInput type="date" labelNm="종료일" handleChange={handleChange} name="endDate" formData={formData} addLabelStyle="formLabel"  disabled={false}/>
                <DateTimeInput type="time" labelNm="시간" handleChange={handleChange} name="startTime" formData={formData} addLabelStyle="formLabel"  disabled={false}/>
                <FormInput type="text" formData={formData} handleChange={handleChange} disabled={false} addLabelStyle="formLabel" name="location" labelNm="장소"/>

                {(userAuth <=3  && (effectiveSn === coSn)) ? <>
                  {/* <div className="dropSet" style={{ zIndex: "2" }}> */}
                  {/* <p>공개 범위</p> */}
                    {/* <Dropdown className="dropset_dd" label={formData.scope || "---- 필수 선택 ----"}> */}
                    {/* 관리자 공개 범위 */}
                      {/* <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "전체공개" }))}>전체공개</p>
                      <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "회사공개" }))}>회사공개</p>
                      <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "그룹공개" }))}>그룹공개</p>
                      <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "비공개" }))}>비공개</p> */}
                    {/* </Dropdown> */}
                    {/* <input type="hidden" name="scope" value={formData.scope} /> */}
                  {/* </div> */}
                </> : null }
            </> : null }              
              {formData.type === "면담신청"?
              <>
                {(userAuth >= 4  && (effectiveSn === coSn)) ? <>
                  <div className="dropSet" style={{ zIndex: "2" }}>
                  <p>면담 대상</p>
                    <Dropdown className="dropset_dd" label={formData.scope || "---- 필수 선택 ----"}>
                    {/* 관리자 공개 범위 */}
                      <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, itvPicAuthrt: "REPRESENTATIVE", scope: "대표" }))}>대표</p>
                      <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, itvPicAuthrt: "EMPLOYEE" , scope: "직원"}))}>직원</p>
                      {userAuth != 4 ?
                        <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, itvPicAuthrt: "INSTRUCTOR", scope: "강사" }))}>강사</p>
                      : null }
                    </Dropdown>
                    <input type="hidden" name="scope" value={formData.itvPicAuthrt} />
                  </div>
                </> : null }
            </> : null }
              {(formData.type === "면담신청") || (formData.type === "일정") || (formData.type === "면담기록") || (formData.type === "설문조사") ?
                  null :
              <div className="dropSet" style={{ zIndex: "2" }}>
                <p>공개 범위</p>
                  { (userAuth <=3  && (effectiveSn === coSn)) ? <> 
                  <Dropdown className="dropset_dd" label={formData.scope || "---- 필수 선택 ----"}>
                  {/* 관리자 공개 범위 */}
                    <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "전체공개" }))}>전체공개</p>
                    <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "회사공개" }))}>회사공개</p>
                    <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "그룹공개" }))}>그룹공개</p>
                    <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "비공개" }))}>비공개</p>
                  </Dropdown>
                  </>: null }
                  { ( userAuth === 4 || userAuth === 5) && (effectiveSn === coSn) ?<>
                    <Dropdown className="dropset_dd" label={formData.scope || "---- 필수 선택 ----"}>
                      <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "그룹공개", cohortSn: cohortSn }))}>그룹공개</p>
                      <p data-dd-select className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "비공개" }))}>비공개</p>
                    </Dropdown>
                  </>: null }
                    
                <input type="hidden" name="scope" value={formData.scope} />
              </div> }

              {(formData.scope === "그룹공개" && userAuth <= 3)&& (
                <div className="dropSet" style={{ zIndex: "1" }}>
                  <p>하위 그룹</p>
                  <Dropdown className="dropset_dd" label={formData.detailScopeNm || "---- 필수 선택 ----"}>
                    {hortlist.map((h, idx) => (
                      <p
                        className={layoutStyles.subMenuList}
                        key={idx}
                        onClick={() => {
                          setFormData(s => ({ ...s, cohortSn:h.cohortSn, detailScope: h.cohortSn, detailScopeNm: String(h.cohortNm) }));
                        }}
                      >
                        {h.cohortNm}
                      </p>
                    ))}
                  </Dropdown>
                  <input type="hidden" name="detailScope" value={formData.detailScope} />
                </div>
              )}
              {(formData.type === "설문조사" && userAuth <= 3) && (
                <div className="dropSet" style={{ zIndex: "1" }}>
                  <p>그룹 지정</p>
                  <Dropdown className="dropset_dd" label={formData.detailScopeNm || "---- 필수 선택 ----"}>
                    {hortlist.map((h, idx) => (
                      <p
                        className={layoutStyles.subMenuList}
                        key={idx}
                        onClick={() => {
                          console.log(h.cohortSn);
                          console.log("기수전체");
                          setFormData(s => ({ ...s, cohortSn: h.cohortSn, srvyScope: (userAuth <= 3 ? "기수전체" : "기수내부"), detailScope: Number(h.cohortSn) ,detailScopeNm: String(h.cohortNm) }));

                        }}
                      >
                        {h.cohortNm}
                      </p>
                    ))}
                  </Dropdown>
                  <input type="hidden" name="scope" value={formData.scope} />
                </div>
              )}
            </div>

            <div className="r_bottom">
              {(formData.type === "설문조사") || (formData.type === "일정") ?
                  null :
              <FileUpload files={files} setFiles={setFiles} />
              }
              {formData.type === "설문조사" ?
              <ul>
                {surveyForm.pages.map((page) => (
                    <React.Fragment key={page.id}>
                      {page.questions.map((q, i) => (
                          <li key={q.qid}>
                            <button
                              type="button"
                              className="specificBtn"
                              onClick={() =>
                              {
                                // r_bottom 버튼 onClick 직전에 찍어봐
                                console.log('child root?', qAddRef.current?.focusQuestion ? 'ok' : 'no');

                                qAddRef.current?.focusQuestion(q.qid, {
                                behavior: "smooth",
                                offsetTop: 8, // 고정 헤더 있으면 px 조절
                              })}}
                            >
                              {q.title?.trim()
                              ? `Q${i + 1} ${q.title}`
                              : `Q${i + 1} (제목 없음)`} · {q.type}
                            </button>
                          </li>
                      ))}
                    </React.Fragment>
                ))}
              </ul>
              : null }
              <div className="save_box">
                {/* <button className="basicBtn tempBtn" type="button" onClick={tempSubmit}>임시 저장</button> */}
                <button className="basicBtn saveBtn" type="button" onClick={saveSubmit}>저장</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BoardPost;