import React from 'react';

export type CompetitionLevel = 'interhouse' | 'cluster' | 'district' | 'state' | 'national' | 'international';
export type CompetitionResult = 'participated' | 'won';

export interface Activity {
  id: string;
  text: string;
  type: 'goal' | 'competition' | 'project';
  completed: boolean;
  timestamp: Date;
  points: number;
  // Competition specific
  competitionLevel?: CompetitionLevel;
  result?: CompetitionResult;
  certificateUrl?: string; // URL for the uploaded certificate image
  status?: 'pending' | 'approved' | 'rejected'; // For certificate verification
  // Project specific
  projectSubmissionUrl?: string;
  projectTitle?: string;
}

export type Role = 'student' | 'admin';

export interface DailyQuest {
    id: string;
    text: string;
    reward: number;
    completed: boolean;
}

export interface Student {
  id: string; // Corresponds to Firebase Auth UID
  name: string;
  email: string;
  avatar: string;
  activities: Activity[];
  points: number;
  academicPercentage: number;
  role: Role;
  bio: string;
  interests: string[];
  lastNameChangeDate?: string; // ISO string
  class: string;
  section: string;
  admissionNumber: string;
  // Gamification & Mentorship
  isMentor?: boolean;
  mentorshipBio?: string;
  dailyQuest?: DailyQuest;
  loginStreak?: number;
  lastLoginDate?: string; // ISO string
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{className?: string}>;
  pointsRequired: number;
}

export interface Level {
  level: number;
  name: string;
  pointsRequired: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
}

export interface Appeal {
  id: string;
  studentId: string;
  studentName: string;
  claimedPercentage: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: Date;
  answerSheetUrl?: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    skills: string[];
    points: number;
    mentors: string[]; // List of mentor IDs
    members: string[]; // List of student IDs
}

export interface LearningResource {
    id: string;
    title: string;
    description: string;
    type: 'video' | 'article' | 'pdf';
    url: string;
    tags: string[];
}