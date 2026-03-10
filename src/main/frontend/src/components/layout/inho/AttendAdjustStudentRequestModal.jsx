// src/components/attend/AttendAdjustStudentRequestModal.jsx
import { useState, useRef } from 'react';
import {
  createAttendAdjust,
  uploadEvidenceFile,
} from '../../../attend/attendService';

const TYPE_OPTIONS = [
  { value: 'SICK_LEAVE', label: '병가' },
  { value: 'VACATION', label: '휴가' },
  { value: 'OFFICIAL_LEAVE', label: '공가' },
  { value: 'OUTING', label: '외출' },
];

const sx = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 9999,
  },
  modal: {
    width: 'min(720px, 100%)',
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
  },
  title: { fontSize: 18, fontWeight: 600 },
  body: { padding: 16 },
  row: { marginBottom: 12 },
  label: { display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 },
  input: {
    width: '100%',
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: '8px 10px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  btn: {
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid #ddd',
    background: '#fff',
    cursor: 'pointer',
  },
  btnPrimary: {
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid #000',
    background: '#000',
    color: '#fff',
    cursor: 'pointer',
  },
  fileTag: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: 6,
    background: '#f5f5f5',
    fontSize: 13,
    marginRight: 6,
    marginTop: 6,
  },
  fileRemove: {
    marginLeft: 6,
    color: 'red',
    cursor: 'pointer',
    fontWeight: 700,
  },
};

export default function AttendAdjustStudentRequestModal({
  open,
  onClose,
  onCreated,
}) {
  const [attendDtlTypeNm, setType] = useState('');
  const [bgngDt, setBgngDt] = useState('');
  const [stuRmrkCn, setRmk] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadRes, setUploadRes] = useState(null); // 하나만 저장
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  if (!open) return null;

  /** 파일 업로드 */
  const doUpload = async () => {
    if (!selectedFile) return;
    try {
      setUploading(true);
      const res = await uploadEvidenceFile(selectedFile);
      setUploadRes(res); // 하나만 저장
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (e) {
      alert(e.message || '업로드 실패');
    } finally {
      setUploading(false);
    }
  };

  /** 업로드된 파일 삭제 */
  const removeFile = () => {
    setUploadRes(null);
  };

  /** 제출 */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!attendDtlTypeNm) return alert('출결유형을 선택하세요.');
    if (!bgngDt) return alert('신청일을 선택하세요.');

    const payload = {
      attendDtlTypeNm,
      bgngDt,
      endDt: bgngDt,
      stuRmrkCn: stuRmrkCn.trim() || null,
      fileSn: uploadRes ? uploadRes.fileSn : null,
    };

    try {
      setSubmitting(true);
      const res = await createAttendAdjust(payload);
      if (res.ok) {
        // 🔹 저장 성공 → 폼 리셋
        setType('');
        setBgngDt('');
        setRmk('');
        setUploadRes(null);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';

        onCreated?.(res.data);
        onClose?.();
      } else {
        alert(res.message || '요청에 실패했습니다.');
      }
    } catch {
      alert('생성 중 오류 발생');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={sx.overlay}>
      <div style={sx.modal}>
        <div style={sx.header}>
          <h2 style={sx.title}>출석 요청</h2>
          <button
            onClick={onClose}
            style={{ ...sx.btn, border: 'none', fontSize: 18 }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={sx.body}>
          {/* 출결 유형 */}
          <div style={sx.row}>
            <label style={sx.label}>출결 유형 *</label>
            <select
              style={sx.input}
              value={attendDtlTypeNm}
              onChange={(e) => setType(e.target.value)}
              disabled={submitting}
              required
            >
              <option value="">----- 필수 선택 -----</option>
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 신청일 */}
          <div style={sx.row}>
            <label style={sx.label}>신청일 *</label>
            <input
              type="date"
              className="datepicker"
              style={sx.input}
              value={bgngDt}
              onChange={(e) => setBgngDt(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          {/* 사유 */}
          <div style={sx.row}>
            <label style={sx.label}>사유 (최대 50자)</label>
            <input
              type="text"
              maxLength={50}
              placeholder="사유 입력 (최대 50자)"
              style={sx.input}
              value={stuRmrkCn}
              onChange={(e) => setRmk(e.target.value)}
              disabled={submitting}
            />
          </div>

          {/* 증빙 자료 */}
          <div style={sx.row}>
            <label style={sx.label}>증빙 자료 *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ ...sx.input, padding: 6 }}
                onChange={(e) => setSelectedFile(e.target.files[0])}
                disabled={uploading || submitting}
                accept="image/*,application/pdf"
              />
              <button
                type="button"
                style={sx.btn}
                onClick={doUpload}
                disabled={!selectedFile || uploading || submitting}
              >
                {uploading ? '업로드 중...' : '업로드'}
              </button>
            </div>

            {uploadRes && (
              <div style={{ marginTop: 8 }}>
                <div style={sx.fileTag}>
                  <a
                    href={`http://localhost:940/api/files/${uploadRes.fileSn}/name`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      textDecoration: 'none',
                      color: '#333',
                      fontWeight: 500,
                    }}
                  >
                    {uploadRes.originalFileName}
                  </a>
                  <span style={sx.fileRemove} onClick={removeFile}>
                    ⛔
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div style={sx.footer}>
            <button
              type="button"
              onClick={onClose}
              style={sx.btn}
              disabled={submitting}
            >
              취소
            </button>
            <button type="submit" style={sx.btnPrimary} disabled={submitting}>
              {submitting ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        input[type="date"].datepicker {
          appearance: auto !important;
          -webkit-appearance: auto !important;
          -moz-appearance: auto !important;
          pointer-events: auto !important;
        }
        input[type="date"].datepicker::-webkit-calendar-picker-indicator {
          display: inline-block !important;
          opacity: 1 !important;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
