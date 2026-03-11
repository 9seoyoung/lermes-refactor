import { useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown";

import layoutStyles from "../../../styles/layout.module.css"
import { useAccount } from "../../../auth/AuthContext";
import MyInfo from "../MyInfo";


function SuperHeader() {
  const navigate = useNavigate();
  const {user, signOut} = useAccount();

  return (
    <>
    <div>
      <button type={"button"} onClick={() => navigate("/")} className="button_L">
        <img src={process.env.PUBLIC_URL + '/img/logo.png'} alt="Logo" />
      </button>
    </div>
      <div className={`header_R ${layoutStyles.menuContainer}`}>
            <Dropdown label="비즈니스: 더 알아보기" trigger="hover" placement="bottom-start">
              <div className={layoutStyles.subMenuList} onClick={console.log(user)}>메뉴 1</div>
              <div className={layoutStyles.subMenuList}>메뉴 2</div>
              <div className={layoutStyles.subMenuList}>메뉴 3</div>
              <div className={layoutStyles.subMenuList}>메뉴 4</div>
            </Dropdown>
            <Dropdown label="비즈니스/제휴" trigger="hover" placement="bottom-start">
              <div className={layoutStyles.subMenuList}>메뉴 1</div>
              <div className={layoutStyles.subMenuList}>메뉴 2</div>
              <div className={layoutStyles.subMenuList}>메뉴 3</div>
              <div className={layoutStyles.subMenuList} onClick={()=> navigate('/welcome/tenantjoin')}>비즈니스 가입</div>
            </Dropdown>
      </div>
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
    </>
    
  )
}

export default SuperHeader