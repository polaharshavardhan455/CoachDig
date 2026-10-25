# CoachDig — replacement starter

A polished React + TypeScript + Vite frontend for a coaching-institute discovery and comparison directory. The UI includes a dashboard, search/filterable directory, saved institutes, a three-item compare board, lightweight insights and a local admin workspace.

## Start locally on macOS

Requirements: Node.js 20+ recommended. **Run this through Terminal; do not double-click `index.html` or use VS Code Live Server.** A Vite React app must be served by Vite so TypeScript/JSX and CSS are processed correctly.

1. Extract this ZIP into your `Desktop` folder.
2. Open Terminal and run:

```bash
cd ~/Desktop/CoachDig-Replacement
npm install
npm run dev -- --open
```

Vite will print the local URL (usually `http://localhost:5173`) and try to open it in your browser. Keep that Terminal window running while you use the app.

### If the page is blank

- Stop the dev server with `Control + C`.
- Make sure Terminal is inside the `CoachDig-Replacement` folder (`pwd` should end with `/CoachDig-Replacement`).
- Run `npm install` and then `npm run dev -- --open` again.
- Open the URL printed by Vite, not the `index.html` file directly.
- If it is still blank, open browser developer tools with `Command + Option + J` and inspect the first red error in the Console.

## Production build

```bash
npm run build
npm run preview
```

## What is included

- Responsive dark-emerald UI with layered card styling, subtle perspective/3D effects, motion, focus states and reduced-motion support.
- Search across institute name, city, state, locality, category and exams.
- Filters for category, state and teaching mode; sorting by recommendation, rating, fees or name.
- Save/unsave institutes and compare up to three records.
- Detail modal with course focus, fee range, modes, status and data-quality reminder.
- Local admin form for creating, reviewing (demo status cycling) and deleting records.
- Local browser storage for edited listings and saved institutes.
- Strict TypeScript setup and Vite production build command.

## Important demo-data note

The starter records in `src/data/institutes.ts` are **fictional illustrative profiles**, not a verified directory of real Indian coaching institutes. Ratings, review counts and fee ranges are also examples. Do not publish these as factual institute listings. Before a public launch, replace them with source-backed records, store source URLs and checked dates, verify each field, deduplicate branches, and implement a server-side review workflow.

## Production-readiness notes

This is a frontend starter, not a deployed or secure production service. The admin experience is intentionally local-only and uses `localStorage`; it has no authentication or shared database. For a real multi-user release, add a backend (for example Supabase), access rules, server-side validation, protected admin roles, data provenance, monitoring and privacy/terms pages. Never put privileged service keys in browser code.

## Structure

```text
src/
  App.tsx             Main application, view state and interactions
  main.tsx            React entry point
  styles.css          Design system and responsive styling
  data/institutes.ts  Fictional starter dataset
  types/index.ts      Shared TypeScript model
```
