import React, { useState } from 'react';
import { Role } from '../types';
import { ApsBrand } from '../components/ApsBrand';

interface LoginPageProps {
  role: Role;
  onLogin: (email: string, password: string) => Promise<'success' | 'not-found' | 'wrong-password' | 'wrong-role'>;
  onSwitchToSignUp: () => void;
  onBack: () => void;
}

export const LoginPage = ({ role, onLogin, onSwitchToSignUp, onBack }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await onLogin(email, password);
    if (result === 'not-found' || result === 'wrong-password') {
      setError('Invalid email or password.');
    } else if (result === 'wrong-role') {
        setError(`You are not registered as a ${role}. Please select the correct role.`);
    }
  };
  
  const title = role === 'student' ? 'Student Login' : 'Admin Login';
  const subtitle = `Log in to your ${role} account.`;


  return (
    <div className="min-h-screen bg-inherit flex flex-col items-center p-4">
       <div className="w-full max-w-md flex-grow flex flex-col justify-center">
        <div className="flex flex-col items-center mb-6">
           <ApsBrand />
           <h1 className="text-2xl sm:text-3xl font-bold mt-4">{title}</h1>
           <p className="mt-1" style={{ color: 'rgba(var(--color-text-main-rgb), 0.7)' }}>{subtitle}</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium" style={{ color: 'var(--color-text-main)' }}>Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm bg-white"
                style={{ '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
              />
            </div>
            <div>
              <label htmlFor="password"className="block text-sm font-medium" style={{ color: 'var(--color-text-main)' }}>Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm bg-white"
                style={{ '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform active:scale-95"
                style={{ backgroundColor: 'var(--color-primary)', '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
              >
                Login
              </button>
            </div>
          </form>
          {role === 'student' && (
             <p className="mt-6 text-center text-sm" style={{ color: 'rgba(var(--color-text-main-rgb), 0.8)' }}>
                Don't have an account?{' '}
                <button onClick={onSwitchToSignUp} className="font-medium hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
                Sign up
                </button>
            </p>
          )}
        </div>
        <div className="text-center mt-4">
            <button onClick={onBack} className="text-sm transition-colors" style={{ color: 'rgba(var(--color-text-main-rgb), 0.7)' }}>
                &larr; Back to Welcome
            </button>
        </div>
      </div>
    </div>
  );
};