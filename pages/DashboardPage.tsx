import React, { useState } from 'react';
import { Student, Activity, DailyQuest } from '../types';
import { Card } from '../components/Card';
import { GoalInput } from '../components/GoalInput';
import { GoalList } from '../components/GoalList';
import { AchievementList } from '../components/AchievementList';
import { PodiumIcon } from '../components/icons/PodiumIcon';
import { DailyQuestCard } from '../components/DailyQuestCard';
import { QuestSubmissionModal } from '../components/QuestSubmissionModal';

interface DashboardPageProps {
  user: Student;
  addGoal: (text: string) => void;
  completeGoal: (id: string) => void;
  onViewCertificate: (activity: Activity) => void;
  onLogCompetitionClick: () => void;
  onSubmitQuest: (submissionText: string) => void;
}

export const DashboardPage = ({
  user,
  addGoal,
  completeGoal,
  onViewCertificate,
  onLogCompetitionClick,
  onSubmitQuest
}: DashboardPageProps) => {
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);

  const handleQuestSubmit = (submissionText: string) => {
      onSubmitQuest(submissionText);
      setIsQuestModalOpen(false);
  };

  return (
    <div>
        {isQuestModalOpen && user.dailyQuest && (
            <QuestSubmissionModal
                quest={user.dailyQuest}
                onClose={() => setIsQuestModalOpen(false)}
                onSubmit={handleQuestSubmit}
            />
        )}

        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Hello, {user.name}! 👋</h1>
        <p className="text-lg mb-6" style={{color: 'rgba(var(--color-text-main-rgb), 0.7)'}}>Ready to conquer your goals today?</p>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Left Column */}
            <div className="xl:col-span-7 space-y-6">
                {user.dailyQuest && (
                    <DailyQuestCard quest={user.dailyQuest} onSubmit={() => setIsQuestModalOpen(true)} />
                )}
                <Card>
                <div className="space-y-4">
                    <GoalInput addGoal={addGoal} />
                    <button
                    onClick={onLogCompetitionClick}
                    className="w-full flex items-center justify-center gap-2 text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform active:scale-95 duration-200"
                    style={{ backgroundColor: 'var(--color-primary)', '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
                    >
                    <PodiumIcon className="w-5 h-5" />
                    <span>Log Competition Result</span>
                    </button>
                </div>
                </Card>
                <GoalList activities={user.activities} completeGoal={completeGoal} />
            </div>

            {/* Right Column */}
            <div className="xl:col-span-5">
                <AchievementList
                activities={user.activities}
                onViewCertificate={onViewCertificate}
                />
            </div>
        </div>
    </div>
  );
};