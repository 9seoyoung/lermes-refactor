import { useState } from 'react';
import { findId } from '../authService';
import { toast } from 'react-toastify';
import '../../styles/sj.css';
import { Link } from 'react-router-dom';

export default function FindId() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(null);

  const isFormValid = name.trim() && phoneNumber.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setEmail(null);

    try {
      const res = await findId({ name, phoneNumber });
      if (res.ok) {
        setEmail(res.email);
        toast.success('아이디를 찾았습니다.');
        setLoading(false);
      } else {
        toast.error(res.message);
        setLoading(false);
      }
    } catch (err) {
      toast.error('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
      setLoading(false);
    }
  };

  return (
    <div className="contBox">
      <div className="signup-inner">
        <div className="signup-title">아이디 찾기</div>

        {email ? (
          // ✅ 성공했을 때는 결과만 보여줌
          <div className="resultBox">
            <p>
              당신의 아이디(이메일): <strong>{email}</strong>
            </p>
          </div>
        ) : (
          // ✅ 아직 못 찾았으면 입력폼 보여줌
          <form className="signup-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="이름을 입력하세요"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="전화번호를 입력하세요. ex) 01012345678"
              className="input"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
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
              {loading ? '조회 중...' : '찾기'}
            </button>
            <div className="findIdPw" style={{ gap: 20 }}>
              <Link to="/welcome/login">
                <span>로그인</span>
              </Link>
              <Link to="/welcome/find-pw">
                <span>비밀번호 찾기</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
