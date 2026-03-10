import React, { useState } from 'react';

import FilterList from '../../components/ui/FilterList';
import ListTable from '../../components/ui/ListTable';
import {Settings} from "lucide-react";
import ListEditTable from '../../components/ui/ListEditTable';
import { BlueCheckbox } from '../../components/ui/UiComp';
import styles from '../../styles/TableAll.module.css';
import { useNavigate } from 'react-router-dom';

export default function TableAll() {
  /* const [manageState, setManageState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // formData 초기값
    // 0. 유저테이블 리스트 객체배열로 보내주셈
    // 1. useEffect로 마운트 시 유저테이블 리스트 불러오기
    // 2. 불러온 내용 setFormData로 펼쳐서 저장하기
  });
  const filterArr = ["직원", "강사", "수강생"];

  // 직원 / 강사 / 수강생 관리(수정 + 저장)할 핸들러
 const handleSubmit = async () => {
    setLoading(true)

    try {
      console.log("아직 연결 x");

    } catch(err) {
      console.log(err);
    } finally {
      setLoading(false);
      setManageState(false);
    }
  }

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }; */

  return (
        <div>
             <StudySched_Tb />
             <Board_Tb />
             <User_Tb />
             <AttRequest_Tb />
             <AttStatus_Tb />
             <CourseMn_Tb />
             <FileMn_Tb />
        </div>
  )
}

// 학습 일정 테이블
export function StudySched_Tb ({whereTogo}){
  const [manageState, setManageState] = useState(false);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
        {manageState ?
          <ListEditTable
            tableHead={['#', '유형', '제목', '시작일', '종료일', '작성일', '작성자', '조회수']}
            columnData={['no',  'type', 'title', 'startDate', 'endDate', 'date', 'name', 'views']}
            apiData={[{no: 1, type: "공지", title: "커리큘럼 같은 공식 일정(관리자 등록)", startDate: "25.09.07", endDate: "25.09.07", date: "25.09.07", name:"하이", views: 2}]}
            gridTemplate="1fr 1fr 5fr 1fr 1fr 1fr 1fr 1fr "
            formData={formData}
            type = {['text', 'text', 'text', 'date', 'date', 'date', 'text', 'text']}
          />
          :
          <ListTable
            tableHead={['#', '유형', '제목', '시작일', '종료일', '작성일', '작성자', '조회수']}
            columnData={['no',  'type', 'title', 'startDate', 'endDate', 'date', 'name', 'views']}
            apiData={[{no: 1, type: "공지", title: "커리큘럼 같은 공식 일정(관리자 등록)", startDate: "25.09.07", endDate: "25.09.07", date: "25.09.07", name:"하이", views: 2}]}
            // 문자열로 지정
            gridTemplate="1fr 1fr 5fr 1fr 1fr 1fr 1fr 1fr "
            gap="12px"
            handleChange = {handleChange}
            whereTogo = {whereTogo}
          />
        }
    </>
  );
}

// 게시판 테이블
export function Board_Tb() {
const [manageState, setManageState] = useState(false);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="boardPage">
      <div className="BigListBox">
        {manageState ?
          <ListEditTable
            tableHead={['#', '유형', '제목', '작성일', '작성자', '조회수']}
            columnData={['no',  'type', 'title', 'date', 'name', 'views']}
            apiData={[{no: 1, type: "공지", title: "공지사항 제목", date: "25.09.06", name:"하이", views: 2}]}
            gridTemplate="1fr 1fr 5fr 1fr 1fr 1fr  "
            formData={formData}
            type = {['text', 'text', 'text', 'date', 'text', 'text']}
          />
          :
          <ListTable
            tableHead={['#', '유형', '제목', '작성일', '작성자', '조회수']}
            columnData={['no',  'type', 'title', 'date', 'name', 'views']}
            apiData={[{no: 1, type: "공지", title: "공지사항 제목", date: "25.09.06", name:"하이", views: 2}]}
            // 문자열로 지정
            gridTemplate="1fr 1fr 5fr 1fr 1fr 1fr "
            gap="12px"
            handleChange = {handleChange}
          />
        }
      </div>
    </div>

);
}

// 계정 관리 테이블
export function User_Tb() {
const [manageState, setManageState] = useState(false);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="boardPage">
      <div className="BigListBox">
        {manageState ?
          <ListEditTable
            tableHead={['#', '이름', '이메일', '전화번호', '과정명 + 그룹명', '참여 상태', '수료 여부', '권한Lv', '접근 통제']}
            columnData={['no', 'name', 'email', 'tel', 'course', 'status', 'completion', 'level', 'access' ]}
            apiData={[{no: 1, name: "아무개", email: "abcd@example.com", tel: "010-xxxx-xxxx", course: "GSITM  부트캠프 풀스택 과정 10기", status: "교육중", completion: "N",  level: "수강생", access: "N" }]}
            gridTemplate="1fr 1fr 3fr 2fr 4fr 1fr 1fr 1fr 1fr"
            formData={formData}
            type = {['text', 'text', 'email', 'tel', 'text', 'text', 'text', 'text', 'text']}
          />
          :
          <ListTable
            tableHead={['#', '이름', '이메일', '전화번호', '과정명 + 그룹명', '참여 상태', '수료 여부', '권한Lv', '접근 통제']}
            columnData={['no', 'name', 'email', 'tel', 'course', 'status', 'completion', 'level', 'access' ]}
            apiData={[{no: 1, name: "아무개", email: "abcd@example.com", tel: "010-xxxx-xxxx", course: "GSITM  부트캠프 풀스택 과정 10기", status: "교육중", completion: "N",  level: "수강생", access: "N" }]}
            // 문자열로 지정
            gridTemplate="1fr 1fr 3fr 2fr 4fr 1fr 1fr 1fr 1fr"
            gap="12px"
            handleChange = {handleChange}
          />
        }
      </div>
    </div>
    )
}

// 출석 요청 내역
export function AttRequest_Tb() {
const [manageState, setManageState] = useState(false);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="boardPage">
      <div className="BigListBox">
        {manageState ?
          <ListEditTable
            tableHead={['#', '유형', '사유', '신청일', '승인여부', '첨부 파일']}
            columnData={['no', 'type', 'reason', 'date', 'status', 'file' ]}
            apiData={[{no: 1, type: "외출", reason: "외출한다", date: "2025-09-08", status: "Y", file: "흐음" }]}
            gridTemplate="1fr 1fr 3fr 2fr 1fr 1fr "
            formData={formData}
            type = {['text', 'text', 'text', 'date', 'text', 'text']}
          />
          :
          <ListTable
            tableHead={['#', '유형', '사유', '신청일', '승인여부', '첨부 파일']}
            columnData={['no', 'type', 'reason', 'date', 'status', 'file' ]}
            apiData={[{no: 1, type: "외출", reason: "외출한다", date: "2025-09-08", status: "Y", file: "흐음" }]}
            // 문자열로 지정
            gridTemplate="1fr 1fr 3fr 2fr 1fr 1fr "
            gap="12px"
            handleChange = {handleChange}
          />
        }
      </div>
    </div>
    )
}

// 출결 현황 테이블
export function AttStatus_Tb() {
const [manageState, setManageState] = useState(false);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="boardPage">
      <div className="BigListBox">
        {manageState ?
          <ListEditTable
            tableHead={['#', '이름', '입실시간', '퇴실시간', '출결상태', '특이사항']}
            columnData={['no', 'name', 'checkIn', 'checkOut', 'status', 'note' ]}
            apiData={[{no: 1, name: "아무개", checkIn: "08:30", checkOut: "19:00", status: "출석", note: "외출" }]}
            gridTemplate="1fr 1fr 1fr 1fr 1fr 1.5fr"
            formData={formData}
            type = {['text', 'text', 'text', 'date', 'text', 'text']}
          />
          :
          <ListTable
            tableHead={['#', '이름', '입실시간', '퇴실시간', '출결상태', '특이사항']}
            columnData={['no', 'name', 'checkIn', 'checkOut', 'status', 'note' ]}
            apiData={[{no: 1, name: "아무개", checkIn: "08:30", checkOut: "19:00", status: "출석", note: "외출" }]}
            // 문자열로 지정
            gridTemplate="1fr 1fr 1fr 1fr 1fr 1.5fr"
            gap="12px"
            handleChange = {handleChange}
          />
        }
      </div>
    </div>
    )
}

// 과정 관리 테이블
export function CourseMn_Tb() {
const [manageState, setManageState] = useState(false);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="boardPage">
      <div className="BigListBox">
        {manageState ?
          <ListEditTable
            tableHead={['그룹핑', '#', '그룹명', '과정명', '모집기간', '교육기간', '교육장소','강사', '담당자', '교육 상태', '모집 폼 수정']}
            columnData={['check', 'no', 'name', 'course', 'recPeriod', 'enrPeriod', 'location', 'instructor', 'user', 'status', 'form' ]}
            apiData={[{check: <input type="checkbox" /> , no: 1, name: "10기", course: "풀스택", recPeriod: "25.04.21 ~ 25.10.20", enrPeriod: "25.04.21 ~ 25.10.20", location: "윙스타워 B동 1103호", instructor: "난강사", user: "난직원", status: "모집예정", form: <button>수정</button> }]}
            gridTemplate="0.8fr 0.5fr 0.8fr 1fr 2.5fr 2.5fr 2.5fr 0.8fr 0.8fr 1fr 1.5fr"
            formData={formData}
            type = {['text', 'text', 'text', 'text', 'date','date','text','text', 'text', 'text', 'text' ]}
          />
          :
          <ListTable
            tableHead={['그룹핑', '#', '그룹명', '과정명', '모집기간', '교육기간', '교육장소','강사', '담당자', '교육 상태', '모집 폼 수정']}
            columnData={['check', 'no', 'name', 'course', 'recPeriod', 'enrPeriod', 'location', 'instructor', 'user', 'status', 'form' ]}
            apiData={[{check: <BlueCheckbox />, no: 1, name: "10기", course: "풀스택", recPeriod: "25.04.21 ~ 25.10.20", enrPeriod: "25.04.21 ~ 25.10.20", location: "윙스타워 B동 1103호", instructor: "난강사", user: "난직원", status: "모집예정", form: <button className={styles.edit}>수정</button>}]}
            // 문자열로 지정
            gridTemplate="0.8fr 0.5fr 0.8fr 1fr 2.5fr 2.5fr 2.5fr 0.8fr 0.8fr 1fr 1.5fr"
            gap="12px"
            handleChange = {handleChange}
          />
        }
      </div>
    </div>
    )
}

// 서류 관리 테이블
export function FileMn_Tb() {
const [manageState, setManageState] = useState(false);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="boardPage">
      <div className="BigListBox">
        {manageState ?
          <ListEditTable
            tableHead={['#', '문서 유형', '이름', '그룹명', '발급일', '발급번호' ]}
            columnData={['no', 'fileType', 'name', 'group', 'date', 'number' ]}
            apiData={[{no: 1, fileType: "출결확인서", name: "아무개", group: "10기", date: "25.09.09", number: "ATD250820_01" }]}
            gridTemplate="1fr 1fr 1fr 1fr 1fr 2fr"
            formData={formData}
            type = {['text', 'text', 'text', 'text', 'date', 'text']}
          />
          :
          <ListTable
            tableHead={['#', '문서 유형', '이름', '그룹명', '발급일', '발급번호' ]}
            columnData={['no', 'fileType', 'name', 'group', 'date', 'number' ]}
            apiData={[{no: 1, fileType: "출결확인서", name: "아무개", group: "10기", date: "25.09.09", number: "ATD250820_01" }]}
            // 문자열로 지정
            gridTemplate="1fr 1fr 1fr 1fr 1fr 2fr"
            gap="12px"
            handleChange = {handleChange}
          />
        }
      </div>
    </div>
    )
}

