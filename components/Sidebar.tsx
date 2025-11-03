import React from 'react';
import { Student } from '../types';
import { Page } from './Dashboard';
import { LogoutIcon } from './icons/LogoutIcon';
import { HomeIcon } from './icons/HomeIcon';
import { UserIcon } from './icons/UserIcon';
import { TrophyIcon } from './icons/TrophyIcon';
import { BadgeIcon } from './icons/BadgeIcon';
import { BellIcon } from './icons/BellIcon';
import { ApsBrand } from './ApsBrand';
import { MailIcon } from './icons/MailIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { ProjectIcon } from './icons/ProjectIcon';
import { MentorIcon } from './icons/MentorIcon';
import { StreakIcon } from './icons/StreakIcon';

interface SidebarProps {
  user: Student;
  onLogout: () => void;
  activePage: Page;
  setActivePage: (page: Page) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  isActive,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full text-left px-4 py-2.5 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'text-white shadow-md'
          : 'hover:opacity-90'
      }`}
      style={{
        backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
        color: isActive ? 'var(--color-primary-text)' : 'var(--color-text-main)',
      }}
    >
      <div className="mr-3">{icon}</div>
      <span className="font-semibold">{label}</span>
    </button>
  );
};

export const Sidebar = ({ user, onLogout, activePage, setActivePage, isOpen, onClose }: SidebarProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon className="w-5 h-5" /> },
    { id: 'learningHub', label: 'Learning Hub', icon: <BookOpenIcon className="w-5 h-5" /> },
    { id: 'projects', label: 'Projects', icon: <ProjectIcon className="w-5 h-5" /> },
    { id: 'mentorship', label: 'Mentorship', icon: <MentorIcon className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <UserIcon className="w-5 h-5" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <TrophyIcon className="w-5 h-5" /> },
    { id: 'rewards', label: 'My Rewards', icon: <BadgeIcon className="w-5 h-5" /> },
    { id: 'events', label: 'Events', icon: <BellIcon className="w-5 h-5" /> },
    { id: 'messages', label: 'Messages', icon: <MailIcon className="w-5 h-5" /> },
  ] as const;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      <aside className={`fixed inset-y-0 left-0 w-64 flex-shrink-0 flex flex-col p-4 border-r z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ backgroundColor: 'var(--color-accent-1)', borderColor: 'rgba(47, 79, 79, 0.1)' }}>
        <div className="px-2 mb-8">
          <ApsBrand layout="horizontal" />
        </div>

        <nav className="flex-grow space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              isActive={activePage === item.id}
              onClick={() => setActivePage(item.id)}
            />
          ))}
        </nav>

        <div className="mt-auto">
          <div className="w-full border-t my-4" style={{ borderColor: 'rgba(47, 79, 79, 0.2)' }}></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--color-text-main)' }}>{user.name}</p>
                 <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-main)', opacity: 0.8 }}>
                    <StreakIcon className="w-4 h-4 text-orange-500" />
                    <span className="font-bold">{user.loginStreak || 1} Day Streak</span>
                 </div>
              </div>
            </div>
            <button onClick={onLogout} className="p-2 rounded-full hover:bg-black/10 transition-colors" aria-label="Logout" style={{ color: 'var(--color-text-main)' }}>
              <LogoutIcon className="w-5 h-5"/>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};