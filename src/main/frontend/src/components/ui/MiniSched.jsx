// src/components/calendar/CalSched.jsx
import React, { useEffect, useState } from 'react';
import MiniCal from './MiniCal.jsx';
import SchedList from './SchedList.jsx';
import styles from '../../styles/CalSched.module.css';
import { useAccount } from '../../auth/AuthContext.jsx';
import { pullToDoList } from "../../services/calService.js";
import { diffDaysInclusive } from '../../utils/dateformat.js';
import { useLocation } from 'react-router-dom';

const z2 = (n) => String(n).padStart(2, '0');

const MiniSched = () => {
  const { user } = useAccount();
  const [selectedDate, setSelectedDate] = useState(null);
  const [displayDate, setDisplayDate] = useState('');
  const [todayList, setTodayList] = useState([]);
  const [schedules, setSchedules] = useState({});
  const [events, setEvents] = useState({});
  const [monthlyTodoRaw, setMonthlyTodoRaw] = useState([]); 
  const location = useLocation();
  const curloc = location.pathname;


  useEffect(() => {
    if (!selectedDate || !user) {
      setDisplayDate('선택된 날짜 없음');
      return;
    }
      const [year, month, day] = selectedDate.split('-').map(Number);
      const dateKey = selectedDate; 

    const params = {
      year,
      month,
      day,
      isPrivate: (user.USER_AUTHRT_SN <= 3 ? 1 : null),
    };

    setDisplayDate(`${month}월 ${day}일`);

    (async () => {
      try {
        // 당일 목록
        const res = await pullToDoList(params); // axios.get('/api/...', { params })
        // const list = res?.data ?? [];
        // setTodayList(list);
        const listRaw = res?.data ?? [];
        const list = listRaw.map(v => ({
          calSn: v.calSn,
          title: v.eventNm,
          eventBgngDt: v.eventBgngDt,
          eventEndDt: v.eventEndDt,
          ...v,
        }));
        setTodayList(list);

        // setSchedules(prev => ({
        //   ...prev,
        //   [selectedDate]: list.map(v => v.eventNm)
        // }));

        // setEvents(prev => ({
        //   ...prev,
        //   [dateKey]: list
        // }));
        setSchedules(prev => ({ ...prev, [selectedDate]: list }));
        setEvents(prev => ({ ...prev, [dateKey]: list }));

        // 월 전체 목록
        const monthlyRes = await pullToDoList(user.USER_AUTHRT_SN <= 3 ? { year, month, isPrivate: 1 } : {year, month});



        const raw = monthlyRes?.data;
        const monthlyListRaw = Array.isArray(raw) ? raw : Object.values(raw ?? {});
        const monthlyList = monthlyListRaw.map(v => ({
          calSn: v.calSn,
          title: v.eventNm,
          eventBgngDt: v.eventBgngDt,
          eventEndDt: v.eventEndDt,
          ...v,
        }));
        setMonthlyTodoRaw(monthlyList); 

        const withPeriod = monthlyList.map(v => ({
          ...v,
          periodDays: diffDaysInclusive(v.eventBgngDt, v.eventEndDt),
        }));

      } catch (err) {
        console.error("[pullToDoList] error:", err?.response?.data ?? err);
      }
    })();

  }, [selectedDate, user]);

  return (
    <>
      <div className={styles.miniCalWrapper}>
        <MiniCal
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          monthlyTodoRaw={monthlyTodoRaw}
        />
      </div>

      <div className={styles.schedListWrapper}>
        <SchedList
          setSchedules={setSchedules}
          schedules={schedules}
          events={events}
          setEvents={setEvents}
          selectedDate={selectedDate}
          displayDate={displayDate}
          setDisplayDate={setDisplayDate}
        />
      </div>
    </>
  );
};

export default MiniSched;