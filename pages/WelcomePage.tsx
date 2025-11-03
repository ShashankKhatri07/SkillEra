import React from 'react';
import { Role } from '../types';
import { ApsBrand } from '../components/ApsBrand';

interface WelcomePageProps {
  role: Role;
  onLoginClick: () => void;
  onSignUpClick: () => void;
  onBack: () => void;
}

export const WelcomePage = ({ role, onLoginClick, onSignUpClick, onBack }: WelcomePageProps) => {
  const title = role === 'student' ? 'Welcome!' : 'Admin Portal';
  const subtitle = role === 'student' ? 'Your personal platform for tracking goals and celebrating achievements.' : 'Manage student data and verify achievements.';

  return (
    <div className="min-h-screen bg-inherit flex flex-col items-center p-4">
      <div className="flex-grow flex flex-col justify-center items-center text-center w-full max-w-md">
        <ApsBrand />
        <h1 className="text-4xl font-bold mt-4">{title}</h1>
        <p className="mt-2 mb-8" style={{ color: 'rgba(var(--color-text-main-rgb), 0.7)' }}>{subtitle}</p>
        
        <div className="w-full space-y-4">
          <button
            onClick={onLoginClick}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-md font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform transform hover:scale-105 active:scale-100"
            style={{ backgroundColor: 'var(--color-primary)', '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
          >
            Login
          </button>
          {role === 'student' && (
             <button
                onClick={onSignUpClick}
                className="w-full flex justify-center py-3 px-4 border border-slate-300 rounded-md shadow-sm text-md font-medium bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform transform hover:scale-105 active:scale-100"
                style={{ color: 'var(--color-text-main)', '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
              >
                Sign Up
              </button>
          )}
        </div>
        <div className="text-center mt-8">
            <button onClick={onBack} className="text-sm transition-colors" style={{ color: 'rgba(var(--color-text-main-rgb), 0.7)' }}>
                &larr; Back to Role Selection
            </button>
        </div>
      </div>
    </div>
  );
};