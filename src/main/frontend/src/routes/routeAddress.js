/**
 * 1. 형제 단위로 쪼개서 객체 만들기, ===> useRoutes용 값에 사용, 상대경로로 써야함
 * 2. 쪼개져 있는거 벡틱으로 합쳐서 절대경로 링크 만들기 ===> 링크에 사용
 * 
 * 이렇게 해야 라우팅 리팩토링 쉬움
 */

const getCompanyNameWithcoSn = async (coSn) => {
  
  // const name = await ~~~~~~~~~~~~~~

  return `${"axios로 받아온거"}`
}

const getCohortNameWithcohortSn = async (cohortSn) => {

  return `${"axios로 받아온거"}`
}

export const seg = {
  // 루트임 ***********************************************************
  ROOT: "/", // root, ㄹㅇ 루트 걍 아울렛임 껍데기임 > 랜딩용 레이아웃 > SuperMain이 index

  // 회원가입 관련 =================================================================
  WELCOME: "welcome", // root 로그인용 레이아웃 쓸 건데 회원가입용임
  BUSINESS: "business",
  GENERAL: "general",
  
  // 로그인 관련 ==================================================================== 
  LOGIN: "login", // root, 로그인용 레이아웃 씀
  OAUTH2: "oauth2-redirect",
  FORGOTID: "forgotId",
  FORGOTPW: "forgotPw",

  // LMS 관련 ======================================================================
  LMS: "lms",// root, LMS용 레이아웃
  // COMPANY: `${getCompanyNameWithcoSn(coSn)}`,
  // COHORT: `${getCohortNameWithcohortSn(cohortSn)}`,
  VISITOR: 'visitor',
  ADMIN: 'admin',

  // 게시물 관련 =====================================================================
  POST: "post"
};

export const routePath = {
  root : "/",
  login : `/${seg.LOGIN}/${seg.LOGIN}`,
  loginOauth2 : `/${seg.LOGIN}/${seg.OAUTH2}`,
  loginForgotId: `/${seg.LOGIN}/${seg.FORGOTID}`,
  loginForgotPw: `/${seg.LOGIN}/${seg.FORGOTPW}`,
  welcomeBusiness: `/${seg.WELCOME}/${seg.BUSINESS}`,
  welcomeGeneral: `/${seg.WELCOME}/${seg.GENERAL}`,
  lmsVisitor: `/${seg.LMS}/${seg.COMPANY}/${seg.VISITOR}`,
  lmsAdmin: `/${seg.LMS}/${seg.COMPANY}/${seg.ADMIN}`,
  // -------------------------------------------과거
    // landing : "/", index
    welcome : {
      login : "/welcome", // index
      oauth2: "/welcome/oauth2-redirect",
      forgotId: "/welcome/forgotId",
      forgotPw: "/welcome/forgotPw",
      business: "/welcome/business",
      general: "/welcome/general",
    },
    myPage : "/myPage",
    community : {}, // 추후 개발
  lms : {
    home : "/lms/home",
    post : {
      create : "/lms/docslayout"
    },
    setting: "/lms/settings"

  }
}