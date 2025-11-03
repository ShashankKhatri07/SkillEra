import React, { useState, useMemo } from 'react';
import { Appeal, Student, Activity } from '../types';
import { Card } from '../components/Card';
import { SchoolStats } from '../components/principal/SchoolStats';
import { TopStudents } from '../components/principal/TopStudents';
import { RecentActivityFeed } from '../components/principal/RecentActivityFeed';
import { FileViewerModal } from '../components/FileViewerModal';
import { FileTextIcon } from '../components/icons/FileTextIcon';


interface PrincipalDashboardPageProps {
    appeals: Appeal[];
    allStudents: Student[];
    onResolveAppeal: (appealId: string, status: 'approved' | 'rejected', newPercentage?: number) => void;
}

interface PrincipalAppealCardProps {
    appeal: Appeal;
    onResolve: (status: 'approved' | 'rejected', newPercentage?: number) => void;
}

const PrincipalAppealCard: React.FC<PrincipalAppealCardProps> = ({ appeal, onResolve }) => {
    const [newPercentage, setNewPercentage] = useState(appeal.claimedPercentage.toString());
    const [isResolving, setIsResolving] = useState(false);
    const [viewingFile, setViewingFile] = useState<string | null>(null);

    const handleApprove = () => {
        const percentage = parseFloat(newPercentage);
        if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
            onResolve('approved', percentage);
        }
    };

    return (
        <>
            {viewingFile && <FileViewerModal fileUrl={viewingFile} onClose={() => setViewingFile(null)} />}
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold">{appeal.studentName}</p>
                        <p className="text-sm opacity-90">Claimed Percentage: <span className="font-semibold">{appeal.claimedPercentage}%</span></p>
                        <p className="text-xs opacity-70">Submitted: {appeal.timestamp.toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${appeal.status === 'pending' ? 'bg-yellow-500/30 text-yellow-300' : appeal.status === 'approved' ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'}`}>
                        {appeal.status}
                    </span>
                </div>
                <p className="text-sm my-3 p-3 rounded bg-black/20 opacity-90">{appeal.reason}</p>
                {appeal.answerSheetUrl && (
                    <button 
                        onClick={() => setViewingFile(appeal.answerSheetUrl!)} 
                        className="flex items-center gap-2 text-sm font-semibold py-1 px-3 rounded-md mb-2" 
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--color-text-main)' }}>
                        <FileTextIcon className="w-4 h-4" />
                        View Answer Sheet
                    </button>
                )}

                {appeal.status === 'pending' && (
                    <div>
                        {!isResolving && (
                            <button onClick={() => setIsResolving(true)} className="text-sm font-semibold py-1 px-3 rounded-md" style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-primary-text)' }}>
                                Resolve
                            </button>
                        )}

                        {isResolving && (
                             <div className="mt-4 p-3 rounded-lg bg-black/20 space-y-3">
                                <label className="block text-sm font-medium">Set Final Percentage:</label>
                                 <input
                                    type="number"
                                    value={newPercentage}
                                    onChange={(e) => setNewPercentage(e.target.value)}
                                    className="w-full rounded-lg p-2 text-sm"
                                    style={{backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)'}}
                                 />
                                <div className="flex gap-2">
                                    <button onClick={() => onResolve('rejected')} className="flex-1 font-semibold py-2 px-3 rounded-md bg-red-500/80 text-white hover:bg-red-500/100 text-xs">Reject</button>
                                    <button onClick={handleApprove} className="flex-1 font-semibold py-2 px-3 rounded-md hover:opacity-90 text-xs" style={{ backgroundColor: 'var(--color-accent-secondary)', color: 'var(--color-primary-text)' }}>Approve & Update</button>
                                </div>
                             </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export const PrincipalDashboardPage = ({ appeals, allStudents, onResolveAppeal }: PrincipalDashboardPageProps) => {
    const studentUsers = useMemo(() => allStudents.filter(s => s.role === 'student'), [allStudents]);

    const stats = useMemo(() => {
        const totalPoints = studentUsers.reduce((sum, student) => sum + student.points, 0);
        const pendingVerifications = studentUsers.reduce((sum, student) => 
            sum + student.activities.filter(act => act.status === 'pending').length, 0
        );

        return {
            totalStudents: studentUsers.length,
            averagePoints: studentUsers.length > 0 ? Math.round(totalPoints / studentUsers.length) : 0,
            pendingVerifications,
            pendingAppeals: appeals.filter(a => a.status === 'pending').length,
        };
    }, [studentUsers, appeals]);
    
    const topStudents = useMemo(() => {
        return [...studentUsers].sort((a, b) => b.points - a.points).slice(0, 5);
    }, [studentUsers]);

    const recentHighValueActivities = useMemo(() => {
        const allActivities: { student: Student, activity: Activity }[] = [];
        studentUsers.forEach(student => {
            student.activities
                .filter(act => act.status === 'approved' && act.points >= 30) // Filter for high-value activities
                .forEach(activity => {
                    allActivities.push({ student, activity });
                });
        });
        return allActivities.sort((a, b) => b.activity.timestamp.getTime() - a.activity.timestamp.getTime()).slice(0, 5);
    }, [studentUsers]);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Principal's Command Center</h1>
            
            <SchoolStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    <TopStudents students={topStudents} />
                    <RecentActivityFeed activities={recentHighValueActivities} />
                </div>
                <div className="lg:col-span-1">
                     <Card title="Pending Academic Appeals">
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                            {stats.pendingAppeals > 0 ? (
                                appeals.filter(a => a.status === 'pending').map(appeal => (
                                    <PrincipalAppealCard key={appeal.id} appeal={appeal} onResolve={(status, newPercentage) => onResolveAppeal(appeal.id, status, newPercentage)} />
                                ))
                            ) : (
                                <p className="opacity-70 text-center py-4">No pending appeals.</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};