import { useNavigate } from "react-router-dom"
import { useAccount } from "../../../auth/AuthContext";

export default function AdminNav({setNavToggle}) {
    const { user, fetchedOnce } = useAccount();
    const navigate = useNavigate();

    if (!fetchedOnce) {
        return <div className="navCont">로딩중…{/* 스켈레톤 */}</div>;
    }


    return (
    <div className="navCont">
        <div className="navMenuCont">
            <div className="navMyInfo">
                <img src="#" alt="사용자 프로필"></img>
                <div className="infoWrap">
                    <div style={{fontSize: "16px", fontWeight:"600" }}>{user.USER_NM}</div>
                    <div style={{color:"#666"}}>{user.USER_EML_ADDR}</div>
                </div>
                <div className="lmsMyInfoBtn"  style={{fontSize: "12px", fontWeight:"400"}}>
                  관리자 / {user.USER_AUTHRT_SN === 2 ? "대표" : "직원"}
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
        <div className="goSuper" onClick={() => {navigate('/'); setNavToggle(false);}}>
            <div>
                LERMES로 돌아가기
            </div>
        </div>
    </div>
  )
}
