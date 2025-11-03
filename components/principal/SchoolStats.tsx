import React from 'react';
import { UsersIcon } from '../icons/UsersIcon';
import { PointsIcon } from '../icons/PointsIcon';
import { ClipboardCheckIcon } from '../icons/ClipboardCheckIcon';
import { GavelIcon } from '../icons/GavelIcon';

interface SchoolStatsProps {
    stats: {
        totalStudents: number;
        averagePoints: number;
        pendingVerifications: number;
        pendingAppeals: number;
    };
}

interface StatCardProps {
    label: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => (
    <div className="p-4 rounded-lg flex items-center gap-4" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="p-3 rounded-full" style={{ backgroundColor: color, color: 'var(--color-primary-text)' }}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm opacity-80">{label}</p>
        </div>
    </div>
);

export const SchoolStats: React.FC<SchoolStatsProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Students" value={stats.totalStudents} icon={<UsersIcon />} color="var(--color-accent)" />
            <StatCard label="Avg. Co-curricular Pts" value={stats.averagePoints} icon={<PointsIcon />} color="var(--color-accent-secondary)" />
            <StatCard label="Pending Verifications" value={stats.pendingVerifications} icon={<ClipboardCheckIcon />} color="var(--color-accent)" />
            <StatCard label="Pending Appeals" value={stats.pendingAppeals} icon={<GavelIcon />} color="var(--color-accent-secondary)" />
        </div>
    );
};