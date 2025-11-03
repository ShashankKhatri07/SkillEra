import React from 'react';

export const LightbulbIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
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
    <path d="M15.09 16.05A6.5 6.5 0 0 1 8.94 9.91a6.51 6.51 0 0 1 8.6-5.41 6.5 6.5 0 0 1 1.55 8.06"/>
    <path d="M9 16.12A2.5 2.5 0 0 1 8.5 22h7a2.5 2.5 0 0 1-2-5.88"/>
    <path d="M12 2v2"/>
  </svg>
);