import { Outlet, useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useAccount } from "../../../auth/AuthContext";
import SuperHeader from "./SuperHeader"
import MyInfo from "../../ui/MyInfo";
import LmsHeader from "./LmsHeader";
import StdNav from "./StdNav";
import AdminNav from "./AdminNav";
import TutorNav from "./TutorNav";
import { useSelectedCompany } from "../../../contexts/SelectedCompanyContext";
import { useEffect, useState, useCallback } from "react";
import { saveProfile } from "../../../auth/authService";
import { Nav } from "../../ui/navModule/Nav";

// 진짜 레이아웃만 짜놓고, 사용자 정보 받아와서 롤, 기본url 체크 후 세부 컴포넌트에서 디자인 바꿔야 할듯
// 세부 컴포넌트 들 마다 outlet 써야할 듯
export default function Layout2() {
  const { effectiveSn, clearFixedSn, fixedSn } = useSelectedCompany();
  const navigate = useNavigate();
  const [navToggle, setNavToggle] = useState(true);
  const { user, signOut, patchUser, setUser } = useAccount();
  const { pathname } = useLocation();
  const navKind = pathname.split('/', 2)[1] || pathname.split('/',2)[1];
  const testAuthLv = ["1(관리자)", "2(테넌트)", "3(직원)", "4(강사)", "5(수강생)", "6(신청자)", "7(비활성화)"];
  const [selectedItem, setItem] = useState(0);
  const myCoSn = user?.USER_OGDP_CO_SN;
  const curloc = useLocation();
  // const onSaveProfile = async (form) => {
  //   const saved = await saveProfile(form);
  //   setUser(saved);           // 서버 결과로 전역 user 교체
  // };

  useEffect(()=>{
    switch (pathname){
      case "/adminHome":
      return setNavToggle(true);
      case "/visitorHome":
        return setNavToggle(true);
      case "/unknownHome":
        return setNavToggle(true);
      case "/tutorHome":
      return setNavToggle(true);
      case "/stdHome":
        return setNavToggle(true);
      default:
        return setNavToggle(p => p);
    }
  },[pathname])

  const myAuth = user?.USER_AUTHRT_SN;
  const authLvPath = {
    1: "adminHome",
    2: "adminHome",
    3: "adminHome",
    4: "tutorHome",
    5: "stdHome",
    6: "visitorHome",
    7: "visitorHome"
  }
  const loc = authLvPath[myAuth];

  
  // 홈 경로 맵
  const HOME_PATHS = {
    adminHome: "/adminHome",
    tutorHome: "/tutorHome",
    stdHome: "/stdHome",
    visitorHome: "/visitorHome" 
  };
  
  
  const CLEAR_PATHS = ["/", "/welcome"];
  
  useEffect(() => {
    // navKind가 홈맵에 있는데, 경로가 null(=비활성)로 지정된 경우만 클리어
    if (pathname === '/') {
      clearFixedSn();
      setNavToggle(false);
    }
  }, [navKind]);

// 헤더 종류 고르기
  function HeaderStatus({ loc, setNavToggle }) {
    let component;

    switch (loc) {
      case "adminHome":
        component = <LmsHeader navToggle = {navToggle} setNavToggle = {setNavToggle} />;
        break;
      case "stdHome":
        component = <LmsHeader navToggle = {navToggle} setNavToggle = {setNavToggle} />;
        break;
      case "tutorHome":
        component = <LmsHeader navToggle = {navToggle} setNavToggle = {setNavToggle} />;
        break;

      case "visitorHome":
        component = <LmsHeader navToggle = {navToggle} setNavToggle = {setNavToggle} />;
        break;

      default:
        component = <SuperHeader setNavToggle = {setNavToggle}  />;
    }

    return component;
  }

  return (
    <div className="layout">
      <header>
      
        {/* 페이지 별 헤더 변경 */}
        <HeaderStatus loc={navKind} setNavToggle={setNavToggle} />

        {/* 로그인 / 로그아웃 버튼 체인지 */}
        {user === null ?
        <button className="joinBtn" type="button" onClick={() => navigate('/welcome/login')}>Login →</button>
        :
          <MyInfo label={user?.USER_NM} className="joinBtn" trigger="hover">
            <div
              className="subMenuList"
              onClick={() => {
                if (user?.USER_AUTHRT_SN === 2 || user?.USER_AUTHRT_SN === 3) {
                  navigate('/adminHome/myPage');
                } else if (user?.USER_AUTHRT_SN === 5) {
                  navigate('/stdHome/myPage');
                } else if (user?.USER_AUTHRT_SN === 4) {
                  navigate('/tutorHome/myPage');
                } else {
                  navigate('/myPage');
                }
              }}
            >
              마이페이지
            </div>
            <div
              className="subMenuList"
              onClick={() => {
                signOut();
                window.location.href = '/';
              }}
            >
              로그아웃
            </div>
          </MyInfo>
        }
      </header>
      <div className="layout_content">
        <main className="varPage">
          {/* Nav 팝업은 여기서 처리 */}
          {navToggle === false ? 
            null 
            : 
            <Nav setNavToggle={setNavToggle}></Nav>
          }
          {/* Outlet에서 페이지 바뀌는거 보일 예정 */}
          <Outlet context={{setNavToggle}} />
        </main>
        <footer>
          {(user?.USER_AUTHRT_SN === 1) ?          
          <>
            <h2 onClick={() => {navigate('/'); setNavToggle(false);}} style={{cursor:"pointer"}}>LERMES</h2>
            <div onClick={() => navigate('/adminHome')} style={{cursor:"pointer"}}>관리자 홈</div>
            <div onClick={() => navigate('/tutorHome')} style={{cursor:"pointer"}}>강사 홈</div>
            <div onClick={() => navigate('/stdHome')} style={{cursor:"pointer"}}>수강생 홈</div>
            <div onClick={() => navigate('/visitorHome')} style={{cursor:"pointer"}}>방문자 홈</div>
          </>
          :
          <h2 onClick={() => {navigate('/'); setNavToggle(false);}} style={{cursor:"pointer"}}>LERMES</h2>
          }
          <p className="testBox">
            <div style={{fontSize: "1.4rem", color: "#444"}}></div>
            {(user?.USER_EML_ADDR === "hash@com") ? 
              testAuthLv.map((item, idx)=> 
                <div
                  style={{cursor: "pointer"}}
                  onClick={() => {patchUser({USER_AUTHRT_SN: idx + 1}); setItem(idx)}}
                  className={`testBtn ${ selectedItem === idx ? "testClicked" : ""}`}
                >
                  {item}
                </div>
              )
              : ""
            }
          </p>
        </footer>
      </div>
    </div>
  )
}
