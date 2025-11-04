// FIX: Add missing React import.
import React, { useState, useRef } from 'react';
import { Student } from '../types';
import { Card } from '../components/Card';
import { ProfileCard } from '../components/ProfileCard';
import { AppealFormModal } from '../components/AppealFormModal';
import { SecuritySettings } from '../components/SecuritySettings';
import { validateText } from '../utils/validationUtils';

interface ProfilePageProps {
  user: Student;
  onUpdateUser: (user: Student) => void;
  onUpdatePassword: (currentPassword: string, newPassword: string) => Promise<'success' | 'incorrect-password'>;
  onCreateAppeal: (claimedPercentage: number, reason: string, answerSheetUrl: string) => void;
}

export const ProfilePage = ({ user, onUpdateUser, onUpdatePassword, onCreateAppeal }: ProfilePageProps) => {
  const [bio, setBio] = useState(user.bio || '');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [name, setName] = useState(user.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const bioTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [validationError, setValidationError] = useState('');

  const handleBioSave = () => {
    const error = validateText(bio, 'Bio');
    if (error) {
        setValidationError(error);
        return;
    }
    setValidationError('');
    onUpdateUser({ ...user, bio });
    setIsEditingBio(false);
  };
  
  const handleEditBioClick = () => {
    setIsEditingBio(true);
    setTimeout(() => {
        bioTextareaRef.current?.focus();
        bioTextareaRef.current?.select();
    }, 0);
  }

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInterest = newInterest.trim();
    const error = validateText(trimmedInterest, 'Interest');
    if (error) {
        setValidationError(error);
        return;
    }
    setValidationError('');
    if (trimmedInterest && !user.interests.includes(trimmedInterest)) {
      onUpdateUser({ ...user, interests: [...user.interests, trimmedInterest] });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    onUpdateUser({ ...user, interests: user.interests.filter(i => i !== interestToRemove) });
  };
  
  const canChangeName = () => {
    if (!user.lastNameChangeDate) return true;
    const lastChange = new Date(user.lastNameChangeDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastChange < thirtyDaysAgo;
  };

  const daysUntilNextChange = () => {
      if (!user.lastNameChangeDate) return 0;
      const lastChange = new Date(user.lastNameChangeDate);
      const nextChangeDate = new Date(lastChange.setDate(lastChange.getDate() + 30));
      const diffTime = Math.max(0, nextChangeDate.getTime() - new Date().getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleNameSave = () => {
      const error = validateText(name.trim(), 'Name');
      if (error) {
          setValidationError(error);
          return;
      }
      setValidationError('');
      if (name.trim() && canChangeName()) {
          onUpdateUser({ ...user, name: name.trim(), lastNameChangeDate: new Date().toISOString() });
      }
      setIsEditingName(false);
  };

  const handleAppealSubmit = (claimedPercentage: number, reason: string, answerSheetUrl: string) => {
    onCreateAppeal(claimedPercentage, reason, answerSheetUrl);
    setIsAppealModalOpen(false);
  };

  return (
    <div>
      {isAppealModalOpen && <AppealFormModal onSubmit={handleAppealSubmit} onClose={() => setIsAppealModalOpen(false)} />}

      <h1 className="text-2xl sm:text-3xl font-bold mb-6">My Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 space-y-6">
          <ProfileCard user={user} onUpdateUser={onUpdateUser} />
          <Card title="Account Settings">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold mb-1">Display Name</label>
                    {isEditingName ? (
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border-slate-300 rounded-lg p-2 bg-white"
                            />
                            <button onClick={handleNameSave} className="font-semibold py-2 px-3 rounded-lg text-white" style={{backgroundColor: 'var(--color-primary)'}}>Save</button>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center">
                            <p>{user.name}</p>
                            <button 
                                onClick={() => setIsEditingName(true)} 
                                disabled={!canChangeName()}
                                className="text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ color: 'var(--color-primary)' }}
                            >
                                Edit
                            </button>
                        </div>
                    )}
                    {!canChangeName() && (
                        <p className="text-xs mt-1" style={{ color: 'rgba(var(--color-text-main-rgb), 0.7)' }}>
                            You can change your name again in {daysUntilNextChange()} days.
                        </p>
                    )}
                </div>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-2 space-y-6">
            {validationError && <p className="text-sm text-red-600 font-bold p-3 bg-red-100 rounded-lg">{validationError}</p>}
            <Card title="About Me">
                {isEditingBio ? (
                    <div>
                        <textarea
                            ref={bioTextareaRef}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            onBlur={handleBioSave}
                            className="w-full border-slate-300 rounded-lg p-3 focus:ring-2 focus:border-transparent transition duration-150 ease-in-out resize-y bg-white min-h-[100px]"
                            style={{'--tw-ring-color': 'var(--color-accent-1)'} as React.CSSProperties}
                            placeholder="Tell everyone a little about yourself..."
                        />
                        <button onClick={handleBioSave} className="mt-2 text-white font-semibold py-1 px-3 rounded-lg text-sm" style={{ backgroundColor: 'var(--color-primary)' }}>Save</button>
                    </div>
                ) : (
                    <div onClick={handleEditBioClick} className="cursor-pointer group">
                        <p className="whitespace-pre-wrap min-h-[50px]" style={{ color: 'rgba(var(--color-text-main-rgb), 0.8)' }}>
                            {user.bio || <span className="opacity-60">Click here to add a bio...</span>}
                        </p>
                        <span className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-primary)'}}>
                            Click to edit
                        </span>
                    </div>
                )}
            </Card>

            <Card title="My Interests">
                <div className="flex flex-wrap gap-2 mb-4">
                    {user.interests.map(interest => (
                        <div key={interest} className="flex items-center gap-2 text-sm font-medium pl-3 pr-1 py-1 rounded-full" style={{ backgroundColor: 'var(--color-accent-secondary)', color: 'var(--color-text-main)' }}>
                            <span>{interest}</span>
                            <button onClick={() => handleRemoveInterest(interest)} className="bg-black/10 hover:bg-black/20 rounded-full w-5 h-5 flex items-center justify-center">&times;</button>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleAddInterest} className="flex gap-2">
                    <input 
                        type="text" 
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder="Add an interest..."
                        className="w-full border-slate-300 rounded-lg p-2 focus:ring-2 focus:border-transparent transition duration-150 ease-in-out text-sm bg-white"
                        style={{'--tw-ring-color': 'var(--color-accent)'} as React.CSSProperties}
                    />
                    <button type="submit" className="text-white font-semibold py-2 px-4 rounded-lg" style={{ backgroundColor: 'var(--color-primary)' }}>Add</button>
                </form>
            </Card>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <Card title="Academic Appeals">
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                        <p className="text-sm" style={{ color: 'rgba(var(--color-text-main-rgb), 0.7)' }}>
                            If you believe there is an error in your academic percentage, you can file an appeal for review by the principal.
                        </p>
                        <button
                            onClick={() => setIsAppealModalOpen(true)}
                            className="w-full font-semibold py-2 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform active:scale-95"
                            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-text)', '--tw-ring-color': 'var(--color-primary)'} as React.CSSProperties}
                        >
                            File a New Appeal
                        </button>
                    </div>
                </Card>

                <SecuritySettings onUpdatePassword={onUpdatePassword} />
            </div>
        </div>
      </div>
    </div>
  );
};