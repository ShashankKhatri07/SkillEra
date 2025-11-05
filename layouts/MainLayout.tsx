import { useState, useEffect, useRef } from 'react';
import { Activity, Student, Event, Badge, CompetitionLevel, CompetitionResult, Level, Message, Project, Quiz } from '../types';
import { allBadges } from '../data/rewards';
import { getUserLevelInfo } from '../utils/levelUtils';
import { isToday } from '../utils/dateUtils';
import { Sidebar } from '../components/Sidebar';
import { DashboardPage } from '../pages/DashboardPage';
import { ProfilePage } from '../pages/ProfilePage';
import { LeaderboardPage } from '../pages/LeaderboardPage';
import { RewardsPage } from '../pages/RewardsPage';
import { EventsPage } from '../pages/EventsPage';
import { MessagesPage } from '../pages/MessagesPage';
import { MobileHeader } from '../components/MobileHeader';

import { NewBadgeUnlockedModal } from '../components/NewBadgeUnlockedModal';
import { LevelUpModal } from '../components/LevelUpModal';
import { LogCompetitionModal } from '../components/LogCompetitionModal';
import { CertificateModal } from '../components/CertificateModal';
import { LearningHubPage } from '../pages/LearningHubPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { MentorshipPage } from '../pages/MentorshipPage';
import { Page } from './layoutTypes';
import { QuizPage } from '../pages/QuizPage';

interface MainLayoutProps {
    user: Student;
    allStudents: Student[];
    projects: Project[];
    onUpdateUser: (user: Student) => void;
    onUpdatePassword: (currentPassword: string, newPassword: string) => Promise<'success' | 'incorrect-password'>;
    onLogout: () => void;
    messages: Message[];
    onSendMessage: (receiverId: string, text: string) => void;
    events: Event[];
    onCreateAppeal: (claimedPercentage: number, reason: string, answerSheetUrl: string) => void;
    onSubmitQuest: (submissionText: string) => void;
    onJoinProject: (projectId: string) => void;
    onSubmitProject: (projectId: string, submissionUrl: string) => void;
    quizzes: Quiz[];
    onCompleteQuiz: (quizId: string, score: number, totalQuestions: number) => void;
}

const POINTS_PER_GOAL = 10;

export const MainLayout = (props: MainLayoutProps) => {
  const { user, allStudents, projects, onUpdateUser, onUpdatePassword, onLogout, messages, onSendMessage, events, onCreateAppeal, onSubmitQuest, onJoinProject, onSubmitProject, quizzes, onCompleteQuiz } = props;
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);
  const [unlockedLevel, setUnlockedLevel] = useState<Level | null>(null);
  const [isLogCompetitionModalOpen, setIsLogCompetitionModalOpen] = useState(false);
  const [viewingCertificate, setViewingCertificate] = useState<Activity | null>(null);
  const prevPoints = useRef(user.points);

  useEffect(() => {
    // If the last login wasn't today, this logic is handled in App.tsx handleLogin
    // This effect handles changes happening *within* a session
    const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : new Date();
    if (!isToday(lastLogin)) {
        // A full login flow would refresh this, but for mock data persistence, we'll force a mini-refresh here.
        // In a real app, you might force a re-authentication or data refresh.
        const updatedUser = { ...user, lastLoginDate: new Date().toISOString(), loginStreak: 1 };
        onUpdateUser(updatedUser);
    }
  }, [user.lastLoginDate, onUpdateUser]);

  useEffect(() => {
    const currentLevel = getUserLevelInfo(user.points);
    const prevLevel = getUserLevelInfo(prevPoints.current);

    if (user.points > prevPoints.current) {
        const newlyUnlockedBadge = allBadges.find(badge => 
            user.points >= badge.pointsRequired && prevPoints.current < badge.pointsRequired
        );
        if (newlyUnlockedBadge) {
            setTimeout(() => setUnlockedBadge(newlyUnlockedBadge), 500);
        }

        if (currentLevel.level > prevLevel.level) {
            setTimeout(() => setUnlockedLevel(currentLevel), 500);
        }
    }
    prevPoints.current = user.points;
  }, [user.points]);
  
  const addGoal = (text: string) => {
    const newGoal: Activity = {
      id: Date.now().toString(), text, type: 'goal', completed: false, timestamp: new Date(),
      points: POINTS_PER_GOAL,
    };
    onUpdateUser({ ...user, activities: [newGoal, ...user.activities] });
  };

  const completeGoal = (id: string) => {
    onUpdateUser({
        ...user,
        points: user.points + POINTS_PER_GOAL,
        activities: user.activities.map(act =>
            act.id === id ? { ...act, completed: true, timestamp: new Date() } : act
        ),
    });
  };
  
  const logCompetition = (level: CompetitionLevel, result: CompetitionResult, points: number, certificateUrl: string) => {
    const newCompetition: Activity = {
        id: Date.now().toString(), text: `${result === 'won' ? 'Won' : 'Participated in'} a ${level} competition`,
        type: 'competition',
        completed: false, // Will be true only after admin approval
        timestamp: new Date(),
        points,
        competitionLevel: level,
        result: result,
        certificateUrl: certificateUrl,
        status: 'pending',
    };
    onUpdateUser({
        ...user,
        activities: [newCompetition, ...user.activities],
    });
    setIsLogCompetitionModalOpen(false);
  };

  const handlePageChange = (page: Page) => {
    setActivePage(page);
    setIsSidebarOpen(false);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage 
                    user={user} 
                    addGoal={addGoal}
                    completeGoal={completeGoal}
                    onViewCertificate={setViewingCertificate}
                    onLogCompetitionClick={() => setIsLogCompetitionModalOpen(true)}
                    onSubmitQuest={onSubmitQuest}
                />;
      case 'profile':
        return <ProfilePage user={user} onUpdateUser={onUpdateUser} onUpdatePassword={onUpdatePassword} onCreateAppeal={onCreateAppeal} />;
      case 'leaderboard':
        return <LeaderboardPage allStudents={allStudents} />;
      case 'rewards':
        return <RewardsPage user={user} />;
      case 'events':
        return <EventsPage events={events} />;
      case 'messages':
        const otherUsers = allStudents.filter(s => s.id !== user.id && s.email !== 'principal@test.com');
        return <MessagesPage currentUser={user} otherUsers={otherUsers} messages={messages} onSendMessage={onSendMessage} />;
      case 'learningHub':
        return <LearningHubPage user={user} onNavigate={handlePageChange} onUpdateUser={onUpdateUser} />;
      case 'projects':
        return <ProjectsPage user={user} projects={projects} onJoinProject={onJoinProject} onSubmitProject={onSubmitProject} />;
      case 'mentorship':
        const mentors = allStudents.filter(s => s.isMentor && s.id !== user.id);
        const peers = allStudents.filter(s => s.role === 'student' && !s.isMentor && s.id !== user.id);
        return <MentorshipPage mentors={mentors} peers={peers} onSendMessage={onSendMessage} />;
      case 'quizzes':
        return <QuizPage quizzes={quizzes} onCompleteQuiz={onCompleteQuiz} />;
      default:
        return <DashboardPage user={user} addGoal={addGoal} completeGoal={completeGoal} onViewCertificate={setViewingCertificate} onLogCompetitionClick={() => setIsLogCompetitionModalOpen(true)} onSubmitQuest={onSubmitQuest} />;
    }
  };
  
  return (
    <div className="flex h-screen bg-inherit font-sans relative">
      {unlockedBadge && <NewBadgeUnlockedModal badge={unlockedBadge} onClose={() => setUnlockedBadge(null)} />}
      {unlockedLevel && <LevelUpModal level={unlockedLevel} onClose={() => setUnlockedLevel(null)} />}
      {isLogCompetitionModalOpen && <LogCompetitionModal onSubmit={logCompetition} onClose={() => setIsLogCompetitionModalOpen(false)} />}
      {viewingCertificate && <CertificateModal achievement={viewingCertificate} onClose={() => setViewingCertificate(null)} />}
      
      <Sidebar 
        user={user} 
        onLogout={onLogout} 
        activePage={activePage} 
        setActivePage={handlePageChange} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--color-bg-main)' }}>
            <div className="p-4 sm:p-6 lg:p-8">
                {renderPage()}
            </div>
        </main>
      </div>
    </div>
  );
};