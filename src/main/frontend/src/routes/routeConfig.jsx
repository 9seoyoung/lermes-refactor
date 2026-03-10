import FindId from "../auth/loginPage/FindId";
import FindPw from "../auth/loginPage/FindPw";
import GeneralJoin from "../auth/loginPage/GeneralJoin";
import OAuth2Redirect from "../auth/loginPage/GoogleOAuth2Redirect";
import Login from "../auth/loginPage/Login";
import TenantSignup from "../auth/loginPage/TenantSignup";
import Layout2 from "../components/layout/Real/Layout2";
import AdminHome from "../pages/LMS/AdminHome";
import StdHome from "../pages/LMS/TutorHome";
import VisitorHome from "../pages/LMS/VisitorHome";
import SuperMain from "../pages/Super/SuperMain";
import CohortGuard from "./guards/CohortGuard";
import TenantGuard from "./guards/TenantGuard";
import GridLayout from "./layouts/GridLayout";
import LmsRoot from "./layouts/LmsRoot";
import Root from "./layouts/Root";
import { seg } from "./routeAddress";

export default [
  {
    path: "/",
    element: <Root></Root>,
    children: [
      {
        index: true, element: <Layout2></Layout2>, // 슈퍼메인 레이아웃
        children: [
          { index: true, element: <SuperMain></SuperMain> }, //랜딩화면 기본
        ]
      },
      {
        path: seg.LOGIN, element: <></>, // 로그인 레이아웃
        children: [
          { index: true, element: <Login></Login>}, // 로그인창 기본
          { path: seg.OAUTH2, element: <OAuth2Redirect />},
          { path: seg.FORGOTID, element: <FindId></FindId>},
          { path: seg.FORGOTPW, element: <FindPw></FindPw>},
        ]
      },
      {
        path: seg.WELCOME, element: <></>, //로그인 레이아웃이랑 동일
        children: [
          { path: seg.GENERAL, element: <GeneralJoin></GeneralJoin>},
          { path: seg.BUSINESS, element: <TenantSignup></TenantSignup>}
        ]
      },
      {
        path: seg.LMS, 
        element: <LmsRoot></LmsRoot>,
        children: [
          { 
            path: seg.COMPANY,
            element: <TenantGuard></TenantGuard>,
            /** 
             * 음.. /lms/회사이름 시 기본 홈은 방문자홈으로 해야겠다.
             * >> 테넌트멤버야? 직원홈으로 아님 >> visitorHome으로
             * >> visitorHome 보내기전에 코호트 멤버임? 코호트멤버 중 강사나 학생이야? > 각자 홈으로
             * >> 아님>> ㄹㅇ 방문자홈
             * */
            children: [
              { index: true, element: <GridLayout></GridLayout>, // 테넌트,직원
                children: [
                  { index: true, element: <AdminHome></AdminHome>}
                ]
              },
              { path: seg.COHORT, element: <CohortGuard role={[Instructor]} ></CohortGuard>,
                children: [
                  { element: <GridLayout></GridLayout>,
                    children: [
                      { index: true, element: <TutorHome></TutorHome>}
                    ]
                  }
                ]
              },
              { element: <CohortGuard role={[Student]} ></CohortGuard>,
                children: [
                  { element: <GridLayout></GridLayout>,
                    children: [
                      { index: true, element: <StdHome></StdHome>}
                    ]
                  }
                ]
              }
            ]
          },
          // 방문자, 테넌트가드 튕김
          {

          }
          // 소속ㅇ, 테넌트가드 통과 + 코호트 가드 ㄱㄱ
        ]
      }
    ]
  }
];