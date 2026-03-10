import { useNavigate } from 'react-router-dom';
import { useAccount } from '../../../auth/AuthContext';
import { useSelectedCompany } from '../../../contexts/SelectedCompanyContext';
import { useEffect } from 'react';
import { routePath } from '../../../routes/routeAddress';

export function Nav() {
  const { user, fetchedOnce } = useAccount();
  const { clearFixedSn, effectiveSn } = useSelectedCompany();
  const navigate = useNavigate();
  const userAuthRole = {
    1: "관리자",
    2: "대표",
    3: "직원",
    4: "강사",
    5: "수강생",
    6: "일반"
  }


  if (!fetchedOnce) {
    return <div className="navCont">로딩중…{/* 스켈레톤 */}</div>;
  }

  const myCoSn = user?.USER_OGDP_CO_SN;

  /** Nav
   * 0. 이미 경로로 접근한 상태 >>>>>>>
   * 1. effectiveSn과 내 회사 SN이 다르면 VistiorNav 메뉴
   * 2. 같으면 권한레벨에 따라 메뉴 다르게 보임
   */

  return (
    <div className="navCont">
      <div className="navMenuCont">
        <div className="navMyInfo">
          <img
            src={
              user?.USER_PROFILE_IMAGE
                ? `http://localhost:940/api/files/id/${user.USER_PROFILE_IMAGE}/preview`
                : '/img/default-profile.png'
            }
            alt="사용자 프로필"
          ></img>
          <div className="infoWrap">
            <div style={{ fontSize: '18px', fontWeight: '600' }}>
              {user?.USER_NM}{` [${user?.USER_OGDP_CO_SN === effectiveSn ?  userAuthRole[user?.USER_AUTHRT_SN] ?? "일반" : (user?.USER_AUTHRT_SN === 1 ? "관리자" : "방문자") }]`}
            </div>
            <div>{user?.USER_EML_ADDR}</div>
          </div>
          {/* <button
            type="button"
            className="lmsMyInfoBtn"
            style={{ fontSize: '14px' }}
          >
            내 정보
          </button> */}
        </div>
        <div id="superNav">
          {effectiveSn !== myCoSn && user?.USER_AUTHRT_SN !== 1? (
            <div onClick={() => navigate('/visitorHome')}>홈</div>
          ) : (
            <>
              {user?.USER_AUTHRT_SN === 1 ? (
                <>
                  <div className="navSet">
                    <div
                      className="superNav"
                      onClick={() => navigate('/adminHome')}
                    >
                      관리자 홈
                    </div>
                    <div
                      className="superNav"
                      onClick={() => navigate('/adminHome/groupSet')}
                    >
                      과정 관리
                    </div>
                    <div
                      className="superNav"
                      onClick={() => navigate('/adminHome/boardSet')}
                    >
                      게시물 관리
                    </div>
                    <div
                      className="superNav"
                      onClick={() => navigate('/adminHome/accountSet')}
                    >
                      계정 관리
                    </div>
                    <div
                      className="superNav"
                      onClick={() => navigate('/adminHome/docuSet')}
                    >
                      서류 관리
                    </div>
                  </div>
                  <div className="navSet">
                    <div
                      className="superNav"
                      onClick={() => navigate('/tutorHome')}
                    >
                      강사 홈
                    </div>
                    <div
                      className="superNav"
                      onClick={() => navigate('/tutorHome/studySched')}
                    >
                      학습 관리
                    </div>
                    <div
                      className="superNav"
                      onClick={() => navigate('/tutorHome/studentManage')}
                    >
                      수강생 관리
                    </div>
                    <div
                      className="superNav"
                      onClick={() => navigate('/tutorHome/board')}
                    >
                      게시판
                    </div>
                  </div>
                  <div className="navSet">
                    <div
                      className="superNav"
                      onClick={() => navigate('/stdHome')}
                    >
                      수강생 홈
                    </div>
                    <div
                      className="superNav"
                      onClick={() => navigate('/stdHome/studySched')}
                    >
                      학습 일정
                    </div>
                    <div
                      className="superNav"
                      onClick={() => navigate('/stdHome/board')}
                    >
                      게시판
                    </div>
                  </div>
                  <div
                    className="superNav"
                    onClick={() => navigate('/visitorHome')}
                  >
                    방문자 홈
                  </div>
                </>
              ) : (
                <>
                  {user?.USER_AUTHRT_SN === 2 || user?.USER_AUTHRT_SN === 3 ? (
                    <>
                      <div onClick={() => navigate('/adminHome')}>홈</div>
                      <div onClick={() => navigate('/adminHome/groupSet')}>
                        과정 관리
                      </div>
                      <div onClick={() => navigate('/adminHome/boardSet')}>
                        게시물 관리
                      </div>
                      <div onClick={() => navigate('/adminHome/accountSet')}>
                        계정 관리
                      </div>
                      {/* <div onClick={() => navigate('/adminHome/docuSet')}>
                        서류 관리
                      </div> */}
                      <div onClick={() => navigate('lms/docslayout')}>
                        게시글 테스트
                      </div>
                      <div onClick={() => navigate(routePath.lms.setting)}>lms 관리</div>
                    </>
                  ) : (
                    <>
                      {user?.USER_AUTHRT_SN === 4 ? (
                        <>
                          <div onClick={() => navigate('/tutorHome')}>홈</div>
                          <div
                            onClick={() => navigate('/tutorHome/studySched')}
                          >
                            학습 관리
                          </div>
                          <div onClick={() => navigate('/tutorHome/board')}>
                            게시판
                          </div>
                        </>
                      ) : (
                        <>
                          {/** 권한 5 ------ 나머지는 회사SN이 없어서 자동 vistor메뉴 */}
                          <div onClick={() => navigate('/stdHome')}>홈</div>
                          <div onClick={() => navigate('/stdHome/studySched')}>
                            학습 일정
                          </div>
                          <div onClick={() => navigate('/stdHome/board')}>
                            게시판
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      <div
        className="goSuper"
        onClick={() => {
          navigate('/');
          clearFixedSn();
        }}
      >
        <div>LERMES로 돌아가기</div>
      </div>
    </div>
  );
}
