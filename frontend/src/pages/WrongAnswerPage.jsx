import { useState } from 'react';
import AppHeader from './AppHeader';

export default function WrongAnswerPage() {
  const [filter, setFilter] = useState('all');

  const wrongAnswers = [
    { id: 1, question: '성취하다', correctAnswer: 'accomplish', userAnswer: 'achieve', type: 'ko_to_en', date: '2024-04-15' },
    { id: 2, question: 'negotiate', correctAnswer: '협상하다', userAnswer: '탐색하다', type: 'en_to_ko', date: '2024-04-15' },
    { id: 3, question: '대략', correctAnswer: 'approximately', userAnswer: 'absolutely', type: 'ko_to_en', date: '2024-04-14' },
    { id: 4, question: 'revenue', correctAnswer: '수익', userAnswer: '검토', type: 'en_to_ko', date: '2024-04-14' },
    { id: 5, question: '가설', correctAnswer: 'hypothesis', userAnswer: 'analysis', type: 'ko_to_en', date: '2024-04-13' },
  ];

  const filters = [
    { label: '전체', value: 'all' },
    { label: '한→영', value: 'ko_to_en' },
    { label: '영→한', value: 'en_to_ko' },
  ];

  const filtered = filter === 'all' ? wrongAnswers : wrongAnswers.filter(w => w.type === filter);

  return (
    <div>
      <AppHeader />
      <main style={s.main}>
        <h1 style={s.title}>오답노트</h1>
        <p style={s.sub}>틀린 문제를 다시 확인하세요</p>

        <div style={s.tabs}>
          {filters.map((f) => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              style={{ ...s.tab, ...(filter === f.value ? s.tabActive : {}) }}>
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={s.empty}>아직 오답이 없습니다</div>
        ) : (
          <div style={s.list}>
            {filtered.map((w) => (
              <div key={w.id} style={s.card}>
                <div style={s.cardHeader}>
                  <span style={s.badge}>{w.type === 'ko_to_en' ? '한→영' : '영→한'}</span>
                  <span style={s.date}>{w.date}</span>
                </div>
                <div style={s.question}>{w.question}</div>
                <div style={s.answers}>
                  <div style={s.wrong}>내 답: {w.userAnswer}</div>
                  <div style={s.correct}>정답: {w.correctAnswer}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const s = {
  main: { maxWidth: 720, margin: '0 auto', padding: '40px 22px' },
  title: { fontSize: 32, marginBottom: 8 },
  sub: { color: '#86868b', fontSize: 15, marginBottom: 24 },
  tabs: { display: 'flex', gap: 8, marginBottom: 24 },
  tab: { background: '#f5f5f7', color: '#1d1d1f', padding: '8px 16px', fontSize: 13, borderRadius: 980 },
  tabActive: { background: '#1d1d1f', color: '#fff' },
  empty: { textAlign: 'center', color: '#86868b', padding: 60 },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  card: { background: '#fff', borderRadius: 14, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badge: { background: '#f5f5f7', color: '#86868b', padding: '4px 10px', borderRadius: 980, fontSize: 11 },
  date: { color: '#86868b', fontSize: 12 },
  question: { fontSize: 22, fontWeight: 600, marginBottom: 12 },
  answers: { display: 'flex', flexDirection: 'column', gap: 6 },
  wrong: { padding: '10px 14px', background: '#fff0f0', borderRadius: 10, fontSize: 14, color: '#ff3b30' },
  correct: { padding: '10px 14px', background: '#f0fff4', borderRadius: 10, fontSize: 14, color: '#34c759' },
};
