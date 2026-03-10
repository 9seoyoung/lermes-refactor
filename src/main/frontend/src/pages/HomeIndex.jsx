import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "../hooks/useAccount";

function HomeIndex() {
  const { user, loading } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;          // 아직 세션 확인 중이면 대기
    if (!user) {
      navigate("/", { replace: true });
      return;
    }

    // 권한 번호 읽기 (snake_case/camelCase 모두 대응)
    const userAuthrtSn = user.userAuthrtSn ?? user.user_authrt_sn;
    const userActvtnYn = user.userActvtnYn ?? user.user_actvtn_yn;

    if (userAuthrtSn === 1 && userActvtnYn === 1) { //슈퍼관리자
      navigate("/", { replace: true });       
    } else if (userAuthrtSn === 2 && userActvtnYn === 1 || userAuthrtSn === 3 && userActvtnYn === 1) { //테넌트, 직원
      navigate("/AdminHome", { replace: true });
    } else if (userAuthrtSn === 4 && userActvtnYn === 1 ){ //강사
      navigate("/TutorHome", { replace: true });              
    } else if (userAuthrtSn === 5 && userActvtnYn === 1 ){ //수강생
      navigate("/stdHome", { replace: true });              
    } else if (userAuthrtSn === 6 && userActvtnYn === 1 ){ //일반회원

    } else {
      navigate("/403", { replace: true });              
    }
  }, [user, loading, navigate]);

  return null; // 렌더링할 내용 없음, 분기만 처리
}

export default HomeIndex;