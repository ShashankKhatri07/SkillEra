import React from 'react';
import { DailyQuest } from '../types';
import { Card } from './Card';
import { PointsIcon } from './icons/PointsIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface DailyQuestCardProps {
    quest: DailyQuest;
    onClaim: () => void;
}

export const DailyQuestCard = ({ quest, onClaim }: DailyQuestCardProps) => {
    return (
        <Card className={`border-t-4 ${quest.completed ? 'opacity-60' : ''}`} style={{ borderColor: 'var(--color-primary)' }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>Daily Quest</h3>
                    <p className="text-lg font-semibold" style={{ color: 'var(--color-text-main)' }}>{quest.text}</p>
                </div>
                {quest.completed ? (
                     <div className="flex items-center gap-2 font-semibold text-center px-4 py-2 rounded-lg" style={{ backgroundColor: 'rgba(var(--color-accent-secondary-rgb), 0.2)', color: 'var(--color-accent-secondary)' }}>
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>Completed!</span>
                     </div>
                ) : (
                    <button 
                        onClick={onClaim}
                        className="flex items-center gap-2 font-semibold text-center px-4 py-2 rounded-lg transition-transform hover:scale-105 active:scale-95 animate-shiny"
                        style={{ backgroundColor: 'var(--color-accent-secondary)', color: 'var(--color-text-main)' }}
                    >
                        <PointsIcon className="w-5 h-5"/>
                        <span>Claim {quest.reward} Points</span>
                    </button>
                )}
            </div>
        </Card>
    );
};