import React, { useState } from 'react';
import { Project } from '../../types';
import { Card } from '../../components/Card';
import { ProjectIcon } from '../../components/icons/ProjectIcon';
import { ProjectModal } from '../../components/admin/ProjectModal';
import { TrashIcon } from '../../components/icons/TrashIcon';

interface ManageProjectsPageProps {
    projects: Project[];
    onAddProject: (project: Omit<Project, 'id' | 'members'>) => void;
    onUpdateProject: (project: Project) => void;
    onDeleteProject: (projectId: string) => void;
}

export const ManageProjectsPage = ({ projects, onAddProject, onUpdateProject, onDeleteProject }: ManageProjectsPageProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingProject(null);
        setIsModalOpen(true);
    };

    const handleSave = (projectData: Omit<Project, 'id' | 'members'> | Project) => {
        if ('id' in projectData) {
            onUpdateProject(projectData);
        } else {
            onAddProject(projectData);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            {isModalOpen && (
                <ProjectModal
                    project={editingProject}
                    onSave={handleSave}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Projects</h1>
                <button
                    onClick={handleAdd}
                    className="font-semibold py-2 px-4 rounded-lg"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-text)' }}
                >
                    + Add Project
                </button>
            </div>
            <Card title="All Projects" icon={<ProjectIcon />}>
                <div className="space-y-3">
                    {projects.length > 0 ? projects.map(project => (
                        <div key={project.id} className="p-4 rounded-lg flex justify-between items-start" style={{ backgroundColor: 'rgba(var(--color-text-main-rgb), 0.05)' }}>
                            <div>
                                <h3 className="font-bold">{project.title}</h3>
                                <p className="text-sm opacity-80">{project.description.substring(0, 100)}...</p>
                                <p className="text-sm font-semibold mt-1" style={{color: 'var(--color-accent-secondary)'}}>{project.points} points</p>
                            </div>
                             <div className="flex items-center gap-2 flex-shrink-0">
                                <button onClick={() => handleEdit(project)} className="text-sm font-semibold opacity-70 hover:opacity-100" style={{ color: 'var(--color-primary)'}}>
                                    Edit
                                </button>
                                <button onClick={() => onDeleteProject(project.id)} className="text-red-500/70 hover:text-red-500/100 p-1 rounded-full">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center py-8 opacity-70">No projects have been created yet.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};