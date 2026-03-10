// RecruitEdit.jsx
import QuestionAdd from "../form/QuestionAdd"; 

import React, { useEffect, useId, useState, useRef } from 'react'
import {FileList, FormInput, DateTimeInput } from '../../../components/ui/UiComp';
import { useAccount } from '../../../auth/AuthContext';
import { hortlistByCpSn } from "../../../services/cohortService";
import {v4 as uuidv4} from "uuid";

import { applyGroup, editGroup, readRecruitPoster } from '../../../services/postService';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";


// CreatePost.jsx
// ...import 생략

function RecruitEdit({propCohortSn, editToggle, setEditToggle}) {
  const domFormId = useId();
  const { recruitSn } = useParams();
  const finalSn = propCohortSn ?? recruitSn; 
  const domId = useId();
  const postId = useRef(uuidv4());
  const { user } = useAccount();
  const coSn = user.USER_OGDP_CO_SN;
  const qAddRef = useRef(null);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  // const [loading, setLoading] = useState(false);
  
  const [hortlist, setHortList] = useState([]);
  const [files, setFiles] = useState([]);
  
  // 설문 폼 (초기 페이지 하나 생성)
  const [surveyForm, setSurveyForm] = useState({
    id: postId.current,
    pages: [{ id: uuidv4(), questions: [] }],
  });
  
  const [formData, setFormData] = useState({
    id: postId.current,
    userSn: user.USER_OGDP_CO_SN, //유저같지만 회사임
    title: "", //과정명
    answer: "", // 신청자 답변
    groupName: "", //그룹명
    type: "모집공고",
    content: "",
    scope: "",
    surveyStart: "",     // 모집시작
    surveyEnd: "",
    startDate:"",
    place: "", // 장소
    endDate:"",   //  모집종료
    classStart: "", //수업시작시간
    classEnd: "", //수업종료시간
    files: [{qid: "", fid: ""}, {qid: "", fid: ""}]
  });
  
  
  useEffect(() => {
    (async () => {
      if (!finalSn) return;
      try {
        const res = await readRecruitPoster(finalSn);
        const c = res?.data;
  
      // ── 설문 복원: crclmCn(JSON 문자열) → surveyForm 주입 ──
      if (typeof c?.crclmCn === "string" && c.crclmCn.trim()) {
        try {
          const parsed = JSON.parse(c.crclmCn); // { id, pages: [{ id, questions: [...] }] }
          const pages = Array.isArray(parsed?.pages) ? parsed.pages : [];
          const first = pages[0] ?? { id: crypto.randomUUID?.() ?? "page-1", questions: [] };
            // 옵션/타입 정규화 (최소 2개 옵션 보장, type 정상화)
          const normalize = (q) => {
            const base = { ...q };
            // 허용 타입만 유지
            const allowed = new Set(["single", "multiple", "text", "image"]);
            if (!allowed.has(base.type)) base.type = "single";
            // 선택형이면 옵션 최소 2개
            if (base.type === "single" || base.type === "multiple") {
              const opts = Array.isArray(base.options) ? base.options : [];
              const withIds = opts.map(o => ({ id: o.id ?? crypto.randomUUID?.() ?? String(Math.random()), label: o.label ?? "" }));
              while (withIds.length < 2) withIds.push({ id: crypto.randomUUID?.() ?? String(Math.random()), label: "" });
              base.options = withIds;
            } else {
              base.options = [];
            }
            // 필드 기본값
            base.qid = base.qid ?? (crypto.randomUUID?.() ?? String(Math.random()));
            base.title = base.title ?? "";
            base.explain = base.explain ?? "";
            base.answer = base.answer ?? "";
            base.required = !!base.required;
            return base;
          };
            const restoredQs = Array.isArray(first.questions)
            ? first.questions.map(normalize)
            : [];
            setSurveyForm(prev => ({
            id: parsed?.id ?? prev.id,                 // 원래 id 유지 or JSON의 id
            pages: [{ id: first.id, questions: restoredQs }],
          }));
        } catch (e) {
          console.warn("[RecruitEdit] crclmCn JSON parse 실패:", e);
        }
      }
  
        setFormData(prev => ({
          ...prev,
          content:     c?.crclmCn ?? "",     // ← 원문도 필요하면 보존
          groupName:   c?.cohortNm ?? "",
          answer:      c?.answer ?? "",
          title:       c?.crclmNm ?? "",
          surveyStart: c?.recruitBgngYmd ?? c?.recruitBgngDt ?? "",
          surveyEnd:   c?.recruitEndYmd   ?? c?.recruitEndDt   ?? "",
          startDate:   c?.crclmBgngYmd ?? c?.crclmBgngDt ?? "",
          endDate:     c?.crclmEndYmd  ?? c?.crclmEndDt  ?? "",
          classStart:  c?.attendStartTm ?? "",
          classEnd:    c?.attendEndTm   ?? "",
          place:       c?.cohortPl ?? "",
        }));
        console.log("[RecruitEdit] finalSn =", finalSn, c);
      } catch (e) {
        console.log("[RecruitEdit] read error:", e?.message, e);
      }
    })();
  }, [finalSn]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log("[change]", name, value);
  };

  const tempSubmit = () => {};
  const saveSubmit = async (e) => {
    e.preventDefault();


  const snapshot = structuredClone
    ? structuredClone({ surveyForm, formData })
    : JSON.parse(JSON.stringify({ surveyForm, formData }));

  const body = {
      // 문자열/날짜/시간 필드 매핑
      cohortNm: snapshot.formData.groupName ?? "",      // 과정명(그룹명으로 보이던 값)
      crclmNm: snapshot.formData.title ?? "",           // 커리큘럼명(제목)
      // JSON 컬럼: 객체를 문자열로(백엔드가 String으로 받는다면)
      crclmCn: JSON.stringify(snapshot.surveyForm),     // ★ 핵심
      coSn: user?.USER_OGDP_CO_SN,                      // 회사 SN (확실히 회사 SN이 맞는지 확인)

      recruitBgngDt: snapshot.formData.surveyStart || null,  // "YYYY-MM-DD"
      recruitEndDt:   snapshot.formData.surveyEnd   || null,  // "

      crclmBgngYmd: snapshot.formData.startDate || null,     // "YYYY-MM-DD"
      crclmEndYmd:   snapshot.formData.endDate   || null,     // "

      attendStartTm: snapshot.formData.classStart 
        ? `${snapshot.formData.classStart}`.length === 5 
          ? `${snapshot.formData.classStart}:00`             // "HH:mm" → "HH:mm:ss"
          : snapshot.formData.classStart 
        : null,
      attendEndTm: snapshot.formData.classEnd 
        ? `${snapshot.formData.classEnd}`.length === 5 
          ? `${snapshot.formData.classEnd}:00`
          : snapshot.formData.classEnd
        : null,

      cohortPl: snapshot.formData.place ?? "",

      // enum들 필요 시 추가
      // cohortSttsNm: "RECRUITING", 
      // cohortCate: "BOOTCAMP",
    };


  console.log("[will send to server]", JSON.stringify(body, null, 2));
  console.table(snapshot.formData);

  console.time("[RecruitEdit] readRecruitPoster");
  try {
    const res = await editGroup(finalSn, body);
    console.log(Object.keys(snapshot)); 
    console.log(Object.keys(snapshot.formData));
    console.log("[RecruitEdit] readRecruitPoster response:", res);
    toast.success("수정 완료");
    setEditToggle(false);
  } catch (err) {
    console.error("[RecruitEdit] readRecruitPoster error:", err);
    toast.error(err.message);
  }
};



  return (
    <div className="boardPage">
      <div className="limitedHeightBox" ref={scrollRef}>
        <h2 style={{ fontWeight: "500" }}>[모집공고] {formData?.title} {formData.groupName}</h2>

        <form className="formAreaRow" onSubmit={(e) => e.preventDefault()}>
          <div className="formArea_L">
            <RecruitForm
                type={formData.type}
                postId={postId.current}
                domFormId={domFormId}
                handleChange={handleChange}
                formData={formData}
                setFormData={setFormData}
                surveyForm={surveyForm}
                setSurveyForm={setSurveyForm}
                FileList={FileList}
                files={files}
                setFiles={setFiles}
                containerRef={scrollRef}
                questionAddRef={qAddRef}
            />
          </div>

          <div className="formArea_R">
            <div className="selectBoxArea" style={{ position: "relative" }}>
                <FormInput labelNm="그룹명" type="text" name="groupName" handleChange={handleChange} textType={"그룹명을 입력하세요."} formData={formData}></FormInput>
                <FormInput labelNm="교육장소" type="text" name="place" handleChange={handleChange} textType={"그룹명을 입력하세요."} formData={formData}></FormInput>
                <DateTimeInput labelNm="개강일" type="date" name="startDate" handleChange={handleChange} textType={"그룹명을 입력하세요."} formData={formData}></DateTimeInput>
                <DateTimeInput labelNm="종강일" type="date" name="endDate" handleChange={handleChange} textType={"그룹명을 입력하세요."} formData={formData}></DateTimeInput>
                <DateTimeInput labelNm="수업 시작" type="time" name="classStart" handleChange={handleChange} textType={"-- : --"} formData={formData}></DateTimeInput>
                <DateTimeInput labelNm="수업 종료" type="time" name="classEnd" handleChange={handleChange} textType={"-- : --"} formData={formData}></DateTimeInput>
            </div>

            <div className="r_bottom">
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
              <div className="save_box">
                <button className="basicBtn tempBtn" type="button" onClick={() => setEditToggle(false)}>취소</button>
                <button className="basicBtn saveBtn" type="button" onClick={saveSubmit}>저장</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecruitEdit;


function RecruitForm({
  domFormId, handleChange, formData, setFiles,
  surveyForm, setSurveyForm, questionAddRef, containerRef 
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
            placeholder='과정명을 입력하세요.'
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className='inputSet inputFlex1'>
          <DateTimeInput type="date" labelNm="모집기간" handleChange={handleChange} name="surveyStart" formData={formData} ></DateTimeInput>
          <DateTimeInput type="date" labelNm="-" handleChange={handleChange} name="surveyEnd" formData={formData} ></DateTimeInput>
        </div>
      </div>

      <div className="formContent" ref={qContainerRef}>
        {/* ☆ 초기 질문 주입 + 변경시 surveyForm 갱신 */}
          <QuestionAdd
              ref={questionAddRef}
              setFiles = {setFiles}
              containerRef={containerRef}
              questions={surveyForm.pages[0].questions}
              onChange={(updaterOrQs) => {
                  setSurveyForm(prev => {
                      const page = prev.pages[0];
                      const nextQs = typeof updaterOrQs === 'function'
                          ? updaterOrQs(page.questions)
                          : updaterOrQs;
                      return {
                          ...prev,
                          pages: [{ ...page, questions: nextQs }, ...prev.pages.slice(1)],
                      };
                  });
              }}
          />
      </div>
    </>
  );
}
