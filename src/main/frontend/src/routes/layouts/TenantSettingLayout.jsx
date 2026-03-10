import { useState } from "react"
import { useSelectedCompany } from "../../contexts/SelectedCompanyContext";
import { useAccount } from "../../auth/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";
import CompanySmallLogoUploader from "../../components/layout/inho/CompanySmallLogoUploader ";
import MyInfo from "../../components/ui/MyInfo";
import { Nav } from "../../components/ui/navModule/Nav";
import LmsHeaderRF from "../../components/ui/headerModule/LmsHeaderRF";
import { User } from "lucide-react";


// 테넌트의 회사 정보 관리를 위한 레이아웃 이자 페이지

function TenantSettingLayout() {
  const { effectiveSn, clearFixedSn, fixedSn } = useSelectedCompany();
  const [openToggle, setOpenToggle] = useState(true);
  const navigate = useNavigate();
  const { user, signOut, patchUser, setUser } = useAccount();

  return (
      <div className={`layoutFrame ${openToggle ? "isClosed" : ""}`}>
        <header className="header">
          <div className="logoBox">
            <CompanySmallLogoUploader />
          </div>
          <LmsHeaderRF></LmsHeaderRF>
          {/* 로그인 / 로그아웃 버튼 체인지 */}
        <MyInfo label={"Sample"} className="joinBtn" trigger="none"></MyInfo>
        </header>
        <aside className={`aside ${openToggle ? "isClosed" : ""}`} onClick={() => setOpenToggle(!openToggle)} >
          <Nav></Nav>
        </aside>
        <main className="main">
          <div className="fade-blur-top" ></div>
          <Outlet></Outlet>
          <div className="fade-blur-bottom" ></div>
        </main>
      </div>
  )
}

export default TenantSettingLayout