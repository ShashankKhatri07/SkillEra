import React from 'react';

export const MasterBadgeIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
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
        <path d="M12.33 2.1c.34-.58.12-1.33-.49-1.68-.6-.36-1.35-.13-1.68.49L5.3 11.27a.8.8 0 0 0-.1.52c0 .28.16.53.4.67l.23.14c.24.14.53.1.72-.1z"/>
        <path d="m20.94 13.53-5.2-10.42c-.34-.58-.12-1.33.49-1.68.6-.36 1.35-.13 1.68.49l5.2 10.42c.34.58.12 1.33-.49 1.68-.2.12-.43.18-.66.18a1 1 0 0 1-.84-.47z"/>
        <path d="M17.33 21.9c-.34.58-.12 1.33.49 1.68.6.36 1.35-.13 1.68-.49l4.86-9.72a.8.8 0 0 0-.1-.9c-.14-.24-.4-.4-.68-.4h-.24c-.28 0-.53.16-.67.4z"/>
        <path d="M6.67 21.9c.34.58.12 1.33-.49 1.68-.6.36-1.35-.13-1.68-.49L-.36 13.37a.8.8 0 0 1 .1-.9c.14-.24.4-.4.68-.4h.24c.28 0 .53.16.67.4z"/>
    </svg>
);