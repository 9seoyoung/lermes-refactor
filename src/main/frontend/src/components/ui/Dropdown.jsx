import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import "../../styles/dropdown.css";

const Dropdown = forwardRef(function Dropdown(
  {
    trigger = "click", // "click" | "hover" | "both"
    label = "Dropdown",
    children,
    className = "",
    placement = "bottom-start", // "bottom-start" | "bottom-end"
    disabled = false,
  },
  ref
) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const btnRef = useRef(null);
  const hoverTimer = useRef(null);

  // imperative handle
  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen((v) => !v),
    isOpen: () => open,
  }));

  // 외부 클릭 닫기
  useEffect(() => {
    const onDown = (e) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // ESC 닫기
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  

  // hover 핸들러 (디바운스 느낌으로 부드럽게)
  const startHoverOpen = () => {
    if (trigger === "hover" || trigger === "both") {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = setTimeout(() => setOpen(true), 60);
    }
  };
  const startHoverClose = () => {
    if (trigger === "hover" || trigger === "both") {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = setTimeout(() => setOpen(false), 120);
    }
  };

  const handleButtonClick = () => {
    if (disabled) return;
    if (trigger === "click" || trigger === "both") {
      setOpen((v) => !v);
    }
  };

  // placement 클래스
  const placementClass =
    placement === "bottom-end" ? "dd__menu--end" : "dd__menu--start";

    const handleMenuClickCapture = (e) => {
      // 선택으로 취급할 요소 규칙: data-dd-select 달린 가장 가까운 조상
      const selectable = e.target.closest("[data-dd-select]");
      if (!selectable) return;              // 선택 항목이 아니면 무시
      if (selectable.hasAttribute("disabled")) return; // 비활성화 항목 무시
      if (selectable.hasAttribute("data-keep-open")) return; // 열어둬야 하면 무시
      setOpen(false);
    };
    

  return (
    <div
      className={`dd ${className}`}
      ref={boxRef}
      onMouseEnter={startHoverOpen}
      onMouseLeave={startHoverClose}
    >
      <button
        ref={btnRef}
        className="dd__button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={handleButtonClick}
        disabled={disabled}
        
      >
        {label}
        <div className={`dd__chev ${open ? "is-open" : ""}`} aria-hidden>
          ▾
        </div>
      </button>

      <div
        data-dd-select
        className={`dd__menu ${placementClass} ${open ? "is-open" : ""}`}
        role="menu"
        onClickCapture={handleMenuClickCapture}
      >
        {children}
      </div>
    </div>
  );
});

export default Dropdown;