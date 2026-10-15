import { useState } from 'react';
import { useTaskStore } from '../store/taskStore';

export function AddTask() {
  const { isAdding, setIsAdding, addTask } = useTaskStore();
  const [inputValue, setInputValue] = useState('');

  if (!isAdding) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 z-40">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (inputValue.trim()) {
            addTask(inputValue);
            setInputValue('');
          }
        }}
        className="w-full max-w-lg p-6 rounded-xl border"
        style={{
          backgroundColor: 'var(--bg)',
          borderColor: 'var(--border)',
        }}
      >
        <label htmlFor="task-input" className="block font-bold mb-3" style={{ fontSize: '14pt' }}>
          New Task
        </label>
        <input
          id="task-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-3 rounded-lg border font-atkinson"
          style={{
            fontSize: '14pt',
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border)',
            color: 'var(--text)',
            minHeight: '44px',
          }}
          autoFocus
        />
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-3 rounded-lg font-bold"
            style={{ backgroundColor: 'var(--accent)', color: 'white', minHeight: '44px' }}
          >
            Add Task
          </button>
          <button
            type="button"
            onClick={() => { setIsAdding(false); setInputValue(''); }}
            className="px-4 py-3 rounded-lg font-bold border"
            style={{ borderColor: 'var(--border)', color: 'var(--text)', minHeight: '44px' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}