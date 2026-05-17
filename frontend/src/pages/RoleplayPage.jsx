import { useState, useEffect } from 'react';
import { useAuth, api } from '../App';
import AppHeader from './AppHeader';

export default function RoleplayPage() {
  const { user } = useAuth();
  const [scenarios, setScenarios] = useState([]);
  const [active, setActive] = useState(null);
  const [convId, setConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [custom, setCustom] = useState('');

  useEffect(() => {
    api.get('/roleplay/scenarios').then(res => setScenarios(res.data));
  }, []);

  const start = async (scenarioId, emoji) => {
    setLoading(true);
    try {
      const res = await api.post('/roleplay/start', { memberId: user.id, scenario: scenarioId });
      setConvId(res.data.conversationId);
      setActive({ title: res.data.title, emoji: emoji || '💬' });
      setMessages([{ role: 'ai', content: res.data.message, correction: null }]);
    } catch {
      alert('시작 실패');
    }
    setLoading(false);
  };

  const startCustom = () => {
    if (!custom.trim()) return;
    start(custom, '💬');
  };

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    setLoading(true);

    setMessages(prev => [...prev, { role: 'user', content: input, correction: null }]);
    const text = input;
    setInput('');

    try {
      const res = await api.post('/roleplay/' + convId + '/messages', { content: text });
      setMessages(prev => [...prev, { role: 'ai', content: res.data.reply, correction: res.data.correction || null }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: 'Error occurred', correction: null }]);
    }
    setLoading(false);
  };

  const exit = () => {
    setActive(null);
    setConvId(null);
    setMessages([]);
  };

  if (active) {
    return (
      <div>
        <AppHeader />
        <main style={s.main}>
          <button onClick={exit} style={s.backBtn}>← 상황 선택</button>
          <h1 style={s.title}>{active.emoji} {active.title}</h1>
          <div style={s.chatBox}>
            {messages.map((m, i) => (
              <div key={i} style={m.role === 'user' ? s.userRow : s.aiRow}>
                <div style={m.role === 'user' ? s.userBubble : s.aiBubble}>
                  {m.content}
                </div>
                {m.correction && (
                  <div style={s.correctionBubble}>
                    <div style={s.correctionLabel}>✏️ 교정</div>
                    {m.correction}
                  </div>
                )}
              </div>
            ))}
            {loading && <div style={s.aiRow}><div style={s.aiBubble}>...</div></div>}
          </div>
          <form style={s.inputRow} onSubmit={send}>
            <input value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="영어로 답변해보세요..." disabled={loading} />
            <button type="submit" style={s.sendBtn} disabled={loading}>전송</button>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div>
      <AppHeader />
      <main style={s.main}>
        <h1 style={s.title}>상황별 롤플레이</h1>
        <p style={s.sub}>원하는 상황을 골라 AI와 역할극을 해보세요</p>

        <div style={s.grid}>
          {scenarios.map((sc) => (
            <button key={sc.id} onClick={() => start(sc.id, sc.emoji)} disabled={loading} style={s.scenarioCard}>
              <div style={s.emoji}>{sc.emoji}</div>
              <div style={s.scTitle}>{sc.title}</div>
            </button>
          ))}
        </div>

        <div style={s.customBox}>
          <h2 style={s.customTitle}>직접 상황 만들기</h2>
          <p style={s.customDesc}>원하는 상황을 입력하면 그 상황으로 대화합니다</p>
          <div style={s.customRow}>
            <input value={custom} onChange={(e) => setCustom(e.target.value)}
              placeholder="예: 식당에서 음식이 잘못 나왔을 때 항의하기" disabled={loading} />
            <button onClick={startCustom} disabled={loading} style={s.customBtn}>시작</button>
          </div>
        </div>
      </main>
    </div>
  );
}

const s = {
  main: { maxWidth: 720, margin: '0 auto', padding: '40px 22px' },
  title: { fontSize: 32, marginBottom: 8 },
  sub: { color: '#86868b', fontSize: 15, marginBottom: 24 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 },
  scenarioCard: { background: '#fff', borderRadius: 18, padding: 24, textAlign: 'left', cursor: 'pointer', border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  emoji: { fontSize: 36, marginBottom: 12 },
  scTitle: { fontSize: 17, fontWeight: 600, color: '#1d1d1f' },
  customBox: { background: '#fff', borderRadius: 18, padding: 24, marginTop: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  customTitle: { fontSize: 17, marginBottom: 4 },
  customDesc: { fontSize: 13, color: '#86868b', marginBottom: 14 },
  customRow: { display: 'flex', gap: 8 },
  customBtn: { padding: '0 22px', whiteSpace: 'nowrap' },
  backBtn: { background: 'transparent', color: '#0071e3', padding: 0, fontSize: 14, marginBottom: 20 },
  chatBox: { background: '#fff', borderRadius: 18, padding: 20, display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20, marginBottom: 12, minHeight: 300, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  userRow: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 },
  aiRow: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 },
  aiBubble: { maxWidth: '75%', padding: '10px 14px', borderRadius: 18, borderBottomLeftRadius: 4, background: '#f5f5f7', fontSize: 14 },
  userBubble: { maxWidth: '75%', padding: '10px 14px', borderRadius: 18, borderBottomRightRadius: 4, background: '#0071e3', color: '#fff', fontSize: 14 },
  correctionBubble: { maxWidth: '75%', padding: '10px 14px', borderRadius: 18, borderBottomLeftRadius: 4, background: '#fff4e5', border: '1px solid #ffb340', fontSize: 14 },
  correctionLabel: { fontSize: 11, color: '#ff9500', marginBottom: 4, fontWeight: 600 },
  inputRow: { display: 'flex', gap: 8 },
  sendBtn: { padding: '0 22px', whiteSpace: 'nowrap' },
};
