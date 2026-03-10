// import { useEffect, useRef } from "react";
import { useAccount } from "../auth/AuthContext";
import { Navigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { useSelectedCompany } from "../contexts/SelectedCompanyContext";

// function LmsHomeIndex() {
//   const { user, loading } = useAccount();
//   const {effectiveSn} = useSelectedCompany();
//   const navigate = useNavigate();
//   const navigatedRef = useRef(false); 

//   useEffect(() => {
//     if (loading) return;          // 아직 세션 확인 중이면 대기
//     if (!user) {
//       navigate("/visitorHome", { replace: true });
//       return;
//     }
    
//     const myCompany = user.OGDP_CO_SN ?? user.user_ogdp_co_sn ?? user.userOgdpCoSn ; // 내 소속회사
//     const userAuthrtSn = user.userAuthrtSn ?? user.user_authrt_sn ?? user.USER_AUTHRT_SN; // 내 권한 번호와 같은지
//     const userActvtnYn = user.userActvtnYn ?? user.user_actvtn_yn ?? user.USER_ACTVTN_YN; //활성화 되어있는지
    

//     if (userAuthrtSn === 1) {navigate("/visitorHome");  return; }

//     if(myCompany === effectiveSn) {

//       // 권한 번호 읽기 (snake_case/camelCase/Pascal? 모두 대응)

//       if (userAuthrtSn === 1 && userActvtnYn === 1) { //슈퍼관리자
//         navigatedRef.current = true;
//         navigate("/visitorHome", { replace: true });       
//       } else if (((userAuthrtSn === 2) && (userActvtnYn === 1)) ||(( userAuthrtSn === 3) && (userActvtnYn === 1))) { //테넌트, 직원
//         navigatedRef.current = true;
//         navigate("/adminHome", { replace: true });
//       } else if ((userAuthrtSn === 4) && (userActvtnYn === 1 )){ //강사
//         navigatedRef.current = true;
//         navigate("/tutorHome", { replace: true });              
//       } else if ((userAuthrtSn === 5 ) && (userActvtnYn === 1 )){ //수강생
//         navigatedRef.current = true;
//         navigate("/stdHome", { replace: true });              
//       } else if ((userAuthrtSn === 6 )&& (userActvtnYn === 1 )){ //일반회원
//         navigatedRef.current = true;
//         navigate("/visitorHome", {replace: true});
//       } else {
//         navigatedRef.current = true;
//         navigate("/403", { replace: true });              
//       }

//     } else {
//       navigate("/visitorHome", {replace: true});
//     }

//     }, [user, loading, effectiveSn, navigate]);

//   return null; // 렌더링할 내용 없음, 분기만 처리
// }

// export default LmsHomeIndex;

export default function LmsHomeIndex() {
  const { user, loading } = useAccount();
  if (loading) return null;

  const auth = Number(user?.userAuthrtSn ?? user?.user_authrt_sn ?? user?.USER_AUTHRT_SN ?? NaN);
  const active = String(user?.userActvtnYn ?? user?.user_actvtn_yn ?? user?.USER_ACTVTN_YN ?? "").toUpperCase();
  const isActive = active === "1" || active === "Y" || active === "TRUE";

  if (!isActive || !Number.isFinite(auth)) return <Navigate to="/403" replace />;

  if (auth === 1) return <Navigate to="/adminHome" replace />;
  if (auth === 2 || auth === 3) return <Navigate to="/adminHome" replace />;
  if (auth === 4) return <Navigate to="/tutorHome" replace />;
  if (auth === 5) return <Navigate to="/stdHome" replace />;
  if (auth === 6) return <Navigate to="/visitorHome" replace />;
  if (!user) return <Navigate to="/unknownHome" replace/>;

  return <Navigate to="/403" replace />;
}