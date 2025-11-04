import React, { useState } from 'react';
import { Card } from './Card';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { TrophyIcon } from './icons/TrophyIcon';
import { UsersIcon } from './icons/UsersIcon';
import { CodeIcon } from './icons/CodeIcon';
import { PaletteIcon } from './icons/PaletteIcon';
import { GamecontrollerIcon } from './icons/GamecontrollerIcon';

interface InterestSelectorProps {
    onSaveInterests: (interests: string[]) => void;
}

const interestCategories = [
    { name: 'Academics & Olympiads', icon: <BookOpenIcon className="w-8 h-8"/>, tags: ['Academics', 'Olympiads', 'Math', 'Science', 'Physics', 'Biology', 'Research', 'Writing', 'Economics', 'Astronomy'] },
    { name: 'Technology & Coding', icon: <CodeIcon className="w-8 h-8"/>, tags: ['Coding', 'React', 'Programming', 'Frontend', 'Python', 'CSS'] },
    { name: 'Arts & Creativity', icon: <PaletteIcon className="w-8 h-8"/>, tags: ['Art', 'Design', 'Creative', 'Psychology'] },
    { name: 'Sports', icon: <TrophyIcon className="w-8 h-8"/>, tags: ['Sports', 'Basketball'] },
    { name: 'Hobbies & Indoor Games', icon: <GamecontrollerIcon className="w-8 h-8"/>, tags: ['Hobbies', 'Chess', 'Strategy', 'Games', 'Gardening', 'Environment', 'Finance', 'Investing'] },
    { name: 'Communication & Leadership', icon: <UsersIcon className="w-8 h-8"/>, tags: ['Communication', 'Soft Skills', 'Presentation', 'Debate', 'Business', 'Leadership'] },
];

export const InterestSelector = ({ onSaveInterests }: InterestSelectorProps) => {
    const [selected, setSelected] = useState<string[]>([]);

    const toggleInterest = (interestName: string) => {
        setSelected(prev => 
            prev.includes(interestName) 
                ? prev.filter(i => i !== interestName)
                : [...prev, interestName]
        );
    };

    const handleSave = () => {
        // We'll save all the specific tags from the selected categories as the user's interests.
        // FIX: Explicitly type `interestsToSave` as string[] to resolve type inference issue.
        const interestsToSave: string[] = selected.flatMap(categoryName => {
            const category = interestCategories.find(c => c.name === categoryName);
            return category ? category.tags : [];
        });
        // Remove duplicates and save
        onSaveInterests([...new Set(interestsToSave)]);
    };

    return (
        <Card>
            <div className="text-center">
                <h2 className="text-2xl font-bold">What are you interested in?</h2>
                <p className="mt-2" style={{ color: 'var(--color-text-muted)' }}>
                    Select a few topics to personalize your Learning Hub experience.
                </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                {interestCategories.map(category => {
                    const isSelected = selected.includes(category.name);
                    return (
                        <button 
                            key={category.name}
                            onClick={() => toggleInterest(category.name)}
                            className={`p-4 rounded-lg flex flex-col items-center justify-center text-center transition-all duration-200 border-2 ${isSelected ? 'shadow-lg -translate-y-1' : 'hover:shadow-md'}`}
                            style={{ 
                                backgroundColor: isSelected ? 'var(--color-primary)' : 'rgba(var(--color-text-main-rgb), 0.05)',
                                borderColor: isSelected ? 'var(--color-primary)' : 'transparent',
                                color: isSelected ? 'var(--color-primary-text)' : 'var(--color-text-main)'
                            }}
                        >
                            <div className="mb-2">{category.icon}</div>
                            <span className="font-semibold text-sm">{category.name}</span>
                        </button>
                    );
                })}
            </div>
            <div className="mt-8 text-center">
                <button
                    onClick={handleSave}
                    disabled={selected.length === 0}
                    className="font-semibold py-3 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95 animate-shiny"
                    style={{ backgroundColor: 'var(--color-accent-secondary)', color: 'var(--color-text-main)' }}
                >
                    Save and Explore
                </button>
            </div>
        </Card>
    );
};