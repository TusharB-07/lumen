import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTaskStore } from '../store/taskStore';

const shortcuts = [
  { key: 'N', description: 'Add new task' },
  { key: 'Space', description: 'Complete current task' },
  { key: 'D', description: 'Delete current task' },
  { key: ']', description: 'Increase text size' },
  { key: '[', description: 'Decrease text size' },
  { key: 'C', description: 'Toggle high contrast' },
  { key: 'L', description: 'Toggle list view' },
  { key: '↑ / ↓', description: 'Navigate tasks (in list)' },
  { key: 'V', description: 'Voice add task' },
  { key: '?', description: 'Show/hide shortcuts' },
];

export function ShortcutOverlay() {
  const { showShortcuts, toggleShortcuts } = useTaskStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showShortcuts && overlayRef.current) {
      overlayRef.current.focus();
    }
  }, [showShortcuts]);

  if (!showShortcuts) return null;

  const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      ref={overlayRef}
      className="fixed inset-0 flex items-center justify-center px-4 z-50"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      initial={shouldReduceMotion ? {} : { opacity: 0 }}
      animate={shouldReduceMotion ? {} : { opacity: 1 }}
      exit={shouldReduceMotion ? {} : { opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === e.currentTarget) toggleShortcuts();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') toggleShortcuts();
      }}
    >
      <motion.div
        className="w-full max-w-md p-6 rounded-xl border shadow-lg"
        style={{
          backgroundColor: 'var(--bg)',
          borderColor: 'var(--border)',
        }}
        initial={shouldReduceMotion ? {} : { scale: 0.95, opacity: 0 }}
        animate={shouldReduceMotion ? {} : { scale: 1, opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold" style={{ fontSize: '18pt', color: 'var(--text)' }}>
            Keyboard Shortcuts
          </h2>
          <button
            onClick={toggleShortcuts}
            className="px-3 py-1 rounded-lg border font-bold"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text)',
              minHeight: '44px',
              minWidth: '44px',
            }}
            aria-label="Close shortcuts"
          >
            ✕
          </button>
        </div>
        <dl className="space-y-3" role="list">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.key}
              className="flex items-center justify-between gap-4"
              role="listitem"
            >
              <dt>
                <kbd
                  className="inline-block px-3 py-1 rounded font-bold border"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                    fontSize: '12pt',
                    minWidth: '44px',
                    textAlign: 'center',
                  }}
                >
                  {shortcut.key}
                </kbd>
              </dt>
              <dd className="flex-1 text-right" style={{ fontSize: '14pt', color: 'var(--text)' }}>
                {shortcut.description}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          Press <kbd className="px-2 py-0.5 rounded border" style={{ borderColor: 'var(--border)' }}>?</kbd> or Escape to close
        </p>
      </motion.div>
    </motion.div>
  );
}
