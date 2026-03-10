import { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../../auth/api';

export default function PasswordChangeModal({ onClose }) {
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      toast.warn('모든 항목을 입력해주세요.');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.warn('새 비밀번호와 확인이 일치하지 않습니다.');
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/user-profile/password/change', form);
      console.log(res);

      if (res.data.ok) {
        toast.success(res.data.message || '비밀번호가 변경되었습니다.');
        setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setLoading(false);
        onClose();
      } else {
        toast.error(res.data.message || '비밀번호 변경 실패');
        setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setLoading(false);
      }
    } catch (err) {
      const msg = err.response?.data?.message || '서버 오류가 발생했습니다.';
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setLoading(false);
      toast.error(msg);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '24px',
          borderRadius: '8px',
          width: '380px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        <h3 style={{ marginBottom: '16px', textAlign: 'center' }}>
          비밀번호 변경
        </h3>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label>기존 비밀번호</label>
            <input
              type="password"
              name="oldPassword"
              value={form.oldPassword}
              onChange={handleChange}
              style={{ width: '100%', padding: '6px', marginTop: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label>새 비밀번호</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              style={{ width: '100%', padding: '6px', marginTop: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label>새 비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              style={{ width: '100%', padding: '6px', marginTop: '4px' }}
            />
          </div>

          <div
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '6px 12px',
                border: '1px solid #ccc',
                background: '#f9f9f9',
                cursor: 'pointer',
              }}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '6px 12px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {loading ? '처리 중...' : '변경'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
