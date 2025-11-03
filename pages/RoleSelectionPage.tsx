import React from 'react';
import { UserIcon } from '../components/icons/UserIcon';
import { Role } from '../types';
import { ApsBrand } from '../components/ApsBrand';

interface RoleSelectionPageProps {
  onRoleSelect: (role: Role) => void;
}

const RoleButton = ({
  label,
  description,
  icon,
  onClick,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full text-left p-6 border border-slate-300 rounded-xl bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all transform hover:scale-105 shadow-sm hover:shadow-lg flex items-center"
    style={{ '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
  >
    <div className="mr-5" style={{ color: 'var(--color-primary)' }}>{icon}</div>
    <div>
      <h2 className="text-lg font-bold">{label}</h2>
      <p className="text-sm" style={{ color: 'rgba(var(--color-text-main-rgb), 0.7)' }}>{description}</p>
    </div>
  </button>
);

export const RoleSelectionPage = ({ onRoleSelect }: RoleSelectionPageProps) => {
  return (
    <div className="min-h-screen bg-inherit flex flex-col items-center p-4">
      <div className="flex-grow flex flex-col justify-center items-center text-center w-full max-w-md">
        <ApsBrand />
        <h1 className="text-5xl font-bold mt-4" style={{ color: 'var(--color-text-main)' }}>SkillEra</h1>
        <p className="mt-4 mb-10 text-lg" style={{ color: 'rgba(var(--color-text-main-rgb), 0.8)' }}>Choose your role to get started.</p>
        
        <div className="w-full space-y-4">
          <RoleButton
            label="I am a Student"
            description="Track goals and achievements"
            icon={<UserIcon className="w-8 h-8" />}
            onClick={() => onRoleSelect('student')}
          />
          <RoleButton
            label="I am an Admin"
            description="Manage and verify users"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9.5 14.5 2.3 2.3a1 1 0 0 0 1.4 0l4.3-4.3"/></svg>}
            onClick={() => onRoleSelect('admin')}
          />
        </div>
      </div>
    </div>
  );
};