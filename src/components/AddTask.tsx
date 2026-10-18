import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTaskStore } from '../store/taskStore';

export function AddTask() {
  const { isAdding, setIsAdding, addTask, isListening, setIsListening, isVoiceMode, setIsVoiceMode } = useTaskStore();
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const hasSpeechAPI = typeof window !== 'undefined' && 
    ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, [setIsListening]);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      inputRef.current?.focus();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsListening(false);
      // Auto-submit after voice input
      setTimeout(() => {
        if (transcript.trim()) {
          addTask(transcript);
          setInputValue('');
          setIsAdding(false);
          setIsVoiceMode(false);
        }
      }, 500);
    };

    recognition.onerror = () => {
      setIsListening(false);
      inputRef.current?.focus();
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [setIsListening, addTask, setIsAdding, setIsVoiceMode]);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
    // Auto-start voice when triggered via V key
    if (isAdding && isVoiceMode && hasSpeechAPI) {
      startListening();
    }
  }, [isAdding, isVoiceMode, hasSpeechAPI, startListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTask(inputValue);
      setInputValue('');
      setIsVoiceMode(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setInputValue('');
    setIsVoiceMode(false);
    stopListening();
  };

  if (!isAdding) return null;

  const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center px-4 z-40"
      style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
      initial={shouldReduceMotion ? {} : { opacity: 0 }}
      animate={shouldReduceMotion ? {} : { opacity: 1 }}
      exit={shouldReduceMotion ? {} : { opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label="Add new task"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCancel();
      }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-6 rounded-xl border shadow-lg"
        style={{
          backgroundColor: 'var(--bg)',
          borderColor: 'var(--border)',
        }}
        initial={shouldReduceMotion ? {} : { scale: 0.95, opacity: 0 }}
        animate={shouldReduceMotion ? {} : { scale: 1, opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
      >
        <label
          htmlFor="task-input"
          className="block font-bold mb-3"
          style={{ fontSize: '14pt', color: 'var(--text)' }}
        >
          {isVoiceMode ? '🎤 Voice Input' : 'New Task'}
        </label>
        <div className="flex gap-3">
          <input
            ref={inputRef}
            id="task-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isListening ? 'Listening...' : 'What needs to be done?'}
            className="flex-1 px-4 py-3 rounded-lg border font-atkinson"
            style={{
              fontSize: '14pt',
              backgroundColor: 'var(--bg-secondary)',
              borderColor: isListening ? 'var(--accent)' : 'var(--border)',
              color: 'var(--text)',
              minHeight: '44px',
            }}
            aria-describedby="task-input-help"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleCancel();
              }
            }}
          />
          {hasSpeechAPI && (
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className="px-4 py-3 rounded-lg border font-bold flex items-center justify-center transition-colors"
              style={{
                borderColor: isListening ? 'var(--accent)' : 'var(--border)',
                backgroundColor: isListening ? 'var(--accent)' : 'transparent',
                color: isListening ? 'white' : 'var(--text)',
                minHeight: '44px',
                minWidth: '44px',
              }}
              aria-label={isListening ? 'Stop listening' : 'Add task by voice'}
              aria-pressed={isListening}
            >
              {isListening ? (
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  🎙️
                </motion.span>
              ) : '🎤'}
            </button>
          )}
        </div>
        <p id="task-input-help" className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Press Enter to add, Escape to cancel
          {hasSpeechAPI && ' • Click 🎤 or press V to use voice'}
          {!hasSpeechAPI && ' • Voice input not available in this browser'}
        </p>
        {isListening && (
          <motion.div
            className="mt-3 p-3 rounded-lg text-center"
            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--accent)' }}
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={shouldReduceMotion ? {} : { opacity: 1 }}
            role="alert"
          >
            Listening... speak your task
          </motion.div>
        )}
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-3 rounded-lg font-bold"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'white',
              minHeight: '44px',
              fontSize: '14pt',
            }}
          >
            Add Task
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-3 rounded-lg font-bold border"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text)',
              minHeight: '44px',
              fontSize: '14pt',
            }}
          >
            Cancel
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
