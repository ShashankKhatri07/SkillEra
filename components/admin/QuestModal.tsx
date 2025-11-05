import React, { useState, useEffect } from 'react';
import { DailyQuest } from '../../types';
import { validateText } from '../../utils/validationUtils';

interface QuestModalProps {
    // FIX: Corrected Omit type for quest and onSave props. 'completed' is not a valid property of DailyQuest.
    // The correct type refers to quest templates, which lack 'status' and 'submissionText'.
    quest: Omit<DailyQuest, 'status' | 'submissionText'> | null;
    onSave: (questData: Omit<DailyQuest, 'id' | 'status' | 'submissionText'> | Omit<DailyQuest, 'status' | 'submissionText'>) => void;
    onClose: () => void;
}

export const QuestModal = ({ quest, onSave, onClose }: QuestModalProps) => {
    const [text, setText] = useState('');
    const [reward, setReward] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (quest) {
            setText(quest.text);
            setReward(quest.reward.toString());
        }
    }, [quest]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const textError = validateText(text, 'Quest text');
        if (textError) { setError(textError); return; }
        
        const rewardNum = parseInt(reward, 10);
        if (isNaN(rewardNum) || rewardNum <= 0) {
            setError('Please enter a valid positive number for the reward.');
            return;
        }

        const questData = { text, reward: rewardNum };
        
        if (quest) {
            onSave({ ...questData, id: quest.id });
        } else {
            onSave(questData);
        }
    };
    
    const modalTitle = quest ? 'Edit Daily Quest' : 'Add New Daily Quest';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-scale-in" style={{ backgroundColor: 'var(--color-bg-main)', border: '1px solid var(--color-border)' }} onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-6">{modalTitle}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium mb-1 opacity-80">Quest Description</label>
                        <input value={text} onChange={(e) => setText(e.target.value)} required className="w-full rounded-lg p-2" style={{backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)'}} />
                    </div>
                     <div>
                        <label className="block text-sm font-medium mb-1 opacity-80">Reward Points</label>
                        <input value={reward} onChange={(e) => setReward(e.target.value)} required type="number" className="w-full rounded-lg p-2" style={{backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)'}} />
                    </div>

                    {error && <p className="text-sm text-red-400">{error}</p>}
                     <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="w-full font-semibold py-2 px-4 rounded-lg transition-colors hover:bg-white/10" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', color: 'var(--color-text-main)' }}>
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="w-full font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-transform active:scale-95"
                            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-primary-text)' }}
                        >
                            Save Quest
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};