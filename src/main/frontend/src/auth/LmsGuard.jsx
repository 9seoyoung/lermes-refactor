// LmsGuard.jsx
import { Navigate, Outlet, useMatch } from "react-router-dom";
import { useAccount } from "../auth/AuthContext";
import { useSelectedCompany } from "../contexts/SelectedCompanyContext";

export default function LmsGuard() {
  const { user, loading } = useAccount();
  const { effectiveSn } = useSelectedCompany();

  // 0) 특정 경로는 화이트리스트로 통과 (모집공고 신청/읽기)
  const matchApply = useMatch("/visitorHome/applyRecruitPoster/:recruitSn");
  const matchApply2 = useMatch("/visitorHome");
  if (matchApply) return <Outlet />;         
  if (matchApply2) return <Outlet />;    
  
  if (loading) return null;

  // 1) 미로그인 -> 방문자 홈
  if (!user) return <Navigate to="/unknownHome" replace />;

  const myCompany = Number(
    user?.USER_OGDP_CO_SN ?? user?.user_ogdp_co_sn ?? user?.userOgdpCoSn ?? NaN
  );
  const selected = Number(effectiveSn ?? NaN);

  // selected가 아직 결정 안 된 경우엔 막지 말고 통과시키는 게 UX에 좋음
  if (!Number.isFinite(selected)) return <Outlet />;

  // 2) 남의 회사 접근 차단
  if (myCompany !== selected && user.USER_AUTHRT_SN != 1) {
    return <Navigate to="/visitorHome" replace />;
  }

  // 3) (선택) 권한 레벨별 홈 라우팅이 ‘이 가드’의 역할이면, return으로 반환해야 동작함
  const myCoAuth = Number(user?.USER_AUTHRT_SN ?? 0);
  const authLvPath = {
    1: "adminHome",
    2: "adminHome",
    3: "adminHome",
    4: "tutorHome",
    5: "stdHome",
    6: "visitorHome",
    7: "unknownHome",
  };

  const arrive = authLvPath[myCoAuth];

  // 필요할 때만 리디렉트(예: 회사 루트 진입 시). 보통은 그냥 <Outlet/>만 내보내는 게 안전.
  // return arrive ? <Navigate to={`/${arrive}`} replace /> : <Navigate to="/visitorHome" replace />;

  // 기본: 자식 라우트 렌더
  return <Outlet />;
}