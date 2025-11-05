import React from 'react';

// FIX: Updated component props to accept all standard SVG attributes (like `style`) by using React.ComponentProps<'svg'>. This resolves the type error in LearningHubPage.tsx.
export const CompassIcon = ({ className = "w-6 h-6", ...props }: React.ComponentProps<'svg'>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);