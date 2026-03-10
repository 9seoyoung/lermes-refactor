import React, { useState } from 'react';
import { FileUpload } from './FileUpload';             // 파일 수집 담당

export default function FilesPage() {
  const [files, setFiles] = useState([]);     // File[]
  const [results, setResults] = useState([]); // UploadResultDTO[]

  const onUpload = async () => {
    if (!files.length) return;
    const form = new FormData();
    files.forEach(f => form.append('files', f));
    const res = await fetch('http://localhost:940/api/files', {
      method: 'POST',
      body: form,
      credentials: 'include',
    });
    const json = await res.json();
    setResults(json);
  };

  return (
    <div>
      <h3>파일 업로드</h3>
      <FileUpload files={files} setFiles={setFiles} />
      <button onClick={onUpload} disabled={!files.length}>
        업로드 ({files.length}개)
      </button>

      {results.length > 0 && (
        <ul style={{marginTop:12}}>
          {results.map(r => (
            <li key={r.storedFileName}>
              <div>원본: {r.originalFileName}</div>
              <div>저장: {r.storedFileName}</div>
              <div>크기: {r.size} bytes</div>
              <button onClick={() =>
                window.open(
                  `http://localhost:940/api/files/${encodeURIComponent(r.storedFileName)}/preview?original=${encodeURIComponent(r.originalFileName||'')}`,
                  '_blank'
                )
              }>미리보기</button>
              <button onClick={() =>
                window.open(
                  `http://localhost:940/api/files/${encodeURIComponent(r.storedFileName)}?original=${encodeURIComponent(r.originalFileName||'')}`,
                  '_blank'
                )
              } style={{marginLeft:8}}>다운로드</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}