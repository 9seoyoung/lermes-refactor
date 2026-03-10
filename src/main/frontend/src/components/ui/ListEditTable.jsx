import { useEffect, useId, useMemo, useRef, useState } from "react";
import styles from "../../styles/UiComp.module.css";
import { deleteAccount } from "../../services/accountService";
import { toast } from "react-toastify";
// import Dropdown from "./Dropdown"; // 커스텀 드롭다운 쓸거면 주석 해제

export default function ListEditTable({
  tableHead = [],
  apiData = [],
  columnData = [],
  addStyle = {},
  handleChange,        // 외부 제어용(옵션)
  onRowsChange,        // 상위로 행 변경 알림(옵션) — 플레이스홀더 제외
  gridTemplate,
  gap = 0,
  type = [],
  options = {}         // { [fieldName]: Array }  (문자열/숫자 배열 or 객체 배열)
}) {
  // ---------- 유틸 ----------
  const makeEmptyRow = () => {
    const base = {};
    columnData.forEach((c) => (base[c] = ""));
    return {
      __tmpId: `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      __placeholder: true,
      ...base,
    };
  };

  const ensureTrailingPlaceholder = (list) => {
    if (!list.length || !list[list.length - 1]?.__placeholder) {
      return [...list, makeEmptyRow()];
    }
    return list;
  };

  const stripPlaceholder = (list) => list.filter((r) => !r.__placeholder);

  const getRowId = (row, i) =>
    row.id ?? row.sn ?? row.MAT_SN ?? row.USER_SN ?? row.__tmpId ?? i;

  const hasAnyValue = (row) =>
    columnData.some((c) => {
      const v = row[c];
      return v !== undefined && v !== null && String(v).trim() !== "";
    });

  // ---------- 행 상태 ----------
  const [rows, setRows] = useState(() => ensureTrailingPlaceholder(apiData ?? []));
  useEffect(() => {
    setRows(ensureTrailingPlaceholder(apiData ?? []));
  }, [apiData]);

  const emitRows = (next) => {
    setRows(next);
    onRowsChange?.(stripPlaceholder(next));
  };

  // ---------- 선택 상태 (플레이스홀더 제외) ----------
  const tempId = useId();
  const [selected, setSelected] = useState(() => new Set());
  const headerCbRef = useRef(null);

  const selectableRows = useMemo(() => rows.filter((r) => !r.__placeholder), [rows]);
  const allIds = useMemo(() => selectableRows.map(getRowId), [selectableRows]);
  const allSelected = selected.size > 0 && selected.size === allIds.length;
  const someSelected = selected.size > 0 && selected.size < allIds.length;

  useEffect(() => {
    if (headerCbRef.current) headerCbRef.current.indeterminate = someSelected;
  }, [someSelected]);

  const toggleAll = () => {
    setSelected((prev) =>
      prev.size === allIds.length ? new Set() : new Set(allIds)
    );
  };
  const toggleRow = (id) => {
    setSelected((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  // const handleBulkDelete = () => {
  //   if (selected.size === 0) return;
  //   const next = rows.filter((r, i) => {
  //     if (r.__placeholder) return true; // 플레이스홀더 보존
  //     const id = getRowId(r, i);
  //     return !selected.has(id);
  //   });
  //   emitRows(ensureTrailingPlaceholder(next));
  //   setSelected(new Set());
  // };
  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
  
    const checkedRows = rows
      .filter((r, i) => !r.__placeholder && selected.has(getRowId(r, i)));
  
    const sns = checkedRows.map(r => r.userSn).filter(Boolean);
  
    try {
      await Promise.all(sns.map(id => deleteAccount(id)));
      toast.success(`${sns.length}개 계정이 삭제되었습니다.`);
    } catch (err) {
      console.error(err);
      toast.error("삭제 중 오류 발생");
    }
  
    const next = rows.filter((r, i) => {
      if (r.__placeholder) return true;
      const id = getRowId(r, i);
      return !selected.has(id);
    });
    emitRows(ensureTrailingPlaceholder(next));
    setSelected(new Set());
  };


  // ---------- 포커스 관리 ----------
  const refMap = useRef(new Map()); // key: `${rowKey}:${colIndex}` -> HTMLInputElement
  const setInputRef = (rowKey, colIndex) => (el) => {
    const k = `${rowKey}:${colIndex}`;
    if (el) refMap.current.set(k, el);
    else refMap.current.delete(k);
  };

  const [pendingFocusKey, setPendingFocusKey] = useState(null);
  useEffect(() => {
    if (pendingFocusKey) {
      const el = refMap.current.get(pendingFocusKey);
      if (el) {
        el.focus();
        setPendingFocusKey(null);
      }
    }
  }, [rows, pendingFocusKey]);

  // ---------- 셀 변경 ----------
  const internalChange = (e, { rowIndex, col /*, colIndex */ }) => {
    const value = e?.target?.value ?? e; // 커스텀 컴포넌트 값 대응
    const next = rows.map((r, i) => (i === rowIndex ? { ...r, [col]: value } : r));

    const curr = next[rowIndex];
    // 플레이스홀더에 입력이 생기면 → 일반행 전환 + 새 플레이스홀더 보장
    if (curr.__placeholder && hasAnyValue(curr)) {
      delete curr.__placeholder;
      emitRows(ensureTrailingPlaceholder(next));
    } else {
      emitRows(next);
    }
  };

  const onCellChange = (e, meta) => {
    if (handleChange) return handleChange(e, meta);
    internalChange(e, meta);
  };

  // ---------- 레이아웃 ----------
  // 체크박스 + # 컬럼이 있으므로 +2
  const resolvedTemplate = useMemo(() => {
    if (Array.isArray(gridTemplate)) return gridTemplate.join(" ");
    if (gridTemplate) return gridTemplate;
    const cols = (tableHead?.length || columnData?.length || 1) + 2;
    return `repeat(${cols}, minmax(0,1fr))`;
  }, [gridTemplate, tableHead, columnData]);

  return (
    <>
      <div style={{display: "flex", flexDirection:"column", width: "100%"}}>
      {/* 툴바 */}
      <ul style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, justifyContent: "space-between" }}>
        <li>
          <label style={{ display: "inline-flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
            <input
              ref={headerCbRef}
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
            />
            전체선택
          </label>
        </li>
        <li>
          <button
            id="accountD_Btn"
            onClick={handleBulkDelete}
            disabled={selected.size === 0}
            style={{ opacity: selected.size === 0 ? 0.5 : 1, color: selected.size === 0 ? undefined : "#E9623A" }}
          >
            내보내기 ({selected.size})
          </button>
        </li>
      </ul>
      <ul
        className={styles.ListTbBg}
        style={{ ['--cols']: resolvedTemplate, ['--gap']: gap , boxShadow: "4px 4px 4px #00000025", position: "relative", zIndex: "3" }}
      >
        {tableHead?.length > 0 && (
          <li key="tableHead" id={styles.ListHeader} className={styles.gridRow}>
            <div className={styles.cell} />         {/* 체크박스 헤더 빈칸 */}
            <div className={styles.cell}>#</div>    {/* # 헤더 */}
            {tableHead?.map((col, idx) => (
              <div key={`th-${idx}`} className={styles.cell}>
                {col}
              </div>
            ))}
          </li>
        )}
        </ul>

      {/* 테이블 */}
      <div style={{...addStyle, background: "var(--color-light-bg"}}>
      <ul
        className={styles.ListTbBg}
        style={{ ['--cols']: resolvedTemplate, ['--gap']: gap , position: "relative", zIndex: "3" }}
      >

        {rows?.map((row, i) => {
          const rowKey = getRowId(row, i);
          const isPh = !!row.__placeholder;
          const checked = !isPh && selected.has(rowKey);

          return (
            <li key={rowKey} className={`${styles.row} ${styles.gridRow}`}>
              {/* 체크박스: 플레이스홀더면 표시X */}
              <div className={styles.cell}>
                {isPh ? (
                  <span style={{ opacity: 0.4 }}>—</span>
                ) : (
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleRow(rowKey)}
                    value={rowKey}
                  />
                )}
              </div>

              {/* # */}
              <div className={styles.cell}>{i + 1}</div>

              {/* 데이터 컬럼 */}
              {columnData?.map((field, j) => {
                const isSelect = type[j] === "select";
                const fieldOptions = options[field] ?? [];

                const onKeyDown = (e) => {
                  // 마지막 열에서 Tab → 새 줄/포커스
                  if (
                    e.key === "Tab" &&
                    !e.shiftKey &&
                    j === columnData.length - 1
                  ) {
                    // 현재 마지막 행이거나, 다음 행이 플레이스홀더가 아니면 추가
                    const isLastRow = i === rows.length - 1;
                    if (isLastRow || !rows[rows.length - 1]?.__placeholder) {
                      e.preventDefault();
                      let next = rows.slice();
                      if (!next[next.length - 1]?.__placeholder) {
                        next = ensureTrailingPlaceholder(next);
                        emitRows(next);
                      } else {
                        emitRows(next);
                      }
                      const newRow = next[next.length - 1];
                      const newKey = getRowId(newRow, next.length - 1);
                      setPendingFocusKey(`${newKey}:0`);
                    }
                  }
                };

                return (
                  <div
                    key={`${rowKey}-${j}`}
                    className={styles.cell}
                    onKeyDown={onKeyDown}
                  >
                    {isSelect ? (
                      // --- 네이티브 select (객체/원시 옵션 모두 대응) ---
                      <select
                        className={styles.gridRow}
                        name={field}
                        value={row?.[field] ?? ""}
                        onChange={(e) => onCellChange(e, { row, rowIndex: i, col: field, colIndex: j })}
                        style={{ margin: "2px 12px" }}
                      >
                        <option value="" disabled hidden>선택</option>

                        {/* 문자열/숫자 배열 */}
                        {Array.isArray(fieldOptions) &&
                          (typeof fieldOptions[0] !== "object") &&
                          fieldOptions?.map((val, idx) => (
                            <option key={`${rowKey}-${j}-${idx}`} value={val}>
                              {String(val)}
                            </option>
                          ))}

                        {/* 객체 배열 (cohortList 등) */}
                        {Array.isArray(fieldOptions) &&
                          (typeof fieldOptions[0] === "object") &&
                          fieldOptions.map((opt, idx) => {
                            const value =
                              opt.value ?? opt.id ?? opt.cohortSn ?? opt.sn ?? opt.key;
                            const label =
                              opt.label ?? opt.name ?? opt.cohortNm ?? String(value);
                            return (
                              <option key={`${rowKey}-${j}-${idx}`} value={value}>
                                {label}
                              </option>
                            );
                          })}
                      </select>

                      // --- 커스텀 드롭다운 쓰려면 아래를 사용 ---
                      // <Dropdown
                      //   options={fieldOptions}
                      //   value={row?.[field] ?? ""}
                      //   onChange={(val) => onCellChange(val, { row, rowIndex: i, col: field, colIndex: j })}
                      // />
                    ) : (
                      <input
                        ref={setInputRef(rowKey, j)}
                        className={styles.gridRow}
                        type={type[j] ?? "text"}
                        name={field}
                        style={{ margin: "2px 12px", padding: "2px 8px" }}
                        value={row?.[field] ?? ""}
                        onChange={(e) => onCellChange(e, { row, rowIndex: i, col: field, colIndex: j })}
                      />
                    )}
                  </div>
                );
              })}
            </li>
          );
        })}
      </ul>
      </div>
      </div>
    </>
  );
}