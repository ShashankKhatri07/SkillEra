import { Student, Event, Message, Appeal, Project, DailyQuest, LearningResource } from '../types';

type MockStudent = Student & { password?: string };

const createAvatar = (seed: string) => `https://picsum.photos/seed/${seed}/100/100`;

// A valid 1x1 transparent gif placeholder to avoid syntax errors from corrupted data.
const certificateDataUri = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export const mockStudents: MockStudent[] = [
  {
    id: 'student1',
    name: 'Alex Johnson',
    email: 'alex@test.com',
    password: 'password123',
    avatar: createAvatar('alex'),
    activities: [
      {
        id: 'c1',
        text: 'Won a cluster chess competition',
        type: 'competition',
        completed: true,
        timestamp: new Date('2024-05-20'),
        points: 30,
        competitionLevel: 'cluster',
        result: 'won',
        certificateUrl: certificateDataUri,
        status: 'approved',
      },
      {
        id: 'g1',
        text: 'Finish math homework',
        type: 'goal',
        completed: true,
        timestamp: new Date('2024-05-18'),
        points: 10,
      },
       {
        id: 'c2',
        text: 'Participated in a state-level debate',
        type: 'competition',
        completed: false,
        timestamp: new Date('2024-06-01'),
        points: 35,
        competitionLevel: 'state',
        result: 'participated',
        certificateUrl: certificateDataUri,
        status: 'pending',
      }
    ],
    points: 40,
    academicPercentage: 88,
    role: 'student',
    bio: 'Aspiring software engineer and chess enthusiast.',
    interests: ['Coding', 'Chess', 'Reading'],
    class: '10',
    section: 'A',
    admissionNumber: '12345',
  },
  {
    id: 'student2',
    name: 'Maria Garcia',
    email: 'maria@test.com',
    password: 'password123',
    avatar: createAvatar('maria'),
    activities: [
      {
        id: 'c3',
        text: 'Participated in an interhouse basketball match',
        type: 'competition',
        completed: true,
        timestamp: new Date('2024-05-22'),
        points: 5,
        competitionLevel: 'interhouse',
        result: 'participated',
        certificateUrl: certificateDataUri,
        status: 'approved',
      },
      {
        id: 'g2',
        text: 'Read a book for 30 minutes',
        type: 'goal',
        completed: true,
        timestamp: new Date('2024-05-25'),
        points: 10,
      },
    ],
    points: 15,
    academicPercentage: 92,
    role: 'student',
    bio: 'Loves sports and science.',
    interests: ['Basketball', 'Biology', 'Science'],
    class: '11',
    section: 'B',
    admissionNumber: '12346',
  },
   {
    id: 'student3',
    name: 'Chen Wei',
    email: 'chen@test.com',
    password: 'password123',
    avatar: createAvatar('chen'),
    activities: [],
    points: 0,
    academicPercentage: 78,
    role: 'student',
    bio: '',
    interests: [],
    class: '9',
    section: 'C',
    admissionNumber: '12347',
    isMentor: true,
    mentorshipBio: "Senior student specializing in Physics and Competitive Programming. Happy to help with complex problems."
  },
   {
    id: 'student4',
    name: 'Priya Singh',
    email: 'priya@test.com',
    password: 'password123',
    avatar: createAvatar('priya'),
    activities: [],
    points: 120,
    academicPercentage: 95,
    role: 'student',
    bio: 'I lead the school\'s debate team and am passionate about public speaking.',
    interests: ['Debate', 'Communication', 'Art', 'Design'],
    class: '12',
    section: 'A',
    admissionNumber: '12348',
    isMentor: true,
    mentorshipBio: "Head of the Debate Club. I can help with public speaking, essay writing, and building confidence."
  },
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'password123',
    avatar: createAvatar('admin'),
    activities: [],
    points: 0,
    academicPercentage: 0,
    role: 'admin',
    bio: 'Administrator for SkillEra platform.',
    interests: ['Management', 'EdTech'],
    class: '',
    section: '',
    admissionNumber: '',
  },
  {
    id: 'principal1',
    name: 'Principal',
    email: 'principal@test.com',
    password: 'password123',
    avatar: createAvatar('principal'),
    activities: [],
    points: 0,
    academicPercentage: 0,
    role: 'admin', // The role is 'admin' but the email is special-cased in the app
    bio: 'Principal of the school.',
    interests: ['Education', 'Leadership'],
    class: '',
    section: '',
    admissionNumber: '',
  }
];

// Events are now managed by admins, so this starts empty.
export const mockEvents: Event[] = [];

export const mockMessages: Message[] = [
    { id: 'msg1', senderId: 'student1', receiverId: 'admin1', text: 'Hello, I have a question about my submission.', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
    { id: 'msg2', senderId: 'admin1', receiverId: 'student1', text: 'Hi Alex, I can help with that. What is your question?', timestamp: new Date(Date.now() - 1000 * 60 * 3) },
];

export const mockAppeals: Appeal[] = [
    { 
        id: 'appeal1', 
        studentId: 'student3', 
        studentName: 'Chen Wei', 
        claimedPercentage: 82, 
        reason: 'There was a mistake in the calculation of my recent exam scores.', 
        status: 'pending', 
        timestamp: new Date('2024-06-05') 
    },
    { 
        id: 'appeal2', 
        studentId: 'student2', 
        studentName: 'Maria Garcia', 
        claimedPercentage: 95, 
        reason: 'My project grade was not included in the final percentage.', 
        status: 'approved', 
        timestamp: new Date('2024-05-30') 
    },
];

// Projects are now managed by admins, so this starts empty.
export const mockProjects: Project[] = [];

// Daily quests are now managed by admins, so this starts empty.
export const dailyQuests: Omit<DailyQuest, 'id' | 'completed'>[] = [];

export const mockLearningResources: LearningResource[] = [
    {
        id: 'lr1',
        title: 'Introduction to React Hooks',
        description: 'A comprehensive video tutorial on how to use React Hooks for state management and side effects.',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=TNha-m42_5I',
        tags: ['Coding', 'React', 'Programming', 'Frontend']
    },
    {
        id: 'lr2',
        title: 'The Basics of Public Speaking',
        description: 'An article outlining key tips and tricks for delivering confident and effective presentations.',
        type: 'article',
        url: 'https://www.forbes.com/sites/sallyannemacdonald/2023/07/25/the-key-to-successful-public-speaking/',
        tags: ['Communication', 'Soft Skills', 'Presentation', 'Debate']
    },
    {
        id: 'lr3',
        title: 'A Guide to Sustainable Gardening',
        description: 'A downloadable PDF guide on creating and maintaining an eco-friendly garden at home or school.',
        type: 'pdf',
        url: 'https://www.epa.gov/sites/default/files/2015-09/documents/reducing_food_waste_from_farm_to_fork_and_beyond.pdf',
        tags: ['Agriculture', 'Environment', 'Biology', 'Science']
    },
    {
        id: 'lr4',
        title: "Chess Fundamentals for Beginners",
        description: "Learn the fundamentals of chess from a grandmaster. This video covers openings, middlegame strategy, and endgame principles.",
        type: "video",
        url: "https://www.youtube.com/watch?v=OCSbzArwB10",
        tags: ["Chess", "Strategy", "Games"]
    },
    {
        id: 'lr5',
        title: "The Psychology of Color in Art and Design",
        description: "Explore how different colors evoke emotions and can be used to create powerful and appealing visual compositions.",
        type: "article",
        url: "https://www.verywellmind.com/color-psychology-2795824",
        tags: ["Art", "Design", "Psychology"]
    },
    {
        id: 'lr6',
        title: "Beginner's Guide to Stock Market Investing",
        description: "A comprehensive PDF that breaks down the basics of investing, from understanding stocks to building a diversified portfolio.",
        type: "pdf",
        url: "https://www.investor.gov/sites/investorgov/files/2019-02/Beginners-Guide-to-Asset-Allocation.pdf",
        tags: ["Finance", "Investing", "Economics"]
    },
    {
        id: 'lr7',
        title: "Advanced CSS and Sass",
        description: "Take your frontend skills to the next level with this deep dive into advanced CSS concepts, flexbox, grid, and Sass.",
        type: "video",
        url: "https://www.youtube.com/watch?v=exk_n3-iO4s",
        tags: ["Coding", "Frontend", "CSS", "Design"]
    },
    {
        id: 'lr8',
        title: "How to Write a Compelling Research Paper",
        description: "This article breaks down the structure of a research paper, from thesis statement to bibliography, with actionable tips.",
        type: "article",
        url: "https://writingcenter.gmu.edu/guides/how-to-write-a-research-paper",
        tags: ["Writing", "Academics", "Research"]
    },
    {
        id: 'lr9',
        title: "The Physics of Black Holes Explained",
        description: "A fascinating documentary that simplifies the complex physics behind black holes and their role in the universe.",
        type: "video",
        url: "https://www.youtube.com/watch?v=e-P5IFTqB9c",
        tags: ["Science", "Physics", "Astronomy"]
    },
     {
        id: 'lr10',
        title: 'Learn Graphic Design Basics',
        description: 'An engaging video series covering the fundamentals of graphic design theory, including color, typography, and layout.',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=YqQx75OPRa0',
        tags: ['Design', 'Art', 'Creative']
    },
    {
        id: 'lr11',
        title: 'Mastering the Art of Negotiation',
        description: 'An insightful article from Harvard Business Review on key negotiation tactics for everyday life and business.',
        type: 'article',
        url: 'https://hbr.org/2021/06/the-art-of-negotiation',
        tags: ['Communication', 'Soft Skills', 'Business']
    },
    {
        id: 'lr12',
        title: 'Introduction to Python Programming',
        description: 'A comprehensive PDF textbook for beginners looking to learn the Python programming language from scratch.',
        type: 'pdf',
        url: 'https://static.realpython.com/python-basics-sample-chapters.pdf',
        tags: ['Coding', 'Programming', 'Python']
    }
];