// src/components/layout/inho/CompanyInfoForm.jsx
import { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { saveCompanyDetail, fetchCompany } from '../../../auth/authService';
import { uploadEvidenceFile } from '../../../attend/attendService';
import { useAccount } from '../../../auth/AuthContext';
import './CompanyInfoForm.css';

const CompanyInfoForm = forwardRef((props, ref) => {
  const { user } = useAccount();
  const companyId = user?.USER_OGDP_CO_SN;

  const [form, setForm] = useState({
    companyId: null,
    companyName: '',
    companyTel: '',
    companyAddress: '',
    companyAddressDetail: '',
    companyLogo: null,
    bizLicenseNo: '제 2025-서울강남-12345호',
  });
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useImperativeHandle(ref, () => ({
    saveCompanyInfo: handleSave,
  }));

  const formatPhone = (tel) => {
    if (!tel) return '';
    const digits = tel.replace(/\D/g, '');
    if (digits.length === 10)
      return digits.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
    if (digits.length === 11)
      return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    return tel;
  };

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

  const fetchCompanyDetail = async () => {
    if (!companyId) return;
    try {
      setLoading(true);
      const detail = await fetchCompany(companyId);
      if (detail) {
        setForm({
          companyId: detail.id || companyId,
          companyName: detail.name || '',
          companyTel: formatPhone(detail.companyTel) || '',
          companyAddress: detail.companyAddress || '',
          companyAddressDetail: detail.companyAddressDetail || '',
          companyLogo: detail.smallLogoFileSn || null,
          bizLicenseNo: '제 2025-서울강남-12345호',
        });
      }
    } catch (e) {
      toast.error('회사 정보 불러오기 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetail();
  }, [companyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'companyTel') {
      const digits = value.replace(/\D/g, '');
      setForm((prev) => ({ ...prev, companyTel: formatPhone(digits) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
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
          companyAddress: data.roadAddress,
        }));
      },
    }).open();
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const uploaded = await uploadEvidenceFile(file);
      setForm((prev) => ({ ...prev, companyLogo: uploaded.fileSn }));
      toast.info('로고 선택 완료. 저장 버튼을 눌러야 반영됩니다.');
    } catch (e) {
      toast.error('로고 업로드 실패');
    }
  };

  const handleLogoDelete = () => {
    setForm((prev) => ({ ...prev, companyLogo: null }));
    toast.info('로고 삭제됨. 저장 버튼을 눌러야 반영됩니다.');
  };

  const handleSave = async () => {
    if (!form.companyId) {
      toast.error('회사 ID가 없습니다.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: form.companyName,
        companyTel: form.companyTel.replace(/-/g, ''),
        companyAddress: form.companyAddress,
        companyAddressDetail: form.companyAddressDetail,
        smallLogoFileSn: form.companyLogo,
      };
      await saveCompanyDetail(form.companyId, payload);
      toast.success('회사 정보 저장 완료');
    } catch (e) {
      toast.error('회사 정보 저장 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="companyInfoSection companyInfoSectionB">
      <h2 className="companyInfoTitle">회사 상세 정보</h2>

      {/* ✅ 항상 펼쳐진 상태 유지 */}
      <div className="companyInfoForm">
        <div className="companyInfoRow">
          <span className="companyInfoLabel">상호명</span>
          <input
            type="text"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            className="companyDetailInfoInput"
          />
        </div>

        <div className="companyInfoRow">
          <span className="companyInfoLabel">회사 전화번호</span>
          <input
            type="text"
            name="companyTel"
            minLength={10}
            maxLength={11}
            value={form.companyTel}
            onChange={handleChange}
            className="companyDetailInfoInput"
            placeholder="02-1234-5678"
          />
        </div>

        <div className="companyInfoRow">
          <span className="companyInfoLabel">회사 주소</span>
          <input
            type="text"
            name="companyAddress"
            value={form.companyAddress}
            className="companyDetailInfoInput"
            placeholder="주소 검색 버튼 클릭"
            readOnly
          />
          <button
            type="button"
            onClick={openPostcode}
            className="companyInfoAddressButton"
            disabled={!scriptLoaded}
          >
            주소 검색
          </button>
        </div>

        <div className="companyInfoRow">
          <span className="companyInfoLabel">상세 주소</span>
          <input
            type="text"
            name="companyAddressDetail"
            value={form.companyAddressDetail}
            onChange={handleChange}
            className="companyDetailInfoInput"
            placeholder="상세 주소 입력"
          />
        </div>

        <div className="companyInfoRow">
          <span className="companyInfoLabel">회사 로고</span>
          <input
            id="companyLogoUpload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleLogoChange}
          />
          <label htmlFor="companyLogoUpload" className="companyLogoSelectBtn">
            파일 선택
          </label>
          <button
            type="button"
            className="companyInfoButton"
            onClick={handleLogoDelete}
          >
            삭제
          </button>
        </div>

        <div className="companyInfoRow">
          <span className="companyInfoLabel">통신판매 신고번호</span>
          <input
            type="text"
            value={form.bizLicenseNo}
            readOnly
            className="companyDetailInfoInput"
          />
        </div>

        {/* ✅ 내부 저장버튼은 여전히 숨김 */}
        <div className="companyInfoActions" style={{ display: 'none' }}>
          <button
            className="companyInfoButtonA"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </section>
  );
});

export default CompanyInfoForm;
