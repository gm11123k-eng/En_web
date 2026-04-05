import { useState } from 'react';
import AppHeader from './AppHeader';

export default function WordPage() {
  const themes = ['토익', '여행', '논문', '일상', '비즈니스', '영화'];
  const [selected, setSelected] = useState('토익');

  const words = [
    { en: 'accomplish', ko: '성취하다', ex: 'She accomplished her goal.' },
    { en: 'deliberate', ko: '신중한', ex: 'He made a deliberate choice.' },
    { en: 'diverse', ko: '다양한', ex: 'We have diverse opinions.' },
    { en: 'efficient', ko: '효율적인', ex: 'This is an efficient method.' },
    { en: 'negotiate', ko: '협상하다', ex: 'Let us negotiate the price.' },
  ];

  return (
    <div>
      <AppHeader />
      <main style={s.main}>
        <h1 style={s.title}>단어 학습</h1>
        <p style={s.sub}>테마를 고르면 AI가 단어와 예문을 보여줍니다</p>

        <div style={s.tabs}>
          {themes.map((t) => (
            <button key={t} onClick={() => setSelected(t)}
              style={{ ...s.tab, ...(selected === t ? s.tabActive : {}) }}>
              {t}
            </button>
          ))}
        </div>

        <div style={s.list}>
          {words.map((w) => (
            <div key={w.en} style={s.card}>
              <div style={s.cardTop}>
                <div>
                  <div style={s.en}>{w.en}</div>
                  <div style={s.ko}>{w.ko}</div>
                </div>
                <button style={s.playBtn}>🔊</button>
              </div>
              <div style={s.ex}>{w.ex}</div>
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
  tabs: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 },
  tab: { background: '#f5f5f7', color: '#1d1d1f', padding: '8px 16px', fontSize: 13, borderRadius: 980 },
  tabActive: { background: '#1d1d1f', color: '#fff' },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  card: { background: '#fff', borderRadius: 14, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  en: { fontSize: 22, fontWeight: 600, marginBottom: 2 },
  ko: { fontSize: 14, color: '#86868b' },
  playBtn: { background: '#f5f5f7', color: '#1d1d1f', padding: 10, fontSize: 16, borderRadius: '50%', width: 40, height: 40 },
  ex: { fontSize: 14, color: '#1d1d1f', padding: '12px 14px', background: '#f5f5f7', borderRadius: 10 },
};
