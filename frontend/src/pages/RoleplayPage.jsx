import { useState } from 'react';
import AppHeader from './AppHeader';

export default function RoleplayPage() {
  const scenarios = [
    { title: '카페 주문', emoji: '☕', desc: '커피숍에서 음료 주문하기' },
    { title: '공항', emoji: '✈️', desc: '탑승 수속과 출국 심사' },
    { title: '호텔 체크인', emoji: '🏨', desc: '호텔 예약과 체크인' },
    { title: '면접', emoji: '💼', desc: '영어 면접 연습' },
    { title: '길 묻기', emoji: '🗺️', desc: '길을 묻고 답하기' },
    { title: '쇼핑', emoji: '🛍️', desc: '가게에서 물건 사기' },
  ];

  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <div>
        <AppHeader />
        <main style={s.main}>
          <button onClick={() => setSelected(null)} style={s.backBtn}>← 상황 선택</button>
          <h1 style={s.title}>{selected.emoji} {selected.title}</h1>
          <p style={s.sub}>{selected.desc}</p>
          <div style={s.chatBox}>
            <div style={s.aiBubble}>
              Hello! Welcome to our cafe. What can I get for you today?
            </div>
            <div style={s.userBubble}>
              I'd like a latte, please.
            </div>
            <div style={s.aiBubble}>
              Great choice! What size would you like?
            </div>
          </div>
          <form style={s.inputRow} onSubmit={(e) => e.preventDefault()}>
            <input placeholder="영어로 답변해보세요..." />
            <button type="submit" style={s.sendBtn}>전송</button>
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
            <button key={sc.title} onClick={() => setSelected(sc)} style={s.scenarioCard}>
              <div style={s.emoji}>{sc.emoji}</div>
              <div style={s.scTitle}>{sc.title}</div>
              <div style={s.scDesc}>{sc.desc}</div>
            </button>
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 },
  scenarioCard: { background: '#fff', borderRadius: 18, padding: 24, textAlign: 'left', cursor: 'pointer', border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  emoji: { fontSize: 36, marginBottom: 12 },
  scTitle: { fontSize: 17, fontWeight: 600, marginBottom: 4, color: '#1d1d1f' },
  scDesc: { fontSize: 13, color: '#86868b' },
  backBtn: { background: 'transparent', color: '#0071e3', padding: 0, fontSize: 14, marginBottom: 20 },
  chatBox: { background: '#fff', borderRadius: 18, padding: 20, display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20, marginBottom: 12, minHeight: 300, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  aiBubble: { alignSelf: 'flex-start', maxWidth: '75%', padding: '10px 14px', borderRadius: 18, borderBottomLeftRadius: 4, background: '#f5f5f7', fontSize: 14 },
  userBubble: { alignSelf: 'flex-end', maxWidth: '75%', padding: '10px 14px', borderRadius: 18, borderBottomRightRadius: 4, background: '#0071e3', color: '#fff', fontSize: 14 },
  inputRow: { display: 'flex', gap: 8 },
  sendBtn: { padding: '0 22px', whiteSpace: 'nowrap' },
};
