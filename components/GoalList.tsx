import React from 'react';
import { Activity } from '../types';
import { Card } from './Card';

interface GoalListProps {
  activities: Activity[];
  completeGoal: (id: string) => void;
}

export const GoalList = ({ activities, completeGoal }: GoalListProps) => {
  const activeGoals = activities.filter(activity => activity.type === 'goal' && !activity.completed);

  return (
    <Card title="Current Goals">
      <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2">
        {activeGoals.length > 0 ? (
          activeGoals.map((goal) => (
            <div key={goal.id} className="flex items-center justify-between p-3 rounded-lg animate-fade-in" style={{ backgroundColor: 'rgba(var(--color-text-main-rgb), 0.05)' }}>
              <span style={{ color: 'var(--color-text-main)' }}>{goal.text}</span>
              <button
                onClick={() => completeGoal(goal.id)}
                className="group p-1.5 rounded-full hover:bg-[var(--color-accent-2)] transition-colors duration-200"
                aria-label="Complete goal"
              >
                <svg className="w-6 h-6 group-hover:text-[var(--color-primary)] transition-colors" style={{ color: 'rgba(var(--color-text-main-rgb), 0.5)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-8" style={{ color: 'rgba(var(--color-text-main-rgb), 0.6)' }}>
            <svg className="w-16 h-16 mb-4" style={{ color: 'rgba(var(--color-text-main-rgb), 0.2)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            <p className="font-semibold" style={{ color: 'var(--color-text-main)' }}>All goals achieved!</p>
            <p className="text-sm">Time to set a new challenge.</p>
          </div>
        )}
      </div>
    </Card>
  );
};
