import { useState } from 'react';
import AppHeader from './AppHeader';

export default function ChatPage() {
  const [input, setInput] = useState('');

  const messages = [
    { role: 'ai', text: 'Hi! How was your day today?' },
    { role: 'user', text: 'My day was good. I study English today.' },
    { role: 'ai', text: 'That\'s great! By the way, small correction: "I studied English today." (past tense)', correction: true },
    { role: 'user', text: 'Thanks. I studied English today.' },
    { role: 'ai', text: 'Perfect! What topics did you focus on?' },
  ];

  return (
    <div style={s.page}>
      <AppHeader />
      <main style={s.main}>
        <div style={s.titleRow}>
          <h1 style={s.title}>AI 대화</h1>
          <span style={s.sub}>자유롭게 영어로 대화해보세요</span>
        </div>

        <div style={s.chat}>
          {messages.map((m, i) => (
            <div key={i} style={m.role === 'user' ? s.userRow : s.aiRow}>
              <div style={{
                ...s.bubble,
                ...(m.role === 'user' ? s.userBubble : s.aiBubble),
                ...(m.correction ? s.correctionBubble : {})
              }}>
                {m.correction && <div style={s.correctionLabel}>✏️ 교정</div>}
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <form style={s.inputRow} onSubmit={(e) => { e.preventDefault(); setInput(''); }}>
          <input value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="영어로 메시지를 입력하세요..." />
          <button type="submit" style={s.sendBtn}>전송</button>
        </form>
      </main>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  main: { flex: 1, maxWidth: 720, width: '100%', margin: '0 auto', padding: '24px 22px', display: 'flex', flexDirection: 'column' },
  titleRow: { display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 },
  title: { fontSize: 28 },
  sub: { color: '#86868b', fontSize: 14 },
  chat: { flex: 1, background: '#fff', borderRadius: 18, padding: 20, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12, minHeight: 400, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  userRow: { display: 'flex', justifyContent: 'flex-end' },
  aiRow: { display: 'flex', justifyContent: 'flex-start' },
  bubble: { maxWidth: '75%', padding: '10px 14px', borderRadius: 18, fontSize: 14, lineHeight: 1.5 },
  userBubble: { background: '#0071e3', color: '#fff', borderBottomRightRadius: 4 },
  aiBubble: { background: '#f5f5f7', color: '#1d1d1f', borderBottomLeftRadius: 4 },
  correctionBubble: { background: '#fff4e5', border: '1px solid #ffb340' },
  correctionLabel: { fontSize: 11, color: '#ff9500', marginBottom: 4, fontWeight: 600 },
  inputRow: { display: 'flex', gap: 8 },
  sendBtn: { padding: '0 22px', whiteSpace: 'nowrap' },
};
