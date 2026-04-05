import { useState } from 'react';
import { useAuth } from '../App';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user } = useAuth();
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleNicknameSave = (e) => {
    e.preventDefault();
    setMessage('닉네임 변경 기능은 준비 중입니다.');
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    setMessage('비밀번호 변경 기능은 준비 중입니다.');
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <Link to="/" style={s.back}>← 메인으로</Link>
        <h1 style={s.title}>내 정보 수정</h1>

        <section style={s.card}>
          <h2 style={s.sectionTitle}>닉네임 변경</h2>
          <form onSubmit={handleNicknameSave} style={s.form}>
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
            <button type="submit" style={s.saveBtn}>저장</button>
          </form>
        </section>

        <section style={s.card}>
          <h2 style={s.sectionTitle}>비밀번호 변경</h2>
          <form onSubmit={handlePasswordSave} style={s.form}>
            <input type="password" placeholder="새 비밀번호" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)} />
            <button type="submit" style={s.saveBtn}>저장</button>
          </form>
        </section>

        {message && <p style={s.message}>{message}</p>}
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', padding: '40px 20px' },
  container: { maxWidth: 500, margin: '0 auto' },
  back: { color: '#0071e3', textDecoration: 'none', fontSize: 14, display: 'inline-block', marginBottom: 20 },
  title: { fontSize: 32, marginBottom: 32 },
  card: { background: '#fff', borderRadius: 18, padding: 24, marginBottom: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.04)' },
  sectionTitle: { fontSize: 17, marginBottom: 16 },
  form: { display: 'flex', gap: 8 },
  saveBtn: { padding: '0 20px', whiteSpace: 'nowrap' },
  message: { marginTop: 16, padding: 12, background: '#f5f5f7', borderRadius: 12, textAlign: 'center', color: '#86868b', fontSize: 14 },
};
