import React from 'react';
import { Activity } from '../types';
import { Card } from './Card';
import { TrophyIcon } from './icons/TrophyIcon';
import { PodiumIcon } from './icons/PodiumIcon';
import { CertificateIcon } from './icons/CertificateIcon';
import { QuizIcon } from './icons/QuizIcon';
import { ProjectIcon } from './icons/ProjectIcon';

interface AchievementListProps {
  activities: Activity[];
  onViewCertificate: (activity: Activity) => void;
}

const getCompetitionStyle = (status?: 'pending' | 'approved' | 'rejected'): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
        borderWidth: '2px',
        position: 'relative',
    };

    if (status === 'pending') {
        return {
            ...baseStyle,
            borderColor: 'rgba(252, 211, 77, 0.5)',
            background: 'linear-gradient(to top right, rgba(252, 211, 77, 0.2), rgba(252, 211, 77, 0.05))',
        };
    }
    if (status === 'rejected') {
        return {
            ...baseStyle,
            borderColor: 'rgba(239, 68, 68, 0.5)',
            background: 'linear-gradient(to top right, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))',
        };
    }
    
    // Default (approved)
    return {
        ...baseStyle,
        borderColor: 'var(--color-accent-secondary)',
        background: 'linear-gradient(to top right, rgba(var(--color-accent-secondary-rgb), 0.3), rgba(var(--color-accent-secondary-rgb), 0.1))',
    };
}

interface ActivityItemProps {
    activity: Activity;
    onViewCertificate: (activity: Activity) => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, onViewCertificate }) => {
    const [displayPoints, setDisplayPoints] = React.useState(0);
    const pointsRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (pointsRef.current) {
            pointsRef.current.classList.remove('animate-point-pop');
            void pointsRef.current.offsetWidth;
            pointsRef.current.classList.add('animate-point-pop');
        }

        let start = 0;
        const end = activity.points;
        if (start === end) {
            setDisplayPoints(end);
            return;
        };

        const duration = 800;
        let startTimestamp: number | null = null;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const nextValue = Math.floor(progress * (end - start) + start);
            setDisplayPoints(nextValue);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        
        window.requestAnimationFrame(step);
    }, [activity.points]);


    if (activity.type === 'competition' || activity.type === 'project') {
        const isProject = activity.type === 'project';
        return (
            <div className="flex items-start p-3 rounded-lg animate-fade-in transition-all duration-300 hover:shadow-lg hover:-translate-y-1" style={getCompetitionStyle(activity.status)}>
                <div className="mr-4 shrink-0 mt-1" style={{ color: 'var(--color-text-main)', opacity: 0.7 }}>
                  {isProject ? <ProjectIcon className="w-6 h-6" /> : <PodiumIcon className="w-6 h-6" />}
                </div>
                <div className="flex-grow">
                    <p className="font-medium" style={{ color: 'var(--color-text-main)' }}>{activity.text}</p>
                    <div className="flex items-center flex-wrap gap-x-3 text-xs mt-1" style={{ color: 'var(--color-text-main)', opacity: 0.7 }}>
                        {!isProject && <span className="font-semibold capitalize">{activity.competitionLevel}</span>}
                        {!isProject && <span className="capitalize px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(var(--color-text-main-rgb), 0.1)', color: 'var(--color-text-main)' }}>{activity.result}</span>}
                        {isProject && <span className="font-semibold">Project Submission</span>}
                        <span>{activity.timestamp.toLocaleDateString()}</span>
                    </div>
                     {activity.status && (
                        <div className="flex items-center gap-4 mt-2">
                             <span className={`text-xs font-bold capitalize px-2 py-0.5 rounded-full ${activity.status === 'pending' ? 'bg-yellow-400/50 text-yellow-800' : activity.status === 'rejected' ? 'bg-red-400/50 text-red-900' : ''}`}>
                                {activity.status}
                            </span>
                            {(activity.certificateUrl || activity.projectSubmissionUrl) && (
                                <button onClick={() => onViewCertificate(activity)} className="flex items-center gap-1 text-sm hover:underline" style={{ color: 'var(--color-text-main)' }}>
                                    <CertificateIcon className="w-4 h-4"/>
                                    View {isProject ? 'Submission' : 'Certificate'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
                 {activity.status === 'approved' && (
                     <div ref={pointsRef} className="flex items-center font-bold text-lg ml-2 self-center" style={{ color: 'var(--color-primary)' }}>
                        +{displayPoints}
                     </div>
                 )}
            </div>
        );
    }

    if (activity.type === 'quiz' && activity.quizDetails) {
        return (
            <div className="flex items-start p-3 rounded-lg border-2 animate-fade-in transition-all duration-300 hover:shadow-lg hover:-translate-y-1" style={{ backgroundColor: 'rgba(var(--color-accent-secondary-rgb), 0.2)', borderColor: 'var(--color-accent-secondary)' }}>
                <div className="mr-3 shrink-0 mt-1" style={{ color: 'var(--color-text-main)' }}>
                    <QuizIcon className="w-5 h-5" />
                </div>
                <div className="flex-grow">
                    <p className="font-medium" style={{ color: 'var(--color-text-main)' }}>{activity.text}</p>
                    <div className="flex items-center flex-wrap gap-x-3 text-xs mt-1" style={{ color: 'var(--color-text-main)', opacity: 0.8 }}>
                        <span>Score: {activity.quizDetails.score}/{activity.quizDetails.totalQuestions}</span>
                        <span>{activity.timestamp.toLocaleDateString()}</span>
                    </div>
                </div>
                <div ref={pointsRef} className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>+{displayPoints} pts</div>
            </div>
        );
    }

    // Default 'goal' type
    return (
        <div className="flex items-center p-3 rounded-lg border-2 animate-fade-in transition-all duration-300 hover:shadow-lg hover:-translate-y-1" style={{ backgroundColor: 'rgba(var(--color-accent-secondary-rgb), 0.2)', borderColor: 'var(--color-accent-secondary)'}}>
            <div className="mr-3 shrink-0" style={{ color: 'var(--color-text-main)' }}>
                <TrophyIcon className="w-5 h-5" />
            </div>
            <div className="flex-grow">
                <p className="font-medium" style={{ color: 'var(--color-text-main)' }}>{activity.text}</p>
                <p className="text-xs" style={{ color: 'rgba(var(--color-text-main-rgb), 0.7)' }}>Completed on {activity.timestamp.toLocaleDateString()}</p>
            </div>
            <div ref={pointsRef} className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>+{displayPoints} pts</div>
        </div>
    );
};

export const AchievementList = ({ activities, onViewCertificate }: AchievementListProps) => {
    const approved = activities
        .filter(act => (act.type === 'goal' && act.completed) || ((act.type === 'competition' || act.type === 'project') && act.status === 'approved') || act.type === 'quiz')
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const pending = activities
        .filter(act => (act.type === 'competition' || act.type === 'project') && act.status === 'pending')
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    const rejected = activities
        .filter(act => (act.type === 'competition' || act.type === 'project') && act.status === 'rejected')
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
    const submissions = [...pending, ...rejected];


  return (
    <Card title="My Activities">
      <div className="space-y-6 overflow-y-auto max-h-[500px] pr-2">
        {submissions.length > 0 && (
            <div>
                <h3 className="font-bold text-md mb-2" style={{ color: 'var(--color-text-main)' }}>Submissions</h3>
                <div className="space-y-3">
                    {submissions.map((activity) => (
                        <ActivityItem key={activity.id} activity={activity} onViewCertificate={onViewCertificate} />
                    ))}
                </div>
            </div>
        )}

        <div>
            <h3 className="font-bold text-md mb-2" style={{ color: 'var(--color-text-main)' }}>Achievements</h3>
            {approved.length > 0 ? (
              <div className="space-y-3">
                {approved.map((achievement) => (
                  <ActivityItem key={achievement.id} activity={achievement} onViewCertificate={onViewCertificate} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-8" style={{ color: 'rgba(var(--color-text-main-rgb), 0.6)' }}>
                 <svg className="w-16 h-16 mb-4" style={{ color: 'rgba(var(--color-text-main-rgb), 0.2)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="font-semibold" style={{ color: 'var(--color-text-main)' }}>No achievements yet.</p>
                <p className="text-sm">Complete a goal or log a competition!</p>
              </div>
            )}
        </div>
      </div>
    </Card>
  );
};