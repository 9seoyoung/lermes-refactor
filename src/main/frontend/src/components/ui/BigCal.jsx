// 학습관리용 큰 캘린더

import React, { useEffect } from 'react';
import styles from '../../styles/BigCal.module.css';

const BigCal = (props) => {
  const {selectedDate, setSelectedDate = () => {}, currentDate, setCurrentDate = () => {}, events, setEvents = () => {}} = props;

// 새로고침하면 오늘 날짜 선택


  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDay = firstDay.getDay();
  const daysInMonth = [];

  for (let i = 0; i < startDay; i++) {
    daysInMonth.push(null);
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    daysInMonth.push(i);
  }

  // 주 단위로 나누고 부족한 칸 null로 채움
  const weeks = [];
  for (let i = 0; i < daysInMonth.length; i += 7) {
    let week = daysInMonth.slice(i, i + 7);
    while (week.length < 7) {
      week.push(null);
    }
    if (week.some((day) => day !== null)) {
      weeks.push(week);
    }
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const onSelectDate = (day) => {
    if (day === null) return;
    setSelectedDate(day);
  };

  const onAddEvent = () => {
    if (!selectedDate) {
      alert('일정을 추가할 날짜를 먼저 선택하세요.');
      return;
    }
    const title = prompt('일정 제목을 입력하세요');
    if (title) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(
        selectedDate
      ).padStart(2, '0')}`;
      setEvents((prev) => {
        const prevEvents = prev[dateKey] || [];
        return {
          ...prev,
          [dateKey]: [...prevEvents, title],
        };
      });
    }
  };

  // 캘린더 전체 높이 고정 (원하는 값으로 조절 가능)
  const totalCalendarHeight = 500;
  const weekCount = weeks.length;
  const weekHeight = totalCalendarHeight / weekCount;

  return (
    <div className={styles.cal}>
     {/* 상단 네비게이션 */}
     <div className={styles.month}>
        <button onClick={prevMonth}>◀</button>
        <h3>
          {year}년 {month + 1}월
        </h3>
        <button onClick={nextMonth}>▶</button>
      </div>

      {/* 요일 헤더 */}
      <div
        className={styles.day}>
        {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => {
          const color = idx === 0 ? 'red' : idx === 6 ? 'blue' : 'black';
          return (
            <div key={idx} style={{ fontWeight: 'bold', color, padding: 8 }}>
              {day}
            </div>
          );
        })}
      </div>

      {/* 날짜 셀 */}
      {weeks.map((week, weekIdx) => (
        <div
          key={weekIdx}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center',
            height: weekHeight,
          }}
        >
          {week.map((day, idx) => {
            const dayOfWeek = idx;

            const dateKey = day
              ? `${year}-${String(month + 1).padStart(2, '0')}-${String(
                  day
                ).padStart(2, '0')}`
              : null;

            const selectedDateKey = selectedDate
              ? `${year}-${String(month + 1).padStart(2, '0')}-${String(
                  selectedDate
                ).padStart(2, '0')}`
              : null;
            const isSelected = day !== null && dateKey === selectedDateKey;

            let color = 'black';
            if (day !== null) {
              if (dayOfWeek === 0) color = 'red';
              else if (dayOfWeek === 6) color = 'blue';
            } else {
              color = 'transparent';
            }

            return (
              <div
                key={idx}
                onClick={() => onSelectDate(day)}
                className={`${styles.calendarCell} ${
                  isSelected ? styles.selected : styles.unselected
                }`}
                style={{
                  color: day !== null ? color : 'transparent',
                }}
              >
                {/* 날짜 숫자 */}
                {day || ''}

                {/* 일정 모두 표시 */}
                {dateKey && events[dateKey] && events[dateKey].length > 0 && (
                  <div className={styles.eventCell}>
                    {events[dateKey].map((event, i) => (
                      <div key={i} className={styles.event}>
                        {event}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* 일정 추가 버튼 */}
       {/* <div className={styles.addEventBtn}>
        <button onClick={onAddEvent} className={styles.addEvent}>
          일정 추가
        </button>
      </div> */}
    </div>
  );
};

export default BigCal;
