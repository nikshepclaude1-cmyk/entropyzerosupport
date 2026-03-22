# lifeplot

> Reconstruct your life before entropyzero.

Generate a realistic synthetic life index chart from birth to today, then import it into entropyzero as your historical data.

## Stack

- Vite + React 18
- Recharts
- Geist Mono
- OpenRouter AI (optional)

## Local dev

```bash
npm install
npm run dev
```

## Deploy to Vercel

```bash
# Option A — Vercel CLI
npm i -g vercel
vercel --prod

# Option B — GitHub import
# Push to GitHub → import at vercel.com → auto-detected as Vite
```

No env vars required. If using AI narrative: add `VITE_OPENROUTER_KEY` in Vercel dashboard, or users paste their own key in the UI.

## Structure

```
src/
  constants.js      ← phases, questions, event impacts
  engine.js         ← curve generation + AI enhancement
  components/
    UI.jsx          ← Btn, Card, Label, Ticker, Spinner
    LifeChart.jsx   ← Recharts chart (synthetic + real)
    PhaseForm.jsx   ← range sliders + chip selectors + textarea
  screens/
    Welcome.jsx     ← mode selection
    Setup.jsx       ← name, DOB, IPO price, JSON upload
    Phases.jsx      ← phase selector + per-phase form
    Preview.jsx     ← chart + export
  App.jsx           ← routing + state
  main.jsx          ← React root
  index.css         ← global styles
```

## How the curve works

1. Range slider scores set trend direction per phase
2. Event chips fire calibrated shocks at each phase midpoint, decayed over 18 days
3. Bi-weekly micro-spikes keep the line from ever looking linear
4. Volatility is age-calibrated (teens/college = 2× more volatile than mid-career)
5. Final point normalized to exactly your entropyzero IPO price

## Importing to entropyzero

Settings → Import/Export → paste or upload the downloaded JSON.

---

Built by [Nikshep Doggalli](https://nikshep.vercel.app)
