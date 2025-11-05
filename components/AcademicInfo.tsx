import React from 'react';
import { Card } from './Card';

interface AcademicInfoProps {
  percentage: number;
}

const CircularProgressBar = ({ percentage }: { percentage: number }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getStrokeColor = (p: number) => {
    if (p >= 75) return 'var(--color-accent-secondary)'; // Green for good
    if (p >= 40) return 'var(--color-primary)'; // Navy for okay
    return 'var(--color-accent)'; // Pink for warning
  }

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="text-slate-200"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        {/* Progress circle */}
        <circle
          className={`progress-ring__circle--animated`}
          strokeWidth="10"
          strokeLinecap="round"
          stroke={getStrokeColor(percentage)}
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: circumference,
            '--stroke-offset': offset,
          } as React.CSSProperties}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color: 'var(--color-text-main)' }}>{percentage}%</span>
      </div>
    </div>
  );
};


export const AcademicInfo = ({ percentage }: AcademicInfoProps) => {
  return (
    <Card title="Academic Performance">
        <div className="flex flex-col items-center justify-center h-full">
            <CircularProgressBar percentage={percentage} />
            <p className="text-sm text-center mt-3" style={{ color: 'rgba(var(--color-text-main-rgb), 0.7)' }}>Your current aggregate percentage.</p>
        </div>
    </Card>
  );
};