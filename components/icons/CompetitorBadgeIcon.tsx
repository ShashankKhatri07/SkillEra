
export const CompetitorBadgeIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
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
        <circle cx="12" cy="12" r="8"></circle>
        <polyline points="8 1v5l4 4 4-4V1"></polyline>
        <path d="m8 1-4 4"></path>
        <path d="m16 1 4 4"></path>
    </svg>
);