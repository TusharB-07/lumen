import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../store/taskStore';

export function FocusView() {
  const { getCurrentTask, fontSize, view, getActiveTasks } = useTaskStore();
  const task = getCurrentTask();
  const activeTasks = getActiveTasks();
  const taskRef = useRef<HTMLDivElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  // Announce task changes to screen readers
  useEffect(() => {
    if (task && liveRegionRef.current) {
      liveRegionRef.current.textContent = `Current task: ${task.text}. Task ${useTaskStore.getState().currentTaskIndex + 1} of ${activeTasks.length}.`;
    } else if (!task && liveRegionRef.current) {
      liveRegionRef.current.textContent = 'No active tasks. Press N to add a task.';
    }
  }, [task?.id, task?.text, activeTasks.length]);

  // Focus the task element when it changes
  useEffect(() => {
    if (task && taskRef.current) {
      taskRef.current.focus();
    }
  }, [task?.id]);

  if (view !== 'focus') return null;

  const shouldReduceMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-8 relative">
      {/* Screen reader live region */}
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      />

      {/* Task counter */}
      {activeTasks.length > 1 && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 text-sm px-3 py-1 rounded-full"
          style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)' }}
          aria-label={`Task ${useTaskStore.getState().currentTaskIndex + 1} of ${activeTasks.length}`}
        >
          {useTaskStore.getState().currentTaskIndex + 1} / {activeTasks.length}
        </div>
      )}

      <AnimatePresence mode="wait">
        {task ? (
          <motion.div
            key={task.id}
            ref={taskRef}
            role="article"
            aria-label={`Current task: ${task.text}`}
            tabIndex={0}
            className="text-center max-w-4xl mx-auto cursor-default select-none outline-none"
            style={{ fontSize: `${fontSize}pt` }}
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, y: -12 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.3,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <p className="leading-relaxed font-bold" style={{ color: 'var(--text)' }}>
              {task.text}
            </p>
            <motion.p
              className="mt-10 opacity-50"
              style={{ fontSize: '12pt', color: 'var(--text-secondary)' }}
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={shouldReduceMotion ? {} : { opacity: 0.5 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.5, duration: 0.3 }}
            >
              <kbd className="px-2 py-0.5 rounded border text-[10pt]" style={{ borderColor: 'var(--border)' }}>Space</kbd> complete
              {' · '}
              <kbd className="px-2 py-0.5 rounded border text-[10pt]" style={{ borderColor: 'var(--border)' }}>[ ]</kbd> size
              {' · '}
              <kbd className="px-2 py-0.5 rounded border text-[10pt]" style={{ borderColor: 'var(--border)' }}>D</kbd> delete
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            className="text-center"
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          >
            <div
              className="mb-6"
              style={{ fontSize: '48pt' }}
              aria-hidden="true"
            >
              ◉
            </div>
            <p
              className="font-bold"
              style={{ fontSize: '28pt', color: 'var(--text)' }}
            >
              All clear
            </p>
            <p
              className="mt-4"
              style={{ fontSize: '16pt', color: 'var(--text-secondary)' }}
            >
              Press <kbd className="px-2 py-0.5 rounded border" style={{ borderColor: 'var(--border)' }}>N</kbd> to add a task
            </p>
            <p
              className="mt-2"
              style={{ fontSize: '12pt', color: 'var(--text-secondary)', opacity: 0.7 }}
            >
              or <kbd className="px-2 py-0.5 rounded border" style={{ borderColor: 'var(--border)' }}>L</kbd> to see all tasks
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
