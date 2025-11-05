import React, { useState } from 'react';
import { Project, Student } from '../types';
import { ProjectCard } from '../components/ProjectCard';
import { SubmitProjectModal } from '../components/SubmitProjectModal';

interface ProjectsPageProps {
    user: Student;
    projects: Project[];
    onJoinProject: (projectId: string) => void;
    onSubmitProject: (projectId: string, submissionUrl: string) => void;
}

export const ProjectsPage = ({ user, projects, onJoinProject, onSubmitProject }: ProjectsPageProps) => {
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [submittingProject, setSubmittingProject] = useState<Project | null>(null);

    const handleOpenSubmitModal = (project: Project) => {
        setSubmittingProject(project);
        setIsSubmitModalOpen(true);
    };
    
    const handleSubmit = (submissionUrl: string) => {
        if (submittingProject) {
            onSubmitProject(submittingProject.id, submissionUrl);
        }
        setIsSubmitModalOpen(false);
        setSubmittingProject(null);
    };

    return (
        <div className="space-y-6">
            {isSubmitModalOpen && submittingProject && (
                <SubmitProjectModal
                    project={submittingProject}
                    onClose={() => setIsSubmitModalOpen(false)}
                    onSubmit={handleSubmit}
                />
            )}
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold">Real-World Projects</h1>
                <p className="text-lg mt-1" style={{color: 'rgba(var(--color-text-main-rgb), 0.7)'}}>Apply your skills, collaborate, and earn points.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map(project => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        currentUser={user}
                        onJoin={() => onJoinProject(project.id)}
                        onSubmit={() => handleOpenSubmitModal(project)}
                    />
                ))}
            </div>
        </div>
    );
};
