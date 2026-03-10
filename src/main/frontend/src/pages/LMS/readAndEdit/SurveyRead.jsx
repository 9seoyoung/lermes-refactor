// SurveyRead.jsx
import QuestionRead from './QuestionRead';

import React, { useEffect, useId, useState, useRef } from 'react';
import {
  FileList,
  FormInput,
  DateTimeInput,
} from '../../../components/ui/UiComp';
import { useAccount } from '../../../auth/AuthContext';
import { hortlistByCpSn } from '../../../services/cohortService';
import { v4 as uuidv4 } from 'uuid';
import { applyGroup, readRecruitPoster, readSurvey } from '../../../services/postService';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatTime } from '../../../utils/dateformat';
import styles from '../../../styles/form.module.css';
import { pullSurveyResList, readSurveyRes, submitSurvey } from '../../../services/responseService';
import { getErrorMessage } from '../../../utils/errorMessageHandler';
import {ApplyList2} from '../../../components/module/ApplyList2.jsx';

// CreatePost.jsx
// ...import 생략

function SurveyRead({setEditToggle}) {
  const domFormId = useId();
  const { srvySn } = useParams();
  console.log(useParams());
  // const finalSn = propCohortSn ?? recruitSn; 
  const domId = useId();
  const postId = useRef(uuidv4());
  const { user } = useAccount();
  const coSn = user.USER_OGDP_CO_SN;
  const qAddRef = useRef(null);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [showForm, setShowForm] = useState(true);
  const {pathname} = useLocation();
  const [files, setFiles] = useState([]);
  const [chkSubmit, setChkSubmit] = useState(false);
  const [getRspnsSn, setRspnsSn] = useState(null);
  const [finalSn, setFinalSn] = useState(srvySn);
  const [readOrEdit, setReadOrEdit] = useState(false);

  console.log(typeof  srvySn);
  // 설문 폼 (초기 페이지 하나 생성)
  const [surveyForm, setSurveyForm] = useState({
    id: postId.current,
    pages: [{ id: uuidv4(), questions: [] }],
  });

  const [formData, setFormData] = useState({
    id: postId.current,
    userSn: user.USER_SN, //유저같지만 회사임
    title: '', //과정명
    answer: '', // 신청자 답변
    groupName: '', //그룹명
    type: '설문조사',
    content: '',
    scope: [1, 2, 3],
    surveyStart: '', // 모집시작
    surveyEnd: '',
    files: [
      { qid: '', fid: '' },
      { qid: '', fid: '' },
    ],
  });

  useEffect(() => {
    (async () => {
      if (!srvySn) return toast.error("srvySn 없는거  맞음 ㅇㅇ");
      console.log(parseInt(srvySn));
      try {

        // 기수사람만 조회하다던가... 백에서 예외 에러 자꾸 보내서 동작 확인 불가......
          const myRes = await readSurveyRes(parseInt(srvySn));
          // console.log(myRes.data);

          const res = await readSurvey(Number(srvySn));
          console.log(myRes.data);

          const c = (chkSubmit ? myRes?. data : res?.data);
          console.log(c);

          // const c = myRes?.data ?? res?.data;
          setReadOrEdit(( myRes?.data ? true: false));
          // console.log(c);
          // console.log(myRes?.data ? true : false);
          
        // }

        // c = myRes?.data;
          
          // 설문 복원 srvyQitem(JSON 문자열) >> surveyForm
          if (typeof c?.srvyQitem === 'string' && c.srvyQitem.trim()) {
            try {
              const parsed = JSON.parse(c.srvyQitem); // { id, pages: [{ id, questions: [...] }] }
              const pages = Array.isArray(parsed?.pages) ? parsed.pages : [];
              const first = pages[0] ?? {
                id: crypto.randomUUID?.() ?? 'page-1',
                questions: [],
              } 
              // 옵션/타입 정규화 (최소 2개 옵션 보장, type 정상화)
              const normalize = (q) => {
                const base = { ...q };
                // 허용 타입만 유지
                const allowed = new Set(['single', 'multiple', 'text', 'image']);
                if (!allowed.has(base.type)) base.type = 'single';
                // 선택형이면 옵션 최소 2개
                if (base.type === 'single' || base.type === 'multiple') {
                  const opts = Array.isArray(base.options) ? base.options : [];
                  const withIds = opts.map((o) => ({
                    id: o.id ?? crypto.randomUUID?.() ?? String(Math.random()),
                    label: o.label ?? '',
                  }));
                  while (withIds.length < 2)
                    withIds.push({
                  id: crypto.randomUUID?.() ?? String(Math.random()),
                  label: '',
                });
                base.options = withIds;
              } else {
                base.options = [];
              }
              // 필드 기본값
              base.qid =
              base.qid ?? crypto.randomUUID?.() ?? String(Math.random());
              base.title = base.title ?? '';
              base.explain = base.explain ?? '';
              base.answer = base.answer ?? '';
              base.required = !!base.required;
              return base;
            };
            const restoredQs = Array.isArray(first.questions)
            ? first.questions.map(normalize)
            : [];
            setSurveyForm((prev) => ({
              id: parsed?.id ?? prev.id, // 원래 id 유지 or JSON의 id
              pages: [{ id: first.id, questions: restoredQs }],
            }));
          } catch (e) {
            console.warn('[SurveyRead] srvyQitem JSON parse 실패:', e);
          }
        }
        
        setFormData((prev) => ({
          ...prev,
          /**
           *     id: postId.current,
          userSn: user.USER_SN, //유저같지만 회사임
            title: '', //과정명
            answer: '', // 신청자 답변
            groupName: '', //그룹명
            type: '모집공고',
            content: '',
            scope: [1, 2, 3],
            surveyStart: '', // 모집시작
            surveyEnd: '',
            startDate: '',
            place: '', // 장소
            endDate: '', //  모집종료
            classStart: '', //수업시작시간
            classEnd: '', //수업종료시간
            files: [
              { qid: '', fid: '' },
              { qid: '', fid: '' },
            ],
           */
          scope: c?.srvyScope ?? '',
          userSn: c?.userSn ?? '',
          userNm: c?.userNm ?? '',
          content: c?.srvyQitem ?? '',
          groupName: c?.cohortNm ?? '',
          answer: c?.answer ?? '',
          title: c?.srvyTtl ?? '',
          surveyStart: c?.srvyBgngDt ?? c?.recruitBgngDt ?? '',
          surveyEnd: c?.srvyEndDt ?? c?.recruitEndDt ?? '',
          srvyFrstWrtDt: c?.srvyFrstWrtDt ?? null,
          viewCnt: c?.viewCnt ?? null
        }));
        console.log('[SurveyRead] srvySn =', srvySn, c);
      } catch (e) {
        toast.error(getErrorMessage(e));
        console.log('[SurveyRead] read error:', e?.message, e);
      }
    })();
  }, [srvySn, getRspnsSn, chkSubmit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log('[change]', name, value);
  };

  // 응답 요약을 사람이 읽기 좋은 문자열로 합치기
  const flattenAnswers = (answersMap) => {
    const parts = [];
    for (const [qid, v] of Object.entries(answersMap || {})) {
      if (!v) continue;
      // single: {id, label}
      if (v && typeof v === 'object' && 'label' in v && 'id' in v) {
        parts.push(v.label);
        continue;
      }
      // multiple: [{id,label}, ...]
      if (Array.isArray(v)) {
        const labels = v
          .map((x) => x?.label)
          .filter(Boolean)
          .join(', ');
        if (labels) parts.push(labels);
        continue;
      }
      // text/image: { text: "..." }
      if (v && typeof v === 'object' && 'text' in v) {
        if (v.text?.trim()) parts.push(v.text.trim());
        continue;
      }
    }
    return parts.join(' | ');
  };

  const buildAnswersMap = (surveyForm) => {
    const out = {};
    for (const p of surveyForm.pages || []) {
      for (const q of p.questions || []) {
        if (q.type === 'single') out[q.qid] = q.answer ? { ...q.answer } : null;
        else if (q.type === 'multiple')
          out[q.qid] = (q.selected || []).map((x) => ({ ...x }));
        else out[q.qid] = { text: q.answerText ?? '' };
      }
    }
    return out;
  };
  const saveSrvyRes = async (e) => {
    e.preventDefault();

    const snapshot = structuredClone
      ? structuredClone({ surveyForm, formData })
      : JSON.parse(JSON.stringify({ surveyForm, formData }));

    const answersMap = buildAnswersMap(snapshot.surveyForm);
    const flatAnswer = flattenAnswers(answersMap); // ★ 요약 문자열 생성

    const body = {
      ...snapshot.formData,
      answer: flatAnswer,
      surveyForm: snapshot.surveyForm,
      surveyAnswers: answersMap,
    };

    console.log('[will send to server]', JSON.stringify(body, null, 2));
    console.table(snapshot.formData);

    console.time('[SurveyRead] readRecruitPoster');
    try {
      const res = await submitSurvey(srvySn, {parentSn: Number(srvySn), response: JSON.stringify(body), parentType: "SURVEY"});
      console.log(Object.keys(snapshot));
      console.log(Object.keys(snapshot.formData));
      console.log('[SurveyRead] readRecruitPoster response:', res);
      toast.success('제출 성공');
      navigate(-1);
    } catch (err) {
      console.error('[SurveyRead] readRecruitPoster error:', err);
      toast.error(err.message);
    }
  };

  const pullFormResponses = () => {

    (async() => {
      try {
        const {data} = await pullSurveyResList(srvySn);
        console.log(data);
      } catch(err) {
        console.log(err.message);
      }

    }
    )();
  }

  return (
    <div className="boardPage">
      <div
        className="BigListBox"
        ref={scrollRef}
        style={{ position: 'relative' }}
      >
        <h4 style={{ fontWeight: '500', justifyContent: "flex-start", gap: "6px"}}>
          <span noborder = "no">{`[${formData.surveyStart} ~ ${formData.surveyEnd}]`}</span>
          <span noborder = "no">{`${formData.title}`}</span>
          { formData.userSn === user.USER_SN ? 
            <>
            {chkSubmit ? 
            <button noborder = "no" onClick={() => {setChkSubmit(!chkSubmit); setRspnsSn(null)}}>내역 닫기</button >
            :
            <button noborder = "no" onClick={() => setChkSubmit(!chkSubmit)}>응답 내역</button >
            }
            </>
            : null }
        </h4>
          <form className="formAreaRow" onSubmit={(e) => e.preventDefault()}>
            <div className="formArea_L">
              <RecruitForm
                readOrEdit={readOrEdit}
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
                saveSrvyRes={saveSrvyRes}
                setShowForm={setShowForm}
                showForm={showForm}
                setEditToggle={setEditToggle}
              />
            </div>
          </form>
      </div>
      {chkSubmit ? <ApplyList2 setRspnsSn={setRspnsSn} srvySn={srvySn} /> : null}
    </div>
  );
}

export default SurveyRead;

function RecruitForm({
  domFormId,
  handleChange,
  formData,
  setFiles,
  surveyForm,
  setSurveyForm,
  questionAddRef,
  containerRef,
  saveSrvyRes,
  saveSubmit,
  setShowForm,
  showForm,
  setEditToggle,
  readOrEdit
}) {
  // pages[0]이 항상 존재하도록 보장(상위 CreatePost에서 초기화함)
  // const firstPage = surveyForm.pages[0];
  const qContainerRef = useRef(null);

  return (
    <>
      <div className="formHeader"></div>

      <div className="formContent" ref={qContainerRef}>
        {/* ☆ 초기 질문 주입 + 변경시 surveyForm 갱신 */}
        <QuestionRead
          ref={questionAddRef}
          setFiles={setFiles}
          containerRef={containerRef}
          questions={surveyForm.pages[0].questions}
          saveSubmit={saveSubmit}
          saveSrvyRes={saveSrvyRes}
          showForm={showForm}
          setShowForm={setShowForm}
          readOrEdit={readOrEdit}
          setEditToggle={setEditToggle}
          onChange={(updaterOrQs) => {
            setSurveyForm((prev) => {
              const page = prev.pages[0];
              const nextQs =
                typeof updaterOrQs === 'function'
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
      <ul
        style={{
          position: 'fixed',
          background: 'var(--color-table-bg)',
          right: '0',
          padding: '16px 12px',
          display: 'flex',
          gap: '8px',
          flexDirection: 'column',
        }}
      >
        {surveyForm.pages.map((page) => (
          <React.Fragment key={page.id}>
            {page.questions.map((q, i) => (
              <li key={q.qid}>
                <button
                  type="button"
                  className="specificBtn"
                  onClick={() => {
                    // r_bottom 버튼 onClick 직전에 찍어봐
                    console.log(
                      'child root?',
                      questionAddRef.current?.focusQuestion ? 'ok' : 'no'
                    );

                    questionAddRef.current?.focusQuestion(q.qid, {
                      behavior: 'smooth',
                      offsetTop: 8, // 고정 헤더 있으면 px 조절
                    });
                  }}
                >
                  {q.title?.trim()
                    ? `Q${i + 1} ${q.title}`
                    : `Q${i + 1} (제목 없음)`}{' '}
                  · {q.type}
                </button>
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>
    </>
  );
}
