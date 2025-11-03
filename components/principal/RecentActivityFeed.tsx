import React from 'react';
import { Student, Activity } from '../../types';
import { Card } from '../Card';
import { PodiumIcon } from '../icons/PodiumIcon';

interface RecentActivityFeedProps {
    activities: { student: Student; activity: Activity }[];
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ activities }) => {
    return (
        <Card title="Recent High-Value Achievements">
            <div className="space-y-4">
                {activities.length > 0 ? activities.map(({ student, activity }) => (
                    <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                        <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                            <p><span className="font-bold">{student.name}</span> <span className="opacity-70">earned</span> <span className="font-bold" style={{color: 'var(--color-primary)'}}>{activity.points} points</span></p>
                            <div className="flex items-center gap-2 text-sm opacity-90 mt-1">
                                <PodiumIcon className="w-4 h-4" />
                                <span>{activity.text}</span>
                            </div>
                        </div>
                    </div>
                )) : (
                    <p className="text-center py-4 opacity-70">No recent high-value achievements to show.</p>
                )}
            </div>
        </Card>
    );
};