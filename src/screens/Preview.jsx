import { useState } from 'react';
import { Btn, Card, CardAccent } from '../components/UI';
import LifeChart from '../components/LifeChart';
import { EZ_IMPORT_URL } from '../constants';

const fmt = (n) => parseFloat(parseFloat(n).toFixed(2));

export default function Preview({ curve, name, startPrice, existingJson, mode, onEdit, onRegenerate }) {
  const [copied, setCopied] = useState(false);

  const signupDate  = mode === 'mix' && existingJson ? existingJson[0]?.date : null;
  const peakValue   = curve.length ? Math.max(...curve.map(d => d.value)) : 0;
  const valleyValue = curve.length ? Math.min(...curve.map(d => d.value)) : 0;
  const startYear   = curve[0]?.date?.slice(0, 4);
  const endYear     = curve[curve.length - 1]?.date?.slice(0, 4);

  const buildExport = () => {
    if (mode === 'mix' && existingJson) {
      return { chartData: curve, _merged: true, _signupDate: signupDate };
    }
    return { chartData: curve };
  };

  const downloadJson = () => {
    const data = buildExport();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `lifeplot_${(name || 'history').replace(/\s/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(JSON.stringify(buildExport(), null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '40px 20px' }}>
      <div className="fade-up">
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '14px',
        }}>
          <div>
            <p style={{ fontSize: '9px', color: '#2a2a2a', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
              lifeplot
            </p>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f0f0f0', letterSpacing: '-0.02em' }}>
              {name || 'Your'}'s life graph
            </h1>
            <p style={{ fontSize: '10px', color: '#222', marginTop: '4px' }}>
              {curve.length} data points · {startYear} → {endYear}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Btn variant="ghost" onClick={onEdit}>← Edit</Btn>
            <Btn variant="ghost" onClick={onRegenerate}>↺ Regenerate</Btn>
          </div>
        </div>

        {/* Chart */}
        <Card style={{ marginBottom: '16px', padding: '16px 16px 10px' }}>
          <LifeChart
            data={curve}
            existingData={mode === 'mix' ? existingJson : null}
            signupDate={signupDate}
            startPrice={startPrice}
          />
        </Card>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: '8px',
          marginBottom: '20px',
        }}>
          {[
            ['Start',   fmt(curve[0]?.value ?? 0)],
            ['Peak',    fmt(peakValue)],
            ['Valley',  fmt(valleyValue)],
            ['End',     `${startPrice} ✓`],
          ].map(([label, val]) => (
            <CardAccent key={label} style={{ textAlign: 'center', padding: '14px 10px' }}>
              <p style={{ fontSize: '9px', color: '#222', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px' }}>
                {label}
              </p>
              <p style={{ fontSize: '17px', fontWeight: 700, color: '#f0f0f0' }}>{val}</p>
            </CardAccent>
          ))}
        </div>

        {/* Export */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '11px', color: '#f0f0f0', fontWeight: 600, marginBottom: '4px' }}>
              Export & Import
            </p>
            <p style={{ fontSize: '9px', color: '#2a2a2a', lineHeight: 1.7 }}>
              Download the JSON, then in entropyzero → Settings → Import/Export → paste or upload.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Btn onClick={downloadJson}>↓ Download JSON</Btn>
            <Btn variant="ghost" onClick={copyToClipboard}>
              {copied ? '✓ Copied!' : 'Copy JSON'}
            </Btn>
          </div>

          <CardAccent>
            <p style={{ fontSize: '9px', color: '#222', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              How to import
            </p>
            {[
              '1. Download JSON above',
              '2. Open entropyzero → Settings',
              '3. Scroll to Import / Export section',
              '4. Upload or paste the JSON',
              '5. Your chart will show the full history',
            ].map(step => (
              <p key={step} style={{ fontSize: '10px', color: '#333', lineHeight: 2.0 }}>{step}</p>
            ))}
          </CardAccent>

          <a
            href={EZ_IMPORT_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '10px',
              color: '#2a2a2a',
              textDecoration: 'none',
              borderBottom: '1px solid #141414',
              paddingBottom: '2px',
              alignSelf: 'flex-start',
            }}
          >
            Open entropyzero ↗
          </a>
        </Card>
      </div>
    </div>
  );
}
