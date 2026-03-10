import { useEffect, useState } from 'react';
import { getAttendSummary } from '../../../attend/attendService';
import '../../../styles/Attend.css';

function AttendanceSummaryCard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getAttendSummary()
      .then(setSummary)
      .catch(() => {});
  }, []);

  if (!summary) return null; // 로딩 텍스트 대신 깔끔히 숨김

  return (
    <section className="att-card">
      <div className="att-card__head">
        <h2 className="att-card__title">출석 현황</h2>
        <span className="att-card__period">({summary.period})</span>
      </div>

      <div className="att-card__divider" />

      <div className="att-card__stats">
        <div className="att-stat">
          <div className="att-stat__label">출석</div>
          <div className="att-stat__value att--present">{summary.present}</div>
        </div>

        <div className="att-stat">
          <div className="att-stat__label">지각/조퇴/외출</div>
          <div className="att-stat__value att--leoe">
            {summary.lateEarlyOut}
          </div>
        </div>

        <div className="att-stat">
          <div className="att-stat__label">결석</div>
          <div className="att-stat__value att--absent">{summary.absent}</div>
        </div>

        <div className="att-stat">
          <div className="att-stat__label">출석 요구일</div>
          <div className="att-stat__value">{summary.requiredDays}</div>
        </div>
      </div>
    </section>
  );
}

export default AttendanceSummaryCard;
