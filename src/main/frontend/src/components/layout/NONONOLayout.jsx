// import { Outlet, useLocation } from "react-router-dom"
// import { useNavigate } from "react-router-dom"
// import { useAccount } from "../../auth/AuthContext";
// import MyInfo from "../ui/MyInfo";
// import { useEffect, useState } from "react";
// import { useSelectedCompany } from "../../contexts/SelectedCompanyContext";
// import { Nav } from "../ui/navModule/Nav";
// import HeaderStatus from "../ui/headerModule/HeaderStatus";
// import LmsHeader from "../ui/headerModule/LmsHeader";
// import SuperHeader from "../ui/headerModule/SuperHeader";

// // 진짜 레이아웃만 짜놓고, 사용자 정보 받아와서 롤, 기본url 체크 후 세부 컴포넌트에서 디자인 바꿔야 할듯
// // 세부 컴포넌트 들 마다 outlet 써야할 듯
// export default function Layout() {
//   const { effectiveSn, clearFixedSn, fixedSn } = useSelectedCompany();
//   const navigate = useNavigate();
//   const [navToggle, setNavToggle] = useState(false);
//   const { user, signOut, patchUser } = useAccount();
//   const { pathname } = useLocation();
//   const navKind = pathname.split('/', 2)[1] || pathname.split('/',2)[1];
//   const testAuthLv = ["1(관리자)", "2(테넌트)", "3(직원)", "4(강사)", "5(수강생)", "6(신청자)", "7(비활성화)"];
//   const [selectedItem, setItem] = useState(0);
//   const myCoSn = user?.USER_OGDP_CO_SN;
//   const curloc = useLocation();

//   const myAuth = user?.USER_AUTHRT_SN;
//   const authLvPath = {
//     1: "adminHome",
//     2: "adminHome",
//     3: "adminHome",
//     4: "tutorHome",
//     5: "stdHome",
//     6: "visitorHome",
//     7: "visitorHome"
//   }
//   const loc = authLvPath[myAuth];

  
//   // 홈 경로 맵
//   const HOME_PATHS = {
//     adminHome: "/adminHome",
//     tutorHome: "/tutorHome",
//     stdHome: "/stdHome",
//     visitorHome: "/visitorHome" 
//   };
  
  
//   const CLEAR_PATHS = ["/", "/welcome"];
  
//   useEffect(() => {
//     // navKind가 홈맵에 있는데, 경로가 null(=비활성)로 지정된 경우만 클리어
//     if (HOME_PATHS[navKind] == null) {
//       clearFixedSn();
//     }
//   }, [navKind]);
  
//   // const handleGoLms = (e) => {
//   //   e.preventDefault();
//   //   // myCoSn != fixedSn ? navigate('/visitorHome', {redirect: true}) : <>{navigate(`${authLvPath}`, {redirect: true})}</>}
//   //   if (myCoSn != fixedSn) navigate('/visitorHome', {redirect:true});
//   //   else if (myCoSn == fixedSn || myCoSn == effectiveSn) navigate(`${authLvPath}`, {redirect: true});
//   //   else navigate('/403', {redirect: true});
//   // }
  
//   // useEffect(() => {
//     //   if (CLEAR_PATHS.includes(location.pathname)) {
//       //     clearFixedSn();
//       //   }
//       // }, [pathname]);
      
//       // const onSaveProfile = async (form) => {
//         //   const saved = await saveProfile(form);
//         //   setUser(saved);           // 서버 결과로 전역 user 교체
//         // };

// // 대안
// //   const { user, loading: userLoading } = useAccount();
// // const { fixedSn, effectiveSn, ready } = useSelectedCompany();
// // const loading = userLoading || !ready;
// // const headerMode = loading ? 'loading' : (fixedSn == null ? 'super' : 'lms');

// // <header>
// //   {headerMode === 'loading' && null}
// //   {headerMode === 'super'   && <SuperHeader/>}
// //   {headerMode === 'lms'     && (
// //     <LmsHeader navToggle={navToggle} setNavToggle={setNavToggle}>
// //       <HeaderStatus navKind={navKind} myCoSn={myCoSn} effectiveSn={effectiveSn}/>
// //     </LmsHeader>
// //   )}
// // </header>


//   console.log(effectiveSn);
//   console.log(myCoSn);

//   return (
//     <div className="layout">
//       <header>
//         {/* clearFixedSn누르면 초기화되고 초기화한 값을 바라봐야하는데 effective봐서그런거같은데 */}
//         {/* <HeaderStatus></HeaderStatus> */}
//         {/* {effectiveSn == null ? 
//           <SuperHeader/> 
//           : 
//           <LmsHeader navToggle={navToggle} setNavToggle={setNavToggle}>
//             <HeaderStatus  navKind={navKind} myCoSn={myCoSn} effectiveSn={effectiveSn}/>
//           </LmsHeader>
//         } */}
//         {/* {effectiveSn == null ?  //보정된 회사값이 널 값이면?
//           <SuperHeader />
//           :
//           <> 
//             {effectiveSn != null &&  (// (HOME_PATHS[navKind] ??  )  ( // 보정된 회사값이 널 값이 아니고!
//               <LmsHeader navToggle={navToggle} setNavToggle={setNavToggle}>
//                 <HeaderStatus navKind={navKind} myCoSn={myCoSn} effectiveSn={effectiveSn} />
//               </LmsHeader>
//         )}
//           </>
//         } */}
//         {fixedSn === myCoSn ?
//           <LmsHeader navKind={navKind} setNavToggle={setNavToggle} navToggle={navToggle} myCoSn={myCoSn} loc={loc}/>
//           :
//           <SuperHeader navKind={navKind}/>
//         }
//         {/* 로그인 / 로그아웃 버튼 체인지 */}
//         {user === null ?
//         <button className="joinBtn" type="button" onClick={() => navigate('/welcome/login')}>Login →</button>
//         :
//         <MyInfo label={user.USER_NM} className="joinBtn" trigger="hover">
//           <div className= "subMenuList" onClick={() => {navigate(`myPage`);}}>마이페이지</div>
//           <div className= "subMenuList" onClick={()=> {signOut(); window.location.href = "/";}} >로그아웃</div>
//         </MyInfo>
//         }
//       </header>
//       <div className="layout_content">
//         <main className="varPage">
//           {/* Nav 팝업은 여기서 처리 */}
//           {navToggle === false ? 
//             null 
//             : 
//             <Nav setNavToggle={setNavToggle}></Nav>
//           }
//           {/* Outlet에서 페이지 바뀌는거 보일 예정 */}
//           <Outlet />
//         </main>
//         <footer>
//           {(user?.USER_AUTHRT_SN === 1) ?
//           <>
//             <h2 onClick={() => {navigate('/'); setNavToggle(false);}} style={{cursor:"pointer"}}>LERMES</h2>
//             <div onClick={() => navigate('/adminHome')} style={{cursor:"pointer"}}>관리자 홈</div>
//             <div onClick={() => navigate('/tutorHome')} style={{cursor:"pointer"}}>강사 홈</div>
//             <div onClick={() => navigate('/stdHome')} style={{cursor:"pointer"}}>수강생 홈</div>
//             <div onClick={() => navigate('/visitorHome')} style={{cursor:"pointer"}}>방문자 홈</div>
//           </>
//           :
//           <h2 onClick={() => {navigate('/'); setNavToggle(false); clearFixedSn();}} style={{cursor:"pointer"}}>LERMES</h2>
//           }
//           <div className="testBox">
//             <div style={{ fontSize: "1.4rem", color: "#444" }}>권한</div>

//             {user?.USER_EML_ADDR === "hash@com" &&
//               testAuthLv.map((item, idx) => (
//                 <button
//                   key={item ?? idx}                  // ← 고유 key
//                   type="button"
//                   style={{ cursor: "pointer" }}
//                   onClick={(e) => {
//                     patchUser({ USER_AUTHRT_SN: idx + 1 });
//                     setItem(idx);                    // selectedItem 업데이트하는 setter
//                   }}
//                   className={`testBtn ${selectedItem === idx ? "testClicked" : ""}`}
//                 >
//                   {item}
//                 </button>
//               ))
//             }
//           </div>
//           <div onClick={() => {
//   console.log(`navKind ${navKind}`);
//   console.log(`${effectiveSn} 최종 fixedSn`)
//   console.log(`${fixedSn} 최종 fixedSn`)

//           }}>클릭</div>
//         </footer>
//       </div>
//     </div>
//   )
// }
