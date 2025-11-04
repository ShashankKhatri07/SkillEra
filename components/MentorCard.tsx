import React from 'react';
import { Student } from '../types';
import { Card } from './Card';

interface MentorCardProps {
    user: Student;
    isPeer?: boolean;
    onConnect: (userId: string) => void;
}

// FIX: Changed component to be of type React.FC to allow passing the 'key' prop without TypeScript errors.
export const MentorCard: React.FC<MentorCardProps> = ({ user, isPeer = false, onConnect }) => {
    return (
        <Card className="flex flex-col items-center text-center">
            <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full mb-3 border-4" style={{ borderColor: 'var(--color-surface)' }}/>
            <h3 className="font-bold text-lg">{user.name}</h3>
            <p className="text-sm font-semibold capitalize" style={{ color: 'var(--color-primary)' }}>{isPeer ? `Class ${user.class}-${user.section}` : user.role}</p>
            <p className="text-sm mt-2 min-h-[40px]" style={{ color: 'var(--color-text-muted)' }}>
                {user.mentorshipBio || user.bio}
            </p>
            <button 
                onClick={() => onConnect(user.id)}
                className="w-full mt-4 font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-transform active:scale-95"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-text)'}}
            >
                Connect
            </button>
        </Card>
    );
};
