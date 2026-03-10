import { useNavigate } from 'react-router-dom';
import { useAccount } from '../../../auth/AuthContext';
import { useSelectedCompany } from '../../../contexts/SelectedCompanyContext';

export default function NavStatus({
  setNavToggle,
  loc,
  myCoSn,
  navKind,
  effectiveSn,
}) {
  const { user } = useAccount();

  if (myCoSn !== effectiveSn || user?.USER_AUTHRT_SN !== 1)
    return <VisitorNav setNavToggle={setNavToggle} loc={loc} />;

  let component;

  switch (navKind) {
    case 'adminHome':
      component = <AdminNav setNavToggle={setNavToggle} loc={loc} />;
      return component;
    case 'stdHome':
      component = <StdNav setNavToggle={setNavToggle} loc={loc} />;
      return component;

    case 'tutorHome':
      component = <TutorNav setNavToggle={setNavToggle} loc={loc} />;
      return component;

    default:
      component = <VisitorNav setNavToggle={setNavToggle} loc={loc} />;
      return component;
  }
}

export function VisitorNav({ setNavToggle, loc }) {
  const { user, fetchedOnce } = useAccount();
  const { clearFixedSn } = useSelectedCompany();
  const navigate = useNavigate();

  if (!fetchedOnce) {
    return <div className="navCont">로딩중…{/* 스켈레톤 */}</div>;
  }

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
              {user?.USER_NM}
            </div>
            <div>{user?.USER_EML_ADDR}</div>
          </div>
          <button
            type="button"
            className="lmsMyInfoBtn"
            style={{ fontSize: '14px' }}
          >
            내 정보
          </button>
        </div>
        <div className="navMenuList">
          <div onClick={() => navigate('/visitorHome')}>홈</div>
        </div>
      </div>
      <div
        className="goSuper"
        onClick={() => {
          navigate('/');
          setNavToggle(false);
          clearFixedSn();
        }}
      >
        <div>LERMES로 돌아가기</div>
      </div>
    </div>
  );
}

function StdNav({ setNavToggle }) {
  const { user, fetchedOnce } = useAccount();
  const navigate = useNavigate();
  const { clearFixedSn } = useSelectedCompany();

  if (!fetchedOnce) {
    return <div className="navCont">로딩중…{/* 스켈레톤 */}</div>;
  }

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
              {user?.USER_NM}
            </div>
            <div>{user?.USER_EML_ADDR}</div>
          </div>
          <button
            type="button"
            className="lmsMyInfoBtn"
            style={{ fontSize: '14px' }}
          >
            내 정보
          </button>
        </div>
        <div className="navMenuList">
          {/* 학생 */}
          <div onClick={() => navigate('/stdHome')}>홈</div>
          <div onClick={() => navigate('/stdHome/studySched')}>학습 일정</div>
          <div onClick={() => navigate('/stdHome/board')}>게시판</div>
        </div>
      </div>
      <div
        className="goSuper"
        onClick={() => {
          navigate('/');
          setNavToggle(false);
          clearFixedSn();
        }}
      >
        <div>LERMES로 돌아가기</div>
      </div>
    </div>
  );
}

function TutorNav({ setNavToggle }) {
  const { user, fetchedOnce } = useAccount();
  const navigate = useNavigate();
  const { clearFixedSn } = useSelectedCompany();

  if (!fetchedOnce) {
    return <div className="navCont">로딩중…{/* 스켈레톤 */}</div>;
  }

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
              {user?.USER_NM}
            </div>
            <div>{user?.USER_EML_ADDR}</div>
          </div>
          <button
            type="button"
            className="lmsMyInfoBtn"
            style={{ fontSize: '14px' }}
          >
            내 정보
          </button>
        </div>
        <div className="navMenuList">
          {/* 강사 */}
          <div onClick={() => navigate('/tutorHome')}>홈</div>
          <div onClick={() => navigate('/tutorHome/studySched')}>학습 관리</div>
          <div onClick={() => navigate('/tutorHome/studentManage')}>
            수강생 관리
          </div>
          <div onClick={() => navigate('/tutorHome/board')}>게시판</div>
        </div>
      </div>
      <div
        className="goSuper"
        onClick={() => {
          navigate('/');
          setNavToggle(false);
          clearFixedSn();
        }}
      >
        <div>LERMES로 돌아가기</div>
      </div>
    </div>
  );
}

function AdminNav({ setNavToggle }) {
  const { user, fetchedOnce } = useAccount();
  const navigate = useNavigate();
  const { clearFixedSn } = useSelectedCompany();

  if (!fetchedOnce) {
    return <div className="navCont">로딩중…{/* 스켈레톤 */}</div>;
  }

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
            <div style={{ fontSize: '16px', fontWeight: '600' }}>
              {user?.USER_NM}
            </div>
            <div style={{ color: '#666' }}>{user?.USER_EML_ADDR}</div>
          </div>
          <div
            className="lmsMyInfoBtn"
            style={{ fontSize: '12px', fontWeight: '400' }}
          >
            관리자 / {user?.USER_AUTHRT_SN === 2 ? '대표' : '직원'}
          </div>
        </div>
        <div className="navMenuList">
          {/* 관리자 */}
          <div onClick={() => navigate('/adminHome')}>홈</div>
          <div onClick={() => navigate('/adminHome/groupSet')}>과정 관리</div>
          <div onClick={() => navigate('/adminHome/boardSet')}>게시물 관리</div>
          <div onClick={() => navigate('/adminHome/accountSet')}>계정 관리</div>
          <div onClick={() => navigate('/adminHome/docuSet')}>서류 관리</div>
        </div>
      </div>
      <div
        className="goSuper"
        onClick={() => {
          navigate('/');
          setNavToggle(false);
          clearFixedSn();
        }}
      >
        <div>LERMES로 돌아가기</div>
      </div>
    </div>
  );
}
