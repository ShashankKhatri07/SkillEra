import React, { useState } from 'react';
import { Card } from './Card';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface SecuritySettingsProps {
    onUpdatePassword: (currentPassword: string, newPassword: string) => Promise<'success' | 'incorrect-password'>;
}

export const SecuritySettings = ({ onUpdatePassword }: SecuritySettingsProps) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters long.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        setIsLoading(true);
        const result = await onUpdatePassword(currentPassword, newPassword);
        setIsLoading(false);

        if (result === 'success') {
            setSuccess("Password updated successfully!");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setSuccess(''), 5000);
        } else if (result === 'incorrect-password') {
            setError("The current password you entered is incorrect.");
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 820);
        } else {
            setError("Failed to update password. Please try again.");
        }
    };
    
    const inputStyle = {backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)'};

    return (
        <Card title="Security" className={isShaking ? 'animate-shake' : ''}>
            <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold mb-1">Current Password</label>
                    <input 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="w-full rounded-lg p-2" 
                        style={inputStyle} 
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">New Password</label>
                    <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full rounded-lg p-2" 
                        style={inputStyle} 
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Retype New Password</label>
                    <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full rounded-lg p-2" 
                        style={inputStyle} 
                    />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}
                
                {success && (
                    <div className="flex items-center gap-2 p-3 rounded-lg" style={{backgroundColor: 'rgba(var(--color-accent-secondary-rgb), 0.1)', color: 'var(--color-accent-secondary)'}}>
                        <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-semibold">{success}</p>
                    </div>
                )}
                
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-transform active:scale-95 disabled:opacity-50" 
                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-text)' }}
                >
                    {isLoading ? 'Updating...' : 'Update Password'}
                </button>
            </form>
        </Card>
    );
};