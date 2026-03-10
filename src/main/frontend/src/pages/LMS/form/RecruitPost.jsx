// RecruitPost.jsx
import QuestionAdd from './QuestionAdd';
import React, { useEffect, useId, useState, useRef } from 'react';
import {
  FileList,
  FormInput,
  DateTimeInput,
} from '../../../components/ui/UiComp';
import { useAccount } from '../../../auth/AuthContext';
import { hortlistByCpSn } from '../../../services/cohortService';
import { v4 as uuidv4 } from 'uuid';
import { createGroup } from '../../../services/postService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateCompanyBigLogo } from '../../../auth/authService';
import { api } from '../../../auth/api';

function RecruitPost() {
  const domFormId = useId();
  const postId = useRef(uuidv4());
  const { user } = useAccount();
  const coSn = user.USER_OGDP_CO_SN;
  const qAddRef = useRef(null);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [hortlist, setHortList] = useState([]);
  const [files, setFiles] = useState([]);

  const [surveyForm, setSurveyForm] = useState({
    id: postId.current,
    pages: [{ id: uuidv4(), questions: [] }],
  });

  const [formData, setFormData] = useState({
    id: postId.current,
    userSn: user.USER_OGDP_CO_SN,
    title: '',
    answer: '',
    groupName: '',
    type: '모집공고',
    content: '',
    scope: '',
    surveyStart: '',
    surveyEnd: '',
    startDate: '',
    place: '',
    endDate: '',
    classStart: '',
    classEnd: '',
    files: [
      { qid: '', fid: '' },
      { qid: '', fid: '' },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const tempSubmit = () => {};

  const saveSubmit = async (e) => {
    e.preventDefault();

    const snapshot = structuredClone
      ? structuredClone({ surveyForm, formData })
      : JSON.parse(JSON.stringify({ surveyForm, formData }));

    const body = { ...snapshot.formData, surveyForm: snapshot.surveyForm };

    console.time('[RecruitPost] createGroup');
    try {
      // 1️⃣ 모집공고(기수) 등록
      const res = await createGroup(body);
      const cohortSn = res?.data?.cohortSn;

      // 2️⃣ 회사 빅 로고 반영 (있을 경우)
      if (bigLogoFileSn) {
        await updateCompanyBigLogo(user.USER_OGDP_CO_SN, bigLogoFileSn);

        // 3️⃣ 기수 이미지 등록 (기수가 생성된 경우)
        if (cohortSn) {
          await api.post(
            `http://localhost:940/api/company/cohort/${cohortSn}/image`,
            null,
            {
              params: { fileSn: bigLogoFileSn },
            }
          );
        }
      }

      toast.success('게시 성공');
      navigate(-1);
    } catch (err) {
      console.error('[RecruitPost] createGroup error:', err);
      if (err.response?.status === 400) {
        toast.error('필수값(모집기간/개강일/종강일)을 입력해주세요.');
      } else {
        toast.error('저장 중 오류가 발생했습니다.');
      }
    } finally {
      console.timeEnd('[RecruitPost] createGroup');
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await hortlistByCpSn(coSn);
        setHortList(data.data.cohorts);
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, [coSn]);

  // =========================== 인호 작성 ===============================
  const [bigLogoFileSn, setBigLogoFileSn] = useState(null);
  const handleBigLogoSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formDataObj = new FormData();
      formDataObj.append('files', file);
      const uploadRes = await api.post('/files', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setBigLogoFileSn(uploadRes.data[0].fileSn);
      toast.info('회사 빅 로고 선택됨 (저장 시 반영)');
    } catch (err) {
      toast.error('파일 업로드 실패');
    }
  };
  // =========================== 인호 작성 ===============================

  return (
    <div className="boardPage">
      <h2>과정 관리</h2>
      <div className="limitedHeightBox" ref={scrollRef}>
        <h4 style={{ fontWeight: '500' }}>{formData.type} 등록하기</h4>

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
            <div className="selectBoxArea" style={{ position: 'relative' }}>
              <FormInput
                labelNm="그룹명"
                type="text"
                name="groupName"
                handleChange={handleChange}
                textType={'그룹명을 입력하세요.'}
                formData={formData}
              ></FormInput>
              <FormInput
                labelNm="교육장소"
                type="text"
                name="place"
                handleChange={handleChange}
                textType={'교육장소를 입력하세요.'}
                formData={formData}
              ></FormInput>
              <DateTimeInput
                labelNm="개강일"
                type="date"
                name="startDate"
                handleChange={handleChange}
                formData={formData}
              ></DateTimeInput>
              <DateTimeInput
                labelNm="종강일"
                type="date"
                name="endDate"
                handleChange={handleChange}
                formData={formData}
              ></DateTimeInput>
              <DateTimeInput
                labelNm="수업 시작"
                type="time"
                name="classStart"
                handleChange={handleChange}
                textType={'-- : --'}
                formData={formData}
              ></DateTimeInput>
              <DateTimeInput
                labelNm="수업 종료"
                type="time"
                name="classEnd"
                handleChange={handleChange}
                textType={'-- : --'}
                formData={formData}
              ></DateTimeInput>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: '500' }}>
                  회사 빅 로고
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBigLogoSelect}
                  style={{
                    padding: '6px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
                {bigLogoFileSn && (
                  <img
                    src={`http://localhost:940/api/files/id/${bigLogoFileSn}`}
                    alt="미리보기"
                    style={{
                      marginTop: '30px',
                      border: '1px solid #ddd',
                      width: '100%',
                      height: '90px',
                    }}
                  />
                )}
              </div>
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
                          onClick={() => {
                            qAddRef.current?.focusQuestion(q.qid, {
                              behavior: 'smooth',
                              offsetTop: 8,
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
              <div className="save_box">
                <button
                  className="basicBtn tempBtn"
                  type="button"
                  onClick={tempSubmit}
                >
                  임시 저장
                </button>
                <button
                  className="basicBtn saveBtn"
                  type="button"
                  onClick={saveSubmit}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecruitPost;

function RecruitForm({
  domFormId,
  handleChange,
  formData,
  setFiles,
  surveyForm,
  setSurveyForm,
  questionAddRef,
  containerRef,
}) {
  const qContainerRef = useRef(null);

  return (
    <>
      <div className="formHeader">
        <div className="inputSet">
          <label className="formLabel" htmlFor={`${domFormId}_title`}>
            제목
          </label>
          <input
            id={`${domFormId}_title`}
            className="formInput"
            name="title"
            placeholder="과정명을 입력하세요."
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="inputSet inputFlex1">
          <DateTimeInput
            type="date"
            labelNm="모집기간"
            handleChange={handleChange}
            name="surveyStart"
            formData={formData}
            addStyle="formLabel"
          ></DateTimeInput>
          <DateTimeInput
            type="date"
            labelNm="-"
            handleChange={handleChange}
            name="surveyEnd"
            formData={formData}
          ></DateTimeInput>
        </div>
      </div>

      <div className="formContent" ref={qContainerRef}>
        <QuestionAdd
          ref={questionAddRef}
          setFiles={setFiles}
          containerRef={containerRef}
          questions={surveyForm.pages[0].questions}
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
    </>
  );
}
