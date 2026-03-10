// src/components/calendar/SchedList.jsx
import React, { useState, useEffect } from "react";
import { SchedAddBtn } from './UiComp.jsx';
import SchedListPopUp from './SchedListPopUp.jsx';
import styles from '../../styles/SchedList.module.css';
import '../../styles/token.css';
import { useAccount } from "../../auth/AuthContext.jsx";
import { useLocation, useNavigate } from "react-router-dom";

function SchedList({
  selectedDate,
  displayDate,
  setDisplayDate,
  schedules,
  setSchedules,
  events,
  setEvents
}) {
  const [showPopup, setShowPopup] = useState(false);
  const { user } = useAccount();
  const curloc = useLocation();
  const navigate = useNavigate();

  const z2 = (n) => String(n).padStart(2, '0');

  useEffect(() => {
    if (!selectedDate) {
      setDisplayDate('선택된 날짜 없음');
      return;
    }
    const [y, m, d] = selectedDate.split('-').map(Number);
    setDisplayDate(`${m}월 ${d}일`);

    // 필요 시 여기서 selectedDate기준 새로 로딩할 수도 있음
    // const params = {
    //   year: y, month: m, day: d,
    //   isPrivate: (user?.USER_AUTHRT_SN ?? 9) <= 3 ? 1 : 0,
    // };
  }, [selectedDate, user, setDisplayDate]);

  // 팝업에서 { calSn, title, eventBgngDt, eventEndDt, ... } 형태로 넘겨받는다고 가정
  const handleSaveSchedule = (sched) => {
    if (!selectedDate) return;
    // if (!title || title.trim() === "") return;
    if (!sched?.title || sched.title.trim() === "") return;
    const dateKey = selectedDate;

    setSchedules(prev => {
      const prevList = prev[dateKey] || [];
      return { ...prev, [dateKey]: [...prevList, sched] };
    });
      

    // 이벤트(객체) 누적 - 여기선 제목 문자열만 넣었지만 실제론 객체 쓰면 좋음
    // setEvents(prev => {
    //   const prevEvents = prev[dateKey] || [];
    //   return { ...prev, [dateKey]: [...prevEvents, title] };
    // });

    setEvents(prev => {
        const prevEvents = prev[dateKey] || [];
        return { ...prev, [dateKey]: [...prevEvents, sched] };
      });

    setShowPopup(false);
  };

  const currentDateSchedules = schedules[selectedDate] || [];
  console.log( currentDateSchedules);
  return (
    <>
      <h4>
         <div style={{color: "#E9623A", display:"flex", gap:"4px", alignItems:"center"}}>TODO <p style={{fontSize:"1.4rem", fontWeight:"500"}}>({displayDate})</p></div>
         {curloc.pathname === "/adminHome/groupSet" ? null :
         <div className="specificBtn" onClick={() => setShowPopup(true)}>+일정등록</div>}
      </h4>

      <ul className={styles.schedList}>
        {currentDateSchedules.length === 0 ? (
          <li>등록된 일정이 없습니다.</li>
        ) : (
          // currentDateSchedules.map((item, index) => <li key={index} onClick={() => navigate(curloc.pathname === "/adminHome" ? `boardSet/readSchedule/${item?.calSn}` : `studySched/calendar/${item?.calSn}`)}>{item}</li>)
            currentDateSchedules.map((item) => (
                <li
                  key={item.calSn ?? `${item.eventBgngDt}-${item.title}`}
                  onClick={() =>
                    navigate(
                      curloc.pathname === "/adminHome"
                        ? `boardSet/readSchedule/${item.calSn}`
                        : `studySched/calendar/${item.calSn}`
                    )
                  }
                >
                  {item.title}
                </li>
              ))
        )}
      </ul>

      {showPopup && (
        <SchedListPopUp
          onClose={() => setShowPopup(false)}
          onSave={handleSaveSchedule}
          selectedDate={selectedDate}
        />
      )}
    </>
  );
}

export default SchedList;