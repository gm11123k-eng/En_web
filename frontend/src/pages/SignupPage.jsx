import { useState } from 'react';
import { useAuth, api } from '../App';
import { useNavigate, Link } from 'react-router-dom';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [emailCheck, setEmailCheck] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleCheckEmail = async () => {
    if (!email) {
      setEmailCheck('이메일을 입력하세요.');
      return;
    }
    try {
      const res = await api.get('/auth/check-email', { params: { email } });
      setEmailCheck(res.data.exists ? '이미 사용 중인 이메일입니다.' : '사용 가능한 이메일입니다.');
    } catch {
      setEmailCheck('확인 실패');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      await signup(email, password, nickname);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || '회원가입 실패');
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>회원가입</h1>
        <p style={s.subtitle}>새 계정을 만들어보세요</p>
        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <div style={s.emailRow}>
              <input type="email" placeholder="이메일" value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailCheck(''); }} />
              <button type="button" onClick={handleCheckEmail} style={s.checkBtn}>중복 확인</button>
            </div>
            <p style={s.hint}>이메일 형식 (예: user@example.com)</p>
            {emailCheck && (
              <p style={emailCheck === '사용 가능한 이메일입니다.' ? s.checkOk : s.checkNg}>
                {emailCheck}
              </p>
            )}
          </div>
          <div style={s.field}>
            <div style={s.pwWrap}>
              <input type={showPw ? 'text' : 'password'} placeholder="비밀번호" value={password}
                onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={s.eyeBtn}>
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
            <p style={s.hint}>4자 이상 50자 이하</p>
          </div>
          <div style={s.field}>
            <input type={showPw ? 'text' : 'password'} placeholder="비밀번호 확인" value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)} />
          </div>
          <div style={s.field}>
            <input type="text" placeholder="닉네임" value={nickname}
              onChange={(e) => setNickname(e.target.value)} />
            <p style={s.hint}>2자 이상 20자 이하</p>
          </div>
          {error && <p style={s.error}>{error}</p>}
          <button type="submit" style={{ width: '100%', marginTop: 8 }}>회원가입</button>
        </form>
        <p style={s.footer}>
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
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
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  emailRow: { display: 'flex', gap: 8 },
  checkBtn: { background: '#f5f5f7', color: '#1d1d1f', padding: '0 16px', fontSize: 13, whiteSpace: 'nowrap' },
  pwWrap: { position: 'relative' },
  eyeBtn: { position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'transparent', padding: 8, fontSize: 16 },
  hint: { fontSize: 12, color: '#86868b', paddingLeft: 4 },
  checkOk: { fontSize: 12, color: '#34c759', paddingLeft: 4 },
  checkNg: { fontSize: 12, color: '#ff3b30', paddingLeft: 4 },
  error: { color: '#ff3b30', fontSize: 13 },
  footer: { textAlign: 'center', marginTop: 24, color: '#86868b', fontSize: 14 },
};
