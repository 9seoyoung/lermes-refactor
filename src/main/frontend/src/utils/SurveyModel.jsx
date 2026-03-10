import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Dropdown from "../components/ui/Dropdown";

function SurveyModel({ postId, domFormId, surveyForm, setSurveyForm, files, setFiles }) {
  const [pIdx, setPIdx] = useState(0); // 현재 페이지
  const [qType, setQtype] = useState("single");

  // 페이지 추가/이동
  const addPage = () => {
    setSurveyForm(prev => ({
      ...prev,
      pages: [...prev.pages, { id: uuidv4(), questions: [] }]
    }));
    setPIdx(idx => idx + 1); // 새 페이지로 포커스 이동
  };
  const goNextPage = () => setPIdx(prev => Math.min(prev + 1, surveyForm.pages.length - 1));
  const goPrevPage = () => setPIdx(prev => Math.max(prev - 1, 0));

  // 질문 추가 (타입 지정)
  const addQuestion = (type = "single") => {
    const base = {
      id: uuidv4(),
      type: qType,            // "single" | "text" | "image"
      title: "",
      content: "",
      options: [],     // single용
      answers: [],     // 응답 저장용(뷰어모드에서)
      images: []       // image 타입용 [{id, name, size, type, url}]
    };

    setSurveyForm(prev => {
      const pages = [...prev.pages];
      const page = { ...pages[pIdx] };
      page.questions = [...page.questions, base];
      pages[pIdx] = page;
      return { ...prev, pages };
    });
  };

  // 질문 필드 수정
  const updateQuestionField = (qIndex, key, value) => {
    setSurveyForm(prev => {
      const pages = [...prev.pages];
      const page = { ...pages[pIdx] };
      const questions = [...page.questions];
      const q = { ...questions[qIndex], [key]: value };
      questions[qIndex] = q;
      page.questions = questions;
      pages[pIdx] = page;
      return { ...prev, pages };
    });
  };

  // 객관식 옵션 추가 (문자열)
  const addOption = (qIndex, text) => {
    const opt = { id: uuidv4(), text };
    setSurveyForm(prev => {
      const pages = [...prev.pages];
      const page = { ...pages[pIdx] };
      const questions = [...page.questions];
      const q = { ...questions[qIndex] };
      q.options = [...q.options, opt];
      questions[qIndex] = q;
      page.questions = questions;
      pages[pIdx] = page;
      return { ...prev, pages };
    });
  };

  // 이미지 추가: 질문.images + 부모 files 동시 업데이트
  const addImages = (qIndex, fileList) => {
    const picked = Array.from(fileList);
    if (picked.length === 0) return;

    const imageItems = picked.map(f => ({
      id: uuidv4(),
      name: f.name,
      size: f.size,
      type: f.type,
      file: f,                        // 필요 시 전송용
      url: URL.createObjectURL(f)     // 미리보기용
    }));

    // 1) 질문.images 업데이트
    setSurveyForm(prev => {
      const pages = [...prev.pages];
      const page = { ...pages[pIdx] };
      const questions = [...page.questions];
      const q = { ...questions[qIndex] };
      q.images = [...q.images, ...imageItems];
      questions[qIndex] = q;
      page.questions = questions;
      pages[pIdx] = page;
      return { ...prev, pages };
    });

    // 2) 부모 files 리스트에도 합치기 (FileList 표시용)
    setFiles(prev => [...prev, ...picked]); // FileList가 File[]를 받는다고 가정
  };

  // 이미지 삭제(선택)
  const removeImage = (qIndex, imgId) => {
    setSurveyForm(prev => {
      const pages = [...prev.pages];
      const page = { ...pages[pIdx] };
      const questions = [...page.questions];
      const q = { ...questions[qIndex] };
      const target = q.images.find(i => i.id === imgId);
      if (target?.url) URL.revokeObjectURL(target.url);
      q.images = q.images.filter(i => i.id !== imgId);
      questions[qIndex] = q;
      page.questions = questions;
      pages[pIdx] = page;
      return { ...prev, pages };
    });
    // 부모 files에서 제거까지 원하면 구현(파일 매칭키 필요). 여기선 유지.
  };

  const currentPage = surveyForm.pages[pIdx] ?? { questions: [] };

  return (
    <>
      <div>
        <label>유형</label>
        <Dropdown label={`${surveyForm.questions}`}>
          <p onClick={() => setQtype("single")}>객관식</p>
          <p onClick={() => setQtype("text")}>주관식</p>
          <p onClick={() => setQtype("image")}>이미지</p>
        </Dropdown>
      </div>
      {currentPage.questions.map((q, i) => (
        <QuestionEditor
          key={q.id}
          q={q}
          onChange={(key, val) => updateQuestionField(i, key, val)}
          onAddOption={(val) => addOption(i, val)}
          onAddImages={(files) => addImages(i, files)}
          onRemoveImage={(imgId) => removeImage(i, imgId)}
        />
      ))}

      <pre style={{ background: "#111", color: "#0f0", padding: 12, marginTop: 12 }}>
        {JSON.stringify(surveyForm, null, 2)}
      </pre>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button type="button" onClick={() => addQuestion()}>질문 추가</button>
        <button type="button" onClick={addPage}>페이지 추가</button>
        <button type="button" onClick={goPrevPage} disabled={pIdx===0}>이전 페이지</button>
        <button type="button" onClick={goNextPage} disabled={pIdx>=surveyForm.pages.length-1}>다음 페이지</button>
        <span>페이지 {pIdx+1}/{surveyForm.pages.length}</span>
      </div>
    </>
  );
}

function QuestionEditor({ q, onChange, onAddOption, onAddImages, onRemoveImage }) {
  const [optInput, setOptInput] = useState("");

  return (
    <div>
      <div style={{ display: "grid", gap: 8 }}>
        <label>
          제목:&nbsp;
          <input value={q.title} onChange={(e) => onChange("title", e.target.value)} placeholder="질문 제목" />
        </label>
        <label>
          내용:&nbsp;
          <input value={q.content} onChange={(e) => onChange("content", e.target.value)} placeholder="질문 설명" />
        </label>
        <div>유형: <b>{q.type}</b></div>
      </div>

      {q.type === "single" && (
        <div style={{ marginTop: 10 }}>
          <strong>객관식 옵션</strong>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <input
              value={optInput}
              onChange={(e) => setOptInput(e.target.value)}
              placeholder="옵션 텍스트"
            />
            <button
              type="button"
              onClick={() => {
                if (!optInput.trim()) return;
                onAddOption(optInput.trim());
                setOptInput("");
              }}
            >
              옵션 추가
            </button>
          </div>
          <div style={{ marginTop: 8 }}>
            {q.options.map((opt) => (
              <label key={opt.id} style={{ display: "block" }}>
                <input type="radio" name={`q-${q.id}`} value={opt.text} readOnly />
                &nbsp;{opt.text}
              </label>
            ))}
          </div>
        </div>
      )}

      {q.type === "text" && (
        <div style={{ marginTop: 10 }}>
          <strong>주관식 미리보기</strong>
          <div style={{ marginTop: 6 }}>
            <input type="text" placeholder="사용자 답변 입력란(미리보기)" readOnly />
          </div>
        </div>
      )}

      {q.type === "image" && (
        <div style={{ marginTop: 10 }}>
          <strong>이미지 첨부</strong>
          <div style={{ marginTop: 6 }}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onAddImages(e.target.files)}
            />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            {q.images.map(img => (
              <div key={img.id} style={{ border: "1px solid #ddd", padding: 8, borderRadius: 6 }}>
                <img src={img.url} alt={img.name} style={{ width: 120, height: 80, objectFit: "cover", display: "block" }} />
                <div style={{ fontSize: 12, marginTop: 4 }}>{img.name}</div>
                <button type="button" style={{ marginTop: 4 }} onClick={() => onRemoveImage(img.id)}>
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SurveyModel;