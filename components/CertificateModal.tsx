import React from 'react';
import { Activity } from '../types';

interface CertificateModalProps {
  achievement: Activity;
  onClose: () => void;
}

export const CertificateModal = ({ achievement, onClose }: CertificateModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative animate-scale-in" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-4 -right-4 bg-white rounded-full p-2 z-20 shadow-lg">
            <svg className="w-6 h-6" style={{ color: 'var(--color-text-main)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="p-6">
            <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text-main)' }}>{achievement.text}</h3>
            <p className="text-sm capitalize" style={{ color: 'rgba(var(--color-text-main-rgb), 0.7)' }}>{achievement.competitionLevel} Level - {achievement.result}</p>
        </div>
        <div className="relative bg-slate-100 p-4">
             {achievement.certificateUrl ? (
                <img 
                    src={achievement.certificateUrl} 
                    alt={`Certificate for ${achievement.text}`}
                    className="w-full h-auto object-contain max-h-[60vh] rounded-lg shadow-md"
                />
             ) : (
                <div className="flex items-center justify-center h-64" style={{ color: 'rgba(var(--color-text-main-rgb), 0.7)' }}>
                    No certificate image available.
                </div>
             )}
        </div>
      </div>
    </div>
  );
};