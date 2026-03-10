// src/components/calendar/MiniCal.jsx
import React, { useEffect, useMemo, useState } from "react";
import styles from "../../styles/MiniCal.module.css";
import { buildOverlayBars, buildWeeks } from "../../utils/calendarBars";
import { useAccount } from "../../auth/AuthContext";

const z2 = (n) => String(n).padStart(2, "0");
const makeKey = (...parts) => parts.filter(Boolean).join("|");

export default function MiniCal({ selectedDate, setSelectedDate, monthlyTodoRaw }) {
  // monthlyTodoRaw: 백에서 받은 "월 전체 이벤트 원본 배열" [{eventNm, eventBgngDt, eventEndDt, ...}, ...]
  const {user} = useAccount();

  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month0 = currentDate.getMonth();
  const month = month0 + 1;
  const day = currentDate.getDate();

  const todayKey = useMemo(() => {
    const t = new Date();
    return `${t.getFullYear()}-${z2(t.getMonth() + 1)}-${z2(t.getDate())}`;
  }, []);

  const isViewingThisMonthOfToday = useMemo(() => {
    const t = new Date();
    return t.getFullYear() === year && (t.getMonth() + 1) === month;
  }, [year, month]);

  // 셀 그리드용 week 행렬
  const weeks = useMemo(() => buildWeeks(year, month), [year, month]);

  // 오버레이 바(좌표/스팬/스택 인덱스) 생성
  const { bars } = useMemo(
    () => buildOverlayBars(Array.isArray(monthlyTodoRaw) ? monthlyTodoRaw : [], year, month),
    [monthlyTodoRaw, year, month]
  );

  useEffect(() => {
    if(user) {
    const today = new Date();
    setCurrentDate(today);
    const key = `${today.getFullYear()}-${z2(today.getMonth() + 1)}-${z2(today.getDate())}`;
    setSelectedDate?.(key);
    }
  }, []);



  const prevMonth = () => {
    setCurrentDate(new Date(year, month0 - 1, 1));
    setSelectedDate?.(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month0 + 1, 1));
    setSelectedDate?.(null);
  };

  const onSelectDate = (day) => {
    if (!day) return;
    setSelectedDate?.(`${year}-${z2(month)}-${z2(day)}`);
  };

  return (
    <div className={styles.cal}>
      {/* 헤더 */}
      <div className={styles.monthNav}>
        <button onClick={prevMonth}>◀</button>
        <div>{year}. {month >= 10 ? month : `0${month}`}</div>
        <button onClick={nextMonth}>▶</button>
        <div></div>
      </div>

      {/* 요일 */}
      <div className={styles.weekdayHeader}>
        {["일","월","화","수","목","금","토"].map((d,i)=>(
          <div key={i} className={styles.weekdayCell}>{d}</div>
        ))}
      </div>

      {/* 달력 컨테이너: 아래 2 레이어 겹침 */}
      <div className={styles.calendarFrame}>
        {/* 1) 셀 레이어 */}
        <div className={styles.cellsGrid}>
          {weeks.map((week, r) => (
             <div key={makeKey("row", year, month, r)} className={styles.rowGrid}>
              {week.map((day, c) => {
                const isNull = day === null;
                const key = !isNull ? `${year}-${z2(month)}-${z2(day)}` : null;

                const isSelected = key && key === selectedDate;
                const isToday = isViewingThisMonthOfToday && key === todayKey;

                return (
                  <div
                    key={key ?? makeKey("empty", year, month, r, c)}
                    className={`${styles.cell} ${isSelected ? styles.selected : ""} ${isNull ? styles.empty : ""}`
                    }
                    onClick={() => onSelectDate(day)}
                  >
                    <div className={styles.dateLabel}>{isToday ? <>{day} <div className={styles.today}>today</div></> : day }</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* 2) 바(오버레이) 레이어 */}
        <div className={styles.barsOverlay}>
          {/* bars: {row, colStart, span, title, stackIndex, z, fullDays} */}
        {bars.map((b, idx) => {
          const seed =
            b.eventId ??
            b.startKey ??             // 'YYYY-MM-DD' 같은 시작 키
            b.title ?? "no-title";
          const safeKey = makeKey(
            "bar",
            seed,
            b.row,
            b.colStart,
            b.span,
            b.stackIndex,
            idx
          );
          return (
            <div
            key={
                safeKey
              }
              className={styles.bar}
              title={`${b.title} · ${b.fullDays}일`}
              style={{
                gridRow: b.row,              // 몇 번째 주(행)
                gridColumn: `${b.colStart} / span ${b.span}`, // 시작 요일 ~ span
                zIndex: b.z,
                // 같은 칸에서 위아래로 쌓이게 Y 오프셋
                transform: `translateY(calc(${b.stackIndex} * (var(--bar-height) + var(--bar-gap))))`,
              }}
            >
              {b.title}
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}