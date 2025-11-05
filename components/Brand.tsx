import React from 'react';

const SkilleraLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" />
        <path fillRule="evenodd" clipRule="evenodd" d="M12 15.346L8.43825 17.5L9.3465 13.439L6 10.561L10.2191 10.22L12 6.5L13.7809 10.22L18 10.561L14.6535 13.439L15.5617 17.5L12 15.346Z" fill="white"/>
    </svg>
);


export const Brand = ({ theme = 'dark' }: { theme?: 'light' | 'dark' }) => {
    const textColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
    return (
        <div className="flex items-center gap-2">
            <SkilleraLogo className="h-8 w-auto text-indigo-600"/>
            <span className={`text-2xl font-bold ${textColor}`}>Skillera</span>
        </div>
    );
};
