import CohortAbsenceCard from '../../components/layout/inho/CohortAbsenceCard';
import AttendAdjustAdminPage from '../../components/layout/inho/AttendAdjustAdminPage';
import CalSched from '../../components/ui/CalSched';
import AbsenceRequest from '../../components/module/attendance/AbsenceRequest';
import { useState } from 'react';

export default function AdminHome() {
  const [viewMode, setViewMode] = useState("adminView")
  
  return (
    <div className='dashboard-container' style={{gap: "16px"}}>
      <div className="dashboard-content">
        <section className="gridSection-1col" style={{gridTemplateRows: "auto 3fr 1fr 1fr 5fr", gap: "16px"}} >
        {/* <AbsenceRequest></AbsenceRequest>
          <div className='accentSection' style={{ height: '232px' }}>
          <CohortAbsenceCard />
          </div>
          <div className='accentSection' style={{height: "100%", justifyContent: "space-between" }}>
          <AttendAdjustAdminPage />
          </div> */}
          <div className='accentSection' >d</div>
          <div className='gridSection-1col' style={{gridTemplateRows: "auto auto auto", gridTemplateColumns: "1fr 1fr",  gap:"0 12px", gridTemplateAreas: `"a a3to1" "b a3to1" "c a3to1"`}} >
            <div className='accentCard text-em-strong flex'>처리 대기중인 출석 요청<AbsenceRequest></AbsenceRequest></div>
            <div className='grayCard text-em-strong flex'>처리 대기중인 면담 요청</div>
            <div className='basicCard text-em-strong flex'>답변 대기중인 문의</div>
            <div className='accentSection gridSection-1col card-title area3to1'>☀️ 출근누락 or 🌙 퇴근누락 명단 / 알림발송</div>
          </div>
          <div className='accentSection' >d</div>
          <div className='accentSection' >d</div>
          <div className='accentSection gridSection-1col' style={{gridAutoRows: "auto 1fr", gap: "16px 12px", gridTemplateColumns: "auto auto", gridTemplateAreas: `"c a" "a2to1 a2to1"`}} >
            <div className='basicCard flex' style={{gap:"12px", gridArea: "c"}}>
              <div className='flex' style={{flex: "1"}}>모집 예정</div>
              <div className='flex' style={{flex: "1"}}>모집중</div>
              <div className='flex' style={{flex: "1"}}>진행 대기</div>
            </div>
            <div className='card-title flex' style={{gridArea: "a"}} > - 이건 사실 필터임</div>
            <div className='basicCard area2to1 gridSection-1col'>
              <div className='text-em-strong'>진행중인 과정</div>
              <a> 과정명(종료일 디데이) / 강사 / 정원 /출결주의대상 /만족도(되면 이건 과제제출에 설문으로 내면되겠다)</a>
              <a> 과정명(시작일/종료일/시작일 디데이) / 강사 / (지원/최종)/모집정원</a>
              <a> 과정명(종료일 디데이) / 강사 / 정원 /출석경고</a>
            </div>
          </div>
        </section>
          <div className='basicCard' >
            <CalSched></CalSched>
          </div>
      </div>
        <div className='indicator-right'>
          <div className={`pageDot  ${viewMode === "adminView" ? "currentView" : ""}`} onClick={() => setViewMode("adminView")}></div>
          <div className={`pageDot  ${viewMode === "visitorView" ? "currentView" : ""}`} onClick={() => setViewMode("visitorView")}></div>
        </div>
        <footer className='footer-sm'>@Powered by LERMES</footer>
    </div>
  );
}
