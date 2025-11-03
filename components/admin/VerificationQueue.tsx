import React, { useState } from 'react';
import { Student, Activity } from '../../types';
import { Card } from '../Card';
import { CertificateModal } from '../CertificateModal';
import { CertificateIcon } from '../icons/CertificateIcon';
import { FileViewerModal } from '../FileViewerModal';
import { ProjectIcon } from '../icons/ProjectIcon';

interface VerificationQueueProps {
    submissions: { student: Student, activity: Activity }[];
    onResolve: (studentId: string, activityId: string, status: 'approved' | 'rejected') => void;
}

interface SubmissionItemProps {
    submission: { student: Student, activity: Activity };
    onResolve: (status: 'approved' | 'rejected') => void;
}

const SubmissionItem: React.FC<SubmissionItemProps> = ({ submission, onResolve }) => {
    const { student, activity } = submission;
    const [viewingFile, setViewingFile] = useState<Activity | null>(null);

    const isCompetition = activity.type === 'competition';
    const fileUrl = isCompetition ? activity.certificateUrl : activity.projectSubmissionUrl;
    const fileViewerTitle = isCompetition ? "Certificate Viewer" : "Project Submission Viewer";


    const handleViewFile = () => {
        setViewingFile(activity);
    }
    
    const handleCloseViewer = () => {
        setViewingFile(null);
    }

    return (
        <>
            {viewingFile && fileUrl && (
                 isCompetition ? 
                 <CertificateModal achievement={viewingFile} onClose={handleCloseViewer} /> :
                 <FileViewerModal fileUrl={fileUrl} onClose={handleCloseViewer} title={fileViewerTitle} />
            )}
            <div className="p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4" style={{ backgroundColor: 'rgba(var(--color-text-main-rgb), 0.1)' }}>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full"/>
                        <p className="font-bold">{student.name}</p>
                    </div>
                    <p className="font-semibold text-sm">{activity.text}</p>
                    {isCompetition ? (
                        <p className="text-xs opacity-70 capitalize">{activity.competitionLevel} - {activity.result}</p>
                    ) : (
                        <p className="text-xs opacity-70 capitalize">Project Submission</p>
                    )}
                    <p className="text-xs opacity-70">Claimed Points: <span className="font-bold">{activity.points}</span></p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {fileUrl && (
                        <button 
                            onClick={handleViewFile}
                            className="flex items-center gap-1 text-sm p-2 rounded-md transition-colors"
                            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--color-text-main)' }}
                        >
                            {isCompetition ? <CertificateIcon className="w-4 h-4" /> : <ProjectIcon className="w-4 h-4" />}
                            <span>View Proof</span>
                        </button>
                    )}
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
                        Approve
                    </button>
                </div>
            </div>
        </>
    );
};

export const VerificationQueue = ({ submissions, onResolve }: VerificationQueueProps) => {
    return (
        <Card title="Pending Submissions">
            <div className="space-y-3">
                {submissions.length > 0 ? (
                    submissions.map(submission => (
                        <SubmissionItem 
                            key={submission.activity.id} 
                            submission={submission} 
                            onResolve={(status) => onResolve(submission.student.id, submission.activity.id, status)}
                        />
                    ))
                ) : (
                    <p className="text-center py-4 opacity-70">The verification queue is empty.</p>
                )}
            </div>
        </Card>
    );
};