import { useState } from 'react';
import { Student, Message, Activity, Event, Project, DailyQuest } from '../types';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { AdminProfilePage } from '../pages/AdminProfilePage';
import { CertificateModal } from '../components/CertificateModal';
import { StudentProfilePage } from '../pages/admin/StudentProfilePage';
import { MessagesPage } from '../pages/MessagesPage';
import { LeaderboardPage } from '../pages/LeaderboardPage';
import { EventsPage } from '../pages/EventsPage';
import { MobileHeader } from '../components/MobileHeader';
import { AllStudentsPage } from '../pages/admin/AllStudentsPage';
import { ManageProjectsPage } from '../pages/admin/ManageProjectsPage';
import { ManageQuestsPage } from '../pages/admin/ManageQuestsPage';
import { AdminPage } from './layoutTypes';

interface AdminLayoutProps {
    user: Student;
    allStudents: Student[];
    onLogout: () => void;
    onUpdateStudent: (studentId: string, updatedData: Partial<Student>) => void;
    onUpdateAdmin: (admin: Student) => void;
    onUpdatePassword: (currentPassword: string, newPassword: string) => Promise<'success' | 'incorrect-password'>;
    messages: Message[];
    onSendMessage: (receiverId: string, text: string) => void;
    events: Event[];
    onAddEvent: (event: Omit<Event, 'id'>) => void;
    onUpdateEvent: (event: Event) => void;
    onDeleteEvent: (eventId: string) => void;
    onResolveSubmission: (studentId: string, activityId: string, status: 'approved' | 'rejected') => void;
    onResolveQuest: (studentId: string, status: 'approved' | 'rejected') => void;
    projects: Project[];
    onAddProject: (project: Omit<Project, 'id' | 'members'>) => void;
    onUpdateProject: (project: Project) => void;
    onDeleteProject: (projectId: string) => void;
    dailyQuests: Omit<DailyQuest, 'status' | 'submissionText'>[];
    onAddQuest: (quest: Omit<DailyQuest, 'id' | 'status' | 'submissionText'>) => void;
    onUpdateQuest: (quest: Omit<DailyQuest, 'status' | 'submissionText'>) => void;
    onDeleteQuest: (questId: string) => void;
}

export const AdminLayout = (props: AdminLayoutProps) => {
  const { 
    user, allStudents, onLogout, onUpdateStudent, onUpdateAdmin, onUpdatePassword, 
    messages, onSendMessage, events, onAddEvent, onUpdateEvent, onDeleteEvent, onResolveSubmission, onResolveQuest,
    projects, onAddProject, onUpdateProject, onDeleteProject,
    dailyQuests, onAddQuest, onUpdateQuest, onDeleteQuest
  } = props;
  const [activePage, setActivePage] = useState<AdminPage>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewingStudentId, setViewingStudentId] = useState<string | null>(null);
  const [viewingCertificate, setViewingCertificate] = useState<Activity | null>(null);

  const viewingStudent = allStudents.find(s => s.id === viewingStudentId);
  const studentUsers = allStudents.filter(s => s.role === 'student');


  const handlePageChange = (page: AdminPage) => {
    setActivePage(page);
    setViewingStudentId(null);
    setIsSidebarOpen(false);
  };

  const renderContent = () => {
    if (viewingStudent) {
        return <StudentProfilePage student={viewingStudent} onBack={() => setViewingStudentId(null)} onUpdateStudent={onUpdateStudent} />;
    }
    
    switch(activePage) {
        case 'dashboard':
            return <AdminDashboardPage 
                       allStudents={studentUsers} 
                       onViewStudentProfile={setViewingStudentId}
                       onResolveSubmission={onResolveSubmission}
                       onResolveQuest={onResolveQuest}
                   />;
        case 'allStudents':
            return <AllStudentsPage allStudents={studentUsers} onViewStudent={setViewingStudentId} />;
        case 'events':
            return <EventsPage
                        events={events}
                        isAdmin={true}
                        onAddEvent={onAddEvent}
                        onUpdateEvent={onUpdateEvent}
                        onDeleteEvent={onDeleteEvent}
                    />;
        case 'manageProjects':
            return <ManageProjectsPage 
                        projects={projects}
                        onAddProject={onAddProject}
                        onUpdateProject={onUpdateProject}
                        onDeleteProject={onDeleteProject}
                    />;
        case 'manageQuests':
            return <ManageQuestsPage 
                        quests={dailyQuests}
                        onAddQuest={onAddQuest}
                        onUpdateQuest={onUpdateQuest}
                        onDeleteQuest={onDeleteQuest}
                    />;
        case 'profile':
            return <AdminProfilePage admin={user} onUpdateAdmin={onUpdateAdmin} onUpdatePassword={onUpdatePassword} />;
        case 'messages':
            const otherUsers = allStudents.filter(s => s.id !== user.id && s.email !== 'principal@test.com');
            return <MessagesPage currentUser={user} otherUsers={otherUsers} messages={messages} onSendMessage={onSendMessage} />;
        case 'leaderboard':
             return <LeaderboardPage allStudents={studentUsers} />;
        default:
            return <AdminDashboardPage 
                       allStudents={studentUsers} 
                       onViewStudentProfile={setViewingStudentId}
                       onResolveSubmission={onResolveSubmission}
                       onResolveQuest={onResolveQuest}
                   />;
    }
  };


  return (
    <div className="admin-theme flex h-screen font-sans relative">
        {viewingCertificate && <CertificateModal achievement={viewingCertificate} onClose={() => setViewingCertificate(null)} />}
        <AdminSidebar 
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