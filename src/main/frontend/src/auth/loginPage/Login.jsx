import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAccount } from '../AuthContext'; // ← 컨텍스트 훅
import '../../styles/sj.css';
import { toast } from 'react-toastify';

// 경로 안전화 (공백/한글/중복 슬래시 방지)
const safePath = (p) => {
  if (!p) return null;
  const s = String(p).trim();
  const noLead = s.startsWith('/') ? s.slice(1) : s;
  return (
    '/' +
    noLead
      .split('/')
      .map((seg) => encodeURIComponent(seg.trim()))
      .join('/')
  );
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAccount(); // ← login + fetchMe 묶음
  const navigate = useNavigate();
  const location = useLocation();

  // 입력 여부로 버튼 활성/비활성 제어
  const isFormValid = email.trim() && password;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // 중복 클릭 방지
    setLoading(true);
    try {
      const me = await signIn({ email: email.trim().toLowerCase(), password });
      toast.success('로그인 성공!');

      // 1순위: 보호 페이지에서 온 경로, 2순위: 서버가 주는 HOME_PATH, 3순위: 디폴트
      const from = location.state?.from?.pathname;
      const to = safePath(from) ?? safePath(me?.HOME_PATH) ?? '/';
      navigate(to, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || '로그인 실패';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contBox">
      <div className="signup-inner">
        <div className="signup-title">로그인</div>
        <form className="signup-form" onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="이메일을 입력하세요. ex) xxxx123@example.com"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="비밀번호를 입력하세요."
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button
            className="signup-btn"
            type="submit"
            disabled={!isFormValid || loading}
            style={{
              backgroundColor: !isFormValid || loading ? '#ccc' : '#007bff',
              cursor: !isFormValid || loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
          <header
            style={{
              textAlign: 'center',
              fontSize: '1.2rem',
              fontWeight: '700',
              letterSpacing: '0.2px',
              color: '#757575',
            }}
          >
            SNS로 간편 로그인 / 회원가입
          </header>
          <div
            className="OAuth2"
            style={{ display: 'flex', gap: '30px', justifyContent: 'center' }}
          >
            <button
              className="googleLoginBtn"
              onClick={() => {
                window.location.href =
                  'http://localhost:940/oauth2/authorization/google';
              }}
            >
              <img
                src="/img/google-icon.png"
                alt="Google 아이콘"
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  border: '1px solid #dadce0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(60,64,67,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  padding: '5px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08)';
                  e.currentTarget.style.boxShadow =
                    '0 3px 8px rgba(60,64,67,0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow =
                    '0 1px 3px rgba(60,64,67,0.3)';
                }}
              />
            </button>
            <button
              className="kakaoLoginBtn"
              onClick={() => {
                window.location.href =
                  'http://localhost:940/oauth2/authorization/kakao';
              }}
            >
              <img
                src="/img/kakao-icon.png"
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#FFE812',
                  justifyContent: 'center',
                  boxShadow: '0 0 4px rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  padding: '10px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08)';
                  e.currentTarget.style.boxShadow =
                    '0 3px 8px rgba(60,64,67,0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow =
                    '0 1px 3px rgba(60,64,67,0.3)';
                }}
              />
            </button>
            <button
              className="naverLoginBtn"
              onClick={() => {
                window.location.href =
                  'http://localhost:940/oauth2/authorization/naver';
              }}
            >
              <img
                src="/img/naver-icon.png"
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#03C75A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 4px rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08)';
                  e.currentTarget.style.boxShadow =
                    '0 3px 8px rgba(60,64,67,0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow =
                    '0 1px 3px rgba(60,64,67,0.3)';
                }}
              />
            </button>
          </div>
          <hr />
          <Link to="/welcome/generaljoin" className="problemBox">
            아이디가 없어요
          </Link>
          <div className="findIdPw">
            <Link to="/welcome/find-id">
              <span>아이디 찾기</span>
            </Link>
            <Link to="/welcome/find-pw">
              <span>비밀번호 찾기</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
