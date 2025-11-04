import React from 'react';

export const PaletteIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
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
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.667 0-.422-.163-.82-.437-1.125-.29-.289-.438-.652-.438-1.125s.148-.836.437-1.125c.274-.304.437-.703.437-1.125s-.163-.82-.437-1.125c-.29-.289-.438-.652-.438-1.125s.148-.836.437-1.125c.274-.304.437-.703.437-1.125C13.648 2.746 12.926 2 12 2z"/>
    </svg>
);