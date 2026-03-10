/** 화면 전체를 덮는 반투명 배경 + 중앙 정렬 컨테이너 */
export default function Backdrop({ children }) {
  return (
    <div style={styles.backdrop} role="dialog" aria-modal="true">
      <div style={styles.center}>{children}</div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    zIndex: 1000,
    display: 'grid',
    placeItems: 'center',
    padding: 16,
  },
  center: {
    maxWidth: 'calc(100vw - 32px)',
    maxHeight: 'calc(100vh - 32px)',
  },
};
