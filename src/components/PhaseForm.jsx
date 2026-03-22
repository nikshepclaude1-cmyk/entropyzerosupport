import { Label } from './UI';
import { PHASE_QUESTIONS } from '../constants';

export default function PhaseForm({ phaseId, answers, onChange }) {
  const questions = PHASE_QUESTIONS[phaseId] || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {questions.map(q => (
        <div key={q.id}>
          <Label>{q.label}</Label>
          {q.help && (
            <p style={{ fontSize: '9px', color: '#2a2a2a', marginBottom: '7px', lineHeight: 1.6 }}>
              {q.help}
            </p>
          )}

          {/* Range slider */}
          {q.type === 'range' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '9px', color: '#2a2a2a', minWidth: '22px' }}>{q.min}</span>
              <input
                type="range"
                min={q.min} max={q.max} step="0.5"
                value={answers[q.id] ?? 0}
                onChange={e => onChange(q.id, parseFloat(e.target.value))}
                style={{ flex: 1 }}
              />
              <span style={{
                fontSize: '12px',
                fontWeight: 700,
                minWidth: '32px',
                textAlign: 'right',
                color: (answers[q.id] ?? 0) > 0 ? '#f0f0f0' : (answers[q.id] ?? 0) < 0 ? '#444' : '#2a2a2a',
              }}>
                {(answers[q.id] ?? 0) > 0 ? '+' : ''}{answers[q.id] ?? 0}
              </span>
              <span style={{ fontSize: '9px', color: '#2a2a2a', minWidth: '22px', textAlign: 'right' }}>{q.max}</span>
            </div>
          )}

          {/* Chip selector */}
          {q.type === 'chips' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '4px' }}>
              {q.options.map(opt => {
                const selected = (answers[q.id] || []).includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => {
                      const cur = answers[q.id] || [];
                      onChange(q.id, selected ? cur.filter(x => x !== opt) : [...cur, opt]);
                    }}
                    style={{
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: '9px',
                      padding: '4px 9px',
                      borderRadius: '6px',
                      border: `1px solid ${selected ? '#2a2a2a' : '#141414'}`,
                      background: selected ? '#111' : '#080808',
                      color: selected ? '#f0f0f0' : '#444',
                      cursor: 'pointer',
                      transition: 'all 0.12s',
                    }}
                  >
                    {selected ? '✓ ' : ''}{opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* Text area */}
          {q.type === 'text' && (
            <textarea
              placeholder="Optional — AI uses this to add realistic texture and specific events..."
              value={answers[q.id] || ''}
              onChange={e => onChange(q.id, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
