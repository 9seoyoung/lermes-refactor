// CohortAbsenceCard.jsx
import { useEffect, useState } from 'react';
import { getAbsenceByCohortToday } from '../../../attend/attendService';
import '../../../styles/Attend.css'; // ← 새 CSS

export default function CohortAbsenceCard() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getAbsenceByCohortToday()
      .then(setRows)
      .catch(() => setRows([]));
  }, []);

  if (!rows.length) return (
      <>
      <div className="coh-card__head">
          <h3 className="coh-card__title">교육 과정별 결석 현황</h3>
          <span className="coh-card__period" noborder={"no"}>
          {new Date().toLocaleDateString()}
        </span>
      </div>
    <div className="coh-card__divider" />
          <div className="coh-card__body" style={{ color: 'var(--font-color-gray1)' }}>
              등록된 과정이 없습니다.
          </div>
      </>
  );

  return (
    <>
      <div className="coh-card__head">
        <h3 className="coh-card__title">교육 과정별 결석 현황</h3>
        <span className="coh-card__period">
          {new Date().toLocaleDateString()}
        </span>
      </div>

      <div className="coh-card__divider" />

      <div
        className="coh-grid"
        style={{ gridTemplateColumns: `repeat(${rows.length}, 1fr)` }}
      >
        {rows.map((r) => (
          <div className="coh-item" key={r.cohortSn}>
            <div className="coh-item__label">{r.label}</div>
            <div className="coh-item__value">{r.absent}</div>
          </div>
        ))}
      </div>
    </>
  );
}
