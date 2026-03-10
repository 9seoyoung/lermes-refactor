import Backdrop from './Backdrop';

/** 퇴실 확인 모달(헤더에서 직접 띄움) */
export default function CheckoutConfirmModal({ onCancel, onConfirm, nowStr }) {
  return (
    <Backdrop>
      <div style={styles.modal}>
        {/* 상단 바 */}
        <div style={{ ...styles.header, background: '#ffe9e9' }}>
          정말 퇴실 하시겠습니까?
        </div>

        {/* 본문 */}
        <div style={styles.body}>
          <div style={styles.msg}>수고하셨습니다</div>
          <div style={styles.time}>현재 시간 : {nowStr}</div>
        </div>

        {/* 하단 버튼 */}
        <div style={styles.footer}>
          <button type="button" onClick={onCancel} style={styles.btnGhost}>
            취소
          </button>
          <button type="button" onClick={onConfirm} style={styles.btnDanger}>
            퇴실
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
    color: '#111827',
  },
  body: { padding: 24, textAlign: 'center' },
  alert: { color: '#ef4444', fontSize: 16, fontWeight: 700, marginBottom: 8 },
  or: { fontSize: 14, marginBottom: 16 },
  msg: { fontSize: 16, fontWeight: 600, marginBottom: 16 },
  time: { color: '#6b7280', fontSize: 12 },
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
  btnDanger: {
    padding: '10px 14px',
    background: '#ef4444',
    color: '#fff',
    borderRadius: 10,
    fontWeight: 700,
  },
};
