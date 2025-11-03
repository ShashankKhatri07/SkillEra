import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { validateText } from '../../utils/validationUtils';

interface ProjectModalProps {
    project: Project | null;
    onSave: (projectData: Omit<Project, 'id' | 'members'> | Project) => void;
    onClose: () => void;
}

const InputField = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
        <label className="block text-sm font-medium mb-1 opacity-80">{label}</label>
        <input {...props} className="w-full rounded-lg p-2" style={{backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)'}} />
    </div>
);

const TextAreaField = ({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <div>
        <label className="block text-sm font-medium mb-1 opacity-80">{label}</label>
        <textarea {...props} rows={3} className="w-full rounded-lg p-2 resize-y" style={{backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)'}} />
    </div>
);

export const ProjectModal = ({ project, onSave, onClose }: ProjectModalProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [skills, setSkills] = useState(''); // Comma-separated
    const [points, setPoints] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (project) {
            setTitle(project.title);
            setDescription(project.description);
            setSkills(project.skills.join(', '));
            setPoints(project.points.toString());
        }
    }, [project]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const titleError = validateText(title, 'Project title');
        if (titleError) { setError(titleError); return; }
        
        const descError = validateText(description, 'Project description');
        if (descError) { setError(descError); return; }

        const pointsNum = parseInt(points, 10);
        if (isNaN(pointsNum) || pointsNum <= 0) {
            setError('Please enter a valid positive number for points.');
            return;
        }

        const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
        if (skillsArray.length === 0) {
            setError('Please provide at least one skill.');
            return;
        }

        const projectData = { title, description, skills: skillsArray, points: pointsNum, mentors: [] };
        
        if (project) {
            onSave({ ...projectData, id: project.id, members: project.members });
        } else {
            onSave(projectData);
        }
    };
    
    const modalTitle = project ? 'Edit Project' : 'Add New Project';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-scale-in" style={{ backgroundColor: 'var(--color-bg-main)', border: '1px solid var(--color-border)' }} onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-6">{modalTitle}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <TextAreaField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    <InputField label="Skills (comma-separated)" value={skills} onChange={(e) => setSkills(e.target.value)} required placeholder="e.g., React, UI/UX, Teamwork" />
                    <InputField label="Points Awarded" value={points} onChange={(e) => setPoints(e.target.value)} required type="number" />

                    {error && <p className="text-sm text-red-400">{error}</p>}
                     <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="w-full font-semibold py-2 px-4 rounded-lg transition-colors hover:bg-white/10" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', color: 'var(--color-text-main)' }}>
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="w-full font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-transform active:scale-95"
                            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-primary-text)' }}
                        >
                            Save Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
