import { useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';
import { AddTask } from './components/AddTask';

function App() {
  const { theme, tasks, currentTaskIndex, setView, view, getCurrentTask, completeTask, deleteTask } = useTaskStore();

  useEffect(() => {
    if (theme === 'high-contrast') {
      document.documentElement.setAttribute('data-theme', 'high-contrast');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  const currentTask = getCurrentTask();
  const activeTasks = tasks.filter((t) => !t.completed);

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg)' }}
        role="banner"
      >
        <h1 className="font-bold" style={{ fontSize: '18pt', color: 'var(--text)' }}>
          <span style={{ color: 'var(--accent)' }}>◉</span> Lumen
        </h1>
        <nav className="flex items-center gap-2" aria-label="App controls">
          <button
            onClick={() => setView(view === 'focus' ? 'list' : 'focus')}
            className="px-3 py-2 rounded-lg font-bold text-sm border"
            style={{ borderColor: 'var(--border)', color: 'var(--text)', minHeight: '44px', minWidth: '44px' }}
            aria-label={view === 'focus' ? 'Open task list' : 'Return to focus view'}
          >
            {view === 'focus' ? '☰ List' : '◉ Focus'}
          </button>
        </nav>
      </header>

      <main id="main-content" className="flex-1 flex flex-col overflow-hidden" role="main" aria-label="Task workspace">
        {view === 'focus' ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
            {currentTask ? (
              <div
                className="text-center max-w-4xl mx-auto"
                style={{ fontSize: '32pt', color: 'var(--text)', lineHeight: '1.3' }}
              >
                {currentTask.text}
              </div>
            ) : (
              <div className="text-center">
                <div style={{ fontSize: '48pt', color: 'var(--text-secondary)' }} aria-hidden="true">◉</div>
                <p className="font-bold mt-6" style={{ fontSize: '28pt', color: 'var(--text)' }}>All clear</p>
                <p className="mt-4" style={{ fontSize: '16pt', color: 'var(--text-secondary)' }}>
                  Press N to add a task
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full overflow-y-auto">
            <h2 className="font-bold mb-6" style={{ fontSize: '24pt', color: 'var(--text)' }}>Tasks</h2>
            {activeTasks.length === 0 ? (
              <p style={{ fontSize: '16pt', color: 'var(--text-secondary)' }} className="text-center py-12">
                No tasks yet. Press N to add one.
              </p>
            ) : (
              <ul className="space-y-2" role="list">
                {activeTasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg border"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)', minHeight: '44px' }}
                  >
                    <button
                      onClick={() => completeTask(task.id)}
                      className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: 'var(--accent)', minWidth: '44px', minHeight: '44px' }}
                      aria-label={`Complete task: ${task.text}`}
                    >
                      <span style={{ color: 'var(--accent)' }}>○</span>
                    </button>
                    <span className="flex-1" style={{ fontSize: '16pt', color: 'var(--text)' }}>
                      {task.text}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="flex-shrink-0 px-2 py-1 rounded text-sm"
                      style={{ color: 'var(--danger)', minHeight: '44px', minWidth: '44px' }}
                      aria-label={`Delete task: ${task.text}`}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tasks.filter((t) => t.completed).length > 0 && view === 'list' && (
          <div className="px-4 pb-8 max-w-2xl mx-auto w-full">
            <h3 className="font-bold mb-3 mt-6" style={{ fontSize: '14pt', color: 'var(--text-secondary)' }}>
              Completed ({tasks.filter((t) => t.completed).length})
            </h3>
            <ul className="space-y-2" role="list">
              {tasks.filter((t) => t.completed).map((task) => (
                <li
                  key={task.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border opacity-60"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)', minHeight: '44px' }}
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center" style={{ borderColor: 'var(--accent)' }}>
                    <span style={{ color: 'var(--accent)' }}>✓</span>
                  </span>
                  <span className="flex-1 line-through" style={{ fontSize: '16pt', color: 'var(--text-secondary)' }}>
                    {task.text}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex-shrink-0 px-2 py-1 rounded text-sm"
                    style={{ color: 'var(--danger)', minHeight: '44px', minWidth: '44px' }}
                    aria-label={`Delete completed task: ${task.text}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <footer
        className="flex items-center justify-center gap-4 px-4 py-2 border-t text-sm"
        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        role="contentinfo"
      >
        <span><kbd className="px-1.5 py-0.5 rounded border text-xs" style={{ borderColor: 'var(--border)' }}>N</kbd> Add</span>
        <span><kbd className="px-1.5 py-0.5 rounded border text-xs" style={{ borderColor: 'var(--border)' }}>Space</kbd> Complete</span>
        <span><kbd className="px-1.5 py-0.5 rounded border text-xs" style={{ borderColor: 'var(--border)' }}>C</kbd> Contrast</span>
        <span><kbd className="px-1.5 py-0.5 rounded border text-xs" style={{ borderColor: 'var(--border)' }}>?</kbd> Help</span>
      </footer>

      <AddTask />
    </div>
  );
}

export default App;