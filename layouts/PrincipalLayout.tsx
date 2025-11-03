import { useState } from 'react';
import { Student, Appeal, Project, DailyQuest, Event } from '../types';
import { PrincipalSidebar } from '../components/principal/PrincipalSidebar';
import { MobileHeader } from '../components/MobileHeader';
import { PrincipalDashboardPage } from '../pages/PrincipalDashboardPage';
import { PrincipalProfilePage } from '../pages/PrincipalProfilePage';
import { AllStudentsPage } from '../pages/principal/AllStudentsPage';
import { StudentProfilePage } from '../pages/admin/StudentProfilePage';
import { ManageProjectsPage } from '../pages/admin/ManageProjectsPage';
import { ManageQuestsPage } from '../pages/admin/ManageQuestsPage';
import { EventsPage } from '../pages/EventsPage';


interface PrincipalLayoutProps {
    user: Student;
    onLogout: () => void;
    onUpdateUser: (principal: Student) => void;
    onUpdatePassword: (currentPassword: string, newPassword: string) => Promise<'success' | 'incorrect-password'>;
    appeals: Appeal[];
    allStudents: Student[];
    onResolveAppeal: (appealId: string, status: 'approved' | 'rejected', newPercentage?: number) => void;
    events: Event[];
    onAddEvent: (event: Omit<Event, 'id'>) => void;
    onUpdateEvent: (event: Event) => void;
    onDeleteEvent: (eventId: string) => void;
    projects: Project[];
    onAddProject: (project: Omit<Project, 'id' | 'members'>) => void;
    onUpdateProject: (project: Project) => void;
    onDeleteProject: (projectId: string) => void;
    dailyQuests: Omit<DailyQuest, 'completed'>[];
    onAddQuest: (quest: Omit<DailyQuest, 'id' | 'completed'>) => void;
    onUpdateQuest: (quest: Omit<DailyQuest, 'completed'>) => void;
    onDeleteQuest: (questId: string) => void;
}

export type PrincipalPage = 'dashboard' | 'profile' | 'allStudents' | 'events' | 'manageProjects' | 'manageQuests';

export const PrincipalLayout = (props: PrincipalLayoutProps) => {
  const { 
    user, onLogout, onUpdateUser, onUpdatePassword, appeals, onResolveAppeal, allStudents,
    events, onAddEvent, onUpdateEvent, onDeleteEvent,
    projects, onAddProject, onUpdateProject, onDeleteProject,
    dailyQuests, onAddQuest, onUpdateQuest, onDeleteQuest
   } = props;
  const [activePage, setActivePage] = useState<PrincipalPage>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewingStudentId, setViewingStudentId] = useState<string | null>(null);

  const viewingStudent = allStudents.find(s => s.id === viewingStudentId);

  const handlePageChange = (page: PrincipalPage) => {
    setActivePage(page);
    setViewingStudentId(null); // Reset student view when changing main page
    setIsSidebarOpen(false);
  };
  
  const handleViewStudent = (studentId: string) => {
    setViewingStudentId(studentId);
  }

  const renderContent = () => {
    if (viewingStudent) {
        // We can reuse the admin's student profile page view
        return <StudentProfilePage student={viewingStudent} onBack={() => setViewingStudentId(null)} onUpdateStudent={() => {}} />;
    }
    switch(activePage) {
        case 'dashboard':
            return <PrincipalDashboardPage appeals={appeals} allStudents={allStudents} onResolveAppeal={onResolveAppeal} />;
        case 'profile':
            return <PrincipalProfilePage principal={user} onUpdateUser={onUpdateUser} onUpdatePassword={onUpdatePassword} />;
        case 'allStudents':
            return <AllStudentsPage allStudents={allStudents} onViewStudent={handleViewStudent} />;
        case 'events':
            return <EventsPage events={events} isAdmin={true} onAddEvent={onAddEvent} onUpdateEvent={onUpdateEvent} onDeleteEvent={onDeleteEvent} />;
        case 'manageProjects':
            return <ManageProjectsPage projects={projects} onAddProject={onAddProject} onUpdateProject={onUpdateProject} onDeleteProject={onDeleteProject} />;
        case 'manageQuests':
            return <ManageQuestsPage quests={dailyQuests} onAddQuest={onAddQuest} onUpdateQuest={onUpdateQuest} onDeleteQuest={onDeleteQuest} />;
        default:
            return <PrincipalDashboardPage appeals={appeals} allStudents={allStudents} onResolveAppeal={onResolveAppeal} />;
    }
  };

  return (
    <div className="principal-theme flex h-screen font-sans relative">
        <PrincipalSidebar 
            user={user} 
            onLogout={onLogout} 
            activePage={activePage} 
            setActivePage={handlePageChange} 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
            <main className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6 lg:p-8">
                   {renderContent()}
                </div>
            </main>
        </div>
    </div>
  );
};