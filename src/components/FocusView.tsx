import { useRef, useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';

export function FocusView() {
  const { getCurrentTask, fontSize, view, getActiveTasks, currentTaskIndex } = useTaskStore();
  const task = getCurrentTask();
  const activeTasks = getActiveTasks();
  const taskRef = useRef<HTMLDivElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (task && liveRegionRef.current) {
      liveRegionRef.current.textContent = `Current task: ${task.text}. Task ${currentTaskIndex + 1} of ${activeTasks.length}.`;
    } else if (!task && liveRegionRef.current) {
      liveRegionRef.current.textContent = 'No active tasks. Press N to add a task.';
    }
  }, [task?.id, task?.text, activeTasks.length]);

  useEffect(() => {
    if (task && taskRef.current) {
      taskRef.current.focus();
    }
  }, [task?.id]);

  if (view !== 'focus') return null;

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-8 relative">
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      />

      {activeTasks.length > 1 && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 text-sm px-3 py-1 rounded-full"
          style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)' }}
          aria-label={`Task ${currentTaskIndex + 1} of ${activeTasks.length}`}
        >
          {currentTaskIndex + 1} / {activeTasks.length}
        </div>
      )}

      {task ? (
        <div
          ref={taskRef}
          role="article"
          aria-label={`Current task: ${task.text}`}
          tabIndex={0}
          className="text-center max-w-4xl mx-auto cursor-default select-none outline-none"
          style={{ fontSize: `${fontSize}pt`, color: 'var(--text)', lineHeight: '1.3' }}
        >
          <p className="font-bold">{task.text}</p>
          <p className="mt-10 opacity-50" style={{ fontSize: '12pt', color: 'var(--text-secondary)' }}>
            <kbd className="px-2 py-0.5 rounded border" style={{ borderColor: 'var(--border)' }}>Space</kbd> complete
            {' · '}
            <kbd className="px-2 py-0.5 rounded border" style={{ borderColor: 'var(--border)' }}>D</kbd> delete
          </p>
        </div>
      ) : (
        <div className="text-center">
          <div
            className="mb-6"
            style={{ fontSize: '48pt', color: 'var(--text-secondary)' }}
            aria-hidden="true"
          >
            ◉
          </div>
          <p className="font-bold" style={{ fontSize: '28pt', color: 'var(--text)' }}>
            All clear
          </p>
          <p className="mt-4" style={{ fontSize: '16pt', color: 'var(--text-secondary)' }}>
            Press <kbd className="px-2 py-0.5 rounded border" style={{ borderColor: 'var(--border)' }}>N</kbd> to add a task
          </p>
        </div>
      )}
    </div>
  );
}