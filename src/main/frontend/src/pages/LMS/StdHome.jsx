// import { useState } from 'react';

import FAQList from '../../components/module/FAQList';
import MaterialList from '../../components/module/MaterialList';
import NoticeList from '../../components/module/NoticeList';
import CalSched from '../../components/ui/CalSched';

// 페이지찾기 - 수강생 메인
export default function StdHome() {
    // const [selectedDate, setSelectedDate] = useState(null); // 공유할 상태
  
  return (
    <div className='dashboard-container' style={{gap: "16px"}}>
      <div className="dashboard-content-std">
        <div className='dashBoardModule' style={{ height: '100%' }}>

          <CalSched></CalSched>
          </div>
        <section className="gridSection-1col" style={{gridTemplateRows: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)", gap: "16px"}} >
          <div className='dashBoardModule' >
            <NoticeList></NoticeList>
          </div>
          <div className='dashBoardModule' >
            <MaterialList/>
          </div>
          <div className='dashBoardModule' >
            <FAQList/>
          </div>
          </section>
      </div>
      <footer className='footer-sm'>@Powered by LERMES</footer>
    </div>
  );
}