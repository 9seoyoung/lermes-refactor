import React, { useEffect, useState } from 'react';
import ListTable from '../ui/ListTable';
import { useSelectedCompany } from '../../contexts/SelectedCompanyContext';
import { callBoardList } from '../../services/postService';
import { useAccount } from '../../auth/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/dateformat';

function NoticeList() {
  const [list, setList] = useState([]);
  const columnData = ["postTtl","postWriterName", "formattedAPostFrstDt"];
  const {effectiveSn} = useSelectedCompany();
  const {user} = useAccount();
  const {pathname} = useLocation();
  const navigate = useNavigate();

  useEffect(()=> {
    const params = {
      cohortSn: user?.USER_COHORT_SN,
      bbsType: "NOTICE",
      coSn: effectiveSn
    };

    (async() => {
      try {
      const {data} = await callBoardList(params);
      console.log(data);
      const formattedData = data.map(item => ({...item, formattedAPostFrstDt:  formatDate(item.postFrstWrtDt)}));
      setList(formattedData);
      } catch(err) {
        console.log(err.message);
      }
    })();
  },[pathname, effectiveSn])

  return (
    <>
        <h4>공지사항
          {pathname === "/unknownHome" || pathname === "/visitorHome" ? null :
            <div className="specificBtn" onClick={() => (navigate((pathname === "/admin" ? "boardSet"  : "board")))}>+ 더보기</div>
          }
        </h4>
        <div className='tableBox'>
            <ListTable
                columnData={columnData}
                apiData={list}
                gridTemplate="0.3fr 3fr 0.7fr 0.7fr"
                postKey={"postSn"}
                whereTogo={pathname === "/admin" ? "boardSet/read"  : "board/read"}
            />
        </div>
    </>
  )
}

export default NoticeList;
