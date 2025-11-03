import React, { useState } from 'react';
import { Student, Activity } from '../../types';
import { ProfileCard } from '../../components/ProfileCard';
import { AchievementList } from '../../components/AchievementList';
import { Card } from '../../components/Card';
import { CertificateModal } from '../../components/CertificateModal';
import { PointsIcon } from '../../components/icons/PointsIcon';

interface StudentProfilePageProps {
    student: Student;
    onBack: () => void;
    onUpdateStudent: (studentId: string, updatedData: Partial<Student>) => void;
}

export const StudentProfilePage = ({ student, onBack, onUpdateStudent }: StudentProfilePageProps) => {
    const [viewingCertificate, setViewingCertificate] = useState<Activity | null>(null);
    const [isEditingPoints, setIsEditingPoints] = useState(false);
    const [editedPoints, setEditedPoints] = useState(student.points.toString());

    const achievements = student.activities
        .filter(g => g.completed)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        
    const handlePointsSave = () => {
        const newPoints = parseInt(editedPoints, 10);
        if (!isNaN(newPoints)) {
            onUpdateStudent(student.id, { points: newPoints });
        }
        setIsEditingPoints(false);
    };

    const cardStyle: React.CSSProperties = { 
        backgroundColor: 'var(--color-surface)', 
        borderColor: 'var(--color-border)' 
    };
    
    const inputStyle: React.CSSProperties = {
        backgroundColor: 'rgba(var(--color-text-main-rgb), 0.1)',
        color: 'var(--color-text-main)', 
        border: '1px solid var(--color-border)'
    };

    return (
        <div>
            {viewingCertificate && <CertificateModal achievement={viewingCertificate} onClose={() => setViewingCertificate(null)} />}
            <button onClick={onBack} className="mb-6 text-sm opacity-80 hover:opacity-100 transition-colors">&larr; Back to Dashboard</button>
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">{student.name}'s Profile</h1>
                    <p className="text-lg" style={{color: 'var(--color-text-muted)'}}>Class {student.class} - Section {student.section}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mt-6">
                <div className="lg:col-span-1 space-y-6">
                    <ProfileCard user={student} onUpdateUser={()=>{}} isAdmin={true} />
                    <Card title="Student Stats" style={cardStyle}>
                        <div className="space-y-2">
                           <div className="flex items-center justify-between">
                                <span className="font-semibold flex items-center gap-2"><PointsIcon className="w-5 h-5 opacity-70"/> Co-curricular Points</span>
                                {isEditingPoints ? (
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="number" 
                                            value={editedPoints}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedPoints(e.target.value)}
                                            className="w-20 rounded-md p-1 text-right"
                                            style={inputStyle}
                                        />
                                        <button onClick={handlePointsSave} className="text-sm font-bold" style={{ color: 'var(--color-accent)' }}>Save</button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-lg">{student.points}</span>
                                        <button onClick={() => { setIsEditingPoints(true); setEditedPoints(student.points.toString()); }} className="text-sm font-semibold opacity-70 hover:opacity-100" style={{ color: 'var(--color-accent)' }}>Edit</button>
                                    </div>
                                )}
                           </div>
                        </div>
                    </Card>
                     <Card title="About" style={cardStyle}>
                         <p className="whitespace-pre-wrap text-sm" style={{ color: 'var(--color-text-muted)' }}>
                            {student.bio || <span className="opacity-60">No bio provided.</span>}
                        </p>
                     </Card>
                     <Card title="Interests" style={cardStyle}>
                        <div className="flex flex-wrap gap-2">
                           {student.interests.map(interest => (
                                <div key={interest} className="text-sm font-medium pl-3 pr-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(var(--color-text-main-rgb), 0.1)', color: 'var(--color-text-main)' }}>
                                    <span>{interest}</span>
                                </div>
                            ))}
                            {student.interests.length === 0 && <span className="text-sm opacity-60">No interests added.</span>}
                        </div>
                     </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card title="Achievements" style={cardStyle} className="h-full">
                         <AchievementList activities={achievements} onViewCertificate={setViewingCertificate} />
                    </Card>
                </div>
            </div>
        </div>
    );
};