// import React, { useState } from 'react'
// import { matchedPathAdminBoardFilter, matchedListAPIAdminBoardFilter } from "../../utils/readPageTypeReturn";
// import { toast } from "react-toastify";

import { useLocation } from 'react-router-dom';
import GroupDropdown from '../ui/GroupDropdown';

function FilterList(props) {
  const { arr, children, selectedIdx, setSelected, setCohortSn, effectiveSn, setCohortStts } =
    props;
  //   const [pullList, setPullList] = useState([]);
  // const filter = filterArr[selectedIdx];
  // console.log(`1. ${filter} 필터 누름`);
  // setFilter(filter);
  console.log(`2. setFilter 상태훅 사용`);
  const location = useLocation();

  return (
    <ul className="ftList_L">
      {arr?.map((ft, idx) => (
        <li
          key={idx}
          onClick={() => {
            setSelected(idx);
            if (setCohortSn) {
              // ✅ 클릭한 기수의 SN 넘기기
              setCohortSn(arr[idx]?.cohortSn || null);
              setCohortStts(arr[idx]?.cohortSttsNm || null);
              console.log('[FilterList] 클릭한 기수:', arr[idx]);
            }
          }}
          id={selectedIdx === idx ? 'ftClicked' : ''}
        >
          {ft?.cohortNm || ft}
        </li>
      ))}
      {/* 추가 버튼 생성 및 눌렀을 때 배열에 데이터 추가하기 위한 버튼 */}
      {children}
    </ul>
  );
}

// 전체에 스타일 기본,
// 다른거 클릭하면 원래 파란색이었던건 바뀌어야함

// const BoardManageFilters = ["전체", "공지", "일정", "자료실", "설문", "FAQ", "문의","학습 일지", "면담 요청", "면담 기록", "임시 저장"];
// const BoardFilters = ["전체", "공지", "자료실", "설문", "FAQ", "문의", "임시 저장"];
// const StdPlanFilters = ["전체", "공식", "내 일정", "일지", "자료실"];
// const StdManageFilters = ["전체", "면담 신청", "면담 요청", "면담 기록", "임시 저장"];
// const AccountManageFilters = ["직원", "강사", "수강생"];
// const docxManagneFilters = ["로그 기록", "수료증", "출결확인서"];
export default FilterList;
