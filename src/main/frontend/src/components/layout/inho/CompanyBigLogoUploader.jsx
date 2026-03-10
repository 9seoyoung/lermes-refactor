// src/components/layout/inho/CompanyBigLogoUploader.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  updateCompanyBigLogo,
  deleteCompanyBigLogo,
  fetchCompany,
} from '../../../auth/authService';
import { useAccount } from '../../../auth/AuthContext';
import { useSelectedCompany } from '../../../contexts/SelectedCompanyContext';
import { uploadEvidenceFile } from '../../../attend/attendService';

export default function CompanyBigLogoUploader() {
  const { user } = useAccount();
  const { effectiveSn } = useSelectedCompany();
  const [logoFileSn, setLogoFileSn] = useState(null);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    if (effectiveSn) {
      fetchCompany(effectiveSn)
        .then((data) => {
          setLogoFileSn(data.bigLogoFileSn);
          setCompany(data);
        })
        .catch(() => {
          setLogoFileSn(null);
          setCompany(null);
        });
    }
  }, [effectiveSn]);

  const canEdit =
    (user?.USER_AUTHRT_SN === 1 ||
      user?.USER_AUTHRT_SN === 2 ||
      user?.USER_AUTHRT_SN === 3) &&
    String(effectiveSn) === String(user?.USER_OGDP_CO_SN);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploaded = await uploadEvidenceFile(file);
      const fileSn = uploaded.fileSn;

      await updateCompanyBigLogo(user?.USER_OGDP_CO_SN, fileSn);
      setLogoFileSn(fileSn);
      toast.success('빅 로고 변경 완료!');
    } catch (err) {
      console.error(err);
      toast.error('빅 로고 업로드 실패');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCompanyBigLogo(user?.USER_OGDP_CO_SN);
      setLogoFileSn(null);
      toast.success('빅 로고 삭제 완료!');
    } catch (err) {
      console.error(err);
      toast.error('빅 로고 삭제 실패');
    }
  };

  return (
    <>
      {/* 컴포넌트 전용 스타일 */}
      <style>
        {`
          .cbl-logoWrapper {
            position: relative;
            border-radius: 12px 12px 0px 0px;
            background-color: #ACACAC;
          }
          .cbl-logoOverlay {
            position: absolute;
            top: 160px;
            right: 80px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 6px;
            opacity: 0;
            transition: opacity 0.2s;
          }
          .cbl-logoWrapper:hover .cbl-logoOverlay {
            opacity: 1;
          }
          .cbl-overlayBtn {
            background: rgba(0,0,0,0.75);
            color: #fff;
            border: none;
            border-radius: 6px;
            font-size: 20px;
            padding: 4px 30px;
            cursor: pointer;
            text-align: center;
          }
          .cbl-card {
            width: 300px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
            background: #fff;
          }
          .cbl-cardBottom {
            padding: 16px;
            background-color: #F6F6F6;
            border-radius: 0px 0px 12px 12px;
          }
          .cbl-title {
            font-weight: bold;
            margin-bottom: 4px;
          }
          .cbl-row {
            display: flex;
            gap: 8px;
            margin-top: 12px;
          }
          .cbl-row button {
            flex: 1;
            background: #e0e0e0;
            border: none;
            padding: 8px;
            cursor: default; 
            border-radius: 8px;
          }
            .cbl-subject {
              margin-top: 22px;
              margin-left: 30px;
              margin-bottom: 50px;
              font-weight: 600;
              font-size: 20px;
            }

            .cbl-root {
              display: flex;
              justisfy-content: center;
            }

              .cbl-logoWrapper {
              position: relative;
              border-radius: 12px 12px 0px 0px;
              background-color: #ACACAC;
              overflow: hidden;
            }
              /* hover 시 전체 어두워지는 오버레이 */
            .cbl-logoOverlay {
              position: absolute;
              inset: 0; /* top, right, bottom, left 전부 0 */
              background: rgba(0,0,0,0.55);
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 20px;
              opacity: 0;
              transition: opacity 0.25s;
            }
            .cbl-logoWrapper:hover .cbl-logoOverlay {
              opacity: 1;
            }

            .cbl-overlayBtn {
              background: rgba(0,0,0,0.85);
              color: #fff;
              border: none;
              border-radius: 6px;
              font-size: 18px;
              padding: 8px 24px;
              cursor: pointer;
            }
        `}
      </style>
      <div className="cbl-subject">부트캠프 배너 변경</div>
      <div
        className="cbl-root"
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div className="cbl-card">
          {/* 상단: 로고 영역 */}
          <div
            className="cbl-logoWrapper"
            style={{
              flex: 1,
              width: '300px',
              height: '270px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: logoFileSn
                ? `url(http://localhost:940/api/files/id/${logoFileSn})`
                : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {!logoFileSn && <div style={{ color: '#666' }}>홍보 배너 자리</div>}

            {canEdit && (
              <div className="cbl-logoOverlay">
                <label htmlFor="bigLogoUpload" className="cbl-overlayBtn">
                  변경
                </label>
                <input
                  id="bigLogoUpload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <button onClick={handleDelete} className="cbl-overlayBtn">
                  삭제
                </button>
              </div>
            )}
          </div>

          {/* 하단: 회사 정보 + 버튼 */}
          <div className="cbl-cardBottom">
            <p className="cbl-title">{company?.name || '상호명 없음'}</p>
            <p>
              {(company?.companyAddress ?? '소재지') +
                ' ' +
                (company?.companyAddressDetail ?? '정보 없음')}
            </p>

            <div className="cbl-row">
              <button>LMS 바로가기</button>
              <button style={{ color: 'blue' }}>모집 예정</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
