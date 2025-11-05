import { useState, useEffect, useCallback } from 'react';
import { Student, Role, Message, Event, Appeal, Activity, Project, DailyQuest, CompetitionLevel, CompetitionResult, Quiz } from './types';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { MainLayout } from './layouts/MainLayout';
import { WelcomePage } from './pages/WelcomePage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { AdminLayout } from './layouts/AdminLayout';
import { PrincipalLayout } from './layouts/PrincipalLayout';
import { AwaitingVerificationPage } from './pages/AwaitingVerificationPage';
import { HomePage } from './pages/HomePage';
import { mockStudents, mockEvents, mockProjects, mockDailyQuests as questTemplates, mockQuizzes } from './data/mockData';
import { isYesterday, isToday } from './utils/dateUtils';

type View = 'homepage' | 'role-selection' | 'welcome' | 'login' | 'signup' | 'awaiting-verification';

// Helper to get a random item from an array
// FIX: Rewrote as a standard function declaration to resolve a likely parsing issue with generic arrow functions.
function getRandomItem<T>(arr: T[]): T | undefined {
    if (arr.length === 0) return undefined;
    return arr[Math.floor(Math.random() * arr.length)];
}

const App = () => {
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [allStudents, setAllStudents] =useState<Student[]>(() => {
    // Make a deep copy of mock students to avoid modifying the original mock data
    return JSON.parse(JSON.stringify(mockStudents)).map((student: Student) => ({
      ...student,
      activities: student.activities.map((activity: any) => ({
        ...activity,
        timestamp: new Date(activity.timestamp),
      })),
      lastLoginDate: student.lastLoginDate ? new Date(student.lastLoginDate).toISOString() : undefined,
    }));
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [dailyQuests, setDailyQuests] = useState<Omit<DailyQuest, 'status' | 'submissionText'>[]>(questTemplates);
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes);

  const [authFlow, setAuthFlow] = useState<{ view: View; role: Role | null }>({
    view: 'homepage',
    role: null,
  });

  const syncCurrentUser = useCallback((user: Student) => {
    setCurrentUser(user);
    setAllStudents(prev => prev.map(s => s.id === user.id ? user : s));
  }, []);

  useEffect(() => {
    document.body.className = '';
    if (currentUser) {
        if (currentUser.email === 'principal@test.com') {
            document.body.classList.add('principal-theme');
        } else if (currentUser.role === 'admin') {
            document.body.classList.add('admin-theme');
        } else {
            document.body.classList.add('app-view');
        }
    } else if (authFlow.view !== 'homepage') {
        document.body.classList.add('app-view');
    }
  }, [currentUser, authFlow.view]);
  
  const handleLogin = async (email: string, password: string): Promise<'success' | 'not-found' | 'wrong-password' | 'wrong-role'> => {
    // In a real app, this would be a secure API call. Here we mock it.
    // For this mock, we'll accept any password for a valid email.
    const user = allStudents.find(u => u.email === email);
    
    if (user) {
        if (user.email === 'principal@test.com' || user.role === authFlow.role) {
            
            // Gamification Logic: Login Streak & Daily Quest
            const today = new Date();
            const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;
            let updatedUser = { ...user };

            if (!lastLogin || !isToday(lastLogin)) {
                let newStreak = 1;
                if (lastLogin && isYesterday(lastLogin)) {
                    newStreak = (user.loginStreak || 0) + 1;
                }
                
                // FIX: Explicitly provide the generic type to `getRandomItem` to ensure correct type inference.
                const newQuestTemplate = getRandomItem<Omit<DailyQuest, 'status' | 'submissionText'>>(dailyQuests);
                
                updatedUser = {
                    ...updatedUser,
                    loginStreak: newStreak,
                    lastLoginDate: today.toISOString(),
                    dailyQuest: newQuestTemplate ? { id: newQuestTemplate.id, text: newQuestTemplate.text, reward: newQuestTemplate.reward, status: 'unclaimed' } : undefined
                };
            }
            syncCurrentUser(updatedUser);
            return 'success';
        } else {
            return 'wrong-role';
        }
    }
    return 'not-found'; // Or 'wrong-password', we can't distinguish here.
  };

  const handleSignUp = async (name: string, email: string, password: string, studentClass: string, section: string, admissionNumber: string): Promise<'success' | 'email-in-use'> => {
      if (allStudents.some(u => u.email === email)) {
          return 'email-in-use';
      }

      // FIX: Explicitly provide the generic type to `getRandomItem` to ensure correct type inference.
      const newQuestTemplate = getRandomItem<Omit<DailyQuest, 'status' | 'submissionText'>>(dailyQuests);
      
      const newUser: Student = {
          id: `student-${Date.now()}`,
          name,
          email,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
          activities: [],
          points: 0,
          academicPercentage: 70, // Default starting percentage
          role: authFlow.role as Role,
          bio: '',
          interests: [],
          class: studentClass,
          section,
          admissionNumber,
          loginStreak: 1,
          lastLoginDate: new Date().toISOString(),
          dailyQuest: newQuestTemplate ? { id: newQuestTemplate.id, text: newQuestTemplate.text, reward: newQuestTemplate.reward, status: 'unclaimed' } : undefined
      };
      
      setAllStudents(prev => [...prev, newUser]);
      setCurrentUser(newUser);

      return 'success';
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthFlow({ view: 'homepage', role: null });
  };
  
  const handleUpdateUser = (updatedUser: Student) => {
    syncCurrentUser(updatedUser);
  };
  
  const handleUpdateStudentById = (studentId: string, updatedStudentData: Partial<Student>) => {
      setAllStudents(prev => prev.map(s => {
          if (s.id === studentId) {
              return { ...s, ...updatedStudentData };
          }
          return s;
      }));
  };
  
   const handleUpdatePassword = async (currentPassword: string, newPassword: string): Promise<'success' | 'incorrect-password'> => {
    // Mock password update
    console.log("Password update attempt:", { currentPassword, newPassword });
    // In a real app, you would verify the current password.
    // Since we can't, we'll just succeed unless they type 'wrong'
    if (currentPassword === 'wrong') {
        return Promise.resolve('incorrect-password');
    }
    return Promise.resolve('success');
  };
  
  const handleSendMessage = (receiverId: string, text: string) => {
    if (!currentUser) return;
    const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        receiverId,
        text,
        timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleAddEvent = (event: Omit<Event, 'id'>) => {
    const newEvent: Event = { ...event, id: `event-${Date.now()}` };
    setEvents(prev => [newEvent, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
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

  const handleAddQuest = (quest: Omit<DailyQuest, 'id' | 'status' | 'submissionText'>) => {
    const newQuest = { ...quest, id: `quest-${Date.now()}`};
    setDailyQuests(prev => [newQuest, ...prev]);
  };

  const handleUpdateQuest = (updatedQuest: Omit<DailyQuest, 'status' | 'submissionText'>) => {
    setDailyQuests(prev => prev.map(q => q.id === updatedQuest.id ? updatedQuest : q));
  };
  
  const handleDeleteQuest = (questId: string) => {
    setDailyQuests(prev => prev.filter(q => q.id !== questId));
  };

  const handleResolveAppeal = (appealId: string, status: 'approved' | 'rejected', newPercentage?: number) => {
      const appeal = appeals.find(a => a.id === appealId);
      if (!appeal) return;

      setAppeals(prev => prev.map(a => a.id === appealId ? { ...a, status } : a));

      if (status === 'approved' && newPercentage !== undefined) {
          handleUpdateStudentById(appeal.studentId, { academicPercentage: newPercentage });
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
        timestamp: new Date()
    };
    setAppeals(prev => [newAppeal, ...prev]);
  };

  const handleResolveSubmission = (studentId: string, activityId: string, status: 'approved' | 'rejected') => {
    setAllStudents(prev => prev.map(s => {
        if (s.id === studentId) {
            const activity = s.activities.find(a => a.id === activityId);
            if (!activity) return s;

            let pointsUpdate = s.points;
            if (status === 'approved' && activity.status !== 'approved') {
                pointsUpdate += activity.points;
            } else if (status !== 'approved' && activity.status === 'approved') {
                pointsUpdate -= activity.points; // Revert points if previously approved
            }
            
            const updatedActivities = s.activities.map(a => a.id === activityId ? {...a, status, completed: status === 'approved'} : a);
            return { ...s, points: pointsUpdate, activities: updatedActivities };
        }
        return s;
    }));
  };

  const handleSubmitQuest = (submissionText: string) => {
    if (currentUser && currentUser.dailyQuest && currentUser.dailyQuest.status === 'unclaimed') {
        const updatedUser = {
            ...currentUser,
            dailyQuest: {
                ...currentUser.dailyQuest,
                status: 'pending' as const,
                submissionText: submissionText,
            }
        };
        syncCurrentUser(updatedUser);
    }
  };
  
  const handleResolveQuest = (studentId: string, status: 'approved' | 'rejected') => {
      setAllStudents(prev => prev.map(s => {
          if (s.id === studentId && s.dailyQuest?.status === 'pending') {
              const questReward = s.dailyQuest.reward;
              const newPoints = status === 'approved' ? s.points + questReward : s.points;
              const newStatus = status === 'approved' ? 'completed' as const : 'rejected' as const;
              
              return {
                  ...s,
                  points: newPoints,
                  dailyQuest: {
                      ...s.dailyQuest,
                      status: newStatus
                  }
              };
          }
          return s;
      }));
  };


  const handleJoinProject = (projectId: string) => {
      if (!currentUser) return;
      setProjects(prev => prev.map(p => {
          if (p.id === projectId && !p.members.includes(currentUser.id)) {
              return { ...p, members: [...p.members, currentUser.id] };
          }
          return p;
      }));
  };

  const handleSubmitProject = (projectId: string, submissionUrl: string) => {
      const project = projects.find(p => p.id === projectId);
      if (!project || !currentUser) return;
      
      const newActivity: Activity = {
          id: `proj-act-${Date.now()}`,
          text: `Submitted work for project: ${project.title}`,
          type: 'project',
          completed: false,
          timestamp: new Date(),
          points: project.points,
          projectSubmissionUrl: submissionUrl,
          projectTitle: project.title,
          status: 'pending',
          student_id: currentUser.id,
      };

      const updatedUser = {
          ...currentUser,
          activities: [newActivity, ...currentUser.activities]
      };
      syncCurrentUser(updatedUser);
  };

  const handleCompleteQuiz = (quizId: string, score: number, totalQuestions: number) => {
    if (!currentUser) return;

    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return;

    const pointsEarned = score * quiz.pointsPerQuestion;
    const quizName = `${quiz.subject}: ${quiz.chapter}`;

    const newActivity: Activity = {
        id: `quiz-act-${Date.now()}`,
        text: `Completed Quiz: ${quizName}`,
        type: 'quiz',
        completed: true,
        timestamp: new Date(),
        points: pointsEarned,
        quizDetails: {
            quizName,
            score,
            totalQuestions,
        },
    };

    const updatedUser: Student = {
        ...currentUser,
        points: currentUser.points + pointsEarned,
        activities: [newActivity, ...currentUser.activities],
    };

    syncCurrentUser(updatedUser);
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
                         allStudents={allStudents}
                         onResolveAppeal={handleResolveAppeal}
                         events={events} onAddEvent={handleAddEvent} onUpdateEvent={handleUpdateEvent} onDeleteEvent={handleDeleteEvent}
                         projects={projects} onAddProject={handleAddProject} onUpdateProject={handleUpdateProject} onDeleteProject={handleDeleteProject}
                         dailyQuests={dailyQuests} onAddQuest={handleAddQuest} onUpdateQuest={handleUpdateQuest} onDeleteQuest={handleDeleteQuest}
                     />;
          }
          if (currentUser.role === 'admin') {
              return <AdminLayout 
                         user={currentUser} 
                         allStudents={allStudents} 
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
                         onResolveQuest={handleResolveQuest}
                     />;
          }
          return <MainLayout 
                     user={currentUser} 
                     allStudents={allStudents}
                     projects={projects}
                     onUpdateUser={handleUpdateUser} 
                     onUpdatePassword={handleUpdatePassword}
                     onLogout={handleLogout} 
                     messages={messages}
                     onSendMessage={handleSendMessage}
                     events={events}
                     onCreateAppeal={handleCreateAppeal}
                     onSubmitQuest={handleSubmitQuest}
                     onJoinProject={handleJoinProject}
                     onSubmitProject={handleSubmitProject}
                     quizzes={quizzes}
                     onCompleteQuiz={handleCompleteQuiz}
                 />;
      }
      
      switch(authFlow.view) {
          case 'homepage':
              return <HomePage onGetStarted={() => setAuthFlow({ view: 'role-selection', role: null })} />;
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
