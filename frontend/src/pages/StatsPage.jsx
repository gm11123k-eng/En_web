import AppHeader from './AppHeader';

export default function StatsPage() {
  const today = { words: 15, sentences: 8, quizzes: 12 };
  const weekData = [12, 18, 8, 24, 15, 20, 10];
  const weekDays = ['월', '화', '수', '목', '금', '토', '일'];
  const max = Math.max(...weekData);

  return (
    <div>
      <AppHeader />
      <main style={s.main}>
        <h1 style={s.title}>학습 통계</h1>
        <p style={s.sub}>나의 영어 학습 기록</p>

        <section style={s.section}>
          <h2 style={s.sectionTitle}>오늘의 학습</h2>
          <div style={s.todayGrid}>
            <div style={s.statCard}>
              <div style={s.statNum}>{today.words}</div>
              <div style={s.statLabel}>단어</div>
            </div>
            <div style={s.statCard}>
              <div style={s.statNum}>{today.sentences}</div>
              <div style={s.statLabel}>문장</div>
            </div>
            <div style={s.statCard}>
              <div style={s.statNum}>{today.quizzes}</div>
              <div style={s.statLabel}>퀴즈</div>
            </div>
          </div>
        </section>

        <section style={s.section}>
          <h2 style={s.sectionTitle}>이번 주 학습량</h2>
          <div style={s.chart}>
            {weekData.map((v, i) => (
              <div key={i} style={s.barWrap}>
                <div style={s.barBg}>
                  <div style={{ ...s.bar, height: `${(v / max) * 100}%` }} />
                </div>
                <div style={s.barValue}>{v}</div>
                <div style={s.barLabel}>{weekDays[i]}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={s.section}>
          <h2 style={s.sectionTitle}>복습 필요</h2>
          <div style={s.reviewCard}>
            <div style={s.reviewLeft}>
              <div style={s.reviewNum}>23개</div>
              <div style={s.reviewDesc}>단어가 복습을 기다리고 있어요</div>
            </div>
            <button style={s.reviewBtn}>복습 시작</button>
          </div>
        </section>
      </main>
    </div>
  );
}

const s = {
  main: { maxWidth: 720, margin: '0 auto', padding: '40px 22px' },
  title: { fontSize: 32, marginBottom: 8 },
  sub: { color: '#86868b', fontSize: 15, marginBottom: 32 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 17, marginBottom: 16 },
  todayGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 },
  statCard: { background: '#fff', borderRadius: 14, padding: 20, textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  statNum: { fontSize: 32, fontWeight: 600, marginBottom: 4 },
  statLabel: { fontSize: 13, color: '#86868b' },
  chart: { background: '#fff', borderRadius: 14, padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 200, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  barWrap: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
  barBg: { flex: 1, width: 24, display: 'flex', alignItems: 'flex-end' },
  bar: { width: '100%', background: '#0071e3', borderRadius: 4, minHeight: 4 },
  barValue: { fontSize: 11, color: '#86868b' },
  barLabel: { fontSize: 12, color: '#1d1d1f' },
  reviewCard: { background: '#fff', borderRadius: 14, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  reviewLeft: { display: 'flex', flexDirection: 'column', gap: 4 },
  reviewNum: { fontSize: 24, fontWeight: 600 },
  reviewDesc: { fontSize: 13, color: '#86868b' },
  reviewBtn: { padding: '10px 20px' },
};
