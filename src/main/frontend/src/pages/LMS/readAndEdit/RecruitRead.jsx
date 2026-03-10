// RecruitRead.jsx
import QuestionRead from './QuestionRead';
import React, { useEffect, useId, useState, useRef } from 'react';
import { FileList } from '../../../components/ui/UiComp';
import { useAccount } from '../../../auth/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import {
  applyGroup,
  deleteGroup,
  readRecruitPoster,
} from '../../../services/postService';
import { useLocation, useNavigate, useParams, matchPath } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatTime } from '../../../utils/dateformat';
import styles from '../../../styles/form.module.css';
import { readApplierResult, submitRecruitForm } from '../../../services/responseService';

function RecruitRead({ propCohortSn, editToggle, setEditToggle }) {
  const domFormId = useId();
  const { recruitSn, rspnsSn } = useParams();
  const postId = useRef(uuidv4());
  const { user } = useAccount();
  const qAddRef = useRef(null);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [showForm, setShowForm] = useState(true);
  const { pathname } = useLocation();
  const [files, setFiles] = useState([]);
  const isApplier = !!matchPath('/adminHome/readRecruitApplier/:rspnsSn', pathname);
  const finalSn = propCohortSn ?? recruitSn ;
  const submittingRef = useRef(false);


  const [surveyForm, setSurveyForm] = useState({
    id: postId.current,
    pages: [{ id: uuidv4(), questions: [] }],
  });

  const [formData, setFormData] = useState({
    cohortSn: finalSn,
    id: postId.current,
    userSn: user.USER_SN,
    title: '',
    answer: '',
    groupName: '',
    type: 'COHORT',
    content: '',
    scope: [1, 2, 3],
    surveyStart: '',
    surveyEnd: '',
    startDate: '',
    endDate: '',
    place: '',
    classStart: '',
    classEnd: '',
    bigLogoFileSn: null,
    cohortImg: null,
  });
  function handleRes(res) {
    const c = res?.data;
    if (!c) return;
    // ... 기존 상태 세팅 로직
  }
  // --------------------------
  // 모집공고 + 기수 이미지 조회
  // --------------------------

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       if (isApplier) {
  //         if (!rspnsSn) return; 
  //         const res = await readApplierResult(rspnsSn);
  //         handleRes(res);
  //       } else {
  //         if (!finalSn) return; 
  //         const res = await readRecruitPoster(finalSn);
  //         handleRes(res);
  //       }
  //     } catch (err) {
  //       toast.error(err?.response?.data?.message ?? err.message ?? '로드 실패');
  //     }
  //   })();
  // }, [isApplier, rspnsSn, finalSn]);
  
  useEffect(() => {
    (async () => {
      // if (!finalSn) return;
      // try {
      //   if (isApplier) {
      //     if (!rspnsSn) return; 
      //     const res = await readApplierResult(rspnsSn);
      //     handleRes(res);
      //   } else {
      //     if (!finalSn) return; 
      //     const res = await readRecruitPoster(finalSn);
      //     handleRes(res);
      //   }
      // } catch (err) {
      //   toast.error(err?.response?.data?.message ?? err.message ?? '로드 실패');
      // }

      try {
        const res = (isApplier ? await readApplierResult(rspnsSn) : await readRecruitPoster(finalSn));
        const c = (isApplier ?  res?.data.responseJson : res?.data);
        const s = (isApplier ?  res?.data.surveyForm : res?.data);
        const p = (isApplier ?  res?.data.userInfo : res?.data);
        console.log(c);
        if (!c) return;

        // 설문 복원
        if (typeof c?.crclmCn === 'string' && c.crclmCn.trim()) {
          try {
            const parsed = JSON.parse(c.crclmCn);
            const pages = Array.isArray(parsed?.pages) ? parsed.pages : [];
            const first = pages[0] ?? { id: uuidv4(), questions: [] };
            setSurveyForm({
              id: parsed?.id ?? postId.current,
              pages: [{ id: first.id, questions: first.questions ?? [] }],
            });
          } catch (err) {
            console.warn('[RecruitRead] crclmCn parse 실패', err);
          }
        }

        // 기본 데이터 세팅
        setFormData((prev) => ({
          ...prev,
          cohortSn: s?.cohortSn ?? prev.cohortSn,
          crclmCn: c?.crclmCn ?? surveyForm,
          groupName: s?.cohortNm ?? s?.title,
          title: s?.crclmNm ?? s?.content,
          surveyStart: s?.recruitBgngYmd ?? s?.surveyStart,
          surveyEnd: s?.recruitEndYmd ?? s?.surveyEnd,
          startDate: s?.crclmBgngYmd ?? s?.startDate,
          endDate: s?.crclmEndYmd ?? s?.endDate,
          classStart: s?.attendStartTm ?? s?.classStart,
          classEnd: s?.attendEndTm ?? s?.classEnd,
          place: s?.cohortPl ?? s?.place,
          bigLogoFileSn: s?.bigLogoFileSn ?? null,
          cohortImg: null,
          type: c?.type ?? '',
          userNm: p?.userNm ?? '',
          userEmlAddr: p?.userEmlAddr ?? '',
          userTelno: p?.userTelno ?? ''
        }));

        
        // ✅ 기수 이미지 따로 조회
        if (c?.cohortSn) {
          const imgRes = await fetch(
            `http://localhost:940/api/cohorts/${c.cohortSn}`
          );
          if (imgRes.ok) {
            const imgData = await imgRes.json();
            if (imgData?.cohortImg) {
              setFormData((prev) => ({
                ...prev,
                cohortImg: imgData.cohortImg,
              }));
            }
          }
        }
        
        console.log('[RecruitRead] finalSn =', finalSn, c);
      } catch (err) {
        console.error('[RecruitRead] readRecruitPoster error:', err);
      }
    })();
  }, [finalSn, recruitSn, rspnsSn]);
  
  const imageId = formData.cohortImg ?? formData.bigLogoFileSn;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const saveSubmit = async (e) => {
    e.preventDefault();
    if (isApplier) return;
    if (submittingRef.current) return; // 중복 방지
    submittingRef.current = true;
    console.trace('[saveSubmit] called'); // 호출 스택 확인
    const body = { ...formData, crclmCn:JSON.stringify(formData) };
    try {
      const apply = await applyGroup({userSn: user?.USER_SN, cohortSn: finalSn});
      toast.success("신청 완료")
      const res = await submitRecruitForm(body);
      console.log('[RecruitRead] applyGroup response:', res);
      toast.success('폼 제출 성공');
      navigate(-1);
    } catch (err) {
      console.error('[RecruitRead] applyGroup error:', err);
      toast.error(err.message);
    }
  };

  return (
    <div className="boardPage">
      <div
        className="BigListBox"
        ref={scrollRef}
        style={{ position: 'relative' }}
      >
        <h2
          style={{ fontWeight: '500', display: 'flex', alignItems: 'baseline' }}
        >
          <span noborder="no">
            [모집공고] {formData?.title} {formData.groupName}
          </span>
          {pathname === '/adminHome/groupSet' && (
            <button
              type="button"
              className={styles.redBtn}
              onClick={async () => {
                const ok = window.confirm('정말 삭제하시겠습니까?');
                if (!ok) return;
                try {
                  await deleteGroup(finalSn);
                  toast.success('삭제되었습니다.', {
                    onClose: () => window.location.reload(),
                  });
                } catch (err) {
                  toast.error('삭제 중 오류');
                }
              }}
            >
              삭제 [x]
            </button>
          )}
        </h2>

        {showForm ? (
          <div className={styles.explainBox}>
            <div className={isApplier ? null : "selectBoxArea"} style={{ height: "180px" }}>
              {isApplier ?
              <div style={{background: "var(--bg-color-gray5)", padding: "8px 12px", borderRadius: "8px"}}>
              <div>신청인 : {formData.userNm}</div>
              <div> Tel : {formData.userTelno}</div>
              <div> Email : {formData.userEmlAddr}</div>
              </div>  
              : null }
              <div>
                모집 기간: {formData.surveyStart} - {formData.surveyEnd}
              </div>
              <div>
                교육 기간: {formData.startDate} - {formData.endDate}
              </div>
              <div>
                수업 시간: {formatTime(formData.classStart)} ~{' '}
                {formatTime(formData.classEnd)}
              </div>
              <div>교육 장소: {formData.place}</div>
            </div>
          {isApplier ?
                      <form className="formAreaRow" onSubmit={(e) => e.preventDefault()}>
                      <div className="formArea_L">
                        <RecruitForm
                          handleChange={handleChange}
                          formData={formData}
                          setFiles={setFiles}
                          surveyForm={surveyForm}
                          setSurveyForm={setSurveyForm}
                          containerRef={scrollRef}
                          questionAddRef={qAddRef}
                          saveSubmit={saveSubmit}
                          setShowForm={setShowForm}
                          showForm={showForm}
                          setEditToggle={setEditToggle}
                          isApplier={isApplier}
                        />
                      </div>
                    </form>
                    :
                    <>
            <img
            src={`http://localhost:940/api/files/id/${
              formData.cohortImg !== null
              ? formData.cohortImg
              : formData.bigLogoFileSn
            }/preview`}
            alt="대표 이미지"
            style={{ width: '80%', height: '800px', objectFit: 'cover' }}
            />

            <button
            className={styles.applyBtn}
            type="button"
            onClick={() => setShowForm(!showForm)}
            >
              {pathname === '/adminHome/groupSet'
                ? '미리보기'
                : '신청하러 가기'}
            </button>
                </>
              }
          </div>
        ) : (
          <form onSubmit={(e) => e.preventDefault()}>
              <RecruitForm
                handleChange={handleChange}
                formData={formData}
                setFiles={setFiles}
                surveyForm={surveyForm}
                setSurveyForm={setSurveyForm}
                containerRef={scrollRef}
                questionAddRef={qAddRef}
                saveSubmit={saveSubmit}
                setShowForm={setShowForm}
                showForm={showForm}
                setEditToggle={setEditToggle}
              />
          </form>
        )}
      </div>
    </div>
  );
}

export default RecruitRead;

function RecruitForm({
  handleChange,
  formData,
  setFiles,
  surveyForm,
  setSurveyForm,
  questionAddRef,
  containerRef,
  saveSubmit,
  setShowForm,
  showForm,
  setEditToggle,
  isApplier
}) {
  const qContainerRef = useRef(null);
  return (
    <>
      <div className="formHeader" />
      <div className="formContent" ref={qContainerRef}>
        <QuestionRead
        isApplier={isApplier}
          ref={questionAddRef}
          setFiles={setFiles}
          containerRef={containerRef}
          questions={surveyForm.pages[0].questions}
          saveSubmit={saveSubmit}
          showForm={showForm}
          setShowForm={setShowForm}
          setEditToggle={setEditToggle}
          onChange={(updaterOrQs) => {
            setSurveyForm((prev) => {
              const page = prev.pages[0];
              const nextQs =
                typeof updaterOrQs === 'function'
                  ? updaterOrQs(page.questions)
                  : updaterOrQs;
              return { ...prev, pages: [{ ...page, questions: nextQs }] };
            });
          }}
        />
      </div>
    </>
  );
}
