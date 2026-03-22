import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, CartesianGrid,
} from 'recharts';

const fmt = (n) => parseFloat(parseFloat(n).toFixed(2));

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0a0a0a',
      border: '1px solid #1e1e1e',
      borderRadius: '8px',
      padding: '8px 12px',
      fontFamily: "'Geist Mono', monospace",
    }}>
      <p style={{ fontSize: '9px', color: '#333', marginBottom: '3px' }}>{label}</p>
      {payload.map((p, i) => p.value != null && (
        <p key={i} style={{ fontSize: '11px', color: p.stroke === '#22c55e' ? '#22c55e' : '#f0f0f0', fontWeight: 600 }}>
          {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function LifeChart({ data, existingData, signupDate, startPrice }) {
  const merged = useMemo(() => {
    if (!existingData?.length) return data;
    return [
      ...data.map(d => ({ ...d, synthetic: d.value, real: null })),
      ...existingData.map(d => ({ ...d, synthetic: null, real: d.value })),
    ];
  }, [data, existingData]);

  const hasExisting = !!existingData?.length;

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={merged} margin={{ top: 10, right: 4, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="synthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#f0f0f0" stopOpacity={0.12} />
              <stop offset="100%" stopColor="#f0f0f0" stopOpacity={0}    />
            </linearGradient>
            <linearGradient id="realGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#22c55e" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0}    />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="2 8" stroke="#0d0d0d" />
          <XAxis dataKey="date" hide />
          <YAxis hide domain={['dataMin - 20', 'dataMax + 20']} />
          <Tooltip content={<CustomTooltip />} />

          {signupDate && (
            <ReferenceLine
              x={signupDate}
              stroke="#2a2a2a"
              strokeDasharray="4 4"
              label={{
                value: 'entropyzero →',
                fill: '#333',
                fontSize: 9,
                fontFamily: "'Geist Mono', monospace",
                position: 'insideTopRight',
              }}
            />
          )}

          {hasExisting ? (
            <>
              <Area
                type="monotone" dataKey="synthetic"
                stroke="#3a3a3a" strokeWidth={1.5}
                strokeDasharray="5 4"
                fill="url(#synthGrad)" dot={false} connectNulls={false}
              />
              <Area
                type="monotone" dataKey="real"
                stroke="#22c55e" strokeWidth={1.8}
                fill="url(#realGrad)" dot={false} connectNulls={false}
              />
            </>
          ) : (
            <Area
              type="monotone" dataKey="value"
              stroke="#e8e8e8" strokeWidth={1.6}
              fill="url(#synthGrad)" dot={false}
              activeDot={{ r: 3, fill: '#f0f0f0', stroke: '#050505', strokeWidth: 2 }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>

      {hasExisting && (
        <div style={{ display: 'flex', gap: '20px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #0d0d0d' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{ width: '18px', height: '1px', background: '#3a3a3a', borderTop: '1px dashed #3a3a3a' }} />
            <span style={{ fontSize: '9px', color: '#333' }}>synthetic history</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{ width: '18px', height: '2px', background: '#22c55e' }} />
            <span style={{ fontSize: '9px', color: '#333' }}>entropyzero data</span>
          </div>
        </div>
      )}
    </div>
  );
}
