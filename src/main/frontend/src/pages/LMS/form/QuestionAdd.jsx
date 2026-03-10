// QuestionAdd.jsx
import React, {
  forwardRef, useRef, useImperativeHandle, createRef, useEffect,
  useState
} from "react";
import { v4 as uuid } from "uuid";
import { Plus } from "lucide-react";
import QuestionType from "./QuestionType";

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
  // 응답 필드들
  answer: null,         // single
  selected: [],         // multiple
  answerText: "",       // text
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
const QuestionAdd = forwardRef(function QuestionAdd({ questions = [], onChange, containerRef }, ref) {
  const [files, setFiles] = useState([]);
  const itemRefs = useRef({});
  const pendingFocusId = useRef(null);

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
      onChange(prev => prev.map(q => q.qid === qid ? { ...q, answer: val } : q));
    };
    
    const onToggleRequired = (qid, required) => {
      onChange(prev => prev.map(q => q.qid === qid ? { ...q, required } : q));
    };
    

  return (
    <>
      <div className="questionContainer">
        {questions.map((q, idx) => (
          <QuestionType
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
            setFiles={setFiles}
          />
        ))}
      </div>

      <button type="button" className="questionAdd" onClick={addQuestionAndFocus}>
        <Plus color="#0088FF" strokeWidth={4} />
        <p>질문추가</p>
      </button>
    </>
  );
});

export default QuestionAdd;
