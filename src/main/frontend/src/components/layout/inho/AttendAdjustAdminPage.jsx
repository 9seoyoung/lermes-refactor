import { useEffect, useState } from 'react';
import {
  getAdminAttendAdjustPage,
  updateAttendAdjustStatus,
} from '../../../attend/attendService';

const TYPE_KO = {
  SICK_LEAVE: '병가',
  VACATION: '휴가',
  OFFICIAL_LEAVE: '공가',
  OUTING: '외출',
};

export default function AttendAdjustAdminPage() {
  const [pageNo, setPageNo] = useState(0);
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(false);

  const rows = page?.content ?? [];
  const totalPages = page?.totalPages ?? 0;

  // 목록 조회
  const fetchPage = async (p = 0) => {
    try {
      setLoading(true);
      const res = await getAdminAttendAdjustPage({ page: p, size: 7 });
      if (res?.ok) setPage(res.data);
      else alert(res?.message || '조회 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(pageNo); // eslint-disable-next-line
  }, [pageNo]);

  // 승인여부 변경
  const handleStatusChange = async (id, status) => {
    try {
      const res = await updateAttendAdjustStatus(id, status);
      if (!res.ok) throw new Error(res.message);
      fetchPage(pageNo);
    } catch (e) {
      alert('상태 변경 실패');
    }
  };

  return (
    <>
      <div>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '16px',
            borderBottom: '2px solid #eee',
            paddingBottom: '8px',
          }}
        >
          출석 인정 요청
        </h2>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'center',
          }}
        >
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ padding: '10px' }}>#</th>
              <th style={{ padding: '10px' }}>유형</th>
              <th style={{ padding: '10px' }}>기수</th>
              <th style={{ padding: '10px' }}>이름</th>
              <th style={{ padding: '10px' }}>사유</th>
              <th style={{ padding: '10px' }}>신청일</th>
              <th style={{ padding: '10px' }}>증빙자료</th>
              <th style={{ padding: '10px' }}>승인여부</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} style={{ padding: '16px' }}>
                  불러오는 중...
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '16px', color: '#777' }}>
                  내역 없음
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((r, idx) => (
                <tr
                  key={r.attendDcmntSn}
                  style={{
                    borderTop: '1px solid #eee',
                    fontSize: '14px',
                  }}
                >
                  <td style={{ padding: '8px' }}>{pageNo * 7 + idx + 1}</td>
                  <td style={{ padding: '8px' }}>
                    {TYPE_KO[r.attendDtlTypeNm] || r.attendDtlTypeNm}
                  </td>
                  <td style={{ padding: '8px' }}>{r.cohortName}</td>
                  <td style={{ padding: '8px' }}>{r.userName}</td>
                  <td style={{ padding: '8px' }}>{r.rmrkCn || '-'}</td>
                  <td style={{ padding: '8px' }}>
                    {String(r.createdAt).slice(0, 10)}
                  </td>
                  <td style={{ padding: '8px' }}>
                    {r.hasFile ? (
                      <a
                        href={`http://localhost:940/api/files/id/${r.fileSn}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: '#2563eb',
                          textDecoration: 'underline',
                          fontWeight: '500',
                        }}
                      >
                        파일
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td style={{ padding: '8px' }}>
                    <select
                      value={r.aprvSttsNm === 'APPROVED' ? 'Y' : 'N'}
                      onChange={(e) =>
                        handleStatusChange(r.attendDcmntSn, e.target.value)
                      }
                      style={{
                        padding: '4px 6px',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                      }}
                    >
                      <option value="Y">Y</option>
                      <option value="N">N</option>
                    </select>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* 페이지네이션 */}
      <div
        style={{
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <button
          onClick={() => setPageNo((p) => Math.max(0, p - 1))}
          disabled={pageNo <= 0}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            background: pageNo <= 0 ? '#f3f4f6' : '#fff',
            cursor: pageNo <= 0 ? 'not-allowed' : 'pointer',
          }}
        >
          이전
        </button>
        <span>
          {pageNo + 1} / {totalPages}
        </span>
        <button
          onClick={() => setPageNo((p) => p + 1)}
          disabled={pageNo >= totalPages - 1}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            background: pageNo >= totalPages - 1 ? '#f3f4f6' : '#fff',
            cursor: pageNo >= totalPages - 1 ? 'not-allowed' : 'pointer',
          }}
        >
          다음
        </button>
      </div>
    </>
  );
}
