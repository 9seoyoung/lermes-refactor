// src/pages/mypage/UserProfile.jsx
import { useEffect, useState } from 'react';
import {
  getUserProfile,
  updateUserProfileInfo,
} from '../../../auth/authService';
import { uploadEvidenceFile } from '../../../attend/attendService';
import { useAccount } from '../../../auth/AuthContext';
import { toast } from 'react-toastify';
import PasswordChangeModal from "./PasswordChangeModal";
import MyInfoForm from "./MyInfoForm";
import { UserInfo } from '../../module/mypage/UserInfo';

export default function UserProfile({ onAdminSave, infoEditToggle, setInfoEditToggle }) {
  const { user, patchUser } = useAccount();
  const [open, setOpen] = useState(false);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    userProfileImage: null,
  });

  const formatPhone = (phone) => {
    if (!phone) return '';
    const onlyNum = phone.replace(/\D/g, '');
    if (onlyNum.length === 11)
      return onlyNum.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    if (onlyNum.length === 10)
      return onlyNum.replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1-$2-$3');
    return onlyNum;
  };

  const formatBrNo = (brno) => {
    if (!brno || brno.length !== 10) return brno;
    return `${brno.substring(0, 3)}-${brno.substring(3, 5)}-${brno.substring(
      5
    )}`;
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getUserProfile();
      setProfile(res);
      setFormData({
        email: res.email,
        phoneNumber: res.phoneNumber ? formatPhone(res.phoneNumber) : '',
        userProfileImage: res.userProfileImage || null,
      });
      setPreviewUrl(
        res.userProfileImage
          ? `http://localhost:940/api/files/id/${res.userProfileImage}/preview`
          : null
      );
    } catch (e) {
      console.error(e);
      toast.error('프로필 불러오기 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploaded = await uploadEvidenceFile(file);
      const fileSn = uploaded.fileSn;

      setFormData((prev) => ({ ...prev, userProfileImage: fileSn }));
      setPreviewUrl(`http://localhost:940/api/files/id/${fileSn}`);
      toast.info('사진이 변경되었습니다. "저장" 버튼을 눌러야 저장됩니다.');
    } catch (err) {
      console.error(err);
      toast.error('업로드 실패');
    }
  };

  const handleSave = async () => {
    const plainPhone = formData.phoneNumber.replace(/[^0-9]/g, '');

    if (!plainPhone || plainPhone.length !== 11) {
      toast.error('휴대폰 번호는 숫자 11자리여야 합니다.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      toast.error('올바른 이메일 주소를 입력하세요.');
      return;
    }

    try {
      await updateUserProfileInfo({
        userEmlAddr: formData.email,
        userTelno: plainPhone,
        userProfileImage: formData.userProfileImage,
      });

      patchUser({
        ...profile,
        USER_PROFILE_IMAGE: formData.userProfileImage,
        USER_EML_ADDR: formData.email,
        USER_TELNO: plainPhone,
      });

      toast.success('프로필이 수정되었습니다.');

      // ✅ 관리자면 회사정보도 같이 저장
      const authSn = user?.USER_AUTHRT_SN;
      if (authSn === 2 || authSn === 3) {
        onAdminSave?.();
      }

      fetchProfile();
      setInfoEditToggle(false);
    } catch (err) {
      console.error(err);
      toast.error('수정 실패');
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (!profile) return <p>데이터 없음</p>;

  const authSn = user?.USER_AUTHRT_SN;

  return (
      <>
        {infoEditToggle ?
    <section className="myInfoSection" style={{background:"white"}}>
      <h2 className="myInfoTitle myInfoTitleA">
        {profile.name} ({profile.status})
        <button className="myInfoEditBtn blue" onClick={handleSave}>
          저장
        </button>
        <button type={"button"} className="myInfoEditBtn gray" onClick={() => setInfoEditToggle(false)}>
          취소
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
          <label htmlFor="fileInput" className="myInfoPhoto">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="프로필"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span>사진 업로드</span>
            )}
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          {formData.userProfileImage && (
            <button
              className="deleteBtn"
              onClick={() => {
                setFormData((prev) => ({ ...prev, userProfileImage: null }));
                setPreviewUrl(null);
                toast.info(
                  '사진이 삭제되었습니다. "저장" 버튼을 눌러야 저장됩니다.'
                );
              }}
            >
              삭제
            </button>
          )}
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
            <input
              type="text"
              className="myInfoInput"
              value={formData.phoneNumber}
              maxLength={11}
              minLength={11}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  phoneNumber: e.target.value.replace(/[^0-9]/g, ''),
                }))
              }
              placeholder="숫자 11자리"
            />
          </div>

          <div className="myInfoRow">
            <span className="myInfoLabel">이메일</span>
            <input
              type="text"
              className="myInfoInput"
              value={formData.email}
              readOnly
              style={{
                backgroundColor: '#f5f5f5',
                color: '#555',
                cursor: 'not-allowed',
                border: 'none',
              }}
            />
          </div>
          <div style={{ textAlign: 'right', margin: '8px 0', width: '100%' }}>
            <button
                onClick={() => setOpen(true)}
                style={{
                  background: '#eee',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'end',
                }}
            >
              비밀번호 변경
            </button>
          </div>

          {open && <PasswordChangeModal onClose={() => setOpen(false)} />}
        </div>
        </div>
        <MyInfoForm />
      </div>
    </section>
            :
            <UserInfo formData={formData} formatBrNo={formatBrNo} previewUrl={previewUrl} onEdit={setInfoEditToggle} profile={profile} authSn={authSn}/>
        }
        </>
  );
}
