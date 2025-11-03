import { useState } from 'react';
import { Student, Role, Message, Event, Appeal, Activity, Project, DailyQuest } from './types';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { MainLayout } from './layouts/MainLayout';
import { WelcomePage } from './pages/WelcomePage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { AdminLayout } from './layouts/AdminLayout';
import { PrincipalLayout } from './layouts/PrincipalLayout';
import { AwaitingVerificationPage } from './pages/AwaitingVerificationPage';
import { mockStudents, mockMessages, mockAppeals } from './data/mockData';
import { isYesterday, isToday } from './utils/dateUtils';


type View = 'role-selection' | 'welcome' | 'login' | 'signup' | 'awaiting-verification';
type MockStudent = Student & { password?: string };

const App = () => {
  const [students, setStudents] = useState<MockStudent[]>(mockStudents);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [events, setEvents] = useState<Event[]>([]); // Start empty
  const [appeals, setAppeals] = useState<Appeal[]>(mockAppeals);
  const [projects, setProjects] = useState<Project[]>([]); // Start empty
  const [dailyQuests, setDailyQuests] = useState<Omit<DailyQuest, 'completed'>[]>([]); // Start empty

  const [currentUser, setCurrentUser] = useState<MockStudent | null>(null);

  const [authFlow, setAuthFlow] = useState<{ view: View; role: Role | null }>({
    view: 'role-selection',
    role: null,
  });
  
  const handleLogin = async (email: string, password: string): Promise<'success' | 'not-found' | 'wrong-password' | 'wrong-role'> => {
    const user = students.find(s => s.email === email);
    
    if (!user) {
        return 'not-found';
    }
    if (user.password !== password) {
        return 'wrong-password';
    }
    if (user.role !== authFlow.role && user.email !== 'principal@test.com') { // Principal can login as admin
        return 'wrong-role';
    }
    
    // --- Gamification Logic: Login Streak & Daily Quest ---
    let updatedUser = { ...user };
    const today = new Date();
    const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;

    if (!lastLogin || !isToday(lastLogin)) {
        let newStreak = 1;
        if (lastLogin && isYesterday(lastLogin)) {
            newStreak = (user.loginStreak || 0) + 1;
        }
        
        let newQuest;
        if(dailyQuests.length > 0) {
            const newQuestIndex = Math.floor(Math.random() * dailyQuests.length);
            newQuest = dailyQuests[newQuestIndex];
        }

        updatedUser = {
            ...updatedUser,
            loginStreak: newStreak,
            lastLoginDate: today.toISOString(),
            dailyQuest: newQuest ? { ...newQuest, completed: false } : undefined
        };

        // Persist these changes
        setStudents(prev => prev.map(s => s.id === updatedUser.id ? updatedUser : s));
    }
    // --- End Gamification Logic ---

    setCurrentUser(updatedUser);
    return 'success';
  };

  const handleSignUp = async (name: string, email: string, password: string, studentClass: string, section: string, admissionNumber: string): Promise<'success' | 'email-in-use'> => {
    if (students.some(s => s.email === email)) {
        return 'email-in-use';
    }
    
    let newQuest;
    if (dailyQuests.length > 0) {
        const newQuestIndex = Math.floor(Math.random() * dailyQuests.length);
        newQuest = dailyQuests[newQuestIndex];
    }
    

    const newUser: MockStudent = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      avatar: `https://picsum.photos/seed/${name}/100/100`,
      activities: [],
      points: 0,
      academicPercentage: 0,
      role: authFlow.role!,
      bio: '',
      interests: [],
      class: studentClass,
      section,
      admissionNumber,
      loginStreak: 1,
      lastLoginDate: new Date().toISOString(),
      dailyQuest: newQuest ? { ...newQuest, completed: false } : undefined,
    };

    setStudents(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return 'success';
  };
  
  const handleLogout = async () => {
    setCurrentUser(null);
    setAuthFlow({ view: 'role-selection', role: null });
  };

  const handleUpdateUser = async (updatedUser: Student) => {
    setStudents(prev => prev.map(s => {
        if (s.id === updatedUser.id) {
            const oldUser = students.find(old => old.id === updatedUser.id);
            return { ...updatedUser, password: oldUser?.password };
        }
        return s;
    }));
    setCurrentUser(updatedUser);
  };

  const handleUpdatePassword = async (currentPassword: string, newPassword: string): Promise<'success' | 'incorrect-password'> => {
    if (!currentUser) return 'incorrect-password';
    
    const userInDb = students.find(s => s.id === currentUser.id);

    if (!userInDb || userInDb.password !== currentPassword) {
        return 'incorrect-password';
    }

    const updatedUser: MockStudent = { ...userInDb, password: newPassword };
    setStudents(prev => prev.map(s => s.id === currentUser.id ? updatedUser : s));
    setCurrentUser(updatedUser);
    return 'success';
  }
  
  const handleUpdateStudentById = async (studentId: string, updatedStudentData: Partial<Student>) => {
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, ...updatedStudentData } : s));
  };

  const handleSendMessage = async (receiverId: string, text: string) => {
    if (!currentUser) return;
    const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        receiverId,
        text,
        timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // --- Admin Content Management Handlers ---

  const handleAddEvent = async (event: Omit<Event, 'id'>) => {
    const newEvent: Event = { ...event, id: `event-${Date.now()}` };
    setEvents(prev => [...prev, newEvent].sort((a,b) => a.date.localeCompare(b.date)));
  };
  
  const handleUpdateEvent = async (updatedEvent: Event) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e).sort((a,b) => a.date.localeCompare(b.date)));
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };
  
  const handleAddProject = (project: Omit<Project, 'id' | 'members'>) => {
    const newProject: Project = { ...project, id: `proj-${Date.now()}`, members: [] };
    setProjects(prev => [newProject, ...prev]);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };
  
  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const handleAddQuest = (quest: Omit<DailyQuest, 'id' | 'completed'>) => {
    const newQuest = { ...quest, id: `quest-${Date.now()}`};
    setDailyQuests(prev => [newQuest, ...prev]);
  };

  const handleUpdateQuest = (updatedQuest: Omit<DailyQuest, 'completed'>) => {
    setDailyQuests(prev => prev.map(q => q.id === updatedQuest.id ? updatedQuest : q));
  };
  
  const handleDeleteQuest = (questId: string) => {
    setDailyQuests(prev => prev.filter(q => q.id !== questId));
  };

  // --- End Admin Handlers ---
  
  const handleResolveAppeal = async (appealId: string, status: 'approved' | 'rejected', newPercentage?: number) => {
      setAppeals(prev => prev.map(a => a.id === appealId ? { ...a, status } : a));

      if (status === 'approved' && newPercentage !== undefined) {
          const appeal = appeals.find(a => a.id === appealId);
          if (appeal) {
              await handleUpdateStudentById(appeal.studentId, { academicPercentage: newPercentage });
          }
      }
  };
  
  const handleCreateAppeal = (claimedPercentage: number, reason: string, answerSheetUrl: string) => {
    if (!currentUser || currentUser.role !== 'student') return;
    const newAppeal: Appeal = {
      id: `appeal-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      claimedPercentage,
      reason,
      answerSheetUrl,
      status: 'pending',
      timestamp: new Date(),
    };
    setAppeals(prev => [newAppeal, ...prev]);
  };

  const handleResolveSubmission = async (studentId: string, activityId: string, status: 'approved' | 'rejected') => {
    const studentToUpdate = students.find(s => s.id === studentId);
    if (studentToUpdate) {
        let pointsUpdate = studentToUpdate.points;
        const newActivities = studentToUpdate.activities.map((activity) => {
            if (activity.id === activityId) {
                if (status === 'approved' && activity.status !== 'approved') {
                    pointsUpdate += activity.points;
                } else if (status === 'rejected' && activity.status === 'approved') {
                    pointsUpdate -= activity.points;
                }
                return { ...activity, status: status, completed: status === 'approved' };
            }
            return activity;
        });
        await handleUpdateStudentById(studentId, { activities: newActivities, points: pointsUpdate });
    }
  };
  
    const handleClaimQuestReward = () => {
        if (currentUser && currentUser.dailyQuest && !currentUser.dailyQuest.completed) {
            const updatedUser = {
                ...currentUser,
                points: currentUser.points + currentUser.dailyQuest.reward,
                dailyQuest: { ...currentUser.dailyQuest, completed: true },
            };
            handleUpdateUser(updatedUser);
        }
    };

    const handleJoinProject = (projectId: string) => {
        if (!currentUser) return;
        setProjects(prevProjects => prevProjects.map(p => 
            p.id === projectId ? { ...p, members: [...p.members, currentUser.id] } : p
        ));
    };

    const handleSubmitProject = (projectId: string, submissionUrl: string) => {
        const project = projects.find(p => p.id === projectId);
        if (!project || !currentUser) return;

        const newProjectActivity: Activity = {
            id: `proj-act-${Date.now()}`,
            text: `Submitted work for project: ${project.title}`,
            type: 'project',
            completed: false, // Pending approval
            timestamp: new Date(),
            points: project.points,
            projectSubmissionUrl: submissionUrl,
            projectTitle: project.title,
            status: 'pending',
        };

        const updatedUser = {
            ...currentUser,
            activities: [newProjectActivity, ...currentUser.activities],
        };
        handleUpdateUser(updatedUser);
    };


  const renderContent = () => {
      if (currentUser) {
          if (currentUser.email === 'principal@test.com') { 
              return <PrincipalLayout
                         user={currentUser}
                         onLogout={handleLogout}
                         onUpdateUser={handleUpdateUser}
                         onUpdatePassword={handleUpdatePassword}
                         appeals={appeals}
                         allStudents={students}
                         onResolveAppeal={handleResolveAppeal}
                         events={events} onAddEvent={handleAddEvent} onUpdateEvent={handleUpdateEvent} onDeleteEvent={handleDeleteEvent}
                         projects={projects} onAddProject={handleAddProject} onUpdateProject={handleUpdateProject} onDeleteProject={handleDeleteProject}
                         dailyQuests={dailyQuests} onAddQuest={handleAddQuest} onUpdateQuest={handleUpdateQuest} onDeleteQuest={handleDeleteQuest}
                     />;
          }
          if (currentUser.role === 'admin') {
              return <AdminLayout 
                         user={currentUser} 
                         allStudents={students} 
                         onLogout={handleLogout} 
                         onUpdateStudent={handleUpdateStudentById} 
                         onUpdateAdmin={handleUpdateUser}
                         onUpdatePassword={handleUpdatePassword}
                         messages={messages}
                         onSendMessage={handleSendMessage}
                         events={events}
                         onAddEvent={handleAddEvent} onUpdateEvent={handleUpdateEvent} onDeleteEvent={handleDeleteEvent}
                         onResolveSubmission={handleResolveSubmission}
                         projects={projects} onAddProject={handleAddProject} onUpdateProject={handleUpdateProject} onDeleteProject={handleDeleteProject}
                         dailyQuests={dailyQuests} onAddQuest={handleAddQuest} onUpdateQuest={handleUpdateQuest} onDeleteQuest={handleDeleteQuest}
                     />;
          }
          return <MainLayout 
                     user={currentUser} 
                     allStudents={students}
                     projects={projects}
                     onUpdateUser={handleUpdateUser} 
                     onUpdatePassword={handleUpdatePassword}
                     onLogout={handleLogout} 
                     messages={messages}
                     onSendMessage={handleSendMessage}
                     events={events}
                     onCreateAppeal={handleCreateAppeal}
                     onClaimQuestReward={handleClaimQuestReward}
                     onJoinProject={handleJoinProject}
                     onSubmitProject={handleSubmitProject}
                 />;
      }
      
      switch(authFlow.view) {
          case 'login':
              return <LoginPage role={authFlow.role!} onLogin={handleLogin} onSwitchToSignUp={() => setAuthFlow(p => ({...p, view: 'signup'}))} onBack={() => setAuthFlow(p => ({...p, view: 'welcome'}))} />;
          case 'signup':
              return <SignUpPage role={authFlow.role!} onSignUp={handleSignUp} onSwitchToLogin={() => setAuthFlow(p => ({...p, view: 'login'}))} onBack={() => setAuthFlow(p => ({...p, view: 'welcome'}))} />;
          case 'awaiting-verification':
              return <AwaitingVerificationPage onVerify={() => {}} onBackToLogin={() => setAuthFlow(p => ({...p, view: 'login'}))} />;
          case 'welcome':
              return <WelcomePage role={authFlow.role!} onLoginClick={() => setAuthFlow(p => ({...p, view: 'login'}))} onSignUpClick={() => setAuthFlow(p => ({...p, view: 'signup'}))} onBack={() => setAuthFlow({ view: 'role-selection', role: null })} />;
          case 'role-selection':
          default:
              return <RoleSelectionPage onRoleSelect={(role) => setAuthFlow({ view: 'welcome', role })} />;
      }
  }

  return (
    <div className="h-full bg-inherit">
        {renderContent()}
    </div>
  );
};

export default App;