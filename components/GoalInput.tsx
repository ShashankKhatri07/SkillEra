import React, { useState } from 'react';
import { validateText } from '../utils/validationUtils';

interface GoalInputProps {
  addGoal: (text: string) => void;
}

export const GoalInput = ({ addGoal }: GoalInputProps) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateText(text, 'Goal');
    if (validationError) {
        setError(validationError);
        return;
    }

    if (text.trim()) {
      addGoal(text);
      setText('');
      setError('');
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-slate-200">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          className="w-full border-slate-300 rounded-lg p-3 focus:ring-2 focus:border-transparent transition duration-150 ease-in-out resize-none bg-white"
          style={{'--tw-ring-color': 'var(--color-accent)'} as React.CSSProperties}
          placeholder="What's your next personal goal?"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError('');
          }}
          rows={3}
        />
        {error && <p className="text-sm text-red-600 -mt-1">{error}</p>}
        <button
            type="submit"
            className="w-full text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform active:scale-95"
            style={{ backgroundColor: 'var(--color-primary)', '--tw-ring-color': 'var(--color-primary)'} as React.CSSProperties}
        >
            Set New Goal
        </button>
      </form>
    </div>
  );
};