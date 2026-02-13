# Sleep Journal — AI Development Guide

## Project Overview

Single-page React app for sleep tracking. No backend, no router, no auth. All state lives in localStorage.

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # Production build
npm run preview   # Preview production build
```

## Architecture

- **Single component**: Everything lives in `src/App.jsx` (`SleepDiaryApp`). Three tabs are rendered conditionally via `activeTab` state (`'morning'` | `'evening'` | `'history'`).
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` plugin. Global styles (toggle switch, fade-in animation, safe-area padding) are in `src/index.css`.
- **Icons**: `lucide-react` — imported individually (Moon, Sun, Save, Calendar, etc.).
- **No router**: Tab switching is internal state, not URL-based.

## Key Patterns

- **Form handling**: Single `handleInputChange` handles all inputs. Uses `e.target.name` to match `formData` keys. Checkboxes use `checked`, everything else uses `value`.
- **localStorage key**: `sleep_diary_entries` — stores `{ [YYYY-MM-DD]: FormData }` object.
- **Auto-save**: `useEffect` syncs `entries` state to localStorage on every change.
- **Date loading**: When `selectedDate` changes, existing entry is loaded or form resets to `initialFormState`.
- **Card pattern**: `bg-white p-5 rounded-xl shadow-sm border border-slate-100` used throughout.
- **CSV export**: BOM prefix (`\uFEFF`) for Excel Chinese support. Filename: `睡眠日誌匯出_YYYY-MM-DD.csv`.

## Conventions

- Tailwind utility classes only — no inline styles, no CSS modules.
- All UI text is in Traditional Chinese (zh-TW).
- Follow Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.
