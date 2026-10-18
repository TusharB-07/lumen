import { create } from 'zustand';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
}

interface TaskState {
  tasks: Task[];
  currentTaskIndex: number;
  fontSize: number;
  theme: 'warm' | 'high-contrast';
  view: 'focus' | 'list';
  showShortcuts: boolean;
  isAdding: boolean;
  isListening: boolean;
  isVoiceMode: boolean;

  // Actions
  addTask: (text: string) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  setCurrentTaskIndex: (index: number) => void;
  setFontSize: (size: number) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  toggleTheme: () => void;
  setView: (view: 'focus' | 'list') => void;
  toggleShortcuts: () => void;
  setIsAdding: (isAdding: boolean) => void;
  setIsListening: (isListening: boolean) => void;
  setIsVoiceMode: (isVoiceMode: boolean) => void;
  getCurrentTask: () => Task | null;
  getActiveTasks: () => Task[];
}

const FONT_MIN = 32;
const FONT_MAX = 48;
const FONT_STEP = 4;

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(`lumen-${key}`);
    if (stored !== null) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return defaultValue;
}

function saveToStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(`lumen-${key}`, JSON.stringify(value));
  } catch {
    // Ignore storage errors
  }
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: loadFromStorage<Task[]>('tasks', []),
  currentTaskIndex: loadFromStorage<number>('currentTaskIndex', 0),
  fontSize: loadFromStorage<number>('fontSize', 32),
  theme: loadFromStorage<'warm' | 'high-contrast'>('theme', 'warm'),
  view: 'focus',
  showShortcuts: false,
  isAdding: false,
  isListening: false,
  isVoiceMode: false,

  addTask: (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    };

    set((state) => {
      const newTasks = [...state.tasks, newTask];
      saveToStorage('tasks', newTasks);
      return { tasks: newTasks, isAdding: false };
    });
  },

  completeTask: (id: string) => {
    set((state) => {
      const newTasks = state.tasks.map((task) =>
        task.id === id
          ? { ...task, completed: true, completedAt: Date.now() }
          : task
      );

      const activeTasks = newTasks.filter((t) => !t.completed);
      const currentIndex = state.currentTaskIndex;

      let newIndex = currentIndex;
      if (activeTasks.length === 0) {
        newIndex = 0;
      } else if (currentIndex >= activeTasks.length) {
        newIndex = activeTasks.length - 1;
      }

      saveToStorage('tasks', newTasks);
      saveToStorage('currentTaskIndex', newIndex);

      return {
        tasks: newTasks,
        currentTaskIndex: newIndex,
        view: activeTasks.length === 0 ? 'list' : state.view,
      };
    });
  },

  deleteTask: (id: string) => {
    set((state) => {
      const taskIndex = state.tasks.findIndex((t) => t.id === id);
      const isActive = !state.tasks[taskIndex]?.completed;

      const newTasks = state.tasks.filter((task) => task.id !== id);

      let newIndex = state.currentTaskIndex;
      if (isActive) {
        const activeTasks = newTasks.filter((t) => !t.completed);
        if (activeTasks.length === 0) {
          newIndex = 0;
        } else if (state.currentTaskIndex >= activeTasks.length) {
          newIndex = activeTasks.length - 1;
        }
      }

      saveToStorage('tasks', newTasks);
      saveToStorage('currentTaskIndex', newIndex);

      return { tasks: newTasks, currentTaskIndex: newIndex };
    });
  },

  setCurrentTaskIndex: (index: number) => {
    set((state) => {
      const activeTasks = state.tasks.filter((t) => !t.completed);
      const clampedIndex = Math.max(0, Math.min(index, activeTasks.length - 1));
      saveToStorage('currentTaskIndex', clampedIndex);
      return { currentTaskIndex: clampedIndex };
    });
  },

  setFontSize: (size: number) => {
    const clamped = Math.max(FONT_MIN, Math.min(FONT_MAX, size));
    saveToStorage('fontSize', clamped);
    set({ fontSize: clamped });
  },

  increaseFontSize: () => {
    const { fontSize } = get();
    const newSize = Math.min(FONT_MAX, fontSize + FONT_STEP);
    saveToStorage('fontSize', newSize);
    set({ fontSize: newSize });
  },

  decreaseFontSize: () => {
    const { fontSize } = get();
    const newSize = Math.max(FONT_MIN, fontSize - FONT_STEP);
    saveToStorage('fontSize', newSize);
    set({ fontSize: newSize });
  },

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'warm' ? 'high-contrast' : 'warm';
      saveToStorage('theme', newTheme);
      return { theme: newTheme };
    });
  },

  setView: (view: 'focus' | 'list') => {
    set({ view });
  },

  toggleShortcuts: () => {
    set((state) => ({ showShortcuts: !state.showShortcuts }));
  },

  setIsAdding: (isAdding: boolean) => {
    set({ isAdding });
  },

  setIsListening: (isListening: boolean) => {
    set({ isListening });
  },

  setIsVoiceMode: (isVoiceMode: boolean) => {
    set({ isVoiceMode });
  },

  getCurrentTask: () => {
    const { tasks, currentTaskIndex } = get();
    const activeTasks = tasks.filter((t) => !t.completed);
    return activeTasks[currentTaskIndex] || null;
  },

  getActiveTasks: () => {
    const { tasks } = get();
    return tasks.filter((t) => !t.completed);
  },
}));