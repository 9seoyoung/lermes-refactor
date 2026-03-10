// frontend/src/pages/UploadDownloadDemo.jsx

import React, { useState } from 'react';
// UiComp.jsx에서 필요한 컴포넌트들을 import 합니다.
import { FileUpload, FileList } from '../components/ui/UiComp';
import { uploadFiles, openPreview as fsOpenPreview, openDownload as fsOpenDownload } from '../services/fileService';

export default function UploadDownloadDemo() {
    // 컴포넌트 데모용 상태만 유지
    const [attachedFiles, setAttachedFiles] = useState([]);      // File[] (FileUpload/FileList 사용)
    const [attachedResults, setAttachedResults] = useState([]);  // UploadResultDTO[] (업로드 결과)

    // --- 업로드 핸들러 ---
    const onAttachedUpload = async () => {
        if (attachedFiles.length === 0) return;

        // 업로드 전 결과 초기화
        setAttachedResults([]);

        try {
            const results = await uploadFiles(attachedFiles);
            setAttachedResults(results || []);
            // 업로드 성공 후 선택 목록 초기화
            // setAttachedFiles([]);
        } catch (e) {
            console.error(e);
            alert('파일 업로드 실패');
        }
    };
    // ---------------------

    // 미리보기 및 다운로드 핸들러는 서비스 레이어 사용
    const onPreview = (r) => fsOpenPreview(r.storedFileName, r.originalFileName || '');
    const onDownload = (r) => fsOpenDownload(r.storedFileName, r.originalFileName || '');

    return (
        <div style={{ maxWidth: 520, margin: '2rem auto', fontFamily: 'sans-serif' }}>

            {/* =======================================================
        // Custom UI 컴포넌트 파일 업로드 데모
        // ======================================================= */}
            <h3>UI 컴포넌트 파일 업로드/다운로드 데모</h3>

            {/* 파일 첨부 컴포넌트 (드래그 앤 드롭 영역) */}
            <FileUpload
                files={attachedFiles}
                setFiles={setAttachedFiles}
            />

            {/* 파일 목록 컴포넌트 */}
            <FileList
                files={attachedFiles}
                setFiles={setAttachedFiles}
            />

            {/* 업로드 버튼 */}
            <button
                onClick={onAttachedUpload}
                disabled={attachedFiles.length === 0}
                style={{
                    marginTop: '16px',
                    padding: '10px 20px',
                    backgroundColor: attachedFiles.length === 0 ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: attachedFiles.length === 0 ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                }}
            >
                파일 업로드 ({attachedFiles.length}개)
            </button>

            {/* 콘솔 찍어 보기 */}
            {console.log(attachedFiles)}

            {/* 업로드 결과 */}
            {attachedResults.length > 0 && (
                <div style={{ marginTop: 24, padding: 12, border: '1px solid #007bff' }}>
                    <div style={{ fontWeight: 600, color: '#007bff', marginBottom: '8px' }}>업로드 결과 (서버 저장 정보)</div>
                    <ul>
                        {attachedResults.map(r => (
                            <li key={r.storedFileName} style={{ marginBottom: 12, borderBottom: '1px dotted #eee', paddingBottom: '4px' }}>
                                <div>**원본:** {r.originalFileName}</div>
                                <div>**저장:** {r.storedFileName}</div>
                                <div>**크기:** {r.size} bytes</div>
                                <div style={{ marginTop: 8 }}>
                                    <button onClick={() => onPreview(r)} style={{ marginRight: 8 }}>미리보기</button>
                                    <button onClick={() => onDownload(r)}>다운로드</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}