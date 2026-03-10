// // 페이지찾기 - 강사 메인
// export default function TutorHome() {
//   return (
//     <>
//       <div>강사 4</div>
//     </>
//   );
// }

import NoticeList from '../../components/module/NoticeList';
import TodayAttendList from '../../components/layout/inho/TodayAttendList';
import CalSched from '../../components/ui/CalSched';
import SchedList from '../../components/ui/SchedList';

export default function StdHome() {
  return (
    <div className="mainCont_Lms_Row" style={{height:"702px"}}>
      <div className="main_L" style={{ width: '40%' }}>
        <div className='dashBoardModule' style={{ height: '100%' }}>
          <CalSched></CalSched>
        </div>
      </div>
      <div className="main_R" style={{ flex: '1', gap: '16px' }}>
        <div  className='dashBoardModule'style={{ height: '232px' }}>
          <NoticeList></NoticeList>
        </div>
        <div className='dashBoardModule' style={{ height: '470px' }}>
          <TodayAttendList></TodayAttendList>
        </div>
      </div>
    </div>
  );
}
