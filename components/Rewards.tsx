import React from 'react';
import { Card } from './Card';
import { allBadges } from '../data/rewards';
import { TrophyIcon } from './icons/TrophyIcon';

interface RewardsProps {
  userPoints: number;
}

export const Rewards = ({ userPoints }: RewardsProps) => {
  return (
    <Card title="My Badges" icon={<TrophyIcon />}>
      <div className="grid grid-cols-2 gap-4 text-center">
        {allBadges.map(badge => {
          const isUnlocked = userPoints >= badge.pointsRequired;
          return (
            <div key={badge.id} className="flex flex-col items-center p-2 rounded-lg transition-all duration-300">
              <div className={`relative ${!isUnlocked ? 'grayscale opacity-40' : ''}`}>
                <div style={{ color: isUnlocked ? 'var(--color-primary)' : 'rgba(var(--color-text-main-rgb), 0.4)' }}>
                  <badge.icon className="w-16 h-16" />
                </div>
              </div>
              <p className="font-bold text-sm mt-2" style={{ color: isUnlocked ? 'var(--color-text-main)' : 'rgba(var(--color-text-main-rgb), 0.6)' }}>{badge.name}</p>
              <p className="text-xs" style={{ color: 'rgba(var(--color-text-main-rgb), 0.5)' }}>{isUnlocked ? 'Unlocked!' : `${badge.pointsRequired} pts`}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};