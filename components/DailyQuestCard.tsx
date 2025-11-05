import { DailyQuest } from '../types';
import { Card } from './Card';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { QuestIcon } from './icons/QuestIcon';

interface DailyQuestCardProps {
    quest: DailyQuest;
    onSubmit: () => void;
}

export const DailyQuestCard = ({ quest, onSubmit }: DailyQuestCardProps) => {
    const getStatusInfo = () => {
        switch (quest.status) {
            case 'completed':
                return {
                    component: (
                        <div className="flex items-center gap-2 font-semibold text-center px-4 py-2 rounded-lg" style={{ backgroundColor: 'rgba(var(--color-accent-secondary-rgb), 0.2)', color: 'var(--color-accent-secondary)' }}>
                            <CheckCircleIcon className="w-5 h-5" />
                            <span>Completed! +{quest.reward} pts</span>
                        </div>
                    ),
                    cardClass: 'opacity-60'
                };
            case 'pending':
                return {
                    component: (
                        <div className="flex items-center gap-2 font-semibold text-center px-4 py-2 rounded-lg" style={{ backgroundColor: 'rgba(var(--color-text-main-rgb), 0.1)'}}>
                           <span>Pending Review...</span>
                        </div>
                    ),
                    cardClass: ''
                };
            case 'rejected':
                 return {
                    component: (
                        <div className="flex items-center gap-2 font-semibold text-center px-4 py-2 rounded-lg bg-red-500/20 text-red-500">
                           <span>Submission Rejected</span>
                        </div>
                    ),
                    cardClass: 'opacity-70'
                };
            case 'unclaimed':
            default:
                return {
                    component: (
                         <button 
                            onClick={onSubmit}
                            className="flex items-center gap-2 font-semibold text-center px-4 py-2 rounded-lg transition-transform hover:scale-105 active:scale-95 animate-shiny"
                            style={{ backgroundColor: 'var(--color-accent-secondary)', color: 'var(--color-text-main)' }}
                        >
                            <QuestIcon className="w-5 h-5"/>
                            <span>Complete Quest (+{quest.reward} Points)</span>
                        </button>
                    ),
                    cardClass: ''
                }
        }
    }

    const { component: statusComponent, cardClass } = getStatusInfo();

    return (
        <Card className={`border-t-4 ${cardClass}`} style={{ borderColor: 'var(--color-primary)' }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>Daily Quest</h3>
                    <p className="text-lg font-semibold" style={{ color: 'var(--color-text-main)' }}>{quest.text}</p>
                </div>
                {statusComponent}
            </div>
        </Card>
    );
};