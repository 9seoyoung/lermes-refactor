import {useLocation, useNavigate} from "react-router-dom";

import layoutStyles from "../../../styles/layout.module.css"
import { useAccount } from "../../../auth/AuthContext";
import Dropdown from "../../ui/Dropdown";
import {useEffect} from "react";


function SuperHeader({setNavToggle}) {
  const navigate = useNavigate();
  const {user} = useAccount();
  const {pathname} = useLocation();
    const homePath = pathname.split("/").slice(1);


    useEffect(() => {
        setNavToggle(false);
    }, [pathname]);


  return (
    <div className="header_L" >
      <button type={"button"} onClick={() => navigate("/")} className="button_L">
        <img src={process.env.PUBLIC_URL + '/img/logo.png'} alt="Logo" />
      </button>
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
              <div className={layoutStyles.subMenuList} onClick={()=> navigate('/bizAd')}>비즈니스 가입</div>
            </Dropdown>
      </div>
    </div>
    
  )
}

export default SuperHeader