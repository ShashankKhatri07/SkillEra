import React from 'react';
import { Card } from './Card';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface InterestSetupPromptProps {
    onGoToProfile: () => void;
}

export const InterestSetupPrompt = ({ onGoToProfile }: InterestSetupPromptProps) => {
    return (
        <Card>
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-6 p-4">
                <div className="flex-shrink-0">
                    <div className="p-4 rounded-full" style={{ backgroundColor: 'rgba(var(--color-accent-secondary-rgb), 0.2)', color: 'var(--color-accent-secondary)'}}>
                         <LightbulbIcon className="w-8 h-8" />
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold">Personalize Your Learning Hub!</h3>
                    <p className="mt-1" style={{ color: 'var(--color-text-muted)' }}>
                        Add some interests to your profile, and we'll recommend learning resources just for you.
                    </p>
                </div>
                <div className="flex-shrink-0 w-full sm:w-auto">
                     <button
                        onClick={onGoToProfile}
                        className="w-full sm:w-auto font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-transform active:scale-95"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-text)' }}
                     >
                        Go to Profile
                    </button>
                </div>
            </div>
        </Card>
    );
};