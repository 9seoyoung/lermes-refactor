import { useEffect, useState } from 'react';
import { getUserDetail, saveUserDetail } from '../../../auth/authService';
import { toast } from 'react-toastify';
import '../../../styles/MyInfo.css';

const MyInfoForm = () => {
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
  const [open, setOpen] = useState(false);

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

  const fetchMyDetail = async () => {
    try {
      setLoading(true);
      const detail = await getUserDetail();
      if (detail) {
        setForm({
          address: detail.address || '',
          addressDetail: detail.addressDetail || '',
          major: detail.major || '',
          cert: detail.cert || '',
          skills: detail.skills || '',
          birth: detail.birth || '',
        });
      }
    } catch (e) {
      console.error(e);
      toast.error('내 정보 불러오기 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDetail();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openPostcode = () => {
    if (!scriptLoaded) {
      toast.error('주소 검색 모듈이 아직 로드되지 않았습니다.');
      return;
    }
    new window.daum.Postcode({
      oncomplete: function (data) {
        setForm((prev) => ({
          ...prev,
          address: data.roadAddress,
        }));
      },
    }).open();
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await saveUserDetail(form);
      if (res) {
        toast.success('저장 성공');
        setForm({
          address: res.address || '',
          addressDetail: res.addressDetail || '',
          major: res.major || '',
          cert: res.cert || '',
          skills: res.skills || '',
          birth: res.birth || '',
        });
      } else {
        toast.error('저장 실패');
      }
    } catch (e) {
      console.error(e);
      toast.error('저장 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section >
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
            <input
              type="date"
              name="birth"
              value={form.birth}
              onChange={handleChange}
              className="myDetailInfoInput"
            />
          </div>

          <div className="myInfoRow">
            <span className="myInfoLabel">주소</span>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="myDetailInfoInput"
              placeholder="주소 검색 버튼 클릭"
              readOnly
            />
            <button
              type="button"
              onClick={openPostcode}
              className="myInfoAddressButton"
              disabled={!scriptLoaded}
            >
              주소 검색
            </button>
          </div>

          <div className="myInfoRow">
            <span className="myInfoLabel">상세 주소</span>
            <input
              type="text"
              name="addressDetail"
              value={form.addressDetail}
              onChange={handleChange}
              className="myDetailInfoInput"
              placeholder="상세 주소 입력"
            />
          </div>

          <div className="myInfoRow">
            <span className="myInfoLabel">전공</span>
            <input
              type="text"
              name="major"
              value={form.major}
              onChange={handleChange}
              className="myDetailInfoInput"
            />
          </div>

          <div className="myInfoRow">
            <span className="myInfoLabel">보유자격</span>
            <input
              type="text"
              name="cert"
              value={form.cert}
              onChange={handleChange}
              className="myDetailInfoInput"
            />
          </div>

          <div className="myInfoRow">
            <span className="myInfoLabel">보유기술</span>
            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className="myDetailInfoInput"
            />
          </div>

          {/* ✅ 저장 버튼은 맨 하단에 고정 */}
          <div className="myInfoActions">
            <button
              className="myInfoButton"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyInfoForm;
