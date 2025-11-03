import React from 'react';
import { Student } from '../../types';
import { getUserLevelInfo } from '../../utils/levelUtils';
import { PointsIcon } from '../icons/PointsIcon';
import { TrophyIcon } from '../icons/TrophyIcon';

interface StudentInfoCardProps {
    student: Student;
    onViewProfile: () => void;
}

export const StudentInfoCard: React.FC<StudentInfoCardProps> = ({ student, onViewProfile }) => {
  const levelInfo = getUserLevelInfo(student.points);
  
  return (
    <button onClick={onViewProfile} className="text-left w-full rounded-2xl p-4 shadow-md transition-transform hover:scale-105 relative border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-start gap-4">
        <img src={student.avatar} alt={student.name} className="w-16 h-16 rounded-full border-2" style={{ borderColor: 'var(--color-accent)' }}/>
        <div className="flex-1">
          <h3 className="font-bold text-lg">{student.name}</h3>
          <p className="text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>Level {levelInfo.level} - {levelInfo.name}</p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Class {student.class} - {student.section}</p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-center text-sm p-2 rounded-lg" style={{ backgroundColor: 'rgba(var(--color-text-main-rgb), 0.1)' }}>
            <span className="font-semibold opacity-80">Academic %</span>
            <span className="font-bold text-lg" style={{ color: 'var(--color-accent-secondary)' }}>{student.academicPercentage}%</span>
        </div>
        <div className="flex justify-between items-center text-sm p-2 rounded-lg" style={{ backgroundColor: 'rgba(var(--color-text-main-rgb), 0.1)' }}>
            <span className="font-semibold opacity-80">Total Points</span>
            <div className="flex items-center gap-1" style={{ color: 'var(--color-accent)' }}>
                <PointsIcon className="w-4 h-4" />
                <span className="font-bold text-lg">{student.points}</span>
            </div>
        </div>
        <div className="flex justify-between items-center text-sm p-2 rounded-lg" style={{ backgroundColor: 'rgba(var(--color-text-main-rgb), 0.1)' }}>
            <span className="font-semibold opacity-80">Achievements</span>
            <div className="flex items-center gap-1" style={{ color: 'var(--color-accent-secondary)' }}>
                <TrophyIcon className="w-4 h-4" />
                <span className="font-bold text-lg">{student.activities.filter(a => a.completed).length}</span>
            </div>
        </div>
      </div>
    </button>
  );
};