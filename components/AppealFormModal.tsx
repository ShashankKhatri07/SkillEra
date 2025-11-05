import React, { useState } from 'react';
import { FileTextIcon } from './icons/FileTextIcon';
import { validateText } from '../utils/validationUtils';

interface AppealFormModalProps {
    onClose: () => void;
    onSubmit: (claimedPercentage: number, reason: string, answerSheetFile: File) => void;
}

export const AppealFormModal = ({ onClose, onSubmit }: AppealFormModalProps) => {
    const [claimedPercentage, setClaimedPercentage] = useState('');
    const [reason, setReason] = useState('');
    const [answerSheetFile, setAnswerSheetFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState('');
    const [validationError, setValidationError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFileError('');
        if (file) {
            if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
                setFileError('Please upload a JPEG, PNG, or PDF file.');
                setAnswerSheetFile(null);
                return;
            }
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                setFileError('File size should not exceed 2MB.');
                setAnswerSheetFile(null);
                return;
            }
            setAnswerSheetFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const reasonError = validateText(reason, 'Reason');
        if (reasonError) {
            setValidationError(reasonError);
            return;
        }
        setValidationError('');

        const percentage = parseFloat(claimedPercentage);
        if (isNaN(percentage) || percentage < 0 || percentage > 100) {
            setValidationError('Please enter a valid percentage between 0 and 100.');
            return;
        }
        if (!answerSheetFile) {
            setFileError('An answer sheet upload is required.');
            return;
        }
        onSubmit(percentage, reason, answerSheetFile);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-scale-in" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-main)' }}>File Academic Appeal</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="percentage" className="block text-sm font-medium mb-1">Claimed Percentage (%)</label>
                        <input
                            id="percentage"
                            type="number"
                            value={claimedPercentage}
                            onChange={e => setClaimedPercentage(e.target.value)}
                            min="0"
                            max="100"
                            step="0.01"
                            required
                            className="w-full rounded-lg p-2 border border-slate-300 bg-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="reason" className="block text-sm font-medium mb-1">Reason for Appeal</label>
                        <textarea
                            id="reason"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            required
                            rows={4}
                            className="w-full rounded-lg p-2 border border-slate-300 resize-y bg-white"
                            placeholder="Please provide a detailed reason for your appeal..."
                        />
                    </div>
                     <div>
                        <label htmlFor="answer-sheet" className="block text-sm font-medium mb-1">Upload Answer Sheet (Required)</label>
                         <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md" style={{ borderColor: 'rgba(var(--color-text-main-rgb), 0.3)' }}>
                            <div className="space-y-1 text-center">
                                <div className="mx-auto" style={{ color: 'rgba(var(--color-text-main-rgb), 0.4)' }}>
                                  <FileTextIcon className="h-12 w-12"/>
                                </div>
                                <div className="flex text-sm" style={{ color: 'rgba(var(--color-text-main-rgb), 0.8)' }}>
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium hover:opacity-80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2" style={{ color: 'var(--color-primary)', '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}>
                                        <span>{answerSheetFile ? 'Change file' : 'Upload file'}</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/jpeg,image/png,application/pdf" onChange={handleFileChange} />
                                    </label>
                                </div>
                                <p className="text-xs" style={{ color: 'rgba(var(--color-text-main-rgb), 0.6)' }}>{answerSheetFile ? answerSheetFile.name : 'PDF, PNG, JPG up to 2MB'}</p>
                            </div>
                        </div>
                        {fileError && <p className="text-xs text-red-500 mt-1">{fileError}</p>}
                    </div>
                    {validationError && <p className="text-sm text-red-600">{validationError}</p>}
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="w-full bg-slate-200 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300">
                            Cancel
                        </button>
                        <button type="submit" disabled={!answerSheetFile || !reason || !claimedPercentage} className="w-full text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 disabled:bg-slate-400" style={{ backgroundColor: 'var(--color-primary)' }}>
                            Submit Appeal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};