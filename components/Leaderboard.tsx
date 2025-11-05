import React from 'react';
import { Student } from '../types';
import { Card } from './Card';
import { TrophyIcon } from './icons/TrophyIcon';
import { PointsIcon } from './icons/PointsIcon';
import { getUserLevelInfo } from '../utils/levelUtils';


interface LeaderboardProps {
  students: Student[];
}

const getRankStyle = (rank: number): React.CSSProperties => {
    switch (rank) {
        case 0: return { backgroundColor: 'var(--color-accent-secondary)', color: 'var(--color-text-main)' };
        case 1: return { backgroundColor: 'var(--color-accent)', color: 'var(--color-text-main)' };
        case 2: return { backgroundColor: 'var(--color-bg-main)', color: 'var(--color-text-main)', border: '1px solid var(--color-accent)' };
        default: return { backgroundColor: 'rgba(var(--color-text-main-rgb), 0.1)', color: 'var(--color-text-main)' };
    }
}

export const Leaderboard = ({ students }: LeaderboardProps) => {
  const sortedStudents = [...students]
    .filter(student => student.role === 'student')
    .sort((a, b) => b.points - a.points);

  return (
    <Card title="Leaderboard" icon={<TrophyIcon />}>
      <div className="space-y-3">
        {sortedStudents.map((student, index) => {
          const levelInfo = getUserLevelInfo(student.points);
          return (
            <div key={student.id} className="flex items-center bg-white/50 p-2 rounded-lg transition-all duration-200 hover:shadow-md hover:bg-white/80 hover:-translate-y-px">
              <div className="w-8 h-8 flex-shrink-0 mr-3 rounded-full flex items-center justify-center font-bold text-sm" style={getRankStyle(index)}>
                {index + 1}
              </div>
              <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
              <div className="flex-grow">
                <p className="font-semibold" style={{ color: 'var(--color-text-main)' }}>{student.name}</p>
                <p className="text-xs font-medium" style={{ color: 'var(--color-text-main)', opacity: 0.8 }}>Level {levelInfo.level} - {levelInfo.name}</p>
              </div>
              <div className="flex items-center" style={{ color: 'var(--color-primary)' }}>
                  <PointsIcon className="w-5 h-5 mr-1"/>
                  <span className="font-bold">{student.points}</span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  );
};