import React, { useState } from 'react';
import { Project } from '../types';
import { validateText } from '../utils/validationUtils';
import { ProjectIcon } from './icons/ProjectIcon';

interface SubmitProjectModalProps {
    project: Project;
    onClose: () => void;
    onSubmit: (submissionUrl: string) => void;
}

export const SubmitProjectModal = ({ project, onClose, onSubmit }: SubmitProjectModalProps) => {
    const [submissionUrl, setSubmissionUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationError = validateText(submissionUrl, 'Submission Link/Text');
        if (validationError) {
            setError(validationError);
            return;
        }
        
        // Basic URL validation
        try {
            // This will throw an error for non-URL text, which is fine if we allow text submissions.
            // For stricter validation, you might add regex.
            if (submissionUrl.startsWith('http')) {
                 new URL(submissionUrl);
            }
        } catch (_) {
            setError('Please enter a valid URL (e.g., http://github.com/...) or a text description of your submission.');
            return;
        }

        setError('');
        onSubmit(submissionUrl);
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
                        <p className="text-sm" style={{ color: 'rgba(var(--color-text-main-rgb), 0.7)' }}>Provide a link to your work (e.g., GitHub, Google Drive).</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="submission-url" className="block text-sm font-medium mb-1">Submission Link or Text</label>
                        <textarea
                            id="submission-url"
                            rows={3}
                            value={submissionUrl}
                            onChange={(e) => {
                                setSubmissionUrl(e.target.value);
                                if (error) setError('');
                            }}
                            required
                            className="w-full rounded-lg p-2 border border-slate-300 bg-white"
                            placeholder="e.g., https://github.com/your-repo/..."
                        />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="w-full bg-slate-200 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-transform active:scale-95" style={{ color: 'var(--color-text-main)' }}>
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="w-full text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-transform active:scale-95"
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