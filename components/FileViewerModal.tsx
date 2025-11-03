import React from 'react';

interface FileViewerModalProps {
  fileUrl: string;
  onClose: () => void;
  // FIX: Added optional title prop to fix type error when passing title from parent components.
  title?: string;
}

export const FileViewerModal = ({ fileUrl, onClose, title = "Document Viewer" }: FileViewerModalProps) => {
  const isImage = fileUrl.startsWith('data:image');
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[100] p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col relative animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold text-lg" style={{color: 'var(--color-text-main)'}}>{title}</h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200">
                <svg className="w-6 h-6" style={{ color: 'var(--color-text-main)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <div className="flex-grow p-2 bg-slate-100">
             {isImage ? (
                <img 
                    src={fileUrl} 
                    alt="Uploaded content"
                    className="w-full h-full object-contain"
                />
             ) : (
                <iframe 
                    src={fileUrl} 
                    title={title}
                    className="w-full h-full border-0"
                />
             )}
        </div>
      </div>
    </div>
  );
};