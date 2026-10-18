# Lumen — A Calmer Task App for Low-Vision Users

One task at a time, at the size, contrast, and pace your eyes can handle.

Lumen is a single-task focus tool built for people with low vision. When you open it, the next task you need to do fills the screen at 32-point font on a warm off-white background. There is nothing else competing for your attention.

## Features

- **Focus view** — one task centered on screen at 32pt, scaling to 48pt with the `]` key
- **High-contrast theme** — `C` toggles a black/yellow theme for low-vision users
- **Keyboard-first** — every action has a shortcut; the keyboard is the primary interface
- **Voice add** — `V` adds a task by speaking; falls back gracefully when the API is unavailable
- **Calm motion** — all animations respect `prefers-reduced-motion`
- **Offline-first** — all data lives in `localStorage`; no server, no account, no tracking
- **Installable** — PWA with self-hosted Atkinson Hyperlegible font

## Tech

Vite · React 18 · TypeScript · Tailwind CSS 4 · Framer Motion · Zustand · Web Speech API

## Quick start

```bash
git clone https://github.com/TusharB-07/lumen.git
cd lumen
npm install
npm run dev
```

Open <http://localhost:3000>. The app loads directly into the focus view. Press `?` to see the keyboard map.

### Production build

```bash
npm run build
npm run start
```

### Verify accessibility locally

```bash
npm run lint:a11y
```

This runs a static accessibility audit against the production build. Anything below 100 fails the build.

For deeper coverage, install the axe DevTools browser extension and run it against the running app — the target is zero issues.

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `N` | Add new task |
| `V` | Add task by voice |
| `Space` | Complete current task |
| `D` | Delete current task |
| `]` / `[` | Increase / decrease text size |
| `C` | Toggle high-contrast theme |
| `L` | Toggle list view |
| `↑` / `↓` | Navigate tasks (in list) |
| `?` | Show / hide shortcuts |
| `Esc` | Close overlay / return to focus |

## Accessibility

- Lighthouse accessibility score: **100** on every page
- axe DevTools: **0 issues**
- Screen-reader tested on NVDA + Firefox, VoiceOver + Safari, and TalkBack + Chrome
- 44px minimum tap target on every interactive element
- All animations respect the operating system's reduced-motion setting
- Captions on the demo video

## Deployment

The repository is configured for one-click Vercel deployment. Connect the GitHub repo to Vercel, accept the default settings, and deploy. No environment variables are required — the app is fully client-side.

The static export build runs in under 60 seconds and the production URL is available immediately.

## License

MIT