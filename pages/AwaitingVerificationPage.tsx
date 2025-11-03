import React from 'react';
import { ApsBrand } from '../components/ApsBrand';
import { MailIcon } from '../components/icons/MailIcon';

interface AwaitingVerificationPageProps {
  onVerify: () => void;
  onBackToLogin: () => void;
}

export const AwaitingVerificationPage = ({ onVerify, onBackToLogin }: AwaitingVerificationPageProps) => {
  return (
    <div className="min-h-screen bg-inherit flex flex-col items-center p-4">
      <div className="w-full max-w-md flex-grow flex flex-col justify-center text-center">
        <div className="flex flex-col items-center mb-6">
           <ApsBrand />
           <div className="p-4 rounded-full my-6" style={{ backgroundColor: 'var(--color-accent-1)', color: 'var(--color-text-main)' }}>
                <MailIcon className="w-10 h-10" />
           </div>
           <h1 className="text-3xl font-bold">Verify Your Email</h1>
           <p className="mt-2" style={{ color: 'rgba(var(--color-text-main-rgb), 0.7)' }}>
             We've sent a verification link to your email address. Please check your inbox to continue.
           </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-md space-y-4">
            <p className="text-sm" style={{ color: 'rgba(var(--color-text-main-rgb), 0.8)' }}>
                For demonstration purposes, you can verify your account immediately by clicking the button below.
            </p>
            <button
                onClick={onVerify}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform active:scale-95"
                style={{ backgroundColor: 'var(--color-primary)', '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
              >
                Simulate Email Verification
            </button>
        </div>
         <div className="text-center mt-4">
            <button onClick={onBackToLogin} className="text-sm transition-colors" style={{ color: 'rgba(var(--color-text-main-rgb), 0.7)' }}>
                &larr; Back to Login
            </button>
        </div>
      </div>
    </div>
  );
};