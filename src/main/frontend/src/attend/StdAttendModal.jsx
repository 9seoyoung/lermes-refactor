import { useEffect, useMemo, useState } from 'react';
import Backdrop from './Backdrop';
import { getActiveAttendCode, checkin } from './attendService';
import { toast } from 'react-toastify';

/**
 * 학생 출석 모달
 * - 중앙 큰 숫자: 강사가 만든 활성 코드(읽기 전용)
 * - 입력창: 학생이 타이핑하는 코드(서버 제출용)
 * - 이 모달은 "입실"만 담당 (퇴실은 헤더에서 확인 모달로 처리)
 */
export default function StdAttendModal({ onClose }) {
  const [, setActiveCode] = useState('--'); // 중앙 표시(읽기전용)
  const [input, setInput] = useState(''); // 입력창 값
  const [loading, setLoading] = useState(false);

  // 시계
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const nowStr = useMemo(
    () =>
      now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    [now]
  );

  // 활성 코드 조회 (한 번)
  useEffect(() => {
    (async () => {
      try {
        const r = await getActiveAttendCode(); // 기대: { data: { code: "26" } }
        setActiveCode(r?.data?.code ?? '--');
      } catch {
        setActiveCode('--');
      }
    })();
  }, []);

  const canSubmit = input.trim().length >= 2;

  const onSubmit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    try {
      const r = await checkin({ code: input.trim() });
      if (r?.ok) {
        toast.success(r.message || '입실 완료');
        onClose?.();
      } else {
        toast.error(r?.message || '입실 실패');
      }
    } catch (e) {
      console.error('[Checkin error]', e);
      const msg =
        e.response?.data?.message || // 서버에서 내려주는 커스텀 메시지
        e.response?.data?.error || // 다른 형태일 때 대비
        e.message || // Axios 기본 메시지
        '입실 실패';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Backdrop>
      <div style={styles.modal}>
        {/* 상단 바 */}
        <div style={{ ...styles.header, background: '#e9f2ff' }}>
          정말 출석 하시겠습니까?
        </div>

        {/* 본문 */}
        <div style={styles.body}>
          <div style={styles.label}>코드 입력</div>

          {/* 중앙 큰 코드(읽기전용) */}
          {/* <div style={styles.bigCode}>{activeCode || '--'}</div> */}
          <div style={styles.bigCode}>출석 코드 입력</div>

          {/* 입력창(중앙 코드는 이 값과 무관) */}
          <input
            maxLength={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="코드 입력"
            style={styles.input}
            autoFocus
          />

          <div style={styles.time}>현재 시간 : {nowStr}</div>
        </div>

        {/* 하단 버튼 */}
        <div style={styles.footer}>
          <button type="button" onClick={onClose} style={styles.btnGhost}>
            취소
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit || loading}
            style={{
              ...styles.btnPrimary,
              opacity: !canSubmit || loading ? 0.6 : 1,
            }}
          >
            {loading ? '입실 중…' : '입실'}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

const styles = {
  modal: {
    width: 420,
    background: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  },
  header: {
    padding: 12,
    fontWeight: 800,
    fontSize: 18,
    textAlign: 'center',
  },
  body: { padding: 16 },
  label: { color: '#6b7280', fontSize: 14, marginBottom: 8 },
  bigCode: {
    fontSize: 50,
    fontWeight: 800,
    textAlign: 'center',
    minHeight: 70,
    lineHeight: 1.1,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid #d0d5dd',
    background: '#fff',
  },
  time: { textAlign: 'right', color: '#6b7280', fontSize: 12, marginTop: 8 },
  footer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
    padding: 16,
    borderTop: '1px solid #eee',
  },
  btnGhost: {
    padding: '10px 14px',
    border: '1px solid #d0d5dd',
    background: '#f3f4f6',
    color: '#111827',
    borderRadius: 10,
    fontWeight: 600,
  },
  btnPrimary: {
    padding: '10px 14px',
    background: '#2563eb',
    color: '#fff',
    borderRadius: 10,
    fontWeight: 700,
  },
};
