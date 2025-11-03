import React, { useState, useRef } from 'react';
import { Student } from '../types';
import { Card } from '../components/Card';
import { ProfileCard } from '../components/ProfileCard';
import { SecuritySettings } from '../components/SecuritySettings';
import { validateText } from '../utils/validationUtils';

interface AdminProfilePageProps {
  admin: Student;
  onUpdateAdmin: (admin: Student) => void;
  onUpdatePassword: (currentPassword: string, newPassword: string) => Promise<'success' | 'incorrect-password'>;
}

export const AdminProfilePage = ({ admin, onUpdateAdmin, onUpdatePassword }: AdminProfilePageProps) => {
  const [bio, setBio] = useState(admin.bio || '');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const bioTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [name, setName] = useState(admin.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const canChangeName = () => {
      if (!admin.lastNameChangeDate) return true;
      const lastChange = new Date(admin.lastNameChangeDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return lastChange < thirtyDaysAgo;
  };

  const daysUntilNextChange = () => {
      if (!admin.lastNameChangeDate) return 0;
      const lastChange = new Date(admin.lastNameChangeDate);
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
        onUpdateAdmin({ ...admin, name: name.trim(), lastNameChangeDate: new Date().toISOString() });
    }
    setIsEditingName(false);
  };

  const handleBioSave = () => {
    const error = validateText(bio, 'Bio');
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError('');
    onUpdateAdmin({ ...admin, bio });
    setIsEditingBio(false);
  };
  
  const handleEditBioClick = () => {
    setIsEditingBio(true);
    setTimeout(() => {
        bioTextareaRef.current?.focus();
        bioTextareaRef.current?.select();
    }, 0);
  };

  const inputStyle = {backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)'};

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 space-y-6">
          <ProfileCard user={admin} onUpdateUser={onUpdateAdmin} isAdmin={true} isEditable={true} />
           <Card title="Account Settings">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold mb-1">Display Name</label>
                    {isEditingName ? (
                        <div className="flex gap-2">
                            <input type="text" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} className="w-full rounded-lg p-2" style={inputStyle}/>
                            <button onClick={handleNameSave} className="font-semibold py-2 px-3 rounded-lg" style={{backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-text)'}}>Save</button>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center">
                            <p>{admin.name}</p>
                            <button onClick={() => setIsEditingName(true)} disabled={!canChangeName()} className="text-sm font-semibold disabled:opacity-50" style={{ color: 'var(--color-primary)' }}>Edit</button>
                        </div>
                    )}
                    {!canChangeName() && (
                        <p className="text-xs mt-1 opacity-70">
                            You can change your name again in {daysUntilNextChange()} days.
                        </p>
                    )}
                </div>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-2">
          {validationError && <p className="text-sm text-red-400 font-bold p-3 bg-red-500/20 rounded-lg mb-6">{validationError}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <Card title="About Me">
                {isEditingBio ? (
                    <div>
                        <textarea
                            ref={bioTextareaRef}
                            value={bio}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
                            onBlur={handleBioSave}
                            className="w-full rounded-lg p-3 focus:ring-2 focus:border-transparent transition duration-150 ease-in-out resize-y min-h-[100px]"
                            style={{'--tw-ring-color': 'var(--color-accent)', ...inputStyle} as React.CSSProperties}
                            placeholder="Tell everyone a little about yourself..."
                        />
                        <button onClick={handleBioSave} className="mt-2 font-semibold py-1 px-3 rounded-lg text-sm" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>Save</button>
                    </div>
                ) : (
                    <div onClick={handleEditBioClick} className="cursor-pointer group">
                        <p className="whitespace-pre-wrap min-h-[50px]" style={{ color: 'var(--color-text-muted)' }}>
                            {admin.bio || <span className="opacity-60">Click here to add a bio...</span>}
                        </p>
                        <span className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-primary)'}}>
                            Click to edit
                        </span>
                    </div>
                )}
            </Card>
             <SecuritySettings onUpdatePassword={onUpdatePassword} />
          </div>
        </div>
      </div>
    </div>
  );
};