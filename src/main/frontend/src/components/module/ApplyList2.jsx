import React, { useEffect, useState } from 'react';
import ListTable from '../ui/ListTable';
import { useSelectedCompany } from '../../contexts/SelectedCompanyContext';
import { callBoardList } from '../../services/postService';
import { useAccount } from '../../auth/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/dateformat';
import { pullSurveyResList, pullSurveyResListAuthor } from '../../services/responseService';

export function ApplyList2({srvySn, setRspnsSn}) {
  const [list, setList] = useState([]);
  const columnData = ["rspnsSn","parentType","userSn","formattedAPostFrstDt"];
  const {effectiveSn} = useSelectedCompany();
  const {user} = useAccount();
  const {pathname} = useLocation();
  const navigate = useNavigate();

  useEffect(()=> {


    (async() => {
      try {
      const {data} = (user.USER_AUTHRT_SN <= 3 ? await pullSurveyResList(srvySn) : await pullSurveyResListAuthor(srvySn));
      console.log(data);
      const formattedData = data?.map(item => ({...item, formattedAPostFrstDt:  formatDate(item.rspnsDt)}));
      setList(formattedData);
      } catch(err) {
        console.log(err.message);
      }
    })();
  },[pathname, effectiveSn])

  return (
    <>
        <h4>응답 내역
        </h4>
        <div className='tableBox'>
            <ListTable
                columnData={columnData}
                apiData={list}
                gridTemplate="0.3fr 0.3fr 3fr 0.7fr 0.7fr"
                postKey={"postSn"}
                setRspnsSn={setRspnsSn}
            />
        </div>
    </>
  )
}

