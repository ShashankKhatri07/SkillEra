import React from 'react';

export const LevelUpIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M12 5l-7 7h4v5h6v-5h4z" />
        <path d="M12 3v2" />
        <path d="M19 12h2" />
        <path d="M5 12H3" />
        <path d="M12 21v-2" />
    </svg>
);