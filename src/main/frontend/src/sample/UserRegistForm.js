import React, { useState } from 'react';
import { registerUser } from "../services/sampleService";

function UserRegistForm() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { employeeId, password };

    try {
      const res = await registerUser(data);
      alert("등록 성공: " + res.data.message);
    } catch (err) {
      alert("등록 실패");
      console.error(err);
    }

  };

  return (
    <div style={styles.container}>
      <h2 style={{ color: '#1976d2' }}>회원등록</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"                      // 이메일 -> 텍스트로 변경
          placeholder="사번"               // placeholder 변경
          value={employeeId}              // 상태 변수도 이메일 대신 사번으로 변경
          onChange={e => setEmployeeId(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>등록</button>
      </form>
    </div>

  );
}

const styles = {
  container: {
    width: '300px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    background: '#f9f9f9',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

export default UserRegistForm;
