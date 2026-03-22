import { useRef } from 'react';
import { Btn, Card, Label } from '../components/UI';

export default function Setup({ mode, form, setForm, existingJson, setExistingJson, onBack, onNext }) {
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        const arr = Array.isArray(parsed) ? parsed : parsed.chartData;
        if (!arr || !arr[0]?.date || !arr[0]?.value) throw new Error('bad');
        const sorted = arr.sort((a, b) => a.date.localeCompare(b.date));
        setExistingJson(sorted);
        setForm(f => ({ ...f, startPrice: parseFloat(sorted[sorted.length - 1]?.value || 500) }));
      } catch {
        alert('Invalid JSON — export your entropyzero data from Settings → Import/Export first.');
      }
    };
    reader.readAsText(file);
  };

  const canNext = form.name.trim() && form.dob && (mode !== 'mix' || existingJson);

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 20px' }}>
      <div className="fade-up">
        <div style={{ marginBottom: '28px' }}>
          <p style={{ fontSize: '9px', color: '#2a2a2a', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
            step 1 / 2
          </p>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f0f0f0', letterSpacing: '-0.02em' }}>
            Your basics
          </h2>
        </div>

        <Card style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <Label>Your name</Label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Nikshep"
            />
          </div>

          <div>
            <Label>Date of birth</Label>
            <input
              type="date"
              value={form.dob}
              onChange={e => setForm(f => ({ ...f, dob: e.target.value }))}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <Label>entropyzero IPO price <span style={{ color: '#1e1e1e' }}>(starting index value)</span></Label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {[100, 250, 500, 1000].map(p => (
                <button key={p}
                  onClick={() => setForm(f => ({ ...f, startPrice: p }))}
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: '11px', fontWeight: 600,
                    padding: '7px 14px', borderRadius: '8px', cursor: 'pointer',
                    border: `1px solid ${form.startPrice === p ? '#2a2a2a' : '#141414'}`,
                    background: form.startPrice === p ? '#141414' : 'transparent',
                    color: form.startPrice === p ? '#f0f0f0' : '#2a2a2a',
                    transition: 'all 0.12s',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
            <input
              type="number" min={1}
              value={form.startPrice}
              onChange={e => setForm(f => ({ ...f, startPrice: parseFloat(e.target.value) || 500 }))}
              placeholder="500"
            />
          </div>

          {/* AI key — optional */}
          <div>
            <Label>OpenRouter API key <span style={{ color: '#1e1e1e' }}>(optional — enables AI narrative layer)</span></Label>
            <input
              type="password"
              value={form.aiKey}
              onChange={e => setForm(f => ({ ...f, aiKey: e.target.value }))}
              placeholder="sk-or-v1-... (leave blank to skip AI)"
            />
            <p style={{ fontSize: '9px', color: '#1e1e1e', marginTop: '5px', lineHeight: 1.6 }}>
              Free key at openrouter.ai. Without it, the rule-based engine still produces a great curve.
            </p>
          </div>

          {/* Existing JSON upload — only in mix mode */}
          {mode === 'mix' && (
            <div>
              <Label>entropyzero export JSON</Label>
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  border: `1px dashed ${existingJson ? '#1e1e1e' : '#111'}`,
                  borderRadius: '10px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#2a2a2a'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = existingJson ? '#1e1e1e' : '#111'; }}
              >
                <p style={{ fontSize: '10px', color: existingJson ? '#22c55e' : '#2a2a2a' }}>
                  {existingJson
                    ? `✓ ${existingJson.length} data points loaded — ${existingJson[0].date} → ${existingJson[existingJson.length - 1].date}`
                    : 'Click to upload your entropyzero export JSON'}
                </p>
              </div>
              <input type="file" accept=".json" ref={fileRef} style={{ display: 'none' }} onChange={handleFile} />
              <p style={{ fontSize: '9px', color: '#1a1a1a', marginTop: '6px', lineHeight: 1.6 }}>
                entropyzero → Settings → Export Data → download → upload here.
              </p>
            </div>
          )}
        </Card>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Btn variant="ghost" onClick={onBack}>← Back</Btn>
          <Btn onClick={onNext} disabled={!canNext}>Set up phases →</Btn>
        </div>
      </div>
    </div>
  );
}
