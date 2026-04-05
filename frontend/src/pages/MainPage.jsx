import { useAuth } from '../App';
import { Link } from 'react-router-dom';
import AppHeader from './AppHeader';

export default function MainPage() {
  const { user } = useAuth();

  const menus = [
    { title: '단어 학습', desc: '테마별 단어를 AI와 함께', to: '/word' },
    { title: '문장 학습', desc: '문법, 기초, 고급 카테고리', to: '/sentence' },
    { title: 'AI 대화', desc: '자유롭게 영어로 대화하기', to: '/chat' },
    { title: '롤플레이', desc: '상황별 역할극 연습', to: '/roleplay' },
    { title: '퀴즈', desc: '복습과 오답노트', to: '/quiz' },
    { title: '통계', desc: '나의 학습 기록 보기', to: '/stats' },
  ];

  return (
    <div>
      <AppHeader />
      <main style={s.main}>
        <section style={s.hero}>
          <h1 style={s.heroTitle}>안녕하세요, {user.nickname}님</h1>
          <p style={s.heroSubtitle}>오늘도 함께 영어 공부를 시작해보세요</p>
          <div style={s.stats}>
            <div style={s.statItem}>
              <div style={s.statValue}>Lv. {user.level}</div>
              <div style={s.statLabel}>레벨</div>
            </div>
            <div style={s.statDivider} />
            <div style={s.statItem}>
              <div style={s.statValue}>{user.totalPoints}</div>
              <div style={s.statLabel}>포인트</div>
            </div>
            <div style={s.statDivider} />
            <div style={s.statItem}>
              <div style={s.statValue}>{user.streakDays}일</div>
              <div style={s.statLabel}>연속 학습</div>
            </div>
          </div>
        </section>
        <section style={s.menuGrid}>
          {menus.map((m) => (
            <Link key={m.title} to={m.to} style={s.menuCard}>
              <h3 style={s.menuTitle}>{m.title}</h3>
              <p style={s.menuDesc}>{m.desc}</p>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}

const s = {
  main: { maxWidth: 980, margin: '0 auto', padding: '48px 22px' },
  hero: { textAlign: 'center', marginBottom: 56 },
  heroTitle: { fontSize: 40, marginBottom: 8 },
  heroSubtitle: { fontSize: 17, color: '#86868b', marginBottom: 32 },
  stats: { display: 'inline-flex', alignItems: 'center', background: '#fff', borderRadius: 18, padding: '20px 32px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' },
  statItem: { textAlign: 'center', padding: '0 24px' },
  statValue: { fontSize: 24, fontWeight: 600, marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#86868b' },
  statDivider: { width: 1, height: 32, background: '#d2d2d7' },
  menuGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 },
  menuCard: { background: '#fff', borderRadius: 18, padding: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', textDecoration: 'none', color: '#1d1d1f', cursor: 'pointer' },
  menuTitle: { fontSize: 19, marginBottom: 6 },
  menuDesc: { fontSize: 14, color: '#86868b' },
};
