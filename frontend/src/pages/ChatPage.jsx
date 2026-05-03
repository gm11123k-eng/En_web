import parse from 'html-react-parser';
import { useState, useEffect } from 'react';
import { useAuth, api } from '../App';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AppHeader from './AppHeader';

export default function ChatPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [convList, setConvList] = useState([]);

  useEffect(() => {
    if (id) {
      api.get('/conversations/' + id).then(res => {
        setMessages(res.data.messages);
      });
    } else {
      api.get('/conversations', { params: { memberId: user.id } }).then(res => {
        setConvList(res.data);
      });
    }
  }, [id]);

  const startNew = async () => {
    const res = await api.post('/conversations', { memberId: user.id });
    navigate('/chat/' + res.data.conversationId);
  };

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    setLoading(true);

    setMessages(prev => [...prev, { role: 'user', content: input, correction: null }]);
    const text = input;
    setInput('');

    try {
      const res = await api.post('/conversations/' + id + '/messages', { content: text });
      const aiMsg = { role: 'ai', content: res.data.reply, correction: res.data.correction || null };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: 'Error occurred', correction: null }]);
    }
    setLoading(false);
  };

  if (!id) {
    return (
      <div>
        <AppHeader />
        <main style={s.main}>
          <div style={s.titleRow}>
            <h1 style={s.title}>AI 대화</h1>
          </div>
          <button onClick={startNew} style={s.newBtn}>새 대화 시작</button>
          <div style={s.list}>
            {convList.map(c => (
              <Link key={c.id} to={'/chat/' + c.id} style={s.convCard}>
                <span>대화 #{c.id}</span>
                <span style={s.date}>{c.createdAt?.substring(0, 10)}</span>
              </Link>
            ))}
            {convList.length === 0 && <p style={s.empty}>아직 대화가 없습니다</p>}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <AppHeader />
      <main style={s.chatMain}>
        <div style={s.titleRow}>
          <Link to="/chat" style={s.back}>← 목록</Link>
          <h1 style={s.title}>AI 대화</h1>
          <span style={s.sub}>자유롭게 영어로 대화해보세요</span>
        </div>

        <div style={s.chat}>
          {messages.map((m, i) => (
            <div key={i} style={m.role === 'user' ? s.userRow : s.aiRow}>
              <div style={{
                ...s.bubble,
                ...(m.role === 'user' ? s.userBubble : s.aiBubble)
              }}>
                <span>{parse(m.content)}</span>
              </div>
              {m.correction && (
                <div style={s.correctionBubble}>
                  <div style={s.correctionLabel}>✏️ 교정</div>
                  <span ref={el => { if (el) el.innerHTML = m.correction; }} />
                </div>
              )}
            </div>
          ))}
          {loading && <div style={s.aiRow}><div style={s.aiBubble}>...</div></div>}
        </div>

        <form style={s.inputRow} onSubmit={send}>
          <input value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="영어로 메시지를 입력하세요..." disabled={loading} />
          <button type="submit" style={s.sendBtn} disabled={loading}>전송</button>
        </form>
      </main>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  main: { maxWidth: 720, width: '100%', margin: '0 auto', padding: '40px 22px' },
  chatMain: { flex: 1, maxWidth: 720, width: '100%', margin: '0 auto', padding: '24px 22px', display: 'flex', flexDirection: 'column' },
  titleRow: { display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 },
  title: { fontSize: 28 },
  sub: { color: '#86868b', fontSize: 14 },
  back: { color: '#0071e3', fontSize: 14, textDecoration: 'none' },
  newBtn: { marginBottom: 24, padding: '12px 24px' },
  list: { display: 'flex', flexDirection: 'column', gap: 8 },
  convCard: { background: '#fff', borderRadius: 14, padding: '16px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', textDecoration: 'none', color: '#1d1d1f' },
  date: { color: '#86868b', fontSize: 13 },
  empty: { color: '#86868b', textAlign: 'center', padding: 40 },
  chat: { flex: 1, background: '#fff', borderRadius: 18, padding: 20, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12, minHeight: 400, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflowY: 'auto' },
  userRow: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 },
  aiRow: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 },
  bubble: { maxWidth: '75%', padding: '10px 14px', borderRadius: 18, fontSize: 14, lineHeight: 1.5 },
  userBubble: { background: '#0071e3', color: '#fff', borderBottomRightRadius: 4 },
  aiBubble: { background: '#f5f5f7', color: '#1d1d1f', borderBottomLeftRadius: 4 },
  correctionBubble: { maxWidth: '75%', padding: '10px 14px', borderRadius: 18, background: '#fff4e5', border: '1px solid #ffb340', fontSize: 14, lineHeight: 1.5, borderBottomLeftRadius: 4 },
  correctionLabel: { fontSize: 11, color: '#ff9500', marginBottom: 4, fontWeight: 600 },
  inputRow: { display: 'flex', gap: 8 },
  sendBtn: { padding: '0 22px', whiteSpace: 'nowrap' },
};
