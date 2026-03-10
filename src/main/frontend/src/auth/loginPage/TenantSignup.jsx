import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestEmailCode, signupTenant } from '../authService.js';
import styles from '../../styles/SignUp.module.css';
import { useAccount } from '../AuthContext.jsx';
import FilePreview from '../../components/ui/FilePreview.jsx';
import { toast } from 'react-toastify';

export default function TenantSignup() {
  const navigate = useNavigate();
  const { signIn } = useAccount();
  const [form, setForm] = useState({
    username: '',
    email: '',
    verificationCode: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    companyName: '',
    businessNumber: '',
  });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const emailRef = useRef(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getErrMsg = (e) =>
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    '알 수 없는 오류가 발생했습니다.';

  const sendCode = async () => {
    if (!emailRef.current?.reportValidity()) return;

    const normEmail = form.email.trim().toLowerCase();
    setSending(true);
    setMsg(null);
    try {
      await requestEmailCode(normEmail);
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
    setMsg(null);

    const nameRegex = /^[가-힣]{2,5}$/;
    if (!nameRegex.test(form.username.trim())) {
      toast.error('이름은 한글 2~5자로 입력해주세요.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      return setMsg('비밀번호가 일치하지 않습니다.');
    }

    setLoading(true);
    try {
      const payload = {
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        verificationCode: form.verificationCode.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        phoneNumber: form.phoneNumber.trim(),
        companyName: form.companyName.trim(),
        businessNumber: form.businessNumber.trim(),
      };

      await signupTenant(payload);

      const loginPayload = { email: payload.email, password: payload.password };
      const me = await signIn(loginPayload);
      toast.success('회원가입이 완료되었습니다!');
      const redirectLoc = `/${me?.HOME_PATH}` || '/';
      navigate(redirectLoc, { replace: true });
    } catch (e) {
      setMsg(e.message || '테넌트 등록 실패');
    } finally {
      setLoading(false);
    }
  };

  // ✔ 모든 값이 채워졌는지 확인
  const isFormValid =
    form.companyName.trim() &&
    form.businessNumber.trim().length === 10 &&
    form.username.trim() &&
    form.email.trim() &&
    form.verificationCode.trim().length === 6 &&
    form.password &&
    form.confirmPassword &&
    form.phoneNumber.trim().length === 11;

  return (
    <div className="signup-inner">
      <div className="signup-title">비즈니스 회원가입</div>
      <form className="signup-form" onSubmit={onSubmit} noValidate autoComplete={"off"}>
        <input
          name="companyName"
          placeholder="상호명"
          value={form.companyName}
          onChange={onChange}
          required
        />
        <input
          name="businessNumber"
          placeholder="사업자등록번호"
          minLength={10}
          maxLength={10}
          value={form.businessNumber}
          onChange={onChange}
          required
        />

        <input
          name="username"
          type="text"
          minLength={2}
          maxLength={10}
          placeholder="이름(국문)"
          value={form.username}
          onChange={onChange}
          required
          autoComplete="off"
          pattern="^[가-힣]{2,5}$"
          title="이름은 한글 2~5자로 입력해주세요."
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
            autoComplete="email"
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
          placeholder="인증코드"
          value={form.verificationCode}
          onChange={onChange}
          minLength={6}
          maxLength={6}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={onChange}
          autoComplete="new-password"
          required
        />
        <input
          name="confirmPassword"
          type="password"
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
          type="submit"
          disabled={!isFormValid || loading}
          className="signup-btn"
          style={{
            backgroundColor: !isFormValid ? '#ccc' : '#007bff',
            cursor: !isFormValid ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '등록 중...' : '회원 가입'}
        </button>

        {msg && <p className="msg">{msg}</p>}
      </form>
    </div>
  );
}
