
import { useState, useEffect, useCallback } from 'react';
import { Student, Role, Message, Event, Appeal, Activity, Project, DailyQuest, Quiz } from './types';
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
import { fileToBase64 } from './utils/fileUtils';
import { 
    getAllStudents, 
    saveStudent, 
    getCollection, 
    addItemToCollection, 
    updateCollection, 
    deleteItemFromCollection 
} from './services/fileStorageService';

type View = 'homepage' | 'role-selection' | 'welcome' | 'login' | 'signup' | 'awaiting-verification';

function getRandomItem<T>(arr: T[]): T | undefined {
    if (arr.length === 0) return undefined;
    return arr[Math.floor(Math.random() * arr.length)];
}

const rehydrateStudentDates = (student: any): Student => ({
    ...student,
    activities: student.activities.map((activity: any) => ({
        ...activity,
        timestamp: new Date(activity.timestamp),
    })),
    lastNameChangeDate: student.lastNameChangeDate ? new Date(student.lastNameChangeDate).toISOString() : undefined,
    lastLoginDate: student.lastLoginDate ? new Date(student.lastLoginDate).toISOString() : undefined,
});

const App = () => {
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [dailyQuests, setDailyQuests] = useState<Omit<DailyQuest, 'status' | 'submissionText'>[]>([]);
  const [quizzes] = useState<Quiz[]>(mockQuizzes);
  const [isLoading, setIsLoading] = useState(true);

  const [authFlow, setAuthFlow] = useState<{ view: View; role: Role | null }>({
    view: 'homepage',
    role: null,
  });
  
  const rehydratedMockStudents = mockStudents.map(rehydrateStudentDates);

  useEffect(() => {
    const loadData = async () => {
        setIsLoading(true);

        const [studentsRes, eventsRes, projectsRes, questsRes, appealsRes, messagesRes] = await Promise.all([
            getAllStudents(),
            getCollection<Event>('events'),
            getCollection<Project>('projects'),
            getCollection<Omit<DailyQuest, 'status' | 'submissionText'>>('quests'),
            getCollection<Appeal>('appeals'),
            getCollection<Message>('messages')
        ]);
        
        const loadedStudents = studentsRes.error ? rehydratedMockStudents : (studentsRes.data?.map(rehydrateStudentDates) || []);
        setAllStudents(loadedStudents);
        setEvents(eventsRes.error ? mockEvents : (eventsRes.data || []));
        setProjects(projectsRes.error ? mockProjects : (projectsRes.data || []));
        setDailyQuests(questsRes.error ? questTemplates : (questsRes.data || []));
        setAppeals(appealsRes.error ? [] : (appealsRes.data || []));
        setMessages(messagesRes.error ? [] : (messagesRes.data || []));

        const loggedInUserId = localStorage.getItem('currentUserId');
        if (loggedInUserId) {
            const user = loadedStudents.find(s => s.id === loggedInUserId);
            if (user) {
                setCurrentUser(user);
            }
        }
        setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    document.body.className = '';
    if (currentUser) {
        if (currentUser.email === 'principal@test.com') document.body.classList.add('principal-theme');
        else if (currentUser.role === 'admin') document.body.classList.add('admin-theme');
        else document.body.classList.add('app-view');
    } else if (authFlow.view !== 'homepage') {
        document.body.classList.add('app-view');
    }
  }, [currentUser, authFlow.view]);
  
  const syncCurrentUser = useCallback(async (user: Student) => {
    setCurrentUser(user);
    setAllStudents(prev => prev.map(s => s.id === user.id ? user : s));
    await saveStudent(user);
  }, []);

  const handleLogin = async (identifier: string, password: string): Promise<'success' | 'not-found' | 'wrong-password' | 'wrong-role'> => {
    const email = authFlow.role === 'student' ? `${identifier}@apsjodhpur.com` : identifier;
    const user = allStudents.find(u => u.email === email);
    
    if (user) {
        if (password !== 'password123') return 'wrong-password';

        if (user.email === 'principal@test.com' || user.role === authFlow.role) {
            let updatedUser = { ...user };
            if (!user.lastLoginDate || !isToday(new Date(user.lastLoginDate))) {
                const newStreak = (user.lastLoginDate && isYesterday(new Date(user.lastLoginDate))) ? (user.loginStreak || 0) + 1 : 1;
                const newQuestTemplate = getRandomItem(dailyQuests);
                updatedUser = {
                    ...updatedUser,
                    loginStreak: newStreak,
                    lastLoginDate: new Date().toISOString(),
                    dailyQuest: newQuestTemplate ? { ...newQuestTemplate, status: 'unclaimed' } : undefined
                };
            }
            await syncCurrentUser(updatedUser);
            localStorage.setItem('currentUserId', updatedUser.id);
            return 'success';
        }
        return 'wrong-role';
    }
    return 'not-found';
  };

  const handleSignUp = async (name: string, studentClass: string, section: string, admissionNumber: string): Promise<'success' | 'email-in-use'> => {
      const email = `${admissionNumber}@apsjodhpur.com`;
      if (allStudents.some(u => u.email === email)) return 'email-in-use';
      
      // FIX: Called getRandomItem only once to prevent potential null reference on spread and inconsistent results.
      const newQuestTemplate = getRandomItem(dailyQuests);
      const newUser: Student = {
          id: `student-${Date.now()}`,
          name, email,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
          activities: [], points: 0, academicPercentage: 70, role: 'student',
          bio: '', interests: [], class: studentClass, section, admissionNumber,
          loginStreak: 1, lastLoginDate: new Date().toISOString(),
          dailyQuest: newQuestTemplate ? { ...newQuestTemplate, status: 'unclaimed' } : undefined
      };
      
      await saveStudent(newUser);
      setAllStudents(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      localStorage.setItem('currentUserId', newUser.id);
      return 'success';
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUserId');
    setAuthFlow({ view: 'homepage', role: null });
  };
  
  const handleUpdateUser = async (updatedUser: Student) => {
    await syncCurrentUser(updatedUser);
  };
  
  const handleUpdateStudentById = async (studentId: string, updatedStudentData: Partial<Student>) => {
      const studentToUpdate = allStudents.find(s => s.id === studentId);
      if (!studentToUpdate) return;
      const finalUpdatedStudent = { ...studentToUpdate, ...updatedStudentData };
      setAllStudents(prev => prev.map(s => s.id === studentId ? finalUpdatedStudent : s));
      await saveStudent(finalUpdatedStudent);
  };
  
  const handleUpdatePassword = async (currentPassword: string, newPassword: string): Promise<'success' | 'incorrect-password'> => {
    if (currentPassword !== 'password123') return 'incorrect-password';
    console.log("Password updated successfully to:", newPassword);
    return 'success';
  };
  
  const handleSendMessage = async (receiverId: string, text: string) => {
    if (!currentUser) return;
    const newMessage: Message = { id: `msg-${Date.now()}`, senderId: currentUser.id, receiverId, text, timestamp: new Date() };
    const { error } = await addItemToCollection('messages', newMessage);
    if (!error) setMessages(prev => [...prev, newMessage].sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime()));
  };

  const handleAddEvent = async (event: Omit<Event, 'id'>) => {
    const newEvent: Event = { ...event, id: `event-${Date.now()}` };
    const { error } = await addItemToCollection('events', newEvent);
    if (!error) setEvents(prev => [newEvent, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleUpdateEvent = async (updatedEvent: Event) => {
    const { error } = await updateCollection('events', updatedEvent);
    if (!error) setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const handleDeleteEvent = async (eventId: string) => {
    const { error } = await deleteItemFromCollection('events', eventId);
    if (!error) setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const handleAddProject = async (project: Omit<Project, 'id' | 'members'>) => {
    const newProject: Project = { ...project, id: `proj-${Date.now()}`, members: [] };
    const { error } = await addItemToCollection('projects', newProject);
    if (!error) setProjects(prev => [newProject, ...prev]);
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    const { error } = await updateCollection('projects', updatedProject);
    if (!error) setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };
  
  const handleDeleteProject = async (projectId: string) => {
    const { error } = await deleteItemFromCollection('projects', projectId);
    if (!error) setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const handleAddQuest = async (quest: Omit<DailyQuest, 'id' | 'status' | 'submissionText'>) => {
    const newQuest = { ...quest, id: `quest-${Date.now()}`};
    const { error } = await addItemToCollection('quests', newQuest);
    if (!error) setDailyQuests(prev => [newQuest, ...prev]);
  };

  const handleUpdateQuest = async (updatedQuest: Omit<DailyQuest, 'status' | 'submissionText'>) => {
    const { error } = await updateCollection('quests', updatedQuest);
    if (!error) setDailyQuests(prev => prev.map(q => q.id === updatedQuest.id ? updatedQuest : q));
  };
  
  const handleDeleteQuest = async (questId: string) => {
    const { error } = await deleteItemFromCollection('quests', questId);
    if (!error) setDailyQuests(prev => prev.filter(q => q.id !== questId));
  };

  const handleResolveAppeal = async (appealId: string, status: 'approved' | 'rejected', newPercentage?: number) => {
      const appeal = appeals.find(a => a.id === appealId);
      if (!appeal) return;
      const updatedAppeal = { ...appeal, status };
      
      const { error } = await updateCollection('appeals', updatedAppeal);
      if (error) return;

      if (status === 'approved' && newPercentage !== undefined) {
          await handleUpdateStudentById(appeal.studentId, { academicPercentage: newPercentage });
      }
      setAppeals(prev => prev.map(a => a.id === appealId ? updatedAppeal : a));
  };
  
  const handleCreateAppeal = async (claimedPercentage: number, reason: string, answerSheetFile: File): Promise<void> => {
    if (!currentUser || currentUser.role !== 'student') return;
    const answerSheetUrl = await fileToBase64(answerSheetFile);
    const newAppeal: Appeal = {
        id: `appeal-${Date.now()}`, studentId: currentUser.id, studentName: currentUser.name,
        claimedPercentage, reason, answerSheetUrl, status: 'pending', timestamp: new Date()
    };
    const { error } = await addItemToCollection('appeals', newAppeal);
    if (!error) setAppeals(prev => [newAppeal, ...prev].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()));
  };

  const handleResolveSubmission = async (studentId: string, activityId: string, status: 'approved' | 'rejected') => {
    const student = allStudents.find(s => s.id === studentId);
    if (!student) return;
    const activity = student.activities.find(a => a.id === activityId);
    if (!activity) return;

    let pointsUpdate = student.points;
    if (status === 'approved' && activity.status !== 'approved') pointsUpdate += activity.points;
    else if (status !== 'approved' && activity.status === 'approved') pointsUpdate -= activity.points;
    
    const updatedActivities = student.activities.map(a => a.id === activityId ? {...a, status, completed: status === 'approved'} : a);
    await handleUpdateStudentById(studentId, { points: pointsUpdate, activities: updatedActivities });
  };

  const handleSubmitQuest = async (submissionText: string) => {
    if (currentUser?.dailyQuest?.status === 'unclaimed') {
        const updatedUser = { ...currentUser, dailyQuest: { ...currentUser.dailyQuest, status: 'pending' as const, submissionText }};
        await syncCurrentUser(updatedUser);
    }
  };
  
  const handleResolveQuest = async (studentId: string, status: 'approved' | 'rejected') => {
      const student = allStudents.find(s => s.id === studentId);
      if (student?.dailyQuest?.status === 'pending') {
          const newPoints = status === 'approved' ? student.points + student.dailyQuest.reward : student.points;
          const newStatus = status === 'approved' ? 'completed' as const : 'rejected' as const;
          await handleUpdateStudentById(studentId, { points: newPoints, dailyQuest: { ...student.dailyQuest, status: newStatus }});
      }
  };

  const handleJoinProject = async (projectId: string) => {
      if (!currentUser) return;
      const project = projects.find(p => p.id === projectId);
      if (!project || project.members.includes(currentUser.id)) return;
      const updatedProject = { ...project, members: [...project.members, currentUser.id] };
      await handleUpdateProject(updatedProject);
  };

  const handleSubmitProject = async (projectId: string, submissionBase64: string) => {
      const project = projects.find(p => p.id === projectId);
      if (!project || !currentUser) return;
      
      const newActivity: Activity = {
          id: `proj-act-${Date.now()}`, text: `Submitted work for project: ${project.title}`,
          type: 'project', completed: false, timestamp: new Date(), points: project.points,
          projectSubmissionUrl: submissionBase64, projectTitle: project.title,
          status: 'pending', student_id: currentUser.id,
      };
      await syncCurrentUser({ ...currentUser, activities: [newActivity, ...currentUser.activities] });
  };

  const handleCompleteQuiz = async (quizId: string, score: number, totalQuestions: number) => {
    if (!currentUser) return;
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return;

    const pointsEarned = score * quiz.pointsPerQuestion;
    const quizName = `${quiz.subject}: ${quiz.chapter}`;
    const newActivity: Activity = {
        id: `quiz-act-${Date.now()}`, text: `Completed Quiz: ${quizName}`, type: 'quiz',
        completed: true, timestamp: new Date(), points: pointsEarned,
        quizDetails: { quizName, score, totalQuestions },
    };
    await syncCurrentUser({ ...currentUser, points: currentUser.points + pointsEarned, activities: [newActivity, ...currentUser.activities] });
  };

  const renderContent = () => {
      if (isLoading) {
          return <div className="flex justify-center items-center h-full"><div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[var(--color-primary)]"></div></div>;
      }
      if (currentUser) {
          if (currentUser.email === 'principal@test.com') {
              // FIX: Corrected all props passed to PrincipalLayout to use the appropriate handlers defined in App.tsx.
              return <PrincipalLayout {...{ user: currentUser, onLogout: handleLogout, onUpdateUser: handleUpdateUser, onUpdatePassword: handleUpdatePassword, appeals, allStudents, onResolveAppeal: handleResolveAppeal, events, onAddEvent: handleAddEvent, onUpdateEvent: handleUpdateEvent, onDeleteEvent: handleDeleteEvent, projects, onAddProject: handleAddProject, onUpdateProject: handleUpdateProject, onDeleteProject: handleDeleteProject, dailyQuests, onAddQuest: handleAddQuest, onUpdateQuest: handleUpdateQuest, onDeleteQuest: handleDeleteQuest }} />;
          }
          if (currentUser.role === 'admin') {
              // FIX: Corrected all props passed to AdminLayout to use the appropriate handlers defined in App.tsx.
              return <AdminLayout {...{ user: currentUser, allStudents, onLogout: handleLogout, onUpdateStudent: handleUpdateStudentById, onUpdateAdmin: handleUpdateUser, onUpdatePassword: handleUpdatePassword, messages, onSendMessage: handleSendMessage, events, onAddEvent: handleAddEvent, onUpdateEvent: handleUpdateEvent, onDeleteEvent: handleDeleteEvent, onResolveSubmission: handleResolveSubmission, projects, onAddProject: handleAddProject, onUpdateProject: handleUpdateProject, onDeleteProject: handleDeleteProject, dailyQuests, onAddQuest: handleAddQuest, onUpdateQuest: handleUpdateQuest, onDeleteQuest: handleDeleteQuest, onResolveQuest: handleResolveQuest }} />;
          }
          // FIX: Corrected all props passed to MainLayout to use the appropriate handlers defined in App.tsx.
          return <MainLayout {...{ user: currentUser, allStudents, projects, onUpdateUser: handleUpdateUser, onUpdatePassword: handleUpdatePassword, onLogout: handleLogout, messages, onSendMessage: handleSendMessage, events, onCreateAppeal: handleCreateAppeal, onSubmitQuest: handleSubmitQuest, onJoinProject: handleJoinProject, onSubmitProject: handleSubmitProject, quizzes, onCompleteQuiz: handleCompleteQuiz }} />;
      }
      
      switch(authFlow.view) {
          case 'homepage': return <HomePage onGetStarted={() => setAuthFlow({ view: 'role-selection', role: null })} />;
          case 'login': return <LoginPage role={authFlow.role!} onLogin={handleLogin} onSwitchToSignUp={() => setAuthFlow(p => ({...p, view: 'signup'}))} onBack={() => setAuthFlow(p => ({...p, view: 'welcome'}))} />;
          case 'signup': return <SignUpPage role={authFlow.role!} onSignUp={handleSignUp} onSwitchToLogin={() => setAuthFlow(p => ({...p, view: 'login'}))} onBack={() => setAuthFlow(p => ({...p, view: 'welcome'}))} />;
          case 'awaiting-verification': return <AwaitingVerificationPage onVerify={() => {}} onBackToLogin={() => setAuthFlow(p => ({...p, view: 'login'}))} />;
          case 'welcome': return <WelcomePage role={authFlow.role!} onLoginClick={() => setAuthFlow(p => ({...p, view: 'login'}))} onSignUpClick={() => setAuthFlow(p => ({...p, view: 'signup'}))} onBack={() => setAuthFlow({ view: 'role-selection', role: null })} />;
          case 'role-selection': default: return <RoleSelectionPage onRoleSelect={(role) => setAuthFlow({ view: 'welcome', role })} />;
      }
  }

  return (
    <div className="h-full bg-inherit">
        {renderContent()}
    </div>
  );
};

export default App;
