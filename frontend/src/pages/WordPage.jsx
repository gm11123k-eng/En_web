import { useState } from 'react';
import { useAuth, api } from '../App';
import AppHeader from './AppHeader';

export default function WordPage() {
  const { user } = useAuth();
  const themes = ['토익', '여행', '논문', '일상', '비즈니스', '영화'];
  const [selected, setSelected] = useState('토익');
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await api.post('/words/generate', {
        memberId: user.id,
        theme: selected,
        count: 5
      });
      setWords(res.data.words);
    } catch {
      alert('단어 생성 실패');
    }
    setLoading(false);
  };

  const loadWords = async (theme) => {
    setSelected(theme);
    try {
      const res = await api.get('/words', { params: { memberId: user.id, theme } });
      setWords(res.data);
    } catch {
      setWords([]);
    }
  };

  const speak = (text) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    speechSynthesis.speak(u);
  };

  return (
    <div>
      <AppHeader />
      <main style={s.main}>
        <h1 style={s.title}>단어 학습</h1>
        <p style={s.sub}>테마를 고르고 단어를 생성하세요</p>

        <div style={s.tabs}>
          {themes.map((t) => (
            <button key={t} onClick={() => loadWords(t)}
              style={{ ...s.tab, ...(selected === t ? s.tabActive : {}) }}>
              {t}
            </button>
          ))}
        </div>

        <button onClick={generate} disabled={loading} style={s.genBtn}>
          {loading ? '생성 중...' : '새 단어 생성'}
        </button>

        <div style={s.list}>
          {words.map((w) => (
            <div key={w.id || w.english} style={s.card}>
              <div style={s.cardTop}>
                <div>
                  <div style={s.en}>{w.english}</div>
                  <div style={s.ko}>{w.korean}</div>
                </div>
                <button onClick={() => speak(w.english)} style={s.playBtn}>🔊</button>
              </div>
              <div style={s.ex}>{w.example}</div>
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
  tabs: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 },
  tab: { background: '#f5f5f7', color: '#1d1d1f', padding: '8px 16px', fontSize: 13, borderRadius: 980 },
  tabActive: { background: '#1d1d1f', color: '#fff' },
  genBtn: { marginBottom: 24, padding: '10px 24px' },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  card: { background: '#fff', borderRadius: 14, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  en: { fontSize: 22, fontWeight: 600, marginBottom: 2 },
  ko: { fontSize: 14, color: '#86868b' },
  playBtn: { background: '#f5f5f7', color: '#1d1d1f', padding: 10, fontSize: 16, borderRadius: '50%', width: 40, height: 40 },
  ex: { fontSize: 14, color: '#1d1d1f', padding: '12px 14px', background: '#f5f5f7', borderRadius: 10 },
};
