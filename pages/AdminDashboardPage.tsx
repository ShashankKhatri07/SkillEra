import { useState, useMemo } from 'react';
import { Student, Activity } from '../types';
import { StudentInfoCard } from '../components/admin/StudentInfoCard';
import { ClassPerformanceChart } from '../components/admin/ClassPerformanceChart';
import { Card } from '../components/Card';
import { BarChartIcon } from '../components/icons/BarChartIcon';
import { VerificationQueue } from '../components/admin/VerificationQueue';
import { QuestVerificationQueue } from '../components/admin/QuestVerificationQueue';

interface AdminDashboardPageProps {
  allStudents: Student[];
  onViewStudentProfile: (studentId: string) => void;
  onResolveSubmission: (studentId: string, activityId: string, status: 'approved' | 'rejected') => void;
  onResolveQuest: (studentId: string, status: 'approved' | 'rejected') => void;
}

export const AdminDashboardPage = ({ allStudents, onViewStudentProfile, onResolveSubmission, onResolveQuest }: AdminDashboardPageProps) => {
  const [classFilter, setClassFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  
  const studentUsers = allStudents.filter(s => s.role === 'student');

  const availableClasses = useMemo(() => ['all', ...Array.from(new Set(studentUsers.map(s => s.class))).sort((a: string, b: string) => parseInt(a) - parseInt(b))], [studentUsers]);
  const availableSections = useMemo(() => ['all', ...Array.from(new Set(studentUsers.map(s => s.section))).sort()], [studentUsers]);

  const filteredStudents = useMemo(() => {
    return studentUsers.filter(student => {
      const classMatch = classFilter === 'all' || student.class === classFilter;
      const sectionMatch = sectionFilter === 'all' || student.section === sectionFilter;
      return classMatch && sectionMatch;
    });
  }, [studentUsers, classFilter, sectionFilter]);
  
  const pendingSubmissions = useMemo(() => {
    const submissions: { student: Student, activity: Activity }[] = [];
    studentUsers.forEach(student => {
        student.activities
            .filter(activity => (activity.type === 'competition' || activity.type === 'project') && activity.status === 'pending')
            .forEach(activity => {
                submissions.push({ student, activity });
            });
    });
    return submissions.sort((a, b) => b.activity.timestamp.getTime() - a.activity.timestamp.getTime());
  }, [studentUsers]);
  
  const pendingQuests = useMemo(() => {
      return studentUsers
          .filter(student => student.dailyQuest?.status === 'pending')
          .map(student => ({ student, quest: student.dailyQuest! }));
  }, [studentUsers]);

  const classPerformanceData = useMemo(() => {
    const classes = Array.from(new Set(studentUsers.map(s => s.class)));
    
    const academicData = classes.map(c => {
        const classStudents = studentUsers.filter(s => s.class === c);
        const avg = classStudents.reduce((acc, s) => acc + s.academicPercentage, 0) / classStudents.length;
        return { label: `Class ${c}`, value: avg || 0 };
    });

    const pointsData = classes.map(c => {
        const classStudents = studentUsers.filter(s => s.class === c);
        const avg = classStudents.reduce((acc, s) => acc + s.points, 0) / classStudents.length;
        return { label: `Class ${c}`, value: avg || 0 };
    });
    
    return { academicData, pointsData };
  }, [studentUsers]);


  return (
    <div className="space-y-8">
      <div>
         <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <VerificationQueue submissions={pendingSubmissions} onResolve={onResolveSubmission} />
        <QuestVerificationQueue submissions={pendingQuests} onResolve={onResolveQuest} />
      </div>


      <Card 
        title="Class Performance Analytics" 
        icon={<BarChartIcon />} 
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ClassPerformanceChart 
                title="Average Academic Performance" 
                data={classPerformanceData.academicData} 
                color="var(--color-accent-secondary)"
                unit="%"
            />
            <ClassPerformanceChart 
                title="Average Co-curricular Points" 
                data={classPerformanceData.pointsData} 
                color="var(--color-accent)"
                unit=" pts"
            />
        </div>
      </Card>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <h2 className="text-2xl font-bold">Student Overview</h2>
            <div className="flex items-center gap-2">
                 <select
                    value={classFilter}
                    onChange={e => setClassFilter(e.target.value)}
                    className="rounded-lg p-2 text-sm"
                    style={{backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)'}}
                  >
                    {availableClasses.map(c => <option key={c} value={c}>{c === 'all' ? 'All Classes' : `Class ${c}`}</option>)}
                  </select>
                   <select
                    value={sectionFilter}
                    onChange={e => setSectionFilter(e.target.value)}
                    className="rounded-lg p-2 text-sm"
                    style={{backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)'}}
                  >
                    {availableSections.map(s => <option key={s} value={s}>{s === 'all' ? 'All Sections' : `Section ${s}`}</option>)}
                  </select>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map(student => (
            <StudentInfoCard key={student.id} student={student} onViewProfile={() => onViewStudentProfile(student.id)} />
          ))}
        </div>
      </div>
    </div>
  );
};