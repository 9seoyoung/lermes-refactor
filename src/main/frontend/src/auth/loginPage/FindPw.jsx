import { useState } from 'react';
import { toast } from 'react-toastify';
import { sendPasswordResetCode, resetPassword } from '../authService';
import '../../styles/sj.css';
import { useNavigate, Link } from 'react-router-dom';

export default function FindPw() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=이메일 입력, 2=코드+비번 입력
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await sendPasswordResetCode({
        email: email.trim().toLowerCase(),
      });
      if (res.ok) {
        toast.success(res.message);
        setStep(2);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('이메일 전송 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await resetPassword({
        email: email.trim().toLowerCase(),
        verificationCode: code,
        password,
        confirmPassword,
      });
      if (res.ok) {
        toast.success('비밀번호가 재설정되었습니다.');
        navigate('/welcome/login', { replace: true });
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('비밀번호 재설정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="contBox"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <div className="signup-inner">
        <div className="signup-title">비밀번호 찾기</div>

        {step === 1 && (
          <form className="signup-form" onSubmit={handleSendCode}>
            <input
              type="email"
              placeholder="가입한 이메일을 입력하세요."
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              className="signup-btn"
              type="submit"
              disabled={!email || loading}
              style={{
                backgroundColor: !email || loading ? '#ccc' : '#007bff',
                cursor: !email || loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? '전송 중...' : '인증코드 발송'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="signup-form" onSubmit={handleResetPassword}>
            <input
              type="text"
              placeholder="인증코드를 입력하세요."
              className="input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="새 비밀번호를 입력하세요."
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="새 비밀번호 확인"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              className="signup-btn"
              type="submit"
              disabled={!code || !password || !confirmPassword || loading}
              style={{
                backgroundColor:
                  !code || !password || !confirmPassword || loading
                    ? '#ccc'
                    : '#007bff',
                cursor:
                  !code || !password || !confirmPassword || loading
                    ? 'not-allowed'
                    : 'pointer',
              }}
            >
              {loading ? '변경 중...' : '비밀번호 변경'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="resultBox">
            <p>비밀번호가 성공적으로 재설정되었습니다.</p>
            <p>이제 로그인 페이지로 이동하세요.</p>
          </div>
        )}
      </div>
      <div className="findIdPw" style={{ gap: 20 }}>
        <Link to="/welcome/login">
          <span>로그인</span>
        </Link>
      </div>
    </div>
  );
}
