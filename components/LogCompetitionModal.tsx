import React, { useState, useMemo } from 'react';
import { CompetitionLevel, CompetitionResult } from '../types';
import { PodiumIcon } from './icons/PodiumIcon';
import { CertificateIcon } from './icons/CertificateIcon';
import { fileToBase64 } from '../utils/fileUtils';


interface LogCompetitionModalProps {
  onClose: () => void;
  onSubmit: (level: CompetitionLevel, result: CompetitionResult, points: number, certificateBase64: string) => void;
}

const competitionLevels: CompetitionLevel[] = ['interhouse', 'cluster', 'district', 'state', 'national', 'international'];
const competitionPoints: Record<CompetitionLevel, { participated: number; won: number }> = {
    interhouse: { participated: 5, won: 10 },
    cluster: { participated: 15, won: 30 },
    district: { participated: 25, won: 50 },
    state: { participated: 35, won: 70 },
    national: { participated: 45, won: 90 },
    international: { participated: 60, won: 120 },
};

export const LogCompetitionModal = ({ onClose, onSubmit }: LogCompetitionModalProps) => {
    const [level, setLevel] = useState<CompetitionLevel>('interhouse');
    const [result, setResult] = useState<CompetitionResult>('participated');
    const [certificateFile, setCertificateFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState('');

    const points = useMemo(() => {
        return competitionPoints[level][result];
    }, [level, result]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFileError('');
        if (file) {
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                setFileError('Please upload a JPEG or PNG image.');
                setCertificateFile(null);
                return;
            }
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                setFileError('File size should not exceed 2MB.');
                setCertificateFile(null);
                return;
            }
            setCertificateFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!certificateFile) {
            setFileError('A certificate upload is required.');
            return;
        }
        const certificateBase64 = await fileToBase64(certificateFile);
        onSubmit(level, result, points, certificateBase64);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-scale-in" onClick={e => e.stopPropagation()}>
                <div className="flex items-center mb-6">
                    <div className="p-2 rounded-lg mr-4" style={{ backgroundColor: 'rgba(230, 230, 250, 0.8)', color: 'var(--color-text-main)' }}>
                        <PodiumIcon className="w-6 h-6"/>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-main)' }}>Log Competition Achievement</h2>
                        <p className="text-sm" style={{ color: 'rgba(var(--color-text-main-rgb), 0.7)' }}>Record your participation or victory.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="level" className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-main)' }}>Competition Level</label>
                        <select
                            id="level"
                            value={level}
                            onChange={e => setLevel(e.target.value as CompetitionLevel)}
                            className="w-full rounded-lg p-2 focus:ring-2 focus:border-transparent transition duration-150 ease-in-out bg-white"
                            style={{ '--tw-ring-color': 'var(--color-accent)', borderColor: 'rgba(var(--color-text-main-rgb), 0.3)' } as React.CSSProperties}
                        >
                            {competitionLevels.map(l => <option key={l} value={l} className="capitalize">{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                        </select>
                    </div>

                     <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-main)' }}>Result</label>
                        <div className="flex gap-4">
                           <label className="flex items-center">
                             <input type="radio" name="result" value="participated" checked={result === 'participated'} onChange={() => setResult('participated')} className="h-4 w-4 border-gray-300 focus:ring-transparent" style={{ color: 'var(--color-primary)' }}/>
                             <span className="ml-2 text-sm" style={{ color: 'var(--color-text-main)' }}>Participated</span>
                           </label>
                           <label className="flex items-center">
                             <input type="radio" name="result" value="won" checked={result === 'won'} onChange={() => setResult('won')} className="h-4 w-4 border-gray-300 focus:ring-transparent" style={{ color: 'var(--color-primary)' }}/>
                             <span className="ml-2 text-sm" style={{ color: 'var(--color-text-main)' }}>Won</span>
                           </label>
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="certificate" className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-main)' }}>Upload Certificate (Required)</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md" style={{ borderColor: 'rgba(var(--color-text-main-rgb), 0.3)' }}>
                            <div className="space-y-1 text-center">
                                <div className="mx-auto" style={{ color: 'rgba(var(--color-text-main-rgb), 0.4)' }}>
                                  <CertificateIcon className="h-12 w-12"/>
                                </div>
                                <div className="flex text-sm" style={{ color: 'rgba(var(--color-text-main-rgb), 0.8)' }}>
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium hover:opacity-80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2" style={{ color: 'var(--color-primary)', '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}>
                                        <span>{certificateFile ? 'Change file' : 'Upload a file'}</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/jpeg,image/png" onChange={handleFileChange} />
                                    </label>
                                </div>
                                <p className="text-xs" style={{ color: 'rgba(var(--color-text-main-rgb), 0.6)' }}>{certificateFile ? certificateFile.name : 'JPEG or PNG up to 2MB'}</p>
                            </div>
                        </div>
                        {fileError && <p className="text-xs text-red-500 mt-1">{fileError}</p>}
                    </div>


                    <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'rgba(var(--color-text-main-rgb), 0.05)' }}>
                        <p className="text-sm" style={{ color: 'rgba(var(--color-text-main-rgb), 0.8)' }}>Points to be awarded:</p>
                        <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{points}</p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="w-full bg-slate-200 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-transform active:scale-95" style={{ color: 'var(--color-text-main)' }}>
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={!certificateFile}
                            className="w-full text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-transform active:scale-95 disabled:bg-slate-400 disabled:cursor-not-allowed"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                            Log Achievement
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};