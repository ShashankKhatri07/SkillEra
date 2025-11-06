import React, { useState } from 'react';
import { Project } from '../types';
import { ProjectIcon } from './icons/ProjectIcon';
import { fileToBase64 } from '../utils/fileUtils';

interface SubmitProjectModalProps {
    project: Project;
    onClose: () => void;
    onSubmit: (submissionBase64: string) => void;
}

export const SubmitProjectModal = ({ project, onClose, onSubmit }: SubmitProjectModalProps) => {
    const [submissionFile, setSubmissionFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState('');

     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFileError('');
        if (file) {
            // Allow more file types for projects
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setFileError('File size should not exceed 5MB.');
                setSubmissionFile(null);
                return;
            }
            setSubmissionFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!submissionFile) {
            setFileError('A submission file is required.');
            return;
        }
        const submissionBase64 = await fileToBase64(submissionFile);
        onSubmit(submissionBase64);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-scale-in" onClick={e => e.stopPropagation()}>
                 <div className="flex items-center mb-6">
                    <div className="p-2 rounded-lg mr-4" style={{ backgroundColor: 'rgba(230, 230, 250, 0.8)', color: 'var(--color-text-main)' }}>
                        <ProjectIcon className="w-6 h-6"/>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-main)' }}>Submit Project: {project.title}</h2>
                        <p className="text-sm" style={{ color: 'rgba(var(--color-text-main-rgb), 0.7)' }}>Upload your project file (e.g., PDF, ZIP, image).</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="project-file" className="block text-sm font-medium mb-1">Submission File</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md" style={{ borderColor: 'rgba(var(--color-text-main-rgb), 0.3)' }}>
                            <div className="space-y-1 text-center">
                                 <div className="mx-auto" style={{ color: 'rgba(var(--color-text-main-rgb), 0.4)' }}>
                                  <ProjectIcon className="h-12 w-12"/>
                                </div>
                                <div className="flex text-sm" style={{ color: 'rgba(var(--color-text-main-rgb), 0.8)' }}>
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium hover:opacity-80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2" style={{ color: 'var(--color-primary)', '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}>
                                        <span>{submissionFile ? 'Change file' : 'Upload a file'}</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                    </label>
                                </div>
                                <p className="text-xs" style={{ color: 'rgba(var(--color-text-main-rgb), 0.6)' }}>{submissionFile ? submissionFile.name : 'Any file up to 5MB'}</p>
                            </div>
                        </div>
                        {fileError && <p className="text-xs text-red-500 mt-1">{fileError}</p>}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="w-full bg-slate-200 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-transform active:scale-95" style={{ color: 'var(--color-text-main)' }}>
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={!submissionFile}
                            className="w-full text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-transform active:scale-95 disabled:bg-slate-400"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                            Submit for Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};