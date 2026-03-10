import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '../AuthContext';
import { toast } from 'react-toastify';

export default function OAuth2Redirect() {
  const navigate = useNavigate();
  const { refreshMe } = useAccount(); // /api/me 호출

  useEffect(() => {
    (async () => {
      try {
        const me = await refreshMe(); // ✅ 세션 기반 유저 확인
        if (me) {
          toast.success(`${me.USER_NM ?? '사용자'}님, 환영합니다!`);
          const to = me?.HOME_PATH ?? '/';
          navigate(to, { replace: true });
        } else {
          throw new Error('no-session');
        }
      } catch {
        // ✅ refreshMe 실패 → 신규 회원가입 후 상태로 간주
        toast.info('회원가입이 완료되었습니다. 로그인 후 이용해주세요.');
        navigate('/welcome/login', { replace: true });
      }
    })();
  }, [navigate, refreshMe]);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
      }}
    >
      로그인 중입니다...
    </div>
  );
}
