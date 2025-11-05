import React, { useState } from 'react';
import { DailyQuest } from '../types';
import { validateText } from '../utils/validationUtils';
import { QuestIcon } from './icons/QuestIcon';

interface QuestSubmissionModalProps {
    quest: DailyQuest;
    onClose: () => void;
    onSubmit: (submissionText: string) => void;
}

export const QuestSubmissionModal = ({ quest, onClose, onSubmit }: QuestSubmissionModalProps) => {
    const [submissionText, setSubmissionText] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationError = validateText(submissionText, 'Submission text');
        if (validationError) {
            setError(validationError);
            return;
        }
        
        if (submissionText.trim().length < 10) {
            setError('Please provide a bit more detail in your submission (at least 10 characters).');
            return;
        }

        setError('');
        onSubmit(submissionText);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-scale-in" onClick={e => e.stopPropagation()}>
                 <div className="flex items-center mb-6">
                    <div className="p-2 rounded-lg mr-4" style={{ backgroundColor: 'rgba(230, 230, 250, 0.8)', color: 'var(--color-text-main)' }}>
                        <QuestIcon className="w-6 h-6"/>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-main)' }}>Complete Daily Quest</h2>
                        <p className="text-sm font-semibold" style={{ color: 'rgba(var(--color-text-main-rgb), 0.9)' }}>{quest.text}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="submission-text" className="block text-sm font-medium mb-1">How did you complete this quest?</label>
                        <textarea
                            id="submission-text"
                            rows={4}
                            value={submissionText}
                            onChange={(e) => {
                                setSubmissionText(e.target.value);
                                if (error) setError('');
                            }}
                            required
                            className="w-full rounded-lg p-2 border border-slate-300 bg-white"
                            placeholder="e.g., I completed my goal to read one chapter of my history book."
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
                            Submit for Verification
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};