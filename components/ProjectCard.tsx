import React from 'react';
import { Project, Student } from '../types';
import { Card } from './Card';
import { PointsIcon } from './icons/PointsIcon';

interface ProjectCardProps {
    project: Project;
    currentUser: Student;
    onJoin: () => void;
    onSubmit: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, currentUser, onJoin, onSubmit }) => {
    const isMember = project.members.includes(currentUser.id);
    const hasSubmitted = currentUser.activities.some(
        act => act.type === 'project' && act.projectTitle === project.title
    );

    return (
        <Card className="flex flex-col h-full">
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <div className="flex items-center font-bold text-lg px-2 py-1 rounded-md" style={{ backgroundColor: 'rgba(var(--color-accent-secondary-rgb), 0.2)', color: 'var(--color-accent-secondary)'}}>
                        <PointsIcon className="w-5 h-5 mr-1"/>
                        <span>{project.points}</span>
                    </div>
                </div>
                <p className="text-sm mt-2 mb-4" style={{ color: 'var(--color-text-muted)' }}>{project.description}</p>
                <div className="flex flex-wrap gap-2">
                    {project.skills.map(skill => (
                        <span key={skill} className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(var(--color-text-main-rgb), 0.1)' }}>
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
            <div className="mt-6">
                {hasSubmitted ? (
                    <div className="w-full text-center font-semibold py-2 px-4 rounded-lg bg-green-100 text-green-800">
                        Submission Pending Review
                    </div>
                ) : isMember ? (
                    <button 
                        onClick={onSubmit}
                        className="w-full font-semibold py-2 px-4 rounded-lg hover:opacity-90"
                        style={{ backgroundColor: 'var(--color-accent-secondary)', color: 'var(--color-text-main)'}}
                    >
                        Submit Your Work
                    </button>
                ) : (
                    <button 
                        onClick={onJoin}
                        className="w-full font-semibold py-2 px-4 rounded-lg hover:opacity-90"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-text)'}}
                    >
                        Join Project
                    </button>
                )}
            </div>
        </Card>
    );
};
