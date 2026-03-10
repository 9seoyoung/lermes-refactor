import React from 'react';
import AttendanceSummaryCard from '../components/layout/inho/AttendanceSummaryCard';
import AttendAdjustStudentRequestList from '../components/layout/inho/AttendAdjustStudentRequestList';
import AttendAdjustAdminPage from '../components/layout/inho/AttendAdjustAdminPage';

function Mypage() {
  return (
    <div>
      <div>Mypage</div>
      <AttendanceSummaryCard />
      <AttendAdjustStudentRequestList />
    </div>
  );
}

export default Mypage;
