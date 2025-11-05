import React from 'react';
import { Student, DailyQuest } from '../../types';
import { Card } from '../Card';

interface QuestVerificationQueueProps {
    submissions: { student: Student, quest: DailyQuest }[];
    onResolve: (studentId: string, status: 'approved' | 'rejected') => void;
}

const SubmissionItem: React.FC<{ submission: { student: Student, quest: DailyQuest }, onResolve: (status: 'approved' | 'rejected') => void }> = ({ submission, onResolve }) => {
    const { student, quest } = submission;

    return (
        <div className="p-4 rounded-lg flex flex-col gap-4" style={{ backgroundColor: 'rgba(var(--color-text-main-rgb), 0.1)' }}>
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full"/>
                    <div>
                        <p className="font-bold">{student.name}</p>
                        <p className="text-xs opacity-70">Quest: "{quest.text}"</p>
                    </div>
                </div>
                <div className="text-sm p-3 rounded bg-black/20 opacity-90 italic">
                    "{quest.submissionText}"
                </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 self-end">
                <button 
                    onClick={() => onResolve('rejected')}
                    className="font-semibold py-2 px-3 rounded-md bg-red-500/80 text-white hover:bg-red-500/100 text-xs"
                >
                    Reject
                </button>
                <button 
                    onClick={() => onResolve('approved')}
                    className="font-semibold py-2 px-3 rounded-md hover:opacity-90 text-xs"
                    style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-main)' }}
                >
                    Approve (+{quest.reward} pts)
                </button>
            </div>
        </div>
    );
};

export const QuestVerificationQueue = ({ submissions, onResolve }: QuestVerificationQueueProps) => {
    return (
        <Card title="Daily Quest Verifications">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {submissions.length > 0 ? (
                    submissions.map(submission => (
                        <SubmissionItem 
                            key={submission.student.id} // Assuming one pending quest per student
                            submission={submission} 
                            onResolve={(status) => onResolve(submission.student.id, status)}
                        />
                    ))
                ) : (
                    <p className="text-center py-4 opacity-70">The quest verification queue is empty.</p>
                )}
            </div>
        </Card>
    );
};