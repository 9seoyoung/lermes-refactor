import { useNavigate } from "react-router-dom"
import { useAccount } from "../../../auth/AuthContext";

export default function TutorNav({setNavToggle}) {
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
                    <div style={{fontSize: "18px", fontWeight:"600"}}>{user.USER_NM}</div>
                    <div>{user.USER_EML_ADDR}</div>
                </div>
                <button type="button" className="lmsMyInfoBtn"  style={{fontSize: "14px"}}>
                    내 정보
                </button> 
            </div>
            <div className="navMenuList">
                {/* 강사 */}
                <div onClick={() => navigate('/tutorHome')}>홈</div>
                <div onClick={() => navigate('/tutorHome/studySched')}>학습 관리</div>
                <div onClick={() => navigate('/tutorHome/board')}>수강생 관리</div>                
                <div onClick={() => navigate('/tutorHome/board')}>게시판</div>                
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
