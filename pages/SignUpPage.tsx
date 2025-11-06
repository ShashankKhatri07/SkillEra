

import React, { useState } from 'react';
import { Role } from '../types';
import { ApsBrand } from '../components/ApsBrand';
import { validateText } from '../utils/validationUtils';

interface SignUpPageProps {
  role: Role;
  onSignUp: (name: string, studentClass: string, section: string, admissionNumber: string) => Promise<'success' | 'email-in-use'>;
  onSwitchToLogin: () => void;
  onBack: () => void;
}

const classes = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'];

export const SignUpPage = ({ role, onSignUp, onSwitchToLogin, onBack }: SignUpPageProps) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [studentClass, setStudentClass] = useState('1');
  const [section, setSection] = useState('A');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameValidationError = validateText(name, 'Name');
    if (nameValidationError) {
        setError(nameValidationError);
        return;
    }
    const admNumValidationError = validateText(admissionNumber, 'Admission Number');
     if (admNumValidationError) {
        setError(admNumValidationError);
        return;
    }
    if (!/^\d+$/.test(admissionNumber)) {
        setError("Admission number must contain only digits.");
        return;
    }
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }
    setError('');
    const result = await onSignUp(name, studentClass, section, admissionNumber);
    if (result === 'email-in-use') {
      setError('Could not create account. The admission number might already be in use.');
    }
  };

  const title = role === 'student' ? 'Create Your Account' : 'Create Admin Account';
  const subtitle = role === 'student' ? 'Start tracking your achievements today' : 'Register a new administrator';


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
              <label htmlFor="name" className="block text-sm font-medium" style={{ color: 'var(--color-text-main)' }}>Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm bg-white"
                style={{ '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
              />
            </div>
             {role === 'student' && (
               <div>
                <label htmlFor="admissionNumber" className="block text-sm font-medium" style={{ color: 'var(--color-text-main)' }}>Admission Number</label>
                <input
                  id="admissionNumber"
                  type="text"
                  value={admissionNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdmissionNumber(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm bg-white"
                  style={{ '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
                />
                <div className="mt-2 p-2 rounded-lg" style={{ backgroundColor: 'rgba(var(--color-text-main-rgb), 0.05)' }}>
                    <span className="block text-xs font-semibold" style={{ color: 'rgba(var(--color-text-main-rgb), 0.6)' }}>School Email</span>
                    <span className="font-mono" style={{ color: 'var(--color-text-main)' }}>
                        <span className="font-bold">{admissionNumber || '...'}</span>@apsjodhpur.com
                    </span>
                </div>
              </div>
             )}
            {role === 'student' && (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/2">
                  <label htmlFor="class" className="block text-sm font-medium" style={{ color: 'var(--color-text-main)' }}>Class</label>
                  <select
                    id="class"
                    value={studentClass}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStudentClass(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm bg-white"
                    style={{ '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
                  >
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="w-full sm:w-1/2">
                  <label htmlFor="section" className="block text-sm font-medium" style={{ color: 'var(--color-text-main)' }}>Section</label>
                  <select
                    id="section"
                    value={section}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSection(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm bg-white"
                    style={{ '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
                  >
                    {sections.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            )}
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
                Create Account
              </button>
            </div>
          </form>
          <p className="mt-6 text-center text-sm" style={{ color: 'rgba(var(--color-text-main-rgb), 0.8)' }}>
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="font-medium hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
              Login
            </button>
          </p>
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