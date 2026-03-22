import { useState } from 'react';
import { Btn, Card, Label, ProgressBar } from '../components/UI';
import PhaseForm from '../components/PhaseForm';
import { LIFE_PHASES } from '../constants';

export default function Phases({ dob, selectedPhases, setSelectedPhases, phaseAnswers, setPhaseAnswers, onBack, onGenerate, canGenerate }) {
  const [activePhase, setActivePhase] = useState(null);

  const birthYear  = dob ? new Date(dob).getFullYear() : 2000;
  const age        = new Date().getFullYear() - birthYear;
  const relevant   = LIFE_PHASES.filter(p => p.ageStart < age);
  const selected   = relevant.filter(p => selectedPhases.has(p.id));

  const activeConfig = activePhase ? relevant.find(p => p.id === activePhase) : null;
  const activeIdx    = activePhase ? selected.findIndex(p => p.id === activePhase) : -1;

  const updateAnswer = (phaseId, qid, val) => {
    setPhaseAnswers(prev => ({
      ...prev,
      [phaseId]: { ...(prev[phaseId] || {}), [qid]: val },
    }));
  };

  // ── Per-phase form view ──
  if (activePhase && activeConfig) {
    return (
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 20px' }}>
        <div className="fade-up">
          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
            <Btn variant="ghost" style={{ padding: '6px 10px' }}
              onClick={() => {
                if (activeIdx > 0) setActivePhase(selected[activeIdx - 1].id);
                else setActivePhase(null);
              }}>←</Btn>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '9px', color: '#2a2a2a' }}>{activeIdx + 1} / {selected.length}</span>
                <span style={{ fontSize: '9px', color: '#444' }}>{activeConfig.label}</span>
              </div>
              <ProgressBar pct={((activeIdx + 1) / selected.length) * 100} />
            </div>
          </div>

          <div style={{ marginBottom: '22px' }}>
            <span style={{ fontSize: '28px' }}>{activeConfig.emoji}</span>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f0f0f0', marginTop: '8px', letterSpacing: '-0.02em' }}>
              {activeConfig.label}
            </h2>
            <p style={{ fontSize: '10px', color: '#2a2a2a', marginTop: '3px' }}>{activeConfig.sub}</p>
          </div>

          <Card style={{ marginBottom: '16px' }}>
            <PhaseForm
              phaseId={activePhase}
              answers={phaseAnswers[activePhase] || {}}
              onChange={(qid, val) => updateAnswer(activePhase, qid, val)}
            />
          </Card>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            <Btn variant="ghost" onClick={() => setActivePhase(null)}>← All phases</Btn>
            {activeIdx < selected.length - 1 ? (
              <Btn onClick={() => setActivePhase(selected[activeIdx + 1].id)}>
                Next phase →
              </Btn>
            ) : (
              <Btn onClick={() => setActivePhase(null)}>Done ✓</Btn>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Phase overview ──
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 20px' }}>
      <div className="fade-up">
        <div style={{ marginBottom: '28px' }}>
          <p style={{ fontSize: '9px', color: '#2a2a2a', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
            step 2 / 2
          </p>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f0f0f0', letterSpacing: '-0.02em' }}>
            Fill in your life phases
          </h2>
          <p style={{ fontSize: '10px', color: '#2a2a2a', marginTop: '4px', lineHeight: 1.7 }}>
            Select phases. Fill in as many as you want — AI and the engine will interpolate gaps.
          </p>
        </div>

        {/* Phase selector grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '6px',
          marginBottom: '24px',
        }}>
          {relevant.map(ph => {
            const active = selectedPhases.has(ph.id);
            return (
              <button key={ph.id}
                onClick={() => {
                  setSelectedPhases(prev => {
                    const next = new Set(prev);
                    if (next.has(ph.id)) next.delete(ph.id);
                    else next.add(ph.id);
                    return next;
                  });
                }}
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  textAlign: 'left',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: `1px solid ${active ? '#1e1e1e' : '#0f0f0f'}`,
                  background: active ? '#0d0d0d' : '#080808',
                  cursor: 'pointer',
                  transition: 'all 0.14s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                }}
              >
                <span style={{ fontSize: '11px', color: active ? '#f0f0f0' : '#2a2a2a', fontWeight: 600 }}>
                  {ph.emoji} {ph.label}
                </span>
                <span style={{ fontSize: '8px', color: active ? '#333' : '#1a1a1a' }}>{ph.sub}</span>
              </button>
            );
          })}
        </div>

        {/* Fill each selected phase */}
        {selected.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <Label style={{ marginBottom: '10px' }}>Fill in each phase</Label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {selected.map(ph => {
                const ans    = phaseAnswers[ph.id] || {};
                const filled = Object.keys(ans).length > 0;
                return (
                  <button key={ph.id}
                    onClick={() => setActivePhase(ph.id)}
                    style={{
                      fontFamily: "'Geist Mono', monospace",
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      background: '#080808',
                      border: `1px solid ${filled ? '#1a1a1a' : '#0d0d0d'}`,
                      borderRadius: '10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'border-color 0.14s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#2a2a2a'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = filled ? '#1a1a1a' : '#0d0d0d'; }}
                  >
                    <span style={{ fontSize: '18px' }}>{ph.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: filled ? '#f0f0f0' : '#2a2a2a' }}>
                        {ph.label}
                      </p>
                      <p style={{ fontSize: '9px', color: '#1e1e1e', marginTop: '2px' }}>{ph.sub}</p>
                    </div>
                    <span style={{ fontSize: '10px', color: filled ? '#22c55e' : '#1e1e1e' }}>
                      {filled ? '✓ filled' : '→ fill'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          <Btn variant="ghost" onClick={onBack}>← Back</Btn>
          <Btn onClick={onGenerate} disabled={!canGenerate}>
            Generate life graph →
          </Btn>
        </div>
      </div>
    </div>
  );
}
