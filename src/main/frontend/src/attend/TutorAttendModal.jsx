import { useEffect, useMemo, useState } from 'react';
import Backdrop from './Backdrop';
import { createAttendCode, getActiveAttendCode } from './attendService';
import { toast } from 'react-toastify';

/**
 * 강사용 출석 코드 생성 모달
 * - 모달을 열면 서버의 '현재 활성 코드'를 가져와 입력값(code)을 그 값으로 초기화
 *   → 중앙 큰 표시와 입력창이 둘 다 기존 코드로 시작
 * - [생성] 성공 시 모달 닫힘
 */
export default function TutorAttendModal({ onClose }) {
  const [code, setCode] = useState(''); // 입력값(중앙 표시도 이 값 사용)
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(new Date());

  // 현재 시간 1초 갱신
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

  // ✅ 모달 열릴 때 기존 활성 코드로 프리필
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await getActiveAttendCode(); // 기대: { data: { code: "26" } }
        const active = r?.data?.code ?? '';
        if (mounted) setCode(String(active));
      } catch {
        // 활성 코드가 없거나 실패해도 그냥 빈값 유지
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onCreate = async () => {
    const value = code.trim();
    if (value.length < 2) {
      toast.error('코드는 최소 2자리 이상 입력해야 합니다.');
      return;
    }
    setLoading(true);
    try {
      const res = await createAttendCode({ code: value }); // { ok, message }
      if (res?.ok) {
        toast.success(res.message || '코드 생성 완료');
        onClose?.(); // 성공 시 모달 닫기
      } else {
        toast.error(res?.message || '코드 생성 실패');
      }
    } catch (e) {
      toast.error(e.message || '네트워크 오류');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Backdrop>
      <div style={styles.modal}>
        {/* 헤더 */}
        <div style={styles.header}>출석 코드 생성</div>

        {/* 본문 */}
        <div style={styles.body}>
          <div style={styles.label}>코드 입력</div>

          {/* 중앙 큰 코드: 프리필된 기존 코드(없으면 '코드 입력') */}
          <div style={styles.bigCode}>{code || '코드 입력'}</div>

          {/* 실제 입력 필드 */}
          <input
            maxLength={2}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="코드 입력"
            style={styles.input}
            disabled={loading}
            autoFocus
          />

          <div style={styles.time}>현재 시간 : {nowStr}</div>
        </div>

        {/* 하단 버튼 */}
        <div style={styles.footer}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={styles.btnGhost}
          >
            취소
          </button>
          <button
            type="button"
            onClick={onCreate}
            disabled={!code.trim() || loading}
            style={{
              ...styles.btnPrimary,
              opacity: !code.trim() || loading ? 0.6 : 1,
            }}
          >
            {loading ? '생성 중…' : '생성'}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

const styles = {
  modal: {
    width: 560, // 필요 시 420으로 조정
    background: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  },
  header: {
    background: '#e9f2ff',
    padding: '12px 16px',
    fontWeight: 800,
    fontSize: 20,
    color: '#111827',
    borderBottom: '1px solid #dbe6ff',
  },
  body: { padding: 24 },
  label: { color: '#6b7280', fontSize: 14, marginBottom: 8 },
  bigCode: {
    fontSize: 72,
    fontWeight: 800,
    textAlign: 'center',
    lineHeight: 1.1,
    margin: '8px 0 12px',
    minHeight: 72,
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: '1px solid #d0d5dd',
    outline: 'none',
    fontSize: 18,
  },
  time: { textAlign: 'right', color: '#6b7280', fontSize: 12, marginTop: 10 },
  footer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    padding: 16,
    borderTop: '1px solid #eee',
  },
  btnGhost: {
    border: '1px solid #d0d5dd',
    background: '#f3f4f6',
    color: '#111827',
    borderRadius: 12,
    padding: '12px 16px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  btnPrimary: {
    border: 'none',
    background: '#7aa2f7',
    color: '#fff',
    borderRadius: 12,
    padding: '12px 16px',
    cursor: 'pointer',
    fontWeight: 700,
  },
};
