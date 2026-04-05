import { useState } from 'react';
import AppHeader from './AppHeader';

export default function SentencePage() {
  const categories = ['기초', '문법', '고급'];
  const [selected, setSelected] = useState('기초');

  const sentences = [
    { en: 'How are you doing today?', ko: '오늘 어떻게 지내세요?' },
    { en: 'Could you help me with this?', ko: '이것 좀 도와주시겠어요?' },
    { en: 'I would like to order a coffee.', ko: '커피 한 잔 주문하고 싶습니다.' },
    { en: 'What time does the meeting start?', ko: '회의가 몇 시에 시작하나요?' },
    { en: 'Thank you for your time.', ko: '시간 내주셔서 감사합니다.' },
  ];

  return (
    <div>
      <AppHeader />
      <main style={s.main}>
        <h1 style={s.title}>문장 학습</h1>
        <p style={s.sub}>카테고리별 문장을 익혀보세요</p>

        <div style={s.tabs}>
          {categories.map((c) => (
            <button key={c} onClick={() => setSelected(c)}
              style={{ ...s.tab, ...(selected === c ? s.tabActive : {}) }}>
              {c}
            </button>
          ))}
        </div>

        <div style={s.list}>
          {sentences.map((st, i) => (
            <div key={i} style={s.card}>
              <div style={s.num}>{i + 1}</div>
              <div style={s.content}>
                <div style={s.en}>{st.en}</div>
                <div style={s.ko}>{st.ko}</div>
              </div>
              <button style={s.playBtn}>🔊</button>
            </div>
          ))}
        </div>
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
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  card: { background: '#fff', borderRadius: 14, padding: 20, display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  num: { width: 28, height: 28, borderRadius: '50%', background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#86868b', flexShrink: 0 },
  content: { flex: 1 },
  en: { fontSize: 16, fontWeight: 500, marginBottom: 4 },
  ko: { fontSize: 13, color: '#86868b' },
  playBtn: { background: '#f5f5f7', color: '#1d1d1f', padding: 10, fontSize: 16, borderRadius: '50%', width: 40, height: 40, flexShrink: 0 },
};
