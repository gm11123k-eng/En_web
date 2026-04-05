import { useState } from 'react';
import { useAuth } from '../App';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || '로그인 실패');
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>로그인</h1>
        <p style={s.subtitle}>영어 학습을 시작하세요</p>
        <form onSubmit={handleSubmit} style={s.form}>
          <input type="email" placeholder="이메일" value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <div style={s.pwWrap}>
            <input type={showPw ? 'text' : 'password'} placeholder="비밀번호" value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPw(!showPw)} style={s.eyeBtn}>
              {showPw ? '🙈' : '👁'}
            </button>
          </div>
          {error && <p style={s.error}>{error}</p>}
          <button type="submit" style={{ width: '100%' }}>로그인</button>
        </form>
        <p style={s.footer}>
          계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 400, background: '#fff', borderRadius: 18, padding: '40px 32px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 8 },
  subtitle: { color: '#86868b', textAlign: 'center', marginBottom: 32 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  pwWrap: { position: 'relative' },
  eyeBtn: { position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'transparent', padding: 8, fontSize: 16 },
  error: { color: '#ff3b30', fontSize: 13 },
  footer: { textAlign: 'center', marginTop: 24, color: '#86868b', fontSize: 14 },
};
