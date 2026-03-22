import { EVENT_IMPACTS } from './constants';

const fmt   = (n) => parseFloat(n.toFixed(2));
const lerp  = (a, b, t) => a + (b - a) * t;
const addDay = (d) => { const nd = new Date(d); nd.setDate(nd.getDate() + 1); return nd; };
const dateStr = (d) => d.toISOString().split('T')[0];

// ── Phase energy: weighted average of all range sliders ───────────────────────
function phaseEnergy(answers = {}) {
  const vals = Object.entries(answers)
    .filter(([k]) => k !== 'key_events' && k !== 'narrative')
    .map(([, v]) => parseFloat(v || 0));
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

// ── Extract event shock values from chip selections ───────────────────────────
function phaseShocks(answers = {}) {
  return (answers.key_events || []).map(ev => EVENT_IMPACTS[ev] || 0);
}

// ── Age-calibrated volatility ─────────────────────────────────────────────────
function volatilityForAge(age) {
  if (age < 6)  return 1.4;
  if (age < 11) return 1.8;
  if (age < 14) return 2.4;
  if (age < 18) return 3.2;  // ← peak volatile (teens)
  if (age < 23) return 3.8;  // ← college
  if (age < 28) return 2.8;
  return 2.0;
}

// ── Main generator ─────────────────────────────────────────────────────────────
export function generateCurve({ phases, dob, startPrice, existingJson }) {
  const birthDate = new Date(dob);
  const now       = new Date();
  // If mixing: end at first point of existing data
  const endDate   = existingJson?.length
    ? new Date(existingJson[0].date)
    : now;

  // Map filled phases to date ranges
  const filled = phases
    .filter(p => p.filled)
    .map(p => {
      const phStart = new Date(birthDate);
      phStart.setFullYear(phStart.getFullYear() + p.config.ageStart);
      const phEnd = new Date(birthDate);
      phEnd.setFullYear(phEnd.getFullYear() + p.config.ageEnd);
      return { ...p, phStart, phEnd: phEnd < endDate ? phEnd : endDate };
    })
    .filter(p => p.phStart < endDate);

  const getPhase = (date) =>
    filled.find(p => date >= p.phStart && date <= p.phEnd) || null;

  // Track which phase shocks have been applied (fire once at midpoint)
  const shockedPhases = new Set();
  const data = [];
  let v = 500; // working value — normalized to startPrice at the end
  let d = new Date(birthDate);
  let dayIdx = 0;

  while (d < endDate) {
    const ds  = dateStr(d);
    const age = (d - birthDate) / (365.25 * 86400000);
    const ph  = getPhase(d);
    const vol = volatilityForAge(age);

    // Base trend from phase energy or default age curve
    let trend;
    if (ph) {
      trend = phaseEnergy(ph.answers) * 0.022;
    } else {
      trend = age < 6  ? 0.09 :
              age < 11 ? 0.11 :
              age < 14 ? 0.04 :
              age < 18 ? 0.07 :
              age < 22 ? 0.08 : 0.05;
    }

    // Daily noise
    const noise = (Math.random() - 0.5) * vol;

    // Bi-weekly micro-spike — keeps the line from ever being too smooth
    const biWeeklySpike = dayIdx % 13 === 0
      ? (Math.random() - 0.47) * vol * 2.8
      : 0;

    // Phase shock at midpoint
    let shock = 0;
    if (ph && !shockedPhases.has(ph.config.id)) {
      const mid = new Date((ph.phStart.getTime() + ph.phEnd.getTime()) / 2);
      if (d >= mid) {
        shockedPhases.add(ph.config.id);
        shock = phaseShocks(ph.answers).reduce((a, b) => a + b, 0)
          * (0.6 + Math.random() * 0.8);
      }
    }

    v = Math.max(50, v + trend + noise + biWeeklySpike + shock);

    // Sample every 5 days — enough density without 20k points
    if (dayIdx % 5 === 0) {
      data.push({ date: ds, value: fmt(v), timestamp: d.getTime() });
    }

    d = addDay(d);
    dayIdx++;
  }

  if (!data.length) return [];

  // ── Normalize so: first ≈ startPrice*0.30–0.45, last = exactly startPrice ──
  const rawFirst = data[0].value;
  const rawLast  = data[data.length - 1].value;
  const rawRange = rawLast - rawFirst || 1;

  const targetFirst = startPrice * (0.28 + Math.random() * 0.14);
  const targetLast  = startPrice;

  const normalized = data.map((pt) => {
    const t  = (pt.value - rawFirst) / rawRange;
    const nv = lerp(targetFirst, targetLast, t);
    // tiny post-norm noise so the line still wiggles after normalization
    const pnoise = (Math.random() - 0.5) * startPrice * 0.007;
    return { ...pt, value: fmt(Math.max(10, nv + pnoise)) };
  });

  // Force exact endpoint
  normalized[normalized.length - 1].value = startPrice;

  return normalized;
}

// ── AI narrative layer (OpenRouter) ───────────────────────────────────────────
async function callAI(key, system, user) {
  const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'lifeplot',
    },
    body: JSON.stringify({
      model: 'arcee-ai/trinity-mini:free',
      max_tokens: 700,
      messages: [
        { role: 'system', content: system },
        { role: 'user',   content: user   },
      ],
    }),
  });
  if (!resp.ok) throw new Error(`AI ${resp.status}`);
  const data = await resp.json();
  return data.choices[0]?.message?.content || '';
}

export async function enhanceCurveWithAI({ phases, curve, dob, aiKey }) {
  if (!aiKey) return curve;

  const narratives = phases
    .filter(p => p.filled && p.answers?.narrative?.trim())
    .map(p => `${p.config.label}: ${p.answers.narrative.trim()}`);

  if (!narratives.length) return curve;

  const birthYear = new Date(dob).getFullYear();
  const system = `You are a life index curve analyst. Given narrative descriptions of life phases, output a JSON array of shock events to inject into a life chart. Each: { "date": "YYYY-MM-DD", "delta": number }. delta range -40 to +40. Be specific and realistic. Output ONLY a valid JSON array, no markdown, max 15 items.`;
  const user   = `Birth year: ${birthYear}.\n${narratives.join('\n')}`;

  try {
    const raw    = await callAI(aiKey, system, user);
    const events = JSON.parse(raw.replace(/```json|```/g, '').trim());

    const result = curve.map(p => ({ ...p }));
    events.forEach(ev => {
      const idx = result.findIndex(p => p.date >= ev.date);
      if (idx < 0) return;
      for (let i = idx; i < Math.min(idx + 18, result.length); i++) {
        const decay = 1 - (i - idx) / 18;
        result[i].value = fmt(Math.max(10, result[i].value + ev.delta * decay * 0.28));
      }
    });

    // Re-pin end
    const sp    = curve[curve.length - 1].value;
    const drift = result[result.length - 1].value - sp;
    result.forEach((p, i) => {
      p.value = fmt(Math.max(10, p.value - drift * (i / (result.length - 1))));
    });
    result[result.length - 1].value = sp;
    return result;
  } catch (e) {
    console.warn('AI enhance failed:', e.message);
    return curve;
  }
}
