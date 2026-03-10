import { useEffect, useState } from 'react';
import { useAccount } from '../../../auth/AuthContext';
import {
  fetchTodayAttendance,
  fetchTodayAttendanceByCohort,
} from '../../../attend/attendService';
import '../../../styles/Attend.css';

const STATUS_KO = {
  PRESENT: '출석',
  LATE: '지각',
  EARLY_LEAVE: '조퇴',
  ABSENT: '결석',
  PRESENT_PENDING: '출석(예정)',
  LATE_PENDING: '지각(예정)',
};

export default function TodayAttendList({ cohortSn }) {
  console.log('[TodayAttendList] 전달받은 cohortSn:', cohortSn);

  const [rows, setRows] = useState([]);
  const { user } = useAccount();

  useEffect(() => {
    const load = async () => {
      try {
        // ✅ 관리자나 테넌트가 특정 기수를 선택한 경우
        if (cohortSn) {
          const data = await fetchTodayAttendanceByCohort(cohortSn);
          setRows(data || []);
        }
        // ✅ 강사(기수 고정 사용자)인 경우
        else if (user?.USER_AUTHRT_SN === 4) {
          const data = await fetchTodayAttendance();
          setRows(data || []);
        }
      } catch (err) {
        console.error('[TodayAttendList] 출결 조회 실패:', err);
      }
    };
    load();
  }, [cohortSn]);

  return (
    <div>
      <h4>
        출결현황 <div className="specificBtn">+ 더보기</div>
      </h4>

      {rows.length === 0 ? (
        <div style={{ padding: 8, color: 'var(--font-color-gray1)' }}>오늘 데이터가 없습니다.</div>
      ) : (
        <div
          style={{
            width: '100%',
            gap: '4px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ul
            style={{
              width: '100%',
              gap: '4px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <li className="listTable">
              <div>#</div>
              <div>이름</div>
              <div>입실</div>
              <div>퇴실</div>
              <div>상태</div>
            </li>
          </ul>
          <ul style={{ width: '100%', height: '350px', overflowY: 'scroll' }}>
            {rows.map((s, idx) => (
              <li
                key={s.userSn}
                className="listTable"
                style={{ height: '30px' }}
              >
                <div>{idx + 1}</div>
                <div>{s.username}</div>
                <div>{s.checkInTime ?? '-'}</div>
                <div>{s.checkOutTime ?? '-'}</div>
                <div>
                  <span className={`badge badge--${s.status ?? 'ABSENT'}`}>
                    {STATUS_KO[s.status ?? 'ABSENT']}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
