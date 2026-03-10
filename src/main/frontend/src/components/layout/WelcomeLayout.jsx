// 라이브러리
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { fetchMe } from '../../auth/authService';

// 스타일
import '../../styles/sj.css';


// 컴포넌트

function WelcomeLayout() {
  const navigate = useNavigate();

  console.log(fetchMe);

  return (
    <div className="welcomeCont" style={{ cursor: 'default' }}>
      <header className="headerLogo" style={{ cursor: 'default' }}>
        <img
          src={process.env.PUBLIC_URL + '/img/logo.png'}
          alt="Logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
      </header>
      <div className="main-container">
        <div className="panel left-panel"
          style={{position: "relative"}}
        >
              <img
                   src={process.env.PUBLIC_URL + '/img/loginBg.png'}
                   alt="bg"
                   style={{
                       objectFit: "contain",
                       width: "100%",
                   }}
              />
              {/*<button*/}
              {/*    type="button"*/}
              {/*    className="start-btn"*/}
              {/*    onClick={() => {*/}
              {/*        navigate('/welcome/generalJoin');*/}
              {/*    }}*/}
              {/*    style={{*/}
              {/*        position:"absolute",*/}
              {/*        left:"56px",*/}
              {/*        bottom: "35%"*/}
              {/*    }}*/}
              {/*>*/}
              {/*    시작하기*/}
              {/*</button>*/}
        </div>
          <div className="panel right-panel">
              <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
}

export default WelcomeLayout;
