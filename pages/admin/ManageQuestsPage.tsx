import { useState } from 'react';
import { DailyQuest } from '../../types';
import { Card } from '../../components/Card';
import { QuestIcon } from '../../components/icons/QuestIcon';
import { QuestModal } from '../../components/admin/QuestModal';
import { TrashIcon } from '../../components/icons/TrashIcon';

interface ManageQuestsPageProps {
    quests: Omit<DailyQuest, 'completed'>[];
    onAddQuest: (quest: Omit<DailyQuest, 'id' | 'completed'>) => void;
    onUpdateQuest: (quest: Omit<DailyQuest, 'completed'>) => void;
    onDeleteQuest: (questId: string) => void;
}

export const ManageQuestsPage = ({ quests, onAddQuest, onUpdateQuest, onDeleteQuest }: ManageQuestsPageProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuest, setEditingQuest] = useState<Omit<DailyQuest, 'completed'> | null>(null);

    const handleEdit = (quest: Omit<DailyQuest, 'completed'>) => {
        setEditingQuest(quest);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingQuest(null);
        setIsModalOpen(true);
    };

    const handleSave = (questData: Omit<DailyQuest, 'id' | 'completed'> | Omit<DailyQuest, 'completed'>) => {
        if ('id' in questData) {
            onUpdateQuest(questData);
        } else {
            onAddQuest(questData);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            {isModalOpen && (
                <QuestModal
                    quest={editingQuest}
                    onSave={handleSave}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Daily Quests</h1>
                <button
                    onClick={handleAdd}
                    className="font-semibold py-2 px-4 rounded-lg"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-text)' }}
                >
                    + Add Quest
                </button>
            </div>
            <Card title="Quest Pool" icon={<QuestIcon />}>
                <div className="space-y-3">
                    {quests.length > 0 ? quests.map(quest => (
                        <div key={quest.id} className="p-4 rounded-lg flex justify-between items-center" style={{ backgroundColor: 'rgba(var(--color-text-main-rgb), 0.05)' }}>
                            <div>
                                <p className="font-semibold">{quest.text}</p>
                                <p className="text-sm font-bold" style={{color: 'var(--color-accent-secondary)'}}>+{quest.reward} Points</p>
                            </div>
                             <div className="flex items-center gap-2 flex-shrink-0">
                                <button onClick={() => handleEdit(quest)} className="text-sm font-semibold opacity-70 hover:opacity-100" style={{ color: 'var(--color-primary)'}}>
                                    Edit
                                </button>
                                <button onClick={() => onDeleteQuest(quest.id)} className="text-red-500/70 hover:text-red-500/100 p-1 rounded-full">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center py-8 opacity-70">No daily quests have been created yet.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};