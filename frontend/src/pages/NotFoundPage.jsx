import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={s.page}>
      <h1 style={s.title}>404</h1>
      <p style={s.subtitle}>페이지를 찾을 수 없습니다.</p>
      <Link to="/" style={s.link}>홈으로 돌아가기</Link>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 },
  title: { fontSize: 72, fontWeight: 700, color: '#1d1d1f' },
  subtitle: { fontSize: 17, color: '#86868b' },
  link: { marginTop: 16, padding: '12px 22px', background: '#0071e3', color: '#fff', borderRadius: 980, textDecoration: 'none', fontSize: 15 },
};
