// QuestionReadType.jsx
import React, { useRef, useImperativeHandle, forwardRef } from "react";
import FilePreview from "../../../components/ui/FilePreview";
import { AddBtn, DeleteBtn } from "../../../components/ui/UiComp";
import styles from "../../../styles/UiComp.module.css";
import Dropdown from "../../../components/ui/Dropdown";

function changeTypeName(value) {
  switch (value) {
    case "single": return "객관식(단일)";
    case "multiple": return "객관식(다중)";
    case "text": return "주관식";
    case "image": return "이미지";
    default: return "객관식";
  }
}

/**
 * Props
 * - q: { qid, type, title, explain, required, options: [{id,label}], answer }
 * - qNum: 질문 번호
 * - onRemoveQuestion(qid)
 * - onSetType(qid, type)
 * - onSetTitle(qid, title)
 * - onSetExplain(qid, explain)
 * - onAddOption(qid)
 * - onUpdateOption(qid, optId, label)
 * - onRemoveOption(qid, optId)
 * - onToggleRequired(qid, required)
 * - onSetAnswer(qid, answer)   // ✅ 신규: 주관식 답변(미리보기) 입력용
 * - setFiles (이미지형 업로드 미리보기용)
 */
const QuestionType = forwardRef(function QuestionType(
  {
    q, qNum,
    onRemoveQuestion,
    onSetType,
    onSetTitle,
    onSetExplain,
    onAddOption,
    onUpdateOption,
    onRemoveOption,
    onToggleRequired,
    onSetAnswer,
    setFiles,
  },
  ref
) {
  const isChoice = q.type === "single" || q.type === "multiple";
  const isRadio = q.type === "single";
  const rootRef = useRef(null);
  const titleRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getRoot: () => rootRef.current,
    focusTitle: () => titleRef.current?.focus?.({ preventScroll: true }),
  }));

  return (
    <div ref={rootRef} className="questionBox" data-qid={q.qid}>
      <div className="qCont">
        <div className="qTitle">
          <p>{`Q${qNum}.`}</p>
          <input
            ref={titleRef}
            style={{color: "var(--font-color-base)", background: "var(--color-sec-bg)"}}
            placeholder="제목을 입력하세요."
            value={q.title}
            onChange={(e) => onSetTitle(q.qid, e.target.value)}
            disabled={true}
          />
        </div>

        <textarea
          className="questionCont"
          placeholder="질문 설명"
          value={q.explain}
          onChange={(e) => onSetExplain(q.qid, e.target.value)}
          style={{color: "var(--font-color-base)", border: "none", background: "var(--color-sec-bg)"}}
          disabled={true}
        />

        <hr className="hrSt2" />

        {q.type === "image" && (
          <div style={{ width: "100%", overflow: "hidden" }}>
            <FilePreview qid={q.qid} setFiles={setFiles} />
          </div>
        )}

        {/* ✅ 주관식: 실제 응답 입력칸(미리보기) */}
        {q.type === "text" && (
          <div className="answerPreview">
            <p className="answerLabel">응답</p>
            <textarea
              className={styles.textarea}
              placeholder={q.required ? "필수 응답입니다." : "자유롭게 입력하세요."}
              value={q.answer ?? ""}
              onChange={(e) => onSetAnswer?.(q.qid, e.target.value)}
              rows={4}
              style={{color: "var(--font-color-base)"}}
            />
          </div>
        )}

        {/* 객관식: 항목 편집 + 미리보기 */}
{isChoice && (
  <div className="multipleSet">
    {q.options.map((opt) => {
      const inputId = `q-${q.qid}-opt-${opt.id}`;
      const checked = q.type === "single"
        ? q.answer?.id === opt.id
        : Array.isArray(q.selected) && q.selected.some(x => x.id === opt.id);

      const handleSelect = (e) => {
        const payload = { id: opt.id, label: opt.label };
        if (q.type === "single") {
          onSetAnswer?.(q.qid, payload);           // 선택값 교체
        } else {
          onSetAnswer?.(q.qid, e.target.checked    // 추가/제거
            ? payload
            : { ...payload, __remove: true });
        }
      };

      return (
        <div key={opt.id} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
          <input
            id={inputId}
            type={isRadio ? "radio" : "checkbox"}
            name={`preview-${q.qid}`}
            checked={!!checked}
            onChange={handleSelect}
          />
          <input
            className={styles.input}
            type="text"
            value={opt.label}
            disabled={true}
            style={{ flex:1, border:"none", color:"var(--font-color-base)", background:"var(--color-sec-bg)" }}
          />
          <label htmlFor={inputId} />
        </div>
      );
    })}
  </div>
)}

      </div>
    </div>
  );
});

export default QuestionType;
