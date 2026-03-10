import { useEffect, useMemo, useState } from 'react';
import { getMyAttendAdjustPage } from '../../../attend/attendService';
import AttendAdjustStudentRequestModal from './AttendAdjustStudentRequestModal';

const TYPE_KO = {
  SICK_LEAVE: '병가',
  VACATION: '휴가',
  OFFICIAL_LEAVE: '공가',
  OUTING: '외출',
};

const sx = {
  card: {
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    maxWidth: 570,
    margin: '0 auto',
    backgroundColor: 'white',
  },
  head: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 20, fontWeight: 700 },
  btnPrimary: {
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid #000',
    background: '#000',
    color: '#fff',
    cursor: 'pointer',
  },
  tableWrap: { overflowX: 'auto', border: '1px solid #eee', borderRadius: 8 },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 14,
    tableLayout: 'fixed',
  },
  th: {
    textAlign: 'center',
    padding: '10px 12px',
    background: '#f9fafb',
    borderBottom: '1px solid #eee',
  },
  td: {
    padding: '10px 12px',
    borderTop: '1px solid #f1f5f9',
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  center: { textAlign: 'center', color: '#666', padding: 16 },
  pager: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  btn: {
    padding: '6px 10px',
    border: '1px solid #ddd',
    borderRadius: 8,
    background: '#fff',
    cursor: 'pointer',
  },
};

const fmtDate = (s) => (s ? String(s).slice(0, 10) : '');

export default function AttendAdjustStudentRequestList() {
  const [pageNo, setPageNo] = useState(0);
  const [size] = useState(5);
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const rows = page?.content ?? [];
  const totalPages = page?.totalPages ?? 0;

  const fetchPage = async (p = 0) => {
    try {
      setLoading(true);
      const res = await getMyAttendAdjustPage({ page: p, size });
      if (res?.ok) setPage(res.data);
      else alert(res?.message || '목록 조회 실패');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(pageNo); /* eslint-disable-next-line */
  }, [pageNo]);

  const handleCreated = () => {
    setPageNo(0);
    fetchPage(0);
  };
  const startIndex = useMemo(() => pageNo * size, [pageNo, size]);

  return (
    <section style={sx.card}>
      {/* 헤더 + 생성 버튼 */}
      <div style={sx.head}>
        <h2 style={sx.title}>출석 요청 내역</h2>
        <button style={sx.btnPrimary} onClick={() => setOpen(true)}>
          출결 요청
        </button>
      </div>

      {/* 테이블 */}
      <div style={sx.tableWrap}>
        <table style={sx.table}>
          <colgroup>
            <col style={{ width: '40px' }} /> {/* # */}
            <col style={{ width: '60px' }} /> {/* 유형 */}
            <col style={{ width: '110px' }} /> {/* 사유 */}
            <col style={{ width: '110px' }} /> {/* 신청일 */}
            <col style={{ width: '80px' }} /> {/* 승인여부 */}
            <col style={{ width: '100px' }} /> {/* 첨부파일 */}
          </colgroup>
          <thead>
            <tr>
              <th style={sx.th}>#</th>
              <th style={sx.th}>유형</th>
              <th style={sx.th}>사유</th>
              <th style={sx.th}>신청일</th>
              <th style={sx.th}>승인여부</th>
              <th style={sx.th}>첨부파일</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} style={sx.center}>
                  불러오는 중...
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={6} style={sx.center}>
                  내역이 없습니다.
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((r, idx) => (
                <tr key={r.attendDcmntSn}>
                  <td style={sx.td}>{startIndex + idx + 1}</td>
                  <td style={sx.td}>
                    {TYPE_KO[r.attendDtlTypeNm] || r.attendDtlTypeNm}
                  </td>
                  <td style={sx.td}>{r.stuRmrkCn || r.rmrkCn || '-'}</td>
                  <td style={sx.td}>{fmtDate(r.createdAt)}</td>
                  <td style={sx.td}>
                    {r.aprvSttsNm === 'APPROVED' ? 'Y' : 'N'}
                  </td>
                  <td style={sx.td}>
                    {r.fileSn ? (
                      <a
                        href={`http://localhost:940/api/files/${r.fileSn}/name`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          border: '1px solid #ddd',
                          background: '#f9fafb',
                          cursor: 'pointer',
                          textDecoration: 'none',
                          fontSize: 16,
                        }}
                        title="다운로드"
                      >
                        ⬇️
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div style={sx.pager}>
        <button
          style={sx.btn}
          disabled={pageNo <= 0}
          onClick={() => setPageNo((p) => Math.max(0, p - 1))}
        >
          이전
        </button>
        <span style={{ color: '#555', fontSize: 13 }}>
          {totalPages > 0 ? `${pageNo + 1} / ${totalPages}` : '0 / 0'}
        </span>
        <button
          style={sx.btn}
          disabled={pageNo >= totalPages - 1}
          onClick={() => setPageNo((p) => p + 1)}
        >
          다음
        </button>
      </div>

      {/* 생성 모달 */}
      <AttendAdjustStudentRequestModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={handleCreated}
      />
    </section>
  );
}
