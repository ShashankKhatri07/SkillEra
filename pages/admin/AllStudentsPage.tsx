import React, { useState, useMemo } from 'react';
import { Student } from '../../types';
import { StudentInfoCard } from '../../components/admin/StudentInfoCard';

interface AllStudentsPageProps {
    allStudents: Student[];
    onViewStudent: (studentId: string) => void;
}

export const AllStudentsPage: React.FC<AllStudentsPageProps> = ({ allStudents, onViewStudent }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = useMemo(() => {
        return allStudents.filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allStudents, searchTerm]);
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">All Students</h1>
                <p className="mt-1 opacity-70">Search for and view student profiles.</p>
            </div>
            
            <div className="sticky top-0 py-2">
                <input
                    type="text"
                    placeholder="Search by student name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-lg p-3 rounded-lg"
                    style={{backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)'}}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStudents.map(student => (
                    <StudentInfoCard key={student.id} student={student} onViewProfile={() => onViewStudent(student.id)} />
                ))}
                {filteredStudents.length === 0 && (
                    <p className="text-center opacity-70 md:col-span-2 lg:col-span-3 xl:col-span-4">
                        No students found matching your search.
                    </p>
                )}
            </div>
        </div>
    );
};