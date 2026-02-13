# Sleep Journal App — Specification

## Intent

### Purpose

A standalone web app for daily sleep tracking, modeled after the NTUH (台大醫院) sleep diary PDF format. Users log morning wake-up data and evening pre-sleep behaviors, then review/export history.

### Users

Individuals tracking sleep patterns, typically under guidance of a sleep clinic. Single-user, local-only (no backend).

### Success Criteria

- App loads and renders all three tabs without errors
- Data persists across page reloads via localStorage
- CSV export produces a valid file openable in Excel with correct Chinese headers

### Non-goals

- Multi-user / authentication
- Backend / database
- Data visualization / charts
- PWA / offline support (beyond localStorage)

## Design

### Tech Stack

| Component | Package | Version |
|-----------|---------|---------|
| Runtime | react | ^19.2.4 |
| DOM | react-dom | ^19.2.4 |
| Build | vite | ^7.3.1 |
| React plugin | @vitejs/plugin-react | ^5.1.4 |
| CSS framework | tailwindcss | ^4.1.18 |
| Tailwind Vite plugin | @tailwindcss/vite | ^4.1.18 |
| Icons | lucide-react | ^0.564.0 |

### File Structure

```
sleepjournal/
  .gitignore
  index.html          ← Vite entry point
  package.json
  vite.config.js
  SPEC.md
  src/
    main.jsx           ← React 19 createRoot
    index.css          ← Tailwind v4 import + global styles
    App.jsx            ← SleepDiaryApp component
```

### System Boundary

| Boundary | Inside | Outside |
|----------|--------|---------|
| Responsibility | Sleep entry CRUD, CSV export | Data analysis, charts, sync |
| Interaction | localStorage read/write | No network requests |
| Control | Form state, entry storage | Browser date/time APIs |

### Behaviors

#### Three Tabs

| Tab | Purpose | Key Fields |
|-----|---------|------------|
| 早上填寫 (Morning) | Log previous night's sleep | bedTime, trySleepTime, sleepLatency, wakeCount, totalWakeTime, lastWakeTime, getUpTime, sleepQuality (1-5), useAlarm, dayType, notes |
| 睡前填寫 (Evening) | Log today's daytime behaviors | napCount, napDuration, alcohol (amount+time), caffeine (amount+time), meds (name+time), lightTime, exerciseTime |
| 歷史/匯出 (History) | View entries, edit, delete, export CSV | Sorted reverse-chronological, per-entry edit/delete |

#### Data Persistence

- All entries stored in `localStorage` under key `sleep_diary_entries`
- Shape: `{ [date: string]: FormData }`
- Auto-saved to localStorage on every entries state change
- On date selection: load existing entry or reset to defaults

#### Date Navigation

- Date picker with left/right chevron buttons (prev/next day)
- Visible on Morning and Evening tabs, hidden on History tab

#### CSV Export

- BOM prefix (`\uFEFF`) for Excel Chinese encoding
- All fields as columns with Chinese headers
- Filename: `睡眠日誌匯出_YYYY-MM-DD.csv`
- Text fields wrapped in quotes to handle commas

### styled-jsx Conversion

The original component uses `<style jsx global>` (Next.js pattern). For standalone Vite app:

| Original | Converted To |
|----------|-------------|
| `<style jsx global>{...}</style>` in JSX | `src/index.css` after `@import "tailwindcss"` |

Extracted global styles:
1. `.toggle-checkbox:checked` — toggle switch positioning and color
2. `@keyframes fade-in` + `.animate-fade-in` — tab transition animation
3. `.pb-safe` — `env(safe-area-inset-bottom)` for iOS notch

### Error Scenarios

| Scenario | Behavior |
|----------|----------|
| localStorage unavailable | Entries default to `{}`, no crash |
| No entries on export | Alert: "目前沒有資料可匯出" |
| Delete confirmation | `confirm()` dialog before deletion |
| Save confirmation | `alert()` after successful save |

## Consistency

### Terminology

| Term | Meaning |
|------|---------|
| Entry | One day's complete sleep record (morning + evening fields) |
| Form data | The in-memory state of the current entry being edited |
| Selected date | The date currently being viewed/edited (YYYY-MM-DD string) |

### Patterns

- All form inputs use `name` attribute matching the formData key
- Single `handleInputChange` handler for all inputs (checkbox → checked, others → value)
- Tailwind utility classes for all styling; no inline styles
- Card pattern: `bg-white p-5 rounded-xl shadow-sm border border-slate-100`

## Implementation Steps

1. `git init` + create `.gitignore`
2. Create `package.json` with exact dependency versions above
3. Create `vite.config.js` — react + tailwindcss plugins
4. Create `index.html` — Vite entry, title "睡眠日誌"
5. Create `src/main.jsx` — React 19 createRoot
6. Create `src/index.css` — `@import "tailwindcss"` + extracted global CSS
7. Create `src/App.jsx` — original component, remove `<style jsx global>` block
8. `npm install`
9. `npm run dev` — verify app runs
10. Commit

## Verification

- `npm run dev` starts without errors
- All three tabs render correctly (早上填寫 / 睡前填寫 / 歷史/匯出)
- Toggle switch, rating buttons (1-5), and date picker are functional
- Save → reload → data persists
- CSV export downloads a valid file
- `npm run build` produces a working `dist/` bundle
