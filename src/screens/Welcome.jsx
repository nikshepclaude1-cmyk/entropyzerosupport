import { Ticker, Btn } from '../components/UI';
import { EZ_IMPORT_URL } from '../constants';

export default function Welcome({ mode, setMode, onStart }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Ticker />

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        textAlign: 'center',
      }}>
        {/* Icon */}
        <div className="fade-up-1" style={{ marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            border: '1px solid #1e1e1e',
            borderRadius: '12px',
            marginBottom: '14px',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="#555" strokeWidth="1.5" strokeLinecap="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <p style={{ fontSize: '10px', color: '#2a2a2a', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            lifeplot
          </p>
        </div>

        {/* Headline */}
        <div className="fade-up-2" style={{ marginBottom: '14px', maxWidth: '560px' }}>
          <h1 style={{
            fontSize: 'clamp(28px,5vw,46px)',
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: '#f0f0f0',
          }}>
            Reconstruct your life<br />before entropyzero.
          </h1>
        </div>

        <div className="fade-up-3" style={{ marginBottom: '44px', maxWidth: '460px' }}>
          <p style={{ fontSize: '12px', color: '#3a3a3a', lineHeight: 1.75 }}>
            Fill in your life phases. Mark key events. Get a realistic synthetic life index chart
            from birth to today — importable directly into entropyzero.
          </p>
        </div>

        {/* Mode cards */}
        <div className="fade-up-4" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '10px',
          width: '100%',
          maxWidth: '520px',
          marginBottom: '36px',
        }}>
          {[
            {
              id: 'fresh',
              emoji: '🌱',
              label: 'Fresh start',
              desc: 'New to entropyzero. Generate full history from birth, import as your starting chart data.',
            },
            {
              id: 'mix',
              emoji: '🔗',
              label: 'Mix with existing',
              desc: 'Already on entropyzero. Stitch synthetic history to your real data. One seamless chart.',
            },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                fontFamily: "'Geist Mono', monospace",
                textAlign: 'left',
                padding: '18px',
                borderRadius: '14px',
                border: `1px solid ${mode === m.id ? '#2a2a2a' : '#0f0f0f'}`,
                background: mode === m.id ? '#0d0d0d' : '#080808',
                cursor: 'pointer',
                transition: 'all 0.18s',
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>{m.emoji}</div>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#f0f0f0', marginBottom: '5px' }}>
                {m.label}
              </p>
              <p style={{ fontSize: '9px', color: '#2a2a2a', lineHeight: 1.6 }}>{m.desc}</p>
              {mode === m.id && (
                <p style={{ fontSize: '9px', color: '#333', marginTop: '10px' }}>✓ selected</p>
              )}
            </button>
          ))}
        </div>

        <div className="fade-up-5">
          <Btn onClick={onStart} style={{ fontSize: '13px', padding: '13px 32px' }}>
            Start →
          </Btn>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid #0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <p style={{ fontSize: '9px', color: '#1a1a1a', letterSpacing: '0.1em' }}>
          LIFEPLOT v1.0 · by Nikshep Doggalli
        </p>
        <a href={EZ_IMPORT_URL} target="_blank" rel="noreferrer"
          style={{ fontSize: '9px', color: '#1e1e1e', textDecoration: 'none', letterSpacing: '0.08em' }}>
          entropyzero ↗
        </a>
      </div>
    </div>
  );
}
