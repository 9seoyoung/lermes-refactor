import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { requestEmailCode, signupGeneral } from '../authService.js';
import '../../styles/sj.css';
import { toast } from 'react-toastify';
import { useAccount } from '../AuthContext.jsx';

// 파일 상단 어딘가에 유틸(컴포넌트 안/밖 아무데나 가능)
const safePath = (p) => {
  if (!p) return '/';
  const s = String(p).trim();
  const noLead = s.startsWith('/') ? s.slice(1) : s;
  // 세그먼트 단위 인코딩(공백/한글 방지)
  return (
    '/' +
    noLead
      .split('/')
      .map((seg) => encodeURIComponent(seg.trim()))
      .join('/')
  );
};

export default function GeneralJoin() {
  const { signIn } = useAccount();
  const [form, setForm] = useState({
    userNm: '',
    email: '',
    verificationCode: '',
    pass: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const emailRef = useRef(null);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getErrMsg = (e) =>
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    '알 수 없는 오류가 발생했습니다.';

  const sendCode = async () => {
    if (!emailRef.current?.reportValidity()) return;

    const normEmail = form.email.trim().toLowerCase();
    if (!normEmail) return toast.error('이메일을 입력하세요.');
    setSending(true);
    setMsg(null);
    try {
      await requestEmailCode(normEmail); // 200 OK or 409 CONFLICT 등
      setForm((f) => ({ ...f, email: normEmail }));
      setCodeSent(true);
      toast.success('인증코드를 전송했습니다.');
    } catch (e) {
      toast.error(getErrMsg(e)); // 예: "이미 가입된 이메일입니다."
    } finally {
      setSending(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const nameRegex = /^[가-힣]{2,5}$/;
    if (!nameRegex.test(form.userNm.trim())) {
      toast.error('이름은 한글 2~5자로 입력해주세요.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        username: form.userNm.trim(),
        email: form.email.trim().toLowerCase(),
        verificationCode: form.verificationCode.trim(),
        password: form.userPwd,
        confirmPassword: form.confirmPassword,
        phoneNumber: form.phoneNumber.trim(),
      };

      await signupGeneral(payload);

      const loginPayload = { email: payload.email, userPwd: payload.userPwd };
      const me = await signIn(loginPayload);
      toast.success('회원가입이 완료되었습니다!');
      navigate(safePath(me?.HOME_PATH) || '/', { replace: true });
    } catch (e) {
      toast.error(getErrMsg(e)); // 예: "이메일 인증 실패", "비밀번호가 일치하지 않습니다."
    } finally {
      setLoading(false);
    }
  };

  // 모든 값이 채워졌는지 확인
  const isFormValid =
    form.userNm.trim() &&
    form.email.trim() &&
    form.verificationCode.trim().length === 6 &&
    form.userPwd &&
    form.confirmPassword &&
    form.phoneNumber.trim().length === 11;

  return (
    <div className="signup-inner">
      <div className="signup-title">
        <b>회원가입</b>
      </div>
      <form className="signup-form" onSubmit={onSubmit} noValidate autoComplete={"off"}>
        <input
          name="userNm"
          minLength={2}
          maxLength={10}
          placeholder="이름(국문)"
          value={form.userNm}
          onChange={onChange}
          autoComplete={"off"}
          required
        />
        <div className="input-with-btn">
          <input
            ref={emailRef}
            name="email"
            type="email"
            placeholder="이메일을 입력하세요. ex) abc123@example.com"
            value={form.email}
            onChange={onChange}
            required
            disabled={codeSent}
          />
          <button
            type="button"
            className="verify-btn"
            onClick={sendCode}
            disabled={sending || !form.email}
          >
            {sending ? '전송중...' : '인증'}
          </button>
        </div>
        <input
          name="verificationCode"
          placeholder="인증번호를 입력하세요."
          value={form.verificationCode}
          onChange={onChange}
          minLength={6}
          maxLength={6}
          required
        />
        <input
          name="userPwd"
          type="userPwd"
          placeholder="비밀번호"
          value={form.userPwd}
          onChange={onChange}
          required
        />
        <input
          name="confirmPassword"
          type="userPwd"
          placeholder="비밀번호 확인"
          value={form.confirmPassword}
          onChange={onChange}
          required
        />
        <input
          name="phoneNumber"
          placeholder="휴대폰번호"
          value={form.phoneNumber}
          onChange={onChange}
          minLength={11}
          maxLength={11}
          required
        />
        <button
          className="signup-btn"
          type="submit"
          disabled={!isFormValid || loading}
          style={{
            backgroundColor: !isFormValid ? '#ccc' : '#007bff',
            cursor: !isFormValid ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '가입 중...' : '회원가입'}
        </button>
        {msg && <p className="msg">{msg}</p>}
      </form>
    </div>
  );
}
