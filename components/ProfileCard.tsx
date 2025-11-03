import React, { useRef } from 'react';
import { Student } from '../types';
import { Card } from './Card';
import { getUserLevelInfo } from '../utils/levelUtils';
import { CameraIcon } from './icons/CameraIcon';

interface ProfileCardProps {
  user: Student;
  onUpdateUser: (user: Student) => void;
  isAdmin?: boolean;
  isEditable?: boolean;
}

const CircularProgressBar = ({ percentage }: { percentage: number; }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getStrokeColor = (p: number) => {
    if (p >= 75) return 'var(--color-text-main)';
    if (p >= 40) return 'var(--color-accent-secondary)';
    return 'var(--color-accent)';
  }
  
  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-slate-200"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        <circle
          className={`progress-ring__circle--animated`}
          strokeWidth="10"
          strokeLinecap="round"
          stroke={getStrokeColor(percentage)}
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: circumference,
            '--stroke-offset': offset,
          } as React.CSSProperties}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color: 'var(--color-text-main)' }}>{percentage}%</span>
      </div>
    </div>
  );
};

export const ProfileCard = ({ user, onUpdateUser, isAdmin = false, isEditable }: ProfileCardProps) => {
  const levelInfo = getUserLevelInfo(user.points);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canEdit = isEditable ?? !isAdmin;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAvatarUrl = e.target?.result as string;
        onUpdateUser({ ...user, avatar: newAvatarUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    if (!canEdit) return;
    fileInputRef.current?.click();
  };

  return (
    <Card 
        className="flex flex-col items-center"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-accent)' }}
    >
      <div className={`relative group ${canEdit && 'cursor-pointer'}`} onClick={handleAvatarClick}>
        <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mb-4 border-4 shadow-md group-hover:opacity-75 transition-opacity" style={{ borderColor: 'var(--color-bg-main)' }}/>
        {canEdit && (
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-300">
                <CameraIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300" />
            </div>
        )}
      </div>
      {canEdit && (
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg"
          className="hidden"
        />
      )}
      
      <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-main)' }}>{user.name}</h2>
      {user.role === 'student' && (
          <div className="text-center">
            <p className="font-semibold" style={{ color: 'var(--color-primary)' }}>Level {levelInfo.level} - {levelInfo.name}</p>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>Class {user.class} - {user.section}</p>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>Adm No: {user.admissionNumber}</p>
          </div>
      )}
      
      {user.role === 'student' && (
          <>
            <div className="w-full border-t my-4" style={{ borderColor: 'var(--color-border)' }}></div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--color-text-main)' }}>Academic Performance</h3>
            <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>Aggregate percentage</p>
            <CircularProgressBar percentage={user.academicPercentage} />
         </>
      )}
    </Card>
  );
};