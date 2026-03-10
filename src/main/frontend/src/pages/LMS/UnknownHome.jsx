import React from 'react'
import { applyEmp } from '../../services/accountService';
import { useSelectedCompany } from '../../contexts/SelectedCompanyContext';
import NoticeList from '../../components/module/NoticeList';
import FAQList from '../../components/module/FAQList';
import BigCal from '../../components/ui/BigCal';
import MiniCal from '../../components/ui/MiniCal';

function UnknownHome() {
  const { effectiveSn } = useSelectedCompany();
  const handleSubmit = () => {

    (async () => {
      try{
        const res = await applyEmp(effectiveSn);
        console.log(res);
      } catch(err) {
        console.log(err.message);
      }
    })();
  }

  return (
      <div className="mainCont_Lms_Row" style={{height:"702px"}}>
        <div className="main_L" style={{ width: '40%', height: "100%" }}>
          <div className='dashBoardModule' style={{ height: '100%' }}>
            <MiniCal/>
          </div>
        </div>
        <div className="main_R" style={{ flex: '1', gap: '16px' }}>
          <div className='max_height'>
            <div className='dashBoardModule' style={{ flex:1 }}>
              <NoticeList/>
            </div>
            <div className='dashBoardModule' style={{ height: '400px' }}>
              <FAQList/>
            </div>
          </div>
        </div>
      </div>
  )
}

export default UnknownHome