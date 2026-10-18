import { useEffect, useCallback } from 'react';
import { useTaskStore } from '../store/taskStore';

export function useKeyboardShortcuts() {
  const {
    addTask,
    completeTask,
    deleteTask,
    getCurrentTask,
    getActiveTasks,
    setCurrentTaskIndex,
    currentTaskIndex,
    increaseFontSize,
    decreaseFontSize,
    toggleTheme,
    setView,
    view,
    toggleShortcuts,
    showShortcuts,
    isAdding,
    setIsAdding,
    setIsVoiceMode,
  } = useTaskStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (isInput && !isAdding) return;
      if (isInput && e.key === 'Escape') {
        setIsAdding(false);
        return;
      }
      if (isInput && e.key !== 'Escape') return;

      switch (e.key) {
        case 'n':
        case 'N':
          e.preventDefault();
          setIsVoiceMode(false);
          setIsAdding(true);
          break;
        case 'v':
        case 'V':
          e.preventDefault();
          setIsVoiceMode(true);
          setIsAdding(true);
          break;
        case ' ':
          e.preventDefault();
          const currentTask = getCurrentTask();
          if (currentTask) completeTask(currentTask.id);
          break;
        case ']':
          e.preventDefault();
          increaseFontSize();
          break;
        case '[':
          e.preventDefault();
          decreaseFontSize();
          break;
        case 'c':
        case 'C':
          e.preventDefault();
          toggleTheme();
          break;
        case 'l':
        case 'L':
          e.preventDefault();
          setView(view === 'list' ? 'focus' : 'list');
          break;
        case '?':
          e.preventDefault();
          toggleShortcuts();
          break;
        case 'd':
        case 'D':
          e.preventDefault();
          const task = getCurrentTask();
          if (task) deleteTask(task.id);
          break;
        case 'ArrowDown':
          e.preventDefault();
          const activeTasks = getActiveTasks();
          if (currentTaskIndex < activeTasks.length - 1) {
            setCurrentTaskIndex(currentTaskIndex + 1);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (currentTaskIndex > 0) {
            setCurrentTaskIndex(currentTaskIndex - 1);
          }
          break;
        case 'Escape':
          if (showShortcuts) {
            toggleShortcuts();
          } else if (view === 'list') {
            setView('focus');
          }
          break;
      }
    },
    [addTask, completeTask, deleteTask, getCurrentTask, getActiveTasks, setCurrentTaskIndex, currentTaskIndex, increaseFontSize, decreaseFontSize, toggleTheme, setView, view, toggleShortcuts, showShortcuts, isAdding, setIsAdding, setIsVoiceMode]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}