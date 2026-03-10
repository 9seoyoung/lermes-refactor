import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import SuperHeader from './SuperHeader';
import uiStyle from '../../../styles/UiComp.module.css';
import { useAccount } from '../../../auth/AuthContext';
import { useSelectedCompany } from '../../../contexts/SelectedCompanyContext';

// 출결 (헤더는 모달만 열고, 실제 입/퇴실은 모달/서비스가 처리)
import TutorAttendModal from '../../../attend/TutorAttendModal';
import StdAttendModal from '../../../attend/StdAttendModal';
import CheckoutConfirmModal from '../../../attend/CheckoutConfirmModal';
import {
  getTodayStatus,
  checkout,
  getActiveAttendCode,
} from '../../../attend/attendService';


/** Header
 * 0. 경로(navLike)로 LMS헤더인지 수퍼메인 헤더인지 분기 (헤더)
 * 1. effectiveSn이 없으면? 내 회사 SN을 자동으로 set, 비로그인/소속회사 없을수도 있으니, fix || 나 || null 로 초기값 지정
 * 2. 내 회사 SN과 effectiveSn(선택한 회사SN)이 다르면 visitor값 반환
 * 3. 내 회사 SN과 effectiveSn이 같으면 auth에 맞는 페이지로 리다이렉트
 *  */ 

/** 공통 헤더 */
export default function HeaderStatus({ navKind, myCoSn, effectiveSn }) {
  const {user} = useAccount();
  let component;

  // 선택한 회사SN 값이 없다? >> 기본페이지네
  if(!(effectiveSn ?? null)){
    return <SuperHeader/>
  }

  // 선택한회사랑 값이다르다?
  if((myCoSn !== effectiveSn) || (user.USER_AUTHRT_SN !== 1) ) return <VisitorHeader />
  

  
  switch (navKind) {
    case 'adminHome':
      return 
        <AdminHeader />
      
    case 'stdHome':
      return 
        <StdHeader />
      
    case 'tutorHome':
      return 
        <TutorHeader />
      
    case 'visitorHome':
      return 
        <VisitorHeader />
      
    default:           
      return <VisitorHeader />; 
    }

}

  /** 수강생 헤더: 단일 버튼(출석/퇴실) + 상태 표시 */
  export function StdHeader() {
    const [showAttendModal, setShowAttendModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [inTime, setInTime] = useState(null);
    const [outTime, setOutTime] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAccount();
    
    console.log(user?.USER_EML_ADDR); // null 대비
    
    // 오늘 상태 갱신
    const refreshStatus = useCallback(async () => {
      // 로그인 정보 없으면 API 호출하지 않음
    if (!user) {
      setInTime(null);
      setOutTime(null);
      setLoading(false);
      return;
    }
    // (선택) 특정 계정 제외 로직이 필요하면 아래처럼
    if (user?.USER_EML_ADDR === 'hash@com') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const r = await getTodayStatus(); // { ok, checkinTime, checkoutTime }
      if (r?.ok) {
        setInTime(r.checkinTime ?? null);
        setOutTime(r.checkoutTime ?? null);
      } else {
        setInTime(null);
        setOutTime(null);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);
  
  const isCheckedIn = !!inTime;
  const isCheckedOut = !!outTime;
  const actionLabel = !isCheckedIn ? '출석' : !isCheckedOut ? '퇴실' : '출석'; // 퇴실 완료면 '출석'(비활성)
  const buttonDisabled = loading || isCheckedOut || !user; // 로그인/세션 확인 전에도 안전
  
  // 헤더 단일 버튼 클릭 분기
  const onClickAction = () => {
    if (!isCheckedIn) setShowAttendModal(true); // 출석(코드입력)
    else if (!isCheckedOut) setShowConfirm(true); // 퇴실 확인
  };
  
  const fmt = (t) => (t ? t : '00:00');
  const nowStr = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  
  // 퇴실 확정
  const doCheckout = async () => {
    try {
      const r = await checkout(); // ok 래퍼 기준: { ok, message, checkoutTime }
      if (r?.ok) {
        await refreshStatus();
      } else {
        alert(r?.message || '퇴실 실패');
      }
    } finally {
      setShowConfirm(false);
    }
  };
  
  return (
    <div className="header_R">
      <div className={uiStyle.statusBtn}>
        <div>입실</div>
        <div>{loading ? '- : -' : fmt(inTime)}</div>
      </div>
      <div className={uiStyle.statusBtn}>
        <div>퇴실</div>
        <div>{loading ? '- : -' : fmt(outTime)}</div>
      </div>

      {/* 단일 버튼: 출석 ↔ 퇴실 ↔ 출석(비활성) */}
      <button
        type="button"
        onClick={onClickAction}
        className={uiStyle.checkInBtn}
        disabled={buttonDisabled}
        style={{
          background: buttonDisabled ? '#9ca3af' : undefined,
          opacity: buttonDisabled ? 0.7 : 1,
        }}
        >
        {actionLabel}
      </button>

      {/* 출석 모달(입실) */}
      {showAttendModal && (
        <StdAttendModal
        onClose={async () => {
          setShowAttendModal(false);
            await refreshStatus();
          }}
          />
        )}

      {/* 퇴실 확인 모달(헤더에서 직접 띄움) */}
      {showConfirm && (
        <CheckoutConfirmModal
        nowStr={nowStr}
        onCancel={() => setShowConfirm(false)}
        onConfirm={doCheckout}
        />
      )}
    </div>
  );
}

/** 강사 헤더 */
export function TutorHeader() {
  const { clearFixedSn } = useSelectedCompany();
  const [modalOpen, setModalOpen] = useState(false);
  const [ , setActiveCode] = useState(null);
  
  const refreshCode = async () => {
    try {
      const r = await getActiveAttendCode(); // { data: { code: "65" } }
      setActiveCode(r?.data?.code ?? null);
    } catch {
      setActiveCode(null);
    }
  };
  
  useEffect(() => {
    refreshCode();
  }, []);

  return (
    <div className="header_R">
      <button
        style={{ padding: '10px 14px' }}
        type="button"
        onClick={() => setModalOpen(true)}
        className={uiStyle.checkInBtn}
      >
        출석 코드 생성
      </button>

      {/* 최신 코드 표시 */}
      {/* {activeCode && (
        <span
          style={{
            width: 120,
            display: 'flex',
            justifyContent: 'center',
            border: 'none',
            marginLeft: 12,
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          현재 코드: {activeCode}
        </span>
      )} */}

      {modalOpen && (
        <TutorAttendModal
          onClose={() => {
            setModalOpen(false);
            refreshCode(); // ✅ 모달 닫힐 때 최신 코드 다시 불러오기
          }}
        />
      )}
    </div>
  );
}

export function AdminHeader() {
  // const { user } = useAccount();
  return (
      <>
    </>);
}

export function VisitorHeader() {
  // const { user } = useAccount();
  return <div></div>;
}
