
export const MentorIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
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
    <path d="M18 21a8 8 0 0 0-16 0"/>
    <circle cx="10" cy="8" r="4"/>
    <path d="M18 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/>
  </svg>
);