import React from 'react';
import { Student } from '../../types';
import { Card } from '../Card';
import { TrophyIcon } from '../icons/TrophyIcon';
import { getUserLevelInfo } from '../../utils/levelUtils';

interface TopStudentsProps {
    students: Student[];
}

const getRankColor = (rank: number) => {
    if (rank === 0) return 'var(--color-primary)';
    if (rank === 1) return 'var(--color-accent-secondary)';
    if (rank === 2) return 'var(--color-accent)';
    return 'rgba(255, 255, 255, 0.1)';
}

export const TopStudents: React.FC<TopStudentsProps> = ({ students }) => {
    return (
        <Card title="Top Performing Students" icon={<TrophyIcon />}>
            <div className="space-y-3">
                {students.map((student, index) => {
                    const levelInfo = getUserLevelInfo(student.points);
                    return (
                        <div key={student.id} className="flex items-center p-2 rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 flex-shrink-0" style={{ backgroundColor: getRankColor(index), color: 'var(--color-bg-main)' }}>
                                {index + 1}
                            </div>
                            <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full mr-3" />
                            <div className="flex-grow">
                                <p className="font-semibold">{student.name}</p>
                                <p className="text-xs opacity-70">Level {levelInfo.level} - {levelInfo.name}</p>
                            </div>
                            <p className="font-bold text-lg" style={{ color: getRankColor(index) }}>{student.points} pts</p>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};