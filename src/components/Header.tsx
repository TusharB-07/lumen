import { useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';

export function Header() {
  const { theme, toggleTheme, view, setView, getActiveTasks, toggleShortcuts } = useTaskStore();
  const activeTasks = getActiveTasks();

  return (
    <header
      className="flex items-center justify-between px-4 py-3 border-b"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg)' }}
      role="banner"
    >
      <div className="flex items-center gap-3">
        <h1 className="font-bold" style={{ fontSize: '18pt', color: 'var(--text)' }}>
          <span style={{ color: 'var(--accent)' }}>◉</span> Lumen
        </h1>
        {activeTasks.length > 0 && (
          <span
            className="text-sm px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
            aria-label={`${activeTasks.length} active tasks`}
          >
            {activeTasks.length}
          </span>
        )}
      </div>
      <nav className="flex items-center gap-2" aria-label="App controls">
        <button
          onClick={() => setView(view === 'focus' ? 'list' : 'focus')}
          className="px-3 py-2 rounded-lg font-bold text-sm border"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text)',
            minHeight: '44px',
            minWidth: '44px',
          }}
          aria-label={view === 'focus' ? 'Open task list' : 'Return to focus view'}
          aria-pressed={view === 'list'}
        >
          {view === 'focus' ? '☰ List' : '◉ Focus'}
        </button>
        <button
          onClick={toggleTheme}
          className="px-3 py-2 rounded-lg font-bold text-sm border"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text)',
            minHeight: '44px',
            minWidth: '44px',
          }}
          aria-label={`Switch to ${theme === 'warm' ? 'high contrast' : 'warm'} theme`}
          aria-pressed={theme === 'high-contrast'}
        >
          {theme === 'warm' ? '◐' : '◑'} Contrast
        </button>
        <button
          onClick={toggleShortcuts}
          className="px-3 py-2 rounded-lg font-bold text-sm border"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text)',
            minHeight: '44px',
            minWidth: '44px',
          }}
          aria-label="Show keyboard shortcuts"
        >
          ?
        </button>
      </nav>
    </header>
  );
}