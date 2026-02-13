# Sleep Journal (睡眠日誌)

A web-based sleep diary modeled after the NTUH (台大醫院) sleep diary format. Track your nightly sleep patterns, daytime behaviors, and export data for clinical review.

## Features

- **Morning tab (早上填寫)** — Log bedtime, sleep latency, wake-ups, sleep quality (1–5), and alarm usage
- **Evening tab (睡前填寫)** — Record naps, caffeine/alcohol intake, medications, light exposure, and exercise
- **History tab (歷史/匯出)** — View, edit, delete entries; export all data as CSV (Excel-compatible with Chinese headers)
- **localStorage persistence** — All data saved locally in the browser; no backend or account required
- **Date navigation** — Date picker with prev/next day buttons

## Tech Stack

| Layer | Package | Version |
|-------|---------|---------|
| UI | React | ^19.2.4 |
| Build | Vite | ^7.3.1 |
| CSS | Tailwind CSS | ^4.1.18 |
| Icons | Lucide React | ^0.564.0 |

## Getting Started

```bash
npm install
npm run dev       # Start dev server
npm run build     # Production build → dist/
npm run preview   # Preview production build
```

## Project Structure

```
sleepjournal/
  index.html          # Vite entry point (lang="zh-TW")
  vite.config.js      # React + Tailwind v4 plugins
  package.json
  SPEC.md             # Full specification
  src/
    main.jsx          # React 19 createRoot
    index.css         # Tailwind v4 import + global styles
    App.jsx           # SleepDiaryApp — single component with all UI
```

## Language

The entire UI is in **Traditional Chinese (zh-TW)**. Field labels, button text, CSV headers, and alert messages are all in Chinese.
