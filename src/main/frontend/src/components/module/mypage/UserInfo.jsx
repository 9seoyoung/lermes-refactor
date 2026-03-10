import {toast} from "react-toastify";
import PasswordChangeModal from "../../layout/inho/PasswordChangeModal";
import MyInfoForm from "../../layout/inho/MyInfoForm";
import {UserCircle, UserCircle2, UserIcon, UserRound} from "lucide-react";
import {useEffect, useState} from "react";

export function UserInfo({formData, onEdit, profile, authSn, previewUrl, formatBrNo }){
    const [form, setForm] = useState({
        address: '',
        addressDetail: '',
        major: '',
        cert: '',
        skills: '',
        birth: '',
    });
    const [loading, setLoading] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [open, setOpen] = useState(true);
    
    useEffect(() => {
        if (window.daum && window.daum.Postcode) {
            setScriptLoaded(true);
            return;
        }
        const script = document.createElement('script');
        script.src =
        '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        script.onload = () => setScriptLoaded(true);
        document.body.appendChild(script);
    }, []);
    
    console.log('onEdit:', onEdit, typeof onEdit);

    return (
        <section className="myInfoSection" style={{background:"white"}}>
            <h2 className="myInfoTitle myInfoTitleA">
                {profile.name} ({profile.status})
                <button className="myInfoEditBtn gray" onClick={() => onEdit(true)}>
                    Edit
                </button>
            </h2>

            <div className="myInfoContent">
                <div id={"userInfoCont"}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        {previewUrl ?
                            <div className="myInfoPhoto">
                        <img
                            src={previewUrl}
                            alt="프로필"
                            className="myInfoPhoto"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                            </div>
                            :
                            <div className="myInfoPhoto">

                            <img
                            src={"/img/default-profile.png"}
                            alt="프로필"
                            className="myInfoPhoto"
                            style={{ width: '50%', height: '50%', objectFit: 'cover' }}
                        />
                            </div>
                        }
                    </div>

                    <div className="myInfoDetails">
                        {(authSn === 4 || authSn === 5) && (
                            <>
                                <div className="myInfoRow">
                                    <span className="myInfoLabel">과정명</span>
                                    <span className="myInfoValue">{profile.courseName}</span>
                                </div>
                                <div className="myInfoRow">
                                    <span className="myInfoLabel">소속 그룹</span>
                                    <span className="myInfoValue">{profile.cohortName}</span>
                                </div>
                            </>
                        )}

                        {(authSn === 2 || authSn === 3) && (
                            <>
                                <div className="myInfoRow">
                                    <span className="myInfoLabel">회사명</span>
                                    <span className="myInfoValue">{profile.companyName}</span>
                                </div>
                                <div className="myInfoRow">
                                    <span className="myInfoLabel">사업자번호</span>
                                    <span className="myInfoValue">{formatBrNo(profile.brNo)}</span>
                                </div>
                            </>
                        )}

                        <div className="myInfoRow">
                            <span className="myInfoLabel">휴대폰 번호</span>
                            <span
                                noborder={"no"}
                                className="myInfoInput"
                            >
                                {formData.phoneNumber}
                            </span>
                        </div>

                        <div className="myInfoRow">
                            <span className="myInfoLabel">이메일</span>
                            <span
                                noborder={"no"}
                            >
                                {formData.email}
                            </span>
                        </div>
                        <div style={{ textAlign: 'right', margin: '8px 0', width: '100%' }}>
                        </div>
                    </div>
                </div>
                {/*상세 정보 토글*/}
                <section className="myInfoSection myInfoSectionB">
                    {/* ✅ 제목 전체를 클릭하면 토글 */}
                    <h2
                        className="myInfoTitle"
                        onClick={() => setOpen((prev) => !prev)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div>상세 정보</div>
                        <span style={{ border: 'none' }}>({open ? '접기' : '펼치기'})</span>
                    </h2>

                    {open && (
                        <div className="myInfoForm">
                            <div className="myInfoRow">
                                <span className="myInfoLabel">생년월일</span>
                                <span noborder={"no"}>{form.birth || "-"}</span>
                            </div>

                            <div className="myInfoRow">
                                <span className="myInfoLabel">주소</span>
                                <span noborder={"no"} >{form.address || "-"}</span>
                            </div>

                            <div className="myInfoRow">
                                <span className="myInfoLabel">상세 주소</span>
                                <span  noborder={"no"}>{form.addressDetail || "-"}</span>
                            </div>

                            <div className="myInfoRow">
                                <span className="myInfoLabel">전공</span>
                                <span noborder={"no"} >{form.major || "-"}</span>
                            </div>

                            <div className="myInfoRow">
                                <span className="myInfoLabel">보유자격</span>
                                <span noborder={"no"} >{form.cert || "-"}</span>
                            </div>

                            <div className="myInfoRow">
                                <span className="myInfoLabel">보유기술</span>
                                <span noborder={"no"} >{form.skills || "-"}</span>
                            </div>

                            {/* ✅ 저장 버튼은 맨 하단에 고정 */}

                        </div>
                    )}
                </section>
            </div>
        </section>
    );
}