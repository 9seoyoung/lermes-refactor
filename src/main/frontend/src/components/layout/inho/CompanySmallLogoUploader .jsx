// src/components/layout/inho/CompanySmallLogoUploader.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  updateCompanySmallLogo,
  deleteCompanySmallLogo,
  fetchCompany,
} from '../../../auth/authService';
import { useAccount } from '../../../auth/AuthContext';
import { useSelectedCompany } from '../../../contexts/SelectedCompanyContext';
import { uploadEvidenceFile } from '../../../attend/attendService';
import './CompanyLogo.css';
import { useNavigate } from 'react-router-dom';

export default function CompanySmallLogoUploader() {
  const { user } = useAccount();
  const { effectiveSn } = useSelectedCompany();
  const navigate = useNavigate();
  const [logoFileSn, setLogoFileSn] = useState(null);
  const [dpState, setDpState] = useState(false)

  useEffect(() => {
    if (effectiveSn) {
      fetchCompany(effectiveSn)
        .then((company) => setLogoFileSn(company.smallLogoFileSn))
        .catch(() => setLogoFileSn(null));
    }
  }, [effectiveSn]);

  const canEdit =
    (user?.USER_AUTHRT_SN === 1 ||
      user?.USER_AUTHRT_SN === 2 ||
      user?.USER_AUTHRT_SN === 3) &&
    String(effectiveSn) === String(user?.USER_OGDP_CO_SN);

  // 파일 업로드
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploaded = await uploadEvidenceFile(file);
      const fileSn = uploaded.fileSn;

      await updateCompanySmallLogo(user?.USER_OGDP_CO_SN, fileSn);
      setLogoFileSn(fileSn);
      toast.success('회사 로고 변경 완료!');
    } catch (err) {
      console.error(err);
      toast.error('로고 업로드 실패');
    }
  };

  // 로고 삭제
  const handleDelete = async () => {
    try {
      await deleteCompanySmallLogo(user?.USER_OGDP_CO_SN);
      setLogoFileSn(null);
      toast.success('회사 로고 삭제 완료!');
    } catch (err) {
      console.error(err);
      toast.error('로고 삭제 실패');
    }
  };
  console.log(dpState)

  return (
    <div
      className="logoBox"
      style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
    >
      {/* 로고 영역 */}
      <div className="logoWrapper" onClick={() => navigate('/lmsHomeIndex')}>
        {logoFileSn ? (
          <img
            src={`http://localhost:940/api/files/id/${logoFileSn}/preview`}
            alt="회사 로고"
            className="companyLogo"
          />
        ) : (
          <div className="logoPlaceholder">회사 로고</div>
        )}
      </div>
      {/* 버튼 영역 (세로 배치) */}
      {canEdit && (
        <div
          className="logoButtons"
          style={{ display: 'block', flexDirection: 'column', gap: '5px' }}
        >
          {/* <label htmlFor="smallLogoUpload" className="btn">
            변경
          </label>
          <input
            id="smallLogoUpload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
           */}
          <button className="btn" onClick={() => setDpState(true)}>
            변경
          </button>
          <button className="btn" onClick={handleDelete}>
            삭제
          </button>
        </div>
      )}
      {dpState && <LogoFileUploader dpState={dpState} setDpState={setDpState}></LogoFileUploader>}
    </div>
  );
}


const LogoFileUploader = ({dpState, setDpState}) => {
  const [file, setLogoFile] = useState();
  const [preview, setPreview] = useState(null);
  const { user } = useAccount();

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;


    setLogoFile(selected);
    const url = URL.createObjectURL(selected);
    setPreview(url);

  };

  const onSubmit = async () => {
    if (!file) return console.log("파일없음");

    try {
      const uploaded = await uploadEvidenceFile(file);
      const fileSn = uploaded.fileSn;

      await updateCompanySmallLogo(user?.USER_OGDP_CO_SN, fileSn);
      setLogoFile(file);
      setDpState(false);
      toast.success('회사 로고 변경 완료!');
    } catch (err) {
      console.error(err);
      toast.error('로고 업로드 실패');
    }
  };
  return (
    <div 
      style={{display: dpState ? "block" : "none", position: "absolute", zIndex: 888888}}
    >
      <a>파일을 가져오세요.</a>
      <input
          id="smallLogoUpload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
      />
      <div>
        <div>미리보기</div>

      {preview ? (
        <img
          src={preview}
          alt="미리보기"
          style={{ width: 200, height: 200, objectFit: "cover" }}
        />
      ) : <a>파일을 업로드 하세요.</a>}
      </div>
      <button onClick={() => onSubmit()}>저장</button>
      <button onClick={()=> setDpState(false)}>취소</button>
    </div>
  );
}