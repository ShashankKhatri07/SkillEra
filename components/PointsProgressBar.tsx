import React from 'react';
import { Card } from './Card';
import { getUserLevelInfo, getNextLevelInfo } from '../utils/levelUtils';

interface PointsProgressBarProps {
  userPoints: number;
}

export const PointsProgressBar = ({ userPoints }: PointsProgressBarProps) => {
  const currentLevel = getUserLevelInfo(userPoints);
  const nextLevel = getNextLevelInfo(userPoints);

  const startPoints = currentLevel.pointsRequired;
  const targetPoints = nextLevel ? nextLevel.pointsRequired : currentLevel.pointsRequired;
  
  const progress = targetPoints > startPoints ? ((userPoints - startPoints) / (targetPoints - startPoints)) * 100 : 100;

  return (
    <Card>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
            {nextLevel ? (
                 <p className="text-sm font-semibold" style={{ color: 'var(--color-text-main)' }}>
                    Progress to <span className="font-bold">Level {nextLevel.level}: {nextLevel.name}</span>
                 </p>
            ) : (
                <p className="text-sm font-semibold" style={{ color: 'var(--color-accent-secondary)' }}>You've reached the maximum level!</p>
            )}
            <p className="text-sm font-bold" style={{ color: 'var(--color-text-main)' }}>{userPoints} / {targetPoints} pts</p>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-500 ease-out animate-shiny"
            style={{ 
                width: `${Math.max(0, Math.min(100, progress))}%`,
                backgroundColor: 'var(--color-primary)'
            }}
          ></div>
        </div>
      </div>
    </Card>
  );
};