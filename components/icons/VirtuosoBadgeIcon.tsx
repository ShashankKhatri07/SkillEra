
export const VirtuosoBadgeIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
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
        <path d="M6 19c-2-2-2-6-2-6s2 4 4 4 4-2 4-4-2-4-4-4-4 2-4 4"/>
        <path d="M18 19c2-2 2-6 2-6s-2 4-4 4-4-2-4-4 2-4 4-4 4 2 4 4"/>
    </svg>
);