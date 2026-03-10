import React, { useEffect } from 'react'
import { applyEmp } from '../../services/accountService';
import { useSelectedCompany } from '../../contexts/SelectedCompanyContext';
import { useAccount } from '../../auth/AuthContext';
import NoticeList from '../../components/module/NoticeList';
import MaterialList from '../../components/module/MaterialList';
import FAQList from '../../components/module/FAQList';
import BigCal from '../../components/ui/BigCal';
import MiniCal from '../../components/ui/MiniCal';
import { useOutletContext } from 'react-router-dom';
import { GrayBtn } from '../../components/ui/UiComp';
import { toast } from 'react-toastify';

function VisitorHome() {
  const { effectiveSn } = useSelectedCompany();
  const {user} = useAccount();


  const handleSubmit1 = () => {
    
    (async () => {
      const params = {
        userAuthrtSn: 3,
        companySn: effectiveSn,
        userSn: user?.USER_SN
      }
      try{
        const res = await applyEmp(params);
        console.log(res);
        toast.success("직원신청완료!");
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
          <div className='dashBoardModule' style={{ height: '300px' }}>
            <NoticeList/>
          </div>
          <div className='dashBoardModule' style={{ height: '300px' }}>
            <FAQList/>
          </div>
        </div>
        <div className='dashBoardModule' style={{ height: '300px', display: "flex", alignItems: "center", flexDirection:"row", justifyContent: "space-around" }}>
          <button type='button' onClick={handleSubmit1}>직원신청</button>
          <button type='button' textType={"강사신청"}>강사신청</button>
        </div>
      </div>
    </div>
  )
}

export default VisitorHome