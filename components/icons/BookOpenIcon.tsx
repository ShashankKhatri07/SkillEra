import React from 'react';

// Renders the Font Awesome icon requested by the user.
// The parent component controls the color via CSS inheritance.
// A span wrapper is used to ensure it aligns correctly with other SVG icons in the sidebar.
export const BookOpenIcon = ({ className = "" }: { className?: string }) => (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '1.25rem', height: '1.25rem' }}>
         <i className="fas fa-book-open"></i>
    </span>
);
