// ── Shared UI primitives ──────────────────────────────────────────────────────

export const Btn = ({ children, onClick, disabled, variant = 'primary', style, ...rest }) => {
  const base = {
    fontFamily: "'Geist Mono', monospace",
    fontSize: '12px',
    fontWeight: 600,
    borderRadius: '10px',
    padding: '11px 20px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    letterSpacing: '0.02em',
    transition: 'all 0.15s',
    opacity: disabled ? 0.35 : 1,
    ...style,
  };
  const variants = {
    primary: { background: '#f0f0f0', color: '#050505' },
    ghost:   { background: 'transparent', color: '#555', border: '1px solid #1e1e1e' },
    danger:  { background: 'transparent', color: '#ef4444', border: '1px solid #2a1010' },
  };
  return (
    <button style={{ ...base, ...variants[variant] }} onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  );
};

export const Card = ({ children, style }) => (
  <div style={{
    background: '#0a0a0a',
    border: '1px solid #141414',
    borderRadius: '16px',
    padding: '20px',
    ...style,
  }}>
    {children}
  </div>
);

export const CardAccent = ({ children, style }) => (
  <div style={{
    background: '#080808',
    border: '1px solid #1a1a1a',
    borderRadius: '14px',
    padding: '16px',
    ...style,
  }}>
    {children}
  </div>
);

export const Label = ({ children, style }) => (
  <label style={{
    fontSize: '10px',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    display: 'block',
    marginBottom: '5px',
    ...style,
  }}>
    {children}
  </label>
);

export const Tag = ({ children, style }) => (
  <span style={{
    fontSize: '9px',
    padding: '3px 8px',
    borderRadius: '6px',
    border: '1px solid #1e1e1e',
    color: '#444',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    ...style,
  }}>
    {children}
  </span>
);

export const ProgressBar = ({ pct }) => (
  <div style={{ height: '2px', background: '#111', borderRadius: '1px', overflow: 'hidden' }}>
    <div style={{
      height: '100%',
      background: '#f0f0f0',
      borderRadius: '1px',
      width: `${pct}%`,
      transition: 'width 0.4s ease',
    }} />
  </div>
);

export const Ticker = () => {
  const items = ['LIFE INDEX GENERATOR', 'RECONSTRUCT YOUR PAST', 'IMPORT TO ENTROPYZERO', 'LIFEPLOT v1.0', 'HYBRID AI + STRUCTURED', 'NO AUTH REQUIRED', 'STANDALONE APP', 'BY NIKSHEP DOGGALLI'];
  const doubled = [...items, ...items];
  return (
    <div style={{
      overflow: 'hidden',
      borderTop: '1px solid #0f0f0f',
      borderBottom: '1px solid #0f0f0f',
      padding: '7px 0',
      background: '#040404',
    }}>
      <div style={{
        display: 'flex',
        gap: '48px',
        animation: 'ticker 35s linear infinite',
        width: 'max-content',
      }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            fontSize: '9px',
            color: '#1e1e1e',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            {item} ·
          </span>
        ))}
      </div>
    </div>
  );
};

export const Spinner = ({ text }) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
  }}>
    <div className="spinner" />
    {text && (
      <p style={{ fontSize: '11px', color: '#444', letterSpacing: '0.08em' }}>{text}</p>
    )}
  </div>
);
