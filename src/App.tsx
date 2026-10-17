import { useEffect } from 'react';
import { useTaskStore } from './store/taskStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Header } from './components/Header';
import { FocusView } from './components/FocusView';
import { ListView } from './components/ListView';
import { AddTask } from './components/AddTask';
import { ShortcutOverlay } from './components/ShortcutOverlay';

function App() {
  const { theme } = useTaskStore();

  useEffect(() => {
    if (theme === 'high-contrast') {
      document.documentElement.setAttribute('data-theme', 'high-contrast');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  useKeyboardShortcuts();

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Header />

      <main
        id="main-content"
        className="flex-1 flex flex-col overflow-hidden"
        role="main"
        aria-label="Task workspace"
      >
        <FocusView />
        <ListView />
      </main>

      <footer
        className="flex items-center justify-center gap-4 px-4 py-2 border-t text-sm"
        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        role="contentinfo"
      >
        <span>
          <kbd className="px-1.5 py-0.5 rounded border text-xs" style={{ borderColor: 'var(--border)' }}>N</kbd> Add
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded border text-xs" style={{ borderColor: 'var(--border)' }}>Space</kbd> Complete
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded border text-xs" style={{ borderColor: 'var(--border)' }}>C</kbd> Contrast
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded border text-xs" style={{ borderColor: 'var(--border)' }}>?</kbd> Help
        </span>
      </footer>

      <AddTask />
      <ShortcutOverlay />
    </div>
  );
}

export default App;