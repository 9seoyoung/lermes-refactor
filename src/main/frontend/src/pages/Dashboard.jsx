import { logout } from "../lib/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate("/login", { replace: true }); // 전역 location 대신 라우터 사용
  };

  return (
    <div className="center">
      <div className="card">
        <h2>대시보드</h2>
        <p>로그인 성공 시 접근 가능</p>
        <button className="btn-secondary" onClick={onLogout}>
          로그아웃
        </button>
      </div>
    </div>
  );
}
