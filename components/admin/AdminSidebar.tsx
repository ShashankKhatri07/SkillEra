import React from 'react';
import { Student } from '../../types';
import { LogoutIcon } from '../icons/LogoutIcon';
import { HomeIcon } from '../icons/HomeIcon';
import { UserIcon } from '../icons/UserIcon';
import { ApsBrand } from '../ApsBrand';
import { MailIcon } from '../icons/MailIcon';
import { TrophyIcon } from '../icons/TrophyIcon';
import { BellIcon } from '../icons/BellIcon';
import { AdminPage } from '../../layouts/layoutTypes';
import { UsersIcon } from '../icons/UsersIcon';
import { ProjectIcon } from '../icons/ProjectIcon';
import { QuestIcon } from '../icons/QuestIcon';


interface AdminSidebarProps {
  user: Student;
  onLogout: () => void;
  activePage: AdminPage;
  setActivePage: (page: AdminPage) => void;
  isOpen: boolean;
  onClose: () => void;
}

const NavItem = ({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full text-left px-4 py-2.5 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'shadow-md'
          : 'opacity-70 hover:opacity-100 hover:bg-black/5'
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

export const AdminSidebar = ({ user, onLogout, activePage, setActivePage, isOpen, onClose }: AdminSidebarProps) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-60 z-30 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      <aside className={`fixed inset-y-0 left-0 w-64 flex-shrink-0 flex flex-col p-4 border-r z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ backgroundColor: 'var(--color-bg-main)', borderColor: 'var(--color-border)' }}>
        <div className="px-2 mb-8">
          <ApsBrand layout="horizontal" />
        </div>

        <nav className="flex-grow space-y-2">
          <NavItem
              label="Dashboard"
              icon={<HomeIcon className="w-5 h-5" />}
              isActive={activePage === 'dashboard'}
              onClick={() => setActivePage('dashboard')}
          />
           <NavItem
              label="All Students"
              icon={<UsersIcon className="w-5 h-5" />}
              isActive={activePage === 'allStudents'}
              onClick={() => setActivePage('allStudents')}
          />
          <NavItem
              label="Events"
              icon={<BellIcon className="w-5 h-5" />}
              isActive={activePage === 'events'}
              onClick={() => setActivePage('events')}
            />
          <NavItem
              label="Manage Projects"
              icon={<ProjectIcon className="w-5 h-5" />}
              isActive={activePage === 'manageProjects'}
              onClick={() => setActivePage('manageProjects')}
            />
          <NavItem
              label="Manage Quests"
              icon={<QuestIcon className="w-5 h-5" />}
              isActive={activePage === 'manageQuests'}
              onClick={() => setActivePage('manageQuests')}
            />
          <NavItem
              label="Leaderboard"
              icon={<TrophyIcon className="w-5 h-5" />}
              isActive={activePage === 'leaderboard'}
              onClick={() => setActivePage('leaderboard')}
            />
          <NavItem
              label="Messages"
              icon={<MailIcon className="w-5 h-5" />}
              isActive={activePage === 'messages'}
              onClick={() => setActivePage('messages')}
            />
             <NavItem
              label="Profile"
              icon={<UserIcon className="w-5 h-5" />}
              isActive={activePage === 'profile'}
              onClick={() => setActivePage('profile')}
          />
        </nav>

        <div className="mt-auto">
          <div className="w-full border-t my-4" style={{ borderColor: 'var(--color-border)' }}></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-sm">{user.name}</p>
                <p className="text-xs opacity-70">Administrator</p>
              </div>
            </div>
            <button onClick={onLogout} className="p-2 rounded-full opacity-70 hover:bg-black/10 hover:opacity-100 transition-colors" aria-label="Logout">
              <LogoutIcon className="w-5 h-5"/>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
