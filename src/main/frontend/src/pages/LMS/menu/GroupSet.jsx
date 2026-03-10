import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FilterList from "../../../components/ui/FilterList";
import { useAccount } from "../../../auth/AuthContext";
import { useSelectedCompany } from "../../../contexts/SelectedCompanyContext";
import { hortlistByCpSn } from "../../../services/cohortService";
import TodayAttendList from "../../../components/layout/inho/TodayAttendList";
import ScheduleList from "../../../components/ui/SchedList";
import styles from '../../../styles/CalSched.module.css';
import MiniCal from "../../../components/ui/MiniCal";
import { pullToDoList } from "../../../services/calService";
import { diffDaysInclusive } from "../../../utils/dateformat";
import { Settings } from "lucide-react";
import RecruitRead from "../readAndEdit/RecruitRead";
import RecruitEdit from "../readAndEdit/RecruitEdit";


const z2 = (n) => String(n).padStart(2, '0');


function GroupSet() {
  const navigate = useNavigate();
  const { user } = useAccount();
  const {effectiveSn} = useSelectedCompany();
  const [selectedDate, setSelectedDate] = useState(null);
  const [todayList, setTodayList] = useState([]);
  const [schedules, setSchedules] = useState({});
  const [monthlyTodoRaw, setMonthlyTodoRaw] = useState([]); // ★ 원본 배열

  const [events, setEvents] = useState([]); // { 'YYYY-MM-DD': ['일정1', '일정2'] }
  const [displayDate, setDisplayDate] = useState(''); // 문자열
  const [selectedIdx, setSelected] = useState(0);
  const [selectedCohortSn, setSelectedCohortSn] = useState(null);
  const [manageToggle, setManageToggle] = useState(false);
  const [editToggle, setEditToggle] = useState(false);
  const location = useLocation();
  const curloc = location.pathname;

  const coSn = user?.USER_OGDP_CO_SN;

  const [hortlist, setHortList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterArr, setFilterArr] = useState([]);
  const cohortSn = useMemo(
      () => (Array.isArray(hortlist) && hortlist[selectedIdx]?.cohortSn) ?? null,
      [hortlist, selectedIdx]
    );
  // 과정 리스트
  useEffect(() => {
    if (!coSn) return;
    let ignore = false;

    (async () => {
      try {
        console.log(`${coSn}-회사SN으로 과정리스트 불러오기API 실행 >>>>>>>>>>>>>>>>>>`)
        setLoading(true);
        const res = await hortlistByCpSn(Number(coSn));
        console.log(res);
        console.log(`${res.data}-회사SN으로 과정리스트 불러오기API 응답 <<<<<<<<<<<<<<<<<<<`)
        // if (!ignore) setHortList(res?.data ?? []);
        if (!ignore) {
          setHortList(res?.data.cohorts );
        }
        console.log(`${hortlist}-회사SN으로 상태에 저장한 리스트`)
      } catch (e) {
        console.error("[GroupSet] hortlistByCpSn error:", e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => { ignore = true; };
  }, [coSn, selectedIdx]);

  // 필터 배열
  useEffect(() => {
    const names = (hortlist || []).map(h => h?.cohortNm).filter(Boolean);
    setFilterArr(names);
  }, [hortlist]);

    useEffect(() => {
      if (!selectedDate || !user || !cohortSn) {
        setDisplayDate('선택된 날짜 없음');
        return;
      }

      const [year, month, day] = selectedDate.split('-').map(Number);
      const dateKey = `${year}-${z2(month)}-${z2(day)}`;

      const params = {
        year,
        month,
        day,
        isPrivate: 0,
        cohortSn: cohortSn,
      };
      setDisplayDate(`${month}월 ${day}일`);

    (async () => {
      try {
        // 당일 목록
        const res = await pullToDoList(params); // axios.get('/api/...', { params })
        const list = res?.data ?? [];
        setTodayList(list);
        console.log(`>>>>>>>>>>>>>>>>>>>당일 목록 불러옴 ${res.data}`)
        console.log(list);

        // 사이드 목록(텍스트)와 events(객체) 갱신
        setSchedules(prev => ({
          ...prev,
          [selectedDate]: list.map(v => v.eventNm)
        }));

        setEvents(prev => ({
          ...prev,
          [dateKey]: list
        }));

        // 월 전체 목록
        const monthlyRes = await pullToDoList({ year, month, isPrivate: 0, cohortSn });

        const raw = monthlyRes?.data;
        console.log("월목록")
        console.log(raw);

        const monthlyList = Array.isArray(raw) ? raw : Object.values(raw ?? {});
        setMonthlyTodoRaw(monthlyList);  // ★ 항상 배열


          // (선택) 전체 기간 일수 필드 부여해두면 다른 곳에서 재사용 편함
          const withPeriod = monthlyList.map(v => ({
            ...v,
            periodDays: diffDaysInclusive(v.eventBgngDt, v.eventEndDt),
          }));

          // 미니캘용 맵
        } catch (err) {
          console.error("[pullToDoList] error:", err?.response?.data ?? err);
        }
      })();

    }, [selectedDate, user, cohortSn]);


    if (!user) return <div>로딩 중…</div>;


  return (
    <div className="boardPage">
      <h2>과정 관리</h2>

      <div className="filterList">
        <FilterList arr={filterArr} selectedIdx={selectedIdx} setSelected={setSelected} loading={loading}>
          <li className="opacityBtn" onClick={() => { navigate('createGroup'); }}>+</li>
        </FilterList>
        <div className="ftList_R" >
          <button
            type="button"
            className="manageBtn"
            onClick={() => setManageToggle(!manageToggle)}
            >
            <Settings size={20} strokeWidth={2} />
            관리
          </button>
        </div>
      </div>
      {manageToggle ? 
          <>
            {editToggle ? 
              <RecruitEdit propCohortSn={cohortSn} editToggle={editToggle} setEditToggle={setEditToggle}/>
              :
              <RecruitRead propCohortSn={cohortSn} editToggle={editToggle} setEditToggle={setEditToggle}/>
            }
          </>
        : 
      <div className="mainCont_Lms_Row">
        <div className="main_L" style={{ width: '40%' }}>
          <div className='dashBoardModule' style={{ flex: 1 }}>
      <div className={styles.miniCalWrapper}>
        <MiniCal
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          monthlyTodoRaw={monthlyTodoRaw}
        />
      </div>
          </div>
        </div>

        <div className="main_R" style={{ flex: '1', gap: '16px' }}>
          <div className='dashBoardModule' style={{ height: '232px' }}>
            <ScheduleList          
            setSchedules={setSchedules}
            schedules={schedules}
            events={events}
            setEvents={setEvents}
            selectedDate={selectedDate}
            displayDate={displayDate}
            setDisplayDate={setDisplayDate}
            todayList={todayList}/>
          </div>
          <div className="dashBoardModule" style={{ overflow: 'hidden', flex: '1' }}>
            <TodayAttendList cohortSn={cohortSn} />
          </div>
        </div>
      </div>
  }
    </div>
  );
}

export default GroupSet;