import { useRef, useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';

export function ListView() {
  const { tasks, view, completeTask, deleteTask, setCurrentTaskIndex, setView } = useTaskStore();
  const listRef = useRef<HTMLUListElement>(null);
  const firstItemRef = useRef<HTMLLIElement>(null);

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  useEffect(() => {
    if (view === 'list' && firstItemRef.current) {
      firstItemRef.current.focus();
    }
  }, [view]);

  if (view !== 'list') return null;

  return (
    <div
      className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full overflow-y-auto"
      role="region"
      aria-label="Task list"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold" style={{ fontSize: '24pt', color: 'var(--text)' }}>
          Tasks
        </h2>
        <button
          onClick={() => setView('focus')}
          className="px-4 py-2 rounded-lg font-bold text-sm"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'white',
            minHeight: '44px',
            minWidth: '44px',
          }}
          aria-label="Return to focus view"
        >
          ← Focus
        </button>
      </div>

      {activeTasks.length === 0 && completedTasks.length === 0 ? (
        <p style={{ fontSize: '16pt', color: 'var(--text-secondary)' }} className="text-center py-12">
          No tasks yet. Press <kbd className="px-2 py-0.5 rounded border" style={{ borderColor: 'var(--border)' }}>N</kbd> to add one.
        </p>
      ) : (
        <>
          {activeTasks.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold mb-3" style={{ fontSize: '14pt', color: 'var(--text-secondary)' }}>
                Active ({activeTasks.length})
              </h3>
              <ul ref={listRef} className="space-y-2" role="list" aria-label="Active tasks">
                {activeTasks.map((task, index) => (
                  <li
                    key={task.id}
                    ref={index === 0 ? firstItemRef : undefined}
                    tabIndex={0}
                    role="listitem"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg border"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: 'var(--bg-secondary)',
                      minHeight: '44px',
                    }}
                    aria-label={`${task.text}. Press Space to complete, D to delete.`}
                    onKeyDown={(e) => {
                      if (e.key === ' ') {
                        e.preventDefault();
                        completeTask(task.id);
                      } else if (e.key === 'd' || e.key === 'D') {
                        e.preventDefault();
                        deleteTask(task.id);
                      } else if (e.key === 'Enter') {
                        e.preventDefault();
                        setCurrentTaskIndex(index);
                        setView('focus');
                      }
                    }}
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
            </div>
          )}

          {completedTasks.length > 0 && (
            <div>
              <h3 className="font-bold mb-3" style={{ fontSize: '14pt', color: 'var(--text-secondary)' }}>
                Completed ({completedTasks.length})
              </h3>
              <ul className="space-y-2" role="list" aria-label="Completed tasks">
                {completedTasks.slice(-10).map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg border opacity-60"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: 'var(--bg-secondary)',
                      minHeight: '44px',
                    }}
                    role="listitem"
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
        </>
      )}
    </div>
  );
}