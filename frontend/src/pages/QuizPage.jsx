import { useState } from 'react';
import AppHeader from './AppHeader';

export default function QuizPage() {
  const quiz = {
    question: '성취하다',
    options: ['accomplish', 'deliver', 'appreciate', 'assemble'],
    answer: 'accomplish',
  };

  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (selected) setShowResult(true);
  };

  const handleNext = () => {
    setSelected(null);
    setShowResult(false);
  };

  return (
    <div>
      <AppHeader />
      <main style={s.main}>
        <div style={s.header}>
          <h1 style={s.title}>퀴즈</h1>
          <span style={s.progress}>3 / 10</span>
        </div>

        <div style={s.card}>
          <div style={s.label}>한국어를 영어로</div>
          <div style={s.question}>{quiz.question}</div>

          <div style={s.options}>
            {quiz.options.map((opt) => {
              let style = s.option;
              if (showResult) {
                if (opt === quiz.answer) style = { ...s.option, ...s.correct };
                else if (opt === selected) style = { ...s.option, ...s.wrong };
              } else if (selected === opt) {
                style = { ...s.option, ...s.selected };
              }
              return (
                <button key={opt} onClick={() => !showResult && setSelected(opt)} style={style}>
                  {opt}
                </button>
              );
            })}
          </div>

          {showResult ? (
            <div>
              <div style={selected === quiz.answer ? s.resultOk : s.resultNg}>
                {selected === quiz.answer ? '✓ 정답입니다!' : '✗ 틀렸습니다. 오답노트에 저장됩니다.'}
              </div>
              <button onClick={handleNext} style={s.nextBtn}>다음 문제</button>
            </div>
          ) : (
            <button onClick={handleSubmit} disabled={!selected} style={s.nextBtn}>제출</button>
          )}
        </div>
      </main>
    </div>
  );
}

const s = {
  main: { maxWidth: 600, margin: '0 auto', padding: '40px 22px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 32 },
  progress: { color: '#86868b', fontSize: 14 },
  card: { background: '#fff', borderRadius: 18, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  label: { fontSize: 12, color: '#86868b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  question: { fontSize: 36, fontWeight: 600, textAlign: 'center', marginBottom: 32 },
  options: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 },
  option: { background: '#f5f5f7', color: '#1d1d1f', padding: '14px 18px', fontSize: 15, textAlign: 'left', borderRadius: 12, border: '2px solid transparent' },
  selected: { border: '2px solid #0071e3' },
  correct: { background: '#d1f4d6', border: '2px solid #34c759' },
  wrong: { background: '#ffd6d6', border: '2px solid #ff3b30' },
  resultOk: { color: '#34c759', fontSize: 15, fontWeight: 600, textAlign: 'center', marginBottom: 16 },
  resultNg: { color: '#ff3b30', fontSize: 15, fontWeight: 600, textAlign: 'center', marginBottom: 16 },
  nextBtn: { width: '100%' },
};
