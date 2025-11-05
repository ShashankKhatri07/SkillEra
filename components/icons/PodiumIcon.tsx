
export const PodiumIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
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
        <path d="M12 22V8" />
        <path d="M8.5 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
        <path d="M15.5 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
        <path d="M4 22h16" />
        <path d="M4 15h3v7H4z" />
        <path d="M17 15h3v7h-3z" />
    </svg>
);