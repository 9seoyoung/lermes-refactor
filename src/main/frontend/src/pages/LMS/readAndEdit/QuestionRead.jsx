// QuestionRead.jsx
import React, {
  forwardRef, useRef, useImperativeHandle, createRef, useEffect,
  useState
} from "react";
import { v4 as uuid } from "uuid";
import { Plus } from "lucide-react";
import QuestionReadType from "./QuestionReadType";
import styles from "../../../styles/form.module.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// ───────── utils ─────────
export const makeQuestion = () => ({
  qid: uuid(),
  type: "single",
  title: "",
  explain: "",
  required: false,
  options: [
    { id: uuid(), label: "" },
    { id: uuid(), label: "" },
  ],
  answer: "",
});

const ensureOptions = (opts = []) => {
  const next = (opts || []).map(o => ({ id: o.id || uuid(), label: o.label ?? "" }));
  while (next.length < 2) next.push({ id: uuid(), label: "" });
  return next;
};

const isScrollable = (el) => {
  if (!el) return false;
  const s = getComputedStyle(el);
  const oy = s.overflowY;
  const canScroll = (oy === "auto" || oy === "scroll" || oy === "overlay");
  return canScroll && el.scrollHeight > el.clientHeight;
};

const isPageScroller = (el) =>
  el === document.scrollingElement || el === document.documentElement || el === document.body;

const getScrollParent = (el) => {
  let p = el?.parentElement;
  while (p) {
    if (isScrollable(p)) return p;
    p = p.parentElement;
  }
  return document.scrollingElement || document.documentElement;
};

const scrollToChild = (container, el, { offsetTop = 0, offsetLeft = 0, behavior = "smooth" } = {}) => {
  if (isPageScroller(container)) {
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.pageYOffset - offsetTop;
    const left = rect.left + window.pageXOffset - offsetLeft;
    window.scrollTo({ top: Math.round(top), left: Math.round(left), behavior });
  } else {
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    const top  = (eRect.top  - cRect.top)  + container.scrollTop  - offsetTop;
    const left = (eRect.left - cRect.left) + container.scrollLeft - offsetLeft;
    container.scrollTo({ top: Math.round(top), left: Math.round(left), behavior });
  }
};

// ───────── component ─────────
const QuestionRead = forwardRef(function QuestionRead({ questions = [], onChange, readOrEdit ,containerRef, saveSubmit, isApplier, showForm, setShowForm, setEditToggle, saveSrvyRes }, ref) {
  const [files, setFiles] = useState([]);
  const itemRefs = useRef({});
  const pendingFocusId = useRef(null);
  const {srvySn} = useParams();
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const getRef = (qid) => {
    if (!itemRefs.current[qid]) itemRefs.current[qid] = createRef();
    return itemRefs.current[qid];
  };

  useEffect(() => {
    if (!questions || questions.length === 0) {
      onChange(() => [makeQuestion()]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focusQuestion = (qid, opts = { behavior: "smooth", offsetTop: 0 }) => {
    const inst = itemRefs.current[qid]?.current;
    const child = inst?.getRoot?.();
    if (!inst || !child) return;

    // 1) 넘겨준 containerRef를 우선 사용하되
    // 2) child를 포함하지 않거나 스크롤 불가면 자동으로 스크롤 부모 사용
    let container = containerRef?.current;
    if (!container || !container.contains(child) || !isScrollable(container)) {
      container = getScrollParent(child);
    }

    scrollToChild(container, child, opts);
    requestAnimationFrame(() => inst.focusTitle?.());
  };

  const addQuestionAndFocus = () => {
    const newQ = makeQuestion();
    pendingFocusId.current = newQ.qid;
    onChange(prev => [...prev, newQ]);
  };

  useEffect(() => {
    const alive = new Set(questions.map(q => q.qid));
    Object.keys(itemRefs.current).forEach((id) => {
      if (!alive.has(id)) delete itemRefs.current[id];
    });

    const target = pendingFocusId.current;
    if (target && itemRefs.current[target]?.current) {
      pendingFocusId.current = null;
      focusQuestion(target, { behavior: "smooth", offsetTop: 0 });
    }
  }, [questions]);

  useImperativeHandle(ref, () => ({
    focusQuestion,
    addQuestionAndFocus,
  }));

  // 상태 업데이트 액션들 (변경 없음)
  const removeQuestion = (qid) =>
    onChange(prev => prev.filter(q => q.qid !== qid));

  const setType = (qid, value) =>
    onChange(prev => prev.map(q => {
      if (q.qid !== qid) return q;
      if (value === "single" || value === "multiple") {
        return { ...q, type: value, options: ensureOptions(q.options), answer: "" };
      }
      return { ...q, type: value, options: [], answer: "" };
    }));

  const setTitle   = (qid, title)   =>
    onChange(prev => prev.map(q => q.qid === qid ? ({ ...q, title })   : q));

  const setExplain = (qid, explain) =>
    onChange(prev => prev.map(q => q.qid === qid ? ({ ...q, explain }) : q));

  const addOption = (qid) =>
    onChange(prev => prev.map(q =>
      q.qid === qid ? ({ ...q, options: [...q.options, { id: uuid(), label: "" }] }) : q
    ));

  const updateOption = (qid, id, label) =>
    onChange(prev => prev.map(q =>
      q.qid === qid
        ? ({ ...q, options: q.options.map(o => o.id === id ? { ...o, label } : o) })
        : q
    ));

  const removeOption = (qid, id) =>
    onChange(prev => prev.map(q =>
      q.qid === qid
        ? ({ ...q, options: q.options.filter(o => o.id !== id) })
        : q
    ));

const onSetAnswer = (qid, val) => {
  onChange(prev =>
    prev.map(q => {
      if (q.qid !== qid) return q;

      if (q.type === "multiple") {
        // val: { id, label }가 추가/제거 이벤트로 들어오게 설계
        const cur = Array.isArray(q.selected) ? q.selected : [];
        const exists = cur.findIndex(x => x.id === val.id);
        const next =
          val.__remove // 체크 해제 플래그
            ? (exists >= 0 ? cur.filter(x => x.id !== val.id) : cur)
            : (exists >= 0 ? cur : [...cur, { id: val.id, label: val.label }]);
        return { ...q, selected: next, answer: null, answerText: q.answerText ?? "" };
      }

      if (q.type === "single") {
        // val: { id, label }
        return { ...q, answer: { id: val.id, label: val.label }, selected: [] };
      }

      // text / image 등
      // val: string
      return { ...q, answerText: val };
    })
  );
};

    
    const onToggleRequired = (qid, required) => {
      onChange(prev => prev.map(q => q.qid === qid ? { ...q, required } : q));
    };

  return (
    <>
      <div className="questionContainer">
        {questions.map((q, idx) => (
          <QuestionReadType
          key={q.qid}
          ref={getRef(q.qid)}
          q={q}
          onSetAnswer={onSetAnswer}
          onToggleRequired={onToggleRequired}
          qNum={idx + 1}
          onRemoveQuestion={removeQuestion}
          onSetType={setType}
          onSetTitle={setTitle}
          onSetExplain={setExplain}
          onAddOption={addOption}
          onUpdateOption={updateOption}
          onRemoveOption={removeOption}
          saveSubmit={saveSubmit}
          setFiles={setFiles}
          />
        ))}
      </div>
      {!isApplier ?
      <div className={styles.can}>
        {pathname === "/adminHome/groupSet" ?
            <button className={styles.applyBtn} type="button" onClick={() => setEditToggle(true)}>수정하기</button>
            :
            <button className={styles.applyBtn} type="button" onClick={(e) => 
              ( pathname.split('/')[3] === "survey" ?
              saveSrvyRes(e)
              : saveSubmit(e))}>{readOrEdit ? "수정하기": "제출하기"}</button>
          }
                        <button
              className={styles.backBtn}
              type="button"
              onClick={() =>
                ( pathname.split('/')[3] === "survey" ?
                navigate(-1)
                : setShowForm(!showForm))}
                >
              뒤로
            </button>
      </div> :    <button
              className={styles.backBtn}
              type="button"
              onClick={() =>
                navigate(-1)
              }>
              뒤로
            </button>
            }
    </>
  );
});

export default QuestionRead;
