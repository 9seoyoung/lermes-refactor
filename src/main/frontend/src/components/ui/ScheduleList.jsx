// 일정 목록

import React, { useState, useEffect } from "react";
import SchedListPopUp from './SchedListPopUp.jsx';
import styles from '../../styles/SchedList.module.css';
import { useLocation } from "react-router-dom";

export default function ScheduleList({selectedDate, toDoList}) {
  const [schedules, setSchedules] = useState({});   // 날짜별 일정 저장
  const [showPopup, setShowPopup] = useState(false); // 💡 팝업 상태 추가
  const [displayDate, setDisplayDate] = useState('');
  const curloc = useLocation();

  useEffect(() => {
    if (selectedDate) {
      // selectedDate는 'YYYY-MM-DD' 문자열
      const [ , month, day] = selectedDate.split('-').map(Number);
      setDisplayDate(`${month}월 ${day}일`);
    } else {
      setDisplayDate('선택된 날짜 없음');
    }
  }, [selectedDate]);

    // 팝업창에서 제목, 시작일 받아서 일정 추가
    const handleSaveSchedule = ({ title, startDate }) => {
      if (title.trim() !== "" && selectedDate) {
        setSchedules(prev => {
          const prevList = prev[selectedDate] || [];
          return {
            ...prev,
            [selectedDate]: [...prevList, title]
          };
        });
      }
      setShowPopup(false);
    };

      // 현재 날짜의 일정만 가져오기
      const currentDateSchedules = schedules[selectedDate] || [];

  return (
    <>
      <h4>
         <div style={{color: "#E9623A", display:"flex", gap:"4px", alignItems:"center"}}>TODO <p style={{fontSize:"1.4rem", fontWeight:"500"}}>({displayDate})</p></div>
         {curloc.pathname === "/adminHome/groupSet" ? null :
         <div className="specificBtn">+일정등록</div>}
      </h4>

      <ul className={styles.schedList}>
      {currentDateSchedules.length === 0 ? (
      <li>등록된 일정이 없습니다.</li>
      ) : (
      currentDateSchedules.map((item, index) => <li key={index}>{item}</li>)
      )}
      </ul>

      {showPopup && <SchedListPopUp onClose={() => setShowPopup(false)}
       /* title={input} */
       onSave={handleSaveSchedule}
       selectedDate={selectedDate}
       />}
    </>
  );
}
