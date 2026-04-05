import { Link } from 'react-router-dom';
import { useAuth } from '../App';

export default function AppHeader() {
  const { logout } = useAuth();
  return (
    <header style={s.header}>
      <div style={s.inner}>
        <Link to="/" style={s.logo}>EngLearn</Link>
        <div style={s.right}>
          <Link to="/profile" style={s.link}>내 정보</Link>
          <button onClick={logout} style={s.btn}>로그아웃</button>
        </div>
      </div>
    </header>
  );
}

const s = {
  header: { background: 'rgba(255,255,255,0.8)', backdropFilter: 'saturate(180%) blur(20px)', borderBottom: '1px solid #d2d2d7', position: 'sticky', top: 0, zIndex: 10 },
  inner: { maxWidth: 980, margin: '0 auto', padding: '0 22px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', color: '#1d1d1f', textDecoration: 'none' },
  right: { display: 'flex', alignItems: 'center', gap: 12 },
  link: { color: '#1d1d1f', textDecoration: 'none', fontSize: 13 },
  btn: { background: 'transparent', color: '#1d1d1f', padding: '6px 14px', fontSize: 13, border: '1px solid #d2d2d7' },
};
