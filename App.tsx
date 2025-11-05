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
import { supabase } from './services/supabaseClient';

type View = 'homepage' | 'role-selection' | 'welcome' | 'login' | 'signup' | 'awaiting-verification';

// Helper to get a random item from an array
function getRandomItem<T>(arr: T[]): T | undefined {
    if (arr.length === 0) return undefined;
    return arr[Math.floor(Math.random() * arr.length)];
}

// Function to re-hydrate date objects from ISO strings
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

  // Seed database with mock data if it's empty. This is for demonstration purposes.
  const seedDatabase = async () => {
    if (!supabase) return;

    try {
        const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
        if (studentCount === 0) {
            console.log('Seeding students...');
            await supabase.from('students').insert(mockStudents);
        }

        const { count: eventCount } = await supabase.from('events').select('*', { count: 'exact', head: true });
        if (eventCount === 0) {
            console.log('Seeding events...');
            await supabase.from('events').insert(mockEvents);
        }

        const { count: projectCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
        if (projectCount === 0) {
            console.log('Seeding projects...');
            await supabase.from('projects').insert(mockProjects);
        }
        
        const { count: questCount } = await supabase.from('quests').select('*', { count: 'exact', head: true });
        if (questCount === 0) {
            console.log('Seeding quests...');
            await supabase.from('quests').insert(questTemplates);
        }
    } catch (e) {
        console.error("Error during seeding:", e);
    }
  };
  
  // Fetch initial data from Supabase
  useEffect(() => {
    if (!supabase) {
      console.log("Running in offline mode.");
      // Fallback to mock data if supabase is not configured
      setAllStudents(JSON.parse(JSON.stringify(mockStudents)).map(rehydrateStudentDates));
      setEvents(mockEvents);
      setProjects(mockProjects);
      setDailyQuests(questTemplates);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
        setIsLoading(true);
        await seedDatabase();

        const [studentRes, eventRes, projectRes, appealRes, messageRes, questRes] = await Promise.all([
            supabase.from('students').select('*'),
            supabase.from('events').select('*').order('date', { ascending: false }),
            supabase.from('projects').select('*'),
            supabase.from('appeals').select('*').order('timestamp', { ascending: false }),
            supabase.from('messages').select('*').order('timestamp'),
            supabase.from('quests').select('*'),
        ]);

        if (studentRes.error) console.error("Error fetching students:", studentRes.error.message);
        else setAllStudents(studentRes.data.map(rehydrateStudentDates));

        if (eventRes.error) console.error("Error fetching events:", eventRes.error.message);
        else setEvents(eventRes.data.map(e => ({...e, date: new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})})));
        
        if (projectRes.error) console.error("Error fetching projects:", projectRes.error.message);
        else setProjects(projectRes.data);

        if (appealRes.error) console.error("Error fetching appeals:", appealRes.error.message);
        else setAppeals(appealRes.data.map(a => ({...a, timestamp: new Date(a.timestamp)})));
        
        if (messageRes.error) console.error("Error fetching messages:", messageRes.error.message);
        else setMessages(messageRes.data.map(m => ({...m, timestamp: new Date(m.timestamp)})));
        
        if (questRes.error) console.error("Error fetching quests:", questRes.error.message);
        else setDailyQuests(questRes.data);

        setIsLoading(false);
    };

    fetchData();
  }, []);


  const syncCurrentUser = useCallback(async (user: Student) => {
    setCurrentUser(user);
    setAllStudents(prev => prev.map(s => s.id === user.id ? user : s));
    
    if (supabase) {
        const { error } = await supabase.from('students').update(user).eq('id', user.id);
        if (error) console.error("Failed to update user in Supabase", error);
    }
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
  
  const handleLogin = async (email: string): Promise<'success' | 'not-found' | 'wrong-password' | 'wrong-role'> => {
    const user = allStudents.find(u => u.email === email);
    
    if (user) {
        if (user.email === 'principal@test.com' || user.role === authFlow.role) {
            const today = new Date();
            const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;
            let updatedUser = { ...user };

            if (!lastLogin || !isToday(lastLogin)) {
                let newStreak = 1;
                if (lastLogin && isYesterday(lastLogin)) {
                    newStreak = (user.loginStreak || 0) + 1;
                }
                
                const newQuestTemplate = getRandomItem<Omit<DailyQuest, 'status' | 'submissionText'>>(dailyQuests);
                
                updatedUser = {
                    ...updatedUser,
                    loginStreak: newStreak,
                    lastLoginDate: today.toISOString(),
                    dailyQuest: newQuestTemplate ? { id: newQuestTemplate.id, text: newQuestTemplate.text, reward: newQuestTemplate.reward, status: 'unclaimed' } : undefined
                };
            }
            await syncCurrentUser(updatedUser);
            return 'success';
        } else {
            return 'wrong-role';
        }
    }
    return 'not-found';
  };

  const handleSignUp = async (name: string, email: string, studentClass: string, section: string, admissionNumber: string): Promise<'success' | 'email-in-use'> => {
      if (allStudents.some(u => u.email === email)) {
          return 'email-in-use';
      }

      const newQuestTemplate = getRandomItem<Omit<DailyQuest, 'status' | 'submissionText'>>(dailyQuests);
      
      const newUser: Student = {
          id: `student-${Date.now()}`,
          name,
          email,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
          activities: [],
          points: 0,
          academicPercentage: 70,
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
      
      if (supabase) {
        const { error } = await supabase.from('students').insert(newUser);
        if (error) {
            console.error('Signup error:', error);
            return 'email-in-use'; // Generic error
        }
      }

      setAllStudents(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      return 'success';
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthFlow({ view: 'homepage', role: null });
  };
  
  const handleUpdateUser = async (updatedUser: Student) => {
    await syncCurrentUser(updatedUser);
  };
  
  const handleUpdateStudentById = async (studentId: string, updatedStudentData: Partial<Student>) => {
      setAllStudents(prev => prev.map(s => s.id === studentId ? { ...s, ...updatedStudentData } : s));
      if (supabase) {
        const { error } = await supabase.from('students').update(updatedStudentData).eq('id', studentId);
        if (error) console.error("Error updating student by ID:", error);
      }
  };
  
  const handleUpdatePassword = async (currentPassword: string, newPassword: string): Promise<'success' | 'incorrect-password'> => {
    console.log("Password update attempt:", { currentPassword, newPassword });
    if (currentPassword === 'wrong') {
        return Promise.resolve('incorrect-password');
    }
    return Promise.resolve('success');
  };
  
  const handleSendMessage = async (receiverId: string, text: string) => {
    if (!currentUser) return;
    const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        receiverId,
        text,
        timestamp: new Date()
    };
    if (supabase) {
        const { error } = await supabase.from('messages').insert(newMessage);
        if (error) console.error("Error sending message:", error);
    }
    setMessages(prev => [...prev, newMessage]);
  };

  const handleAddEvent = async (event: Omit<Event, 'id'>) => {
    const newEvent: Event = { ...event, id: `event-${Date.now()}` };
    if (supabase) {
        const { error } = await supabase.from('events').insert(newEvent);
        if (error) console.error("Error adding event:", error);
    }
    setEvents(prev => [newEvent, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleUpdateEvent = async (updatedEvent: Event) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    if (supabase) {
        const { error } = await supabase.from('events').update(updatedEvent).eq('id', updatedEvent.id);
        if (error) console.error("Error updating event:", error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    if (supabase) {
        const { error } = await supabase.from('events').delete().eq('id', eventId);
        if (error) console.error("Error deleting event:", error);
    }
  };

  const handleAddProject = async (project: Omit<Project, 'id' | 'members'>) => {
    const newProject: Project = { ...project, id: `proj-${Date.now()}`, members: [] };
    if (supabase) {
        const { error } = await supabase.from('projects').insert(newProject);
        if (error) console.error("Error adding project:", error);
    }
    setProjects(prev => [newProject, ...prev]);
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    if (supabase) {
        const { error } = await supabase.from('projects').update(updatedProject).eq('id', updatedProject.id);
        if (error) console.error("Error updating project:", error);
    }
  };
  
  const handleDeleteProject = async (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (supabase) {
        const { error } = await supabase.from('projects').delete().eq('id', projectId);
        if (error) console.error("Error deleting project:", error);
    }
  };

  const handleAddQuest = async (quest: Omit<DailyQuest, 'id' | 'status' | 'submissionText'>) => {
    const newQuest = { ...quest, id: `quest-${Date.now()}`};
    if (supabase) {
        const { error } = await supabase.from('quests').insert(newQuest);
        if (error) console.error("Error adding quest:", error);
    }
    setDailyQuests(prev => [newQuest, ...prev]);
  };

  const handleUpdateQuest = async (updatedQuest: Omit<DailyQuest, 'status' | 'submissionText'>) => {
    setDailyQuests(prev => prev.map(q => q.id === updatedQuest.id ? updatedQuest : q));
    if (supabase) {
        const { error } = await supabase.from('quests').update(updatedQuest).eq('id', updatedQuest.id);
        if (error) console.error("Error updating quest:", error);
    }
  };
  
  const handleDeleteQuest = async (questId: string) => {
    setDailyQuests(prev => prev.filter(q => q.id !== questId));
     if (supabase) {
        const { error } = await supabase.from('quests').delete().eq('id', questId);
        if (error) console.error("Error deleting quest:", error);
    }
  };

  const handleResolveAppeal = async (appealId: string, status: 'approved' | 'rejected', newPercentage?: number) => {
      const appeal = appeals.find(a => a.id === appealId);
      if (!appeal) return;

      const updatedAppeal = { ...appeal, status };
      setAppeals(prev => prev.map(a => a.id === appealId ? updatedAppeal : a));
      if (supabase) {
          const { error } = await supabase.from('appeals').update({ status }).eq('id', appealId);
          if (error) console.error("Error resolving appeal:", error);
      }

      if (status === 'approved' && newPercentage !== undefined) {
          await handleUpdateStudentById(appeal.studentId, { academicPercentage: newPercentage });
      }
  };
  
  const handleCreateAppeal = async (claimedPercentage: number, reason: string, answerSheetFile: File) => {
    if (!currentUser || currentUser.role !== 'student' || !supabase) return;
    
    // 1. Upload file
    const fileName = `appeals/${currentUser.id}/${Date.now()}-${answerSheetFile.name}`;
    const { error: uploadError } = await supabase.storage.from('documents').upload(fileName, answerSheetFile);
    if (uploadError) { console.error('Appeal document upload error:', uploadError); return; }

    // 2. Get public URL
    const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(fileName);

    // 3. Create appeal record
    const newAppeal: Appeal = {
        id: `appeal-${Date.now()}`,
        studentId: currentUser.id,
        studentName: currentUser.name,
        claimedPercentage,
        reason,
        answerSheetUrl: publicUrl,
        status: 'pending',
        timestamp: new Date()
    };
    
    const { error: insertError } = await supabase.from('appeals').insert(newAppeal);
    if (insertError) { console.error("Error creating appeal:", insertError); return; }

    setAppeals(prev => [newAppeal, ...prev]);
  };

  const handleResolveSubmission = async (studentId: string, activityId: string, status: 'approved' | 'rejected') => {
    const student = allStudents.find(s => s.id === studentId);
    if (!student) return;

    const activity = student.activities.find(a => a.id === activityId);
    if (!activity) return;

    let pointsUpdate = student.points;
    if (status === 'approved' && activity.status !== 'approved') {
        pointsUpdate += activity.points;
    } else if (status !== 'approved' && activity.status === 'approved') {
        pointsUpdate -= activity.points;
    }
    
    const updatedActivities = student.activities.map(a => a.id === activityId ? {...a, status, completed: status === 'approved'} : a);
    
    await handleUpdateStudentById(studentId, { points: pointsUpdate, activities: updatedActivities });
  };

  const handleSubmitQuest = async (submissionText: string) => {
    if (currentUser && currentUser.dailyQuest && currentUser.dailyQuest.status === 'unclaimed') {
        const updatedUser = {
            ...currentUser,
            dailyQuest: {
                ...currentUser.dailyQuest,
                status: 'pending' as const,
                submissionText: submissionText,
            }
        };
        await syncCurrentUser(updatedUser);
    }
  };
  
  const handleResolveQuest = async (studentId: string, status: 'approved' | 'rejected') => {
      const student = allStudents.find(s => s.id === studentId);
      if (student && student.dailyQuest?.status === 'pending') {
          const questReward = student.dailyQuest.reward;
          const newPoints = status === 'approved' ? student.points + questReward : student.points;
          const newStatus = status === 'approved' ? 'completed' as const : 'rejected' as const;
          
          await handleUpdateStudentById(studentId, {
              points: newPoints,
              dailyQuest: {
                  ...student.dailyQuest,
                  status: newStatus
              }
          });
      }
  };

  const handleJoinProject = async (projectId: string) => {
      if (!currentUser) return;
      const project = projects.find(p => p.id === projectId);
      if (!project || project.members.includes(currentUser.id)) return;

      const updatedMembers = [...project.members, currentUser.id];
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, members: updatedMembers } : p));
      
      if (supabase) {
        const { error } = await supabase.from('projects').update({ members: updatedMembers }).eq('id', projectId);
        if (error) console.error("Error joining project:", error);
      }
  };

  const handleSubmitProject = async (projectId: string, submissionFile: File) => {
      const project = projects.find(p => p.id === projectId);
      if (!project || !currentUser || !supabase) return;

      // 1. Upload file
      const fileName = `projects/${currentUser.id}/${projectId}-${submissionFile.name}`;
      const { error: uploadError } = await supabase.storage.from('documents').upload(fileName, submissionFile);
      if (uploadError) { console.error('Project submission upload error:', uploadError); return; }

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(fileName);
      
      const newActivity: Activity = {
          id: `proj-act-${Date.now()}`,
          text: `Submitted work for project: ${project.title}`,
          type: 'project',
          completed: false,
          timestamp: new Date(),
          points: project.points,
          projectSubmissionUrl: publicUrl,
          projectTitle: project.title,
          status: 'pending',
          student_id: currentUser.id,
      };

      const updatedUser = {
          ...currentUser,
          activities: [newActivity, ...currentUser.activities]
      };
      await syncCurrentUser(updatedUser);
  };

  const handleCompleteQuiz = async (quizId: string, score: number, totalQuestions: number) => {
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

    await syncCurrentUser(updatedUser);
  };

  const renderContent = () => {
      if (isLoading) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-white text-slate-800">
                <svg className="animate-spin h-10 w-10 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="font-semibold">Connecting to SkillEra Cloud...</p>
            </div>
        );
      }

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