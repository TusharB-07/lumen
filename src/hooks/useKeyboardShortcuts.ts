import { useEffect, useCallback } from 'react';
import { useTaskStore } from '../store/taskStore';

export function useKeyboardShortcuts() {
  const {
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
    setIsAdding,
  } = useTaskStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (isInput && e.key !== 'Escape') return;
      if (isInput && e.key === 'Escape') {
        useTaskStore.setState({ isAdding: false });
        return;
      }

      switch (e.key) {
        case 'n':
        case 'N':
          e.preventDefault();
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
      }
    },
    [completeTask, deleteTask, getCurrentTask, getActiveTasks, setCurrentTaskIndex, currentTaskIndex, increaseFontSize, decreaseFontSize, toggleTheme, setView, view, setIsAdding]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}