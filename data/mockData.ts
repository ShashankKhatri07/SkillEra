import { Student, Activity, Event, Project, DailyQuest, LearningResource, Quiz } from '../types';

// MOCK ACTIVITIES
const student1_activities: Activity[] = [
  { id: 'act1', student_id: 'student-1', text: 'Won the Inter-house Debate Competition', type: 'competition', completed: true, timestamp: new Date('2024-05-15'), points: 30, competitionLevel: 'interhouse', result: 'won', certificateUrl: 'https://images.unsplash.com/photo-1593034509783-a59092491a5b?q=80&w=2070&auto=format&fit=crop', status: 'approved' },
  { id: 'act2', student_id: 'student-1', text: 'Finish reading "Sapiens"', type: 'goal', completed: true, timestamp: new Date('2024-05-10'), points: 10 },
  { id: 'act3', student_id: 'student-1', text: 'Participated in State Level Science Fair', type: 'competition', completed: false, timestamp: new Date('2024-05-20'), points: 35, competitionLevel: 'state', result: 'participated', certificateUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1974&auto=format&fit=crop', status: 'pending' },
  { id: 'act4', student_id: 'student-1', text: 'Learn basic Python syntax', type: 'goal', completed: false, timestamp: new Date('2024-05-25'), points: 10 },
  { id: 'proj-act-1', student_id: 'student-1', text: `Submitted work for project: Eco-Friendly Campus Initiative`, type: 'project', completed: false, timestamp: new Date(), points: 120, projectSubmissionUrl: 'https://example.com/project-submission.pdf', projectTitle: 'Eco-Friendly Campus Initiative', status: 'pending' },
];

const student2_activities: Activity[] = [
    { id: 'act5', student_id: 'student-2', text: 'Participated in National Chess Tournament', type: 'competition', completed: true, timestamp: new Date('2024-04-15'), points: 45, competitionLevel: 'national', result: 'participated', certificateUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2071&auto=format&fit=crop', status: 'approved' },
    { id: 'act6', student_id: 'student-2', text: 'Build a volcano model for science class', type: 'goal', completed: true, timestamp: new Date('2024-05-01'), points: 10 },
    { id: 'act7', student_id: 'student-2', text: 'Rejected Submission Example', type: 'competition', completed: false, timestamp: new Date('2024-04-01'), points: 15, competitionLevel: 'cluster', result: 'won', certificateUrl: 'https://images.unsplash.com/photo-1593034509783-a59092491a5b?q=80&w=2070&auto=format&fit=crop', status: 'rejected' },
];

// MOCK DAILY QUESTS (template)
export const mockDailyQuests: Omit<DailyQuest, 'status' | 'submissionText'>[] = [
    { id: 'q1', text: 'Complete one personal goal today', reward: 15 },
    { id: 'q2', text: 'Explore a new resource in the Learning Hub', reward: 10 },
    { id: 'q3', text: 'Review your achievements and plan a new one', reward: 5 },
    { id: 'q4', text: 'Connect with a mentor or a peer', reward: 20 },
];


// MOCK STUDENTS
export const mockStudents: Student[] = [
    {
        id: 'student-1',
        name: 'Alex Johnson',
        email: 'student@test.com',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Alex Johnson`,
        activities: student1_activities,
        points: student1_activities.filter(a => a.status === 'approved' || (a.type === 'goal' && a.completed)).reduce((sum, a) => sum + a.points, 0),
        academicPercentage: 88,
        role: 'student',
        bio: 'Aspiring astrophysicist and avid debater. I love exploring complex topics and challenging myself.',
        interests: ['Science', 'Debate', 'Astronomy', 'Reading', 'Academics'],
        class: '11',
        section: 'A',
        admissionNumber: '12345',
        dailyQuest: { ...mockDailyQuests[0], status: 'unclaimed' },
        loginStreak: 3,
        lastLoginDate: new Date('2024-07-20').toISOString() // Yesterday
    },
    {
        id: 'student-2',
        name: 'Maria Garcia',
        email: 'student2@test.com',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Maria Garcia`,
        activities: student2_activities,
        points: student2_activities.filter(a => a.status === 'approved' || (a.type === 'goal' && a.completed)).reduce((sum, a) => sum + a.points, 0),
        academicPercentage: 92,
        role: 'student',
        bio: 'Passionate about coding and chess. Always looking for a new problem to solve.',
        interests: ['Coding', 'Chess', 'Strategy', 'React', 'Frontend'],
        class: '12',
        section: 'B',
        admissionNumber: '67890',
        dailyQuest: { ...mockDailyQuests[1], status: 'completed' },
        loginStreak: 12,
        lastLoginDate: new Date().toISOString() // Today
    },
    {
        id: 'student-3',
        name: 'Sam Lee',
        email: 'student3@test.com',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Sam Lee`,
        activities: [],
        points: 120,
        academicPercentage: 75,
        role: 'student',
        bio: 'I enjoy playing basketball and learning about graphic design.',
        interests: ['Sports', 'Basketball', 'Design', 'Art'],
        class: '10',
        section: 'C',
        admissionNumber: '11223',
    },
     {
        id: 'student-4',
        name: 'Priya Patel',
        email: 'student4@test.com',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Priya Patel`,
        activities: [],
        points: 250,
        academicPercentage: 95,
        role: 'student',
        bio: 'Future doctor and classical dancer.',
        interests: ['Biology', 'Dance', 'Academics'],
        class: '12',
        section: 'A',
        admissionNumber: '33445',
        isMentor: true,
        mentorshipBio: 'I can help with biology, chemistry, and time management skills!'
    },
    {
        id: 'admin-1',
        name: 'Dr. Evans',
        email: 'admin@test.com',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Dr Evans`,
        activities: [],
        points: 0,
        academicPercentage: 0,
        role: 'admin',
        bio: 'Administrator for SkillEra. Ensuring a smooth experience for all students and faculty.',
        interests: [],
        class: '',
        section: '',
        admissionNumber: '',
        isMentor: true,
        mentorshipBio: 'As an admin, I can guide you on platform usage and connect you with the right resources.'
    },
    {
        id: 'principal-1',
        name: 'Mr. Singh',
        email: 'principal@test.com',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Mr Singh`,
        activities: [],
        points: 0,
        academicPercentage: 0,
        role: 'admin', // Role is 'admin' for principals, but email is unique
        bio: 'Principal of Army Public School, Jodhpur. Dedicated to fostering excellence.',
        interests: [],
        class: '',
        section: '',
        admissionNumber: '',
    }
];

// MOCK EVENTS
export const mockEvents: Event[] = [
    { id: 'event1', title: 'Annual Sports Day', description: 'Get ready for a day of thrilling athletic events and house spirit!', date: 'Nov 25, 2024' },
    { id: 'event2', title: 'Science Exhibition "Innovision"', description: 'Showcase your innovative science projects. Last date for registration is Nov 20.', date: 'Dec 5, 2024' },
    { id: 'event3', title: 'Parent-Teacher Meeting', description: 'A meeting to discuss student progress for the half-yearly exams.', date: 'Dec 15, 2024' },
];

// MOCK PROJECTS
export const mockProjects: Project[] = [
    {
        id: 'proj1',
        title: 'School Website Revamp',
        description: 'Collaborate to redesign and develop a modern, responsive website for our school using React and Tailwind CSS.',
        skills: ['React', 'UI/UX', 'Teamwork', 'CSS'],
        points: 150,
        mentors: ['admin-1'],
        members: ['student-2']
    },
    {
        id: 'proj2',
        title: 'Eco-Friendly Campus Initiative',
        description: 'Research and implement a project to make our campus more sustainable. Ideas include waste management systems, rainwater harvesting, etc.',
        skills: ['Research', 'Environment', 'Project Management'],
        points: 120,
        mentors: [],
        members: ['student-1']
    },
    {
        id: 'proj3',
        title: 'Annual School Magazine',
        description: 'Join the editorial team to write, edit, and design this year\'s school magazine. Roles available for writers, designers, and photographers.',
        skills: ['Writing', 'Design', 'Communication', 'Creative'],
        points: 100,
        mentors: [],
        members: []
    }
];

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
        tags: ['Gardening', 'Environment', 'Biology', 'Science', 'Hobbies']
    },
    {
        id: 'lr4',
        title: "Chess Fundamentals for Beginners",
        description: "Learn the fundamentals of chess from International Master Levy Rozman (GothamChess). This video covers openings, middlegame strategy, and endgame principles.",
        type: "video",
        url: "https://www.youtube.com/watch?v=OCSbzArwB10",
        tags: ["Chess", "Strategy", "Games", "Hobbies"]
    },
    {
        id: 'lr5',
        title: "The Psychology of Color in Art and Design",
        description: "Explore how different colors evoke emotions and can be used to create powerful and appealing visual compositions.",
        type: "article",
        url: "https://www.verywellmind.com/color-psychology-2795824",
        tags: ["Art", "Design", "Psychology", 'Creative']
    },
    {
        id: 'lr6',
        title: "Beginner's Guide to Stock Market Investing",
        description: "A comprehensive PDF that breaks down the basics of investing, from understanding stocks to building a diversified portfolio.",
        type: "pdf",
        url: "https://www.investor.gov/sites/investorgov/files/2019-02/Beginners-Guide-to-Asset-Allocation.pdf",
        tags: ["Finance", "Investing", "Economics", 'Hobbies']
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
        tags: ["Science", "Physics", "Astronomy", 'Academics']
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
        tags: ['Communication', 'Soft Skills', 'Business', 'Leadership']
    },
    {
        id: 'lr12',
        title: 'Introduction to Python Programming',
        description: 'A comprehensive PDF textbook for beginners looking to learn the Python programming language from scratch.',
        type: 'pdf',
        url: 'https://static.realpython.com/python-basics-sample-chapters.pdf',
        tags: ['Coding', 'Programming', 'Python']
    },
    {
        id: 'lr13',
        title: 'Basketball Dribbling Drills',
        description: 'Improve your handle with these essential basketball dribbling drills for all skill levels.',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=1_wsdC0d_G0',
        tags: ['Sports', 'Basketball']
    },
    {
        id: 'lr14',
        title: 'Problem Solving Strategies for Math Olympiads',
        description: 'Learn key strategies and techniques to tackle challenging problems in mathematics competitions.',
        type: 'pdf',
        url: 'https://artofproblemsolving.com/wiki/images/c/c5/Eng-prob-brochure.pdf',
        tags: ['Academics', 'Olympiads', 'Math', 'Strategy']
    }
];

// MOCK QUIZZES
export const mockQuizzes: Quiz[] = [
    // English
    {
        id: 'quiz-en-1',
        subject: 'English',
        chapter: 'Class 6 - Grammar (Nouns)',
        pointsPerQuestion: 1,
        questions: [
            { id: 'q-en-1-1', text: 'Which of the following is a proper noun?', options: ['City', 'River', 'Amazon', 'Boy'], correctAnswer: 'Amazon' },
            { id: 'q-en-1-2', text: 'What is the plural of "child"?', options: ['Childs', 'Childrens', 'Child', 'Children'], correctAnswer: 'Children' },
            { id: 'q-en-1-3', text: 'Which of these is a collective noun for a group of lions?', options: ['Herd', 'Pack', 'Pride', 'Flock'], correctAnswer: 'Pride' },
            { id: 'q-en-1-4', text: 'Identify the abstract noun in the list.', options: ['Book', 'Happiness', 'Table', 'Water'], correctAnswer: 'Happiness' },
            { id: 'q-en-1-5', text: 'Which of the following is a material noun?', options: ['Love', 'Team', 'Gold', 'Girl'], correctAnswer: 'Gold' },
            { id: 'q-en-1-6', text: 'Which word is a countable noun?', options: ['Water', 'Information', 'Book', 'Sand'], correctAnswer: 'Book' },
            { id: 'q-en-1-7', text: 'Which word is an uncountable noun?', options: ['Chair', 'Friend', 'Music', 'Idea'], correctAnswer: 'Music' },
            { id: 'q-en-1-8', text: 'What is the noun form of the adjective "beautiful"?', options: ['Beautify', 'Beautifully', 'Beauty', 'Beautician'], correctAnswer: 'Beauty' },
            { id: 'q-en-1-9', text: 'Identify the common noun in the sentence: "The dog barked at the mailman."', options: ['The', 'Dog', 'Barked', 'At'], correctAnswer: 'Dog' },
            { id: 'q-en-1-10', text: 'What is the plural of "mouse"?', options: ['Mouses', 'Mice', 'Mouse', 'Mooses'], correctAnswer: 'Mice' },
        ],
    },
    {
        id: 'quiz-en-2',
        subject: 'English',
        chapter: 'Class 8 - Tenses',
        pointsPerQuestion: 1,
        questions: [
            { id: 'q-en-2-1', text: 'She ___ to the market yesterday.', options: ['go', 'goes', 'went', 'gone'], correctAnswer: 'went' },
            { id: 'q-en-2-2', text: 'They ___ playing cricket now.', options: ['is', 'are', 'was', 'were'], correctAnswer: 'are' },
            { id: 'q-en-2-3', text: 'I ___ my homework by 9 PM tonight.', options: ['will finish', 'will have finished', 'finished', 'am finishing'], correctAnswer: 'will have finished' },
            { id: 'q-en-2-4', text: 'He has ___ here for two hours.', options: ['waited', 'waiting', 'been waiting', 'waits'], correctAnswer: 'been waiting' },
            { id: 'q-en-2-5', text: 'The train ___ before we reached the station.', options: ['left', 'leaves', 'had left', 'will leave'], correctAnswer: 'had left' },
            { id: 'q-en-2-6', text: 'Listen! Someone ___ at the door.', options: ['knocks', 'is knocking', 'knocked', 'will knock'], correctAnswer: 'is knocking' },
            { id: 'q-en-2-7', text: 'It ___ heavily tomorrow.', options: ['rains', 'is raining', 'will rain', 'rained'], correctAnswer: 'will rain' },
            { id: 'q-en-2-8', text: 'I ___ this movie before.', options: ['see', 'saw', 'have seen', 'am seeing'], correctAnswer: 'have seen' },
            { id: 'q-en-2-9', text: 'What ___ you do last weekend?', options: ['do', 'did', 'have done', 'were doing'], correctAnswer: 'did' },
            { id: 'q-en-2-10', text: 'Water ___ at 100 degrees Celsius.', options: ['boil', 'boils', 'is boiling', 'boiled'], correctAnswer: 'boils' },
        ],
    },
    // Hindi
    {
        id: 'quiz-hi-1',
        subject: 'Hindi',
        chapter: 'Class 7 - Sangya',
        pointsPerQuestion: 1,
        questions: [
            { id: 'q-hi-1-1', text: 'इनमें से कौन सा शब्द व्यक्तिवाचक संज्ञा है?', options: ['पहाड़', 'नदी', 'गंगा', 'शहर'], correctAnswer: 'गंगा' },
            { id: 'q-hi-1-2', text: '"सुंदरता" कौन सी संज्ञा है?', options: ['व्यक्तिवाचक', 'जातिवाचक', 'भाववाचक', 'समूहवाचक'], correctAnswer: 'भाववाचक' },
            { id: 'q-hi-1-3', text: '"सेना" कौन सी संज्ञा का उदाहरण है?', options: ['जातिवाचक', 'भाववाचक', 'समूहवाचक', 'व्यक्तिवाचक'], correctAnswer: 'समूहवाचक' },
            { id: 'q-hi-1-4', text: '"लोहा" कौन सी संज्ञा है?', options: ['समूहवाचक', 'द्रव्यवाचक', 'भाववाचक', 'जातिवाचक'], correctAnswer: 'द्रव्यवाचक' },
            { id: 'q-hi-1-5', text: 'इनमें से कौन सा शब्द जातिवाचक संज्ञा है?', options: ['राम', 'हिमालय', 'लड़का', 'जयपुर'], correctAnswer: 'लड़का' },
            { id: 'q-hi-1-6', text: '"बचपन" शब्द में कौन सी संज्ञा है?', options: ['व्यक्तिवाचक', 'भाववाचक', 'जातिवाचक', 'समूहवाचक'], correctAnswer: 'भाववाचक' },
            { id: 'q-hi-1-7', text: '"दिल्ली" भारत की राजधानी है। इस वाक्य में "दिल्ली" कौन सी संज्ञा है?', options: ['जातिवाचक', 'व्यक्तिवाचक', 'भाववाचक', 'द्रव्यवाचक'], correctAnswer: 'व्यक्तिवाचक' },
            { id: 'q-hi-1-8', text: '"परिवार" शब्द कौन सी संज्ञा का भेद है?', options: ['व्यक्तिवाचक', 'समूहवाचक', 'भाववाचक', 'जातिवाचक'], correctAnswer: 'समूहवाचक' },
            { id: 'q-hi-1-9', text: 'इनमें से भाववाचक संज्ञा पहचानिए।', options: ['लड़की', 'मिठास', 'पेड़', 'नदी'], correctAnswer: 'मिठास' },
            { id: 'q-hi-1-10', text: '"पुस्तक" कौन सी संज्ञा है?', options: ['व्यक्तिवाचक', 'जातिवाचक', 'भाववाचक', 'समूहवाचक'], correctAnswer: 'जातिवाचक' },
        ],
    },
    // Maths
    {
        id: 'quiz-ma-1',
        subject: 'Maths',
        chapter: 'Class 6 - Knowing Our Numbers',
        pointsPerQuestion: 1,
        questions: [
            { id: 'q-ma-1-1', text: 'What is the smallest whole number?', options: ['1', '0', '-1', '10'], correctAnswer: '0' },
            { id: 'q-ma-1-2', text: 'What is the successor of 999?', options: ['998', '1000', '9999', '100'], correctAnswer: '1000' },
            { id: 'q-ma-1-3', text: 'What is the predecessor of 10000?', options: ['9999', '10001', '9990', '9000'], correctAnswer: '9999' },
            { id: 'q-ma-1-4', text: 'What is the Roman numeral for 50?', options: ['C', 'D', 'M', 'L'], correctAnswer: 'L' },
            { id: 'q-ma-1-5', text: '1 million is equal to how many lakhs?', options: ['1', '10', '100', '1000'], correctAnswer: '10' },
            { id: 'q-ma-1-6', text: 'Estimate 5,290 + 17,986 to the nearest thousand.', options: ['22000', '23000', '24000', '25000'], correctAnswer: '23000' },
            { id: 'q-ma-1-7', text: 'How many centimeters make a kilometer?', options: ['100', '1000', '10000', '100000'], correctAnswer: '100000' },
            { id: 'q-ma-1-8', text: 'What is the place value of 5 in 7,54,321?', options: ['500', '5000', '50000', '500000'], correctAnswer: '50000' },
            { id: 'q-ma-1-9', text: 'Which is the greatest 4-digit number?', options: ['9000', '9999', '1000', '9899'], correctAnswer: '9999' },
            { id: 'q-ma-1-10', text: '1 crore is equal to how many lakhs?', options: ['10', '100', '1000', '1'], correctAnswer: '100' },
        ],
    },
    {
        id: 'quiz-ma-2',
        subject: 'Maths',
        chapter: 'Class 8 - Squares and Square Roots',
        pointsPerQuestion: 1,
        questions: [
            { id: 'q-ma-2-1', text: 'What is the square of 12?', options: ['122', '144', '169', '24'], correctAnswer: '144' },
            { id: 'q-ma-2-2', text: 'What is the square root of 81?', options: ['7', '8', '9', '10'], correctAnswer: '9' },
            { id: 'q-ma-2-3', text: 'A number ending in 2, 3, 7 or 8 is never a ___.', options: ['prime number', 'perfect square', 'even number', 'odd number'], correctAnswer: 'perfect square' },
            { id: 'q-ma-2-4', text: 'What is the square root of 625?', options: ['15', '25', '35', '45'], correctAnswer: '25' },
            { id: 'q-ma-2-5', text: 'The number of digits in the square root of 4489 is?', options: ['1', '2', '3', '4'], correctAnswer: '2' },
            { id: 'q-ma-2-6', text: 'What is 15 squared?', options: ['125', '215', '225', '255'], correctAnswer: '225' },
            { id: 'q-ma-2-7', text: 'Find the Pythagorean triplet whose one member is 6.', options: ['6, 7, 8', '6, 8, 10', '6, 9, 12', '5, 6, 7'], correctAnswer: '6, 8, 10' },
            { id: 'q-ma-2-8', text: 'The square root of 1.21 is?', options: ['1.1', '11', '0.11', '12.1'], correctAnswer: '1.1' },
            { id: 'q-ma-2-9', text: 'What is (-9)^2?', options: ['-81', '18', '-18', '81'], correctAnswer: '81' },
            { id: 'q-ma-2-10', text: 'Is 243 a perfect square?', options: ['Yes', 'No', 'Cannot determine', 'Only if divided by 3'], correctAnswer: 'No' },
        ],
    },
    // Science
    {
        id: 'quiz-sc-1',
        subject: 'Science',
        chapter: 'Class 7 - Acids, Bases and Salts',
        pointsPerQuestion: 1,
        questions: [
            { id: 'q-sc-1-1', text: 'What color does litmus paper turn in an acidic solution?', options: ['Blue', 'Red', 'Green', 'Yellow'], correctAnswer: 'Red' },
            { id: 'q-sc-1-2', text: 'Which of the following is a base?', options: ['Vinegar', 'Lemon Juice', 'Soap', 'Orange Juice'], correctAnswer: 'Soap' },
            { id: 'q-sc-1-3', text: 'Turmeric is a natural ___.', options: ['Acid', 'Base', 'Salt', 'Indicator'], correctAnswer: 'Indicator' },
            { id: 'q-sc-1-4', text: 'When an acid and a base react, they form salt and ___.', options: ['Oxygen', 'Hydrogen', 'Water', 'Carbon Dioxide'], correctAnswer: 'Water' },
            { id: 'q-sc-1-5', text: 'What is the chemical name for baking soda?', options: ['Sodium Chloride', 'Sodium Bicarbonate', 'Calcium Carbonate', 'Acetic Acid'], correctAnswer: 'Sodium Bicarbonate' },
            { id: 'q-sc-1-6', text: 'The acid present in curd is ___.', options: ['Citric acid', 'Lactic acid', 'Acetic acid', 'Sulphuric acid'], correctAnswer: 'Lactic acid' },
            { id: 'q-sc-1-7', text: 'Which of these is a strong acid?', options: ['Citric Acid', 'Acetic Acid', 'Hydrochloric acid', 'Lactic Acid'], correctAnswer: 'Hydrochloric acid' },
            { id: 'q-sc-1-8', text: 'Neutral solutions have a pH of?', options: ['0', '7', '14', '1'], correctAnswer: '7' },
            { id: 'q-sc-1-9', text: 'China rose indicator turns ___ in basic solutions.', options: ['Red', 'Magenta', 'Green', 'Yellow'], correctAnswer: 'Green' },
            { id: 'q-sc-1-10', text: 'Antacids, used to cure indigestion, contain ___.', options: ['Weak acids', 'Strong acids', 'Weak bases', 'Salts'], correctAnswer: 'Weak bases' },
        ],
    },
    {
        id: 'quiz-sc-2',
        subject: 'Science',
        chapter: 'Class 8 - Cell Structure',
        pointsPerQuestion: 1,
        questions: [
            { id: 'q-sc-2-1', text: 'What is the "powerhouse" of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Cell Membrane'], correctAnswer: 'Mitochondria' },
            { id: 'q-sc-2-2', text: 'Which part of the cell contains the genetic material?', options: ['Cytoplasm', 'Vacuole', 'Nucleus', 'Golgi apparatus'], correctAnswer: 'Nucleus' },
            { id: 'q-sc-2-3', text: 'The jelly-like substance present between the cell membrane and nucleus is called ___.', options: ['Protoplasm', 'Cytoplasm', 'Nucleoplasm', 'Cell sap'], correctAnswer: 'Cytoplasm' },
            { id: 'q-sc-2-4', text: 'Which of these is only found in a plant cell and not an animal cell?', options: ['Cell membrane', 'Cytoplasm', 'Cell wall', 'Nucleus'], correctAnswer: 'Cell wall' },
            { id: 'q-sc-2-5', text: 'The green colored plastids which have chlorophyll are called ___.', options: ['Chromoplasts', 'Leucoplasts', 'Chloroplasts', 'Protoplast'], correctAnswer: 'Chloroplasts' },
            { id: 'q-sc-2-6', text: 'A group of similar cells performing a specific function is called a ___.', options: ['Organ', 'Organ system', 'Tissue', 'Organism'], correctAnswer: 'Tissue' },
            { id: 'q-sc-2-7', text: 'The unit of inheritance in living organisms is ___.', options: ['Cell', 'Tissue', 'Gene', 'Chromosome'], correctAnswer: 'Gene' },
            { id: 'q-sc-2-8', text: 'Which instrument is used to see cells?', options: ['Telescope', 'Periscope', 'Microscope', 'Kaleidoscope'], correctAnswer: 'Microscope' },
            { id: 'q-sc-2-9', text: 'The outermost layer in an animal cell is the ___.', options: ['Cell wall', 'Nuclear membrane', 'Cell membrane', 'Cytoplasm'], correctAnswer: 'Cell membrane' },
            { id: 'q-sc-2-10', text: 'Amoeba is a ___ organism.', options: ['Multi-celled', 'Double-celled', 'Single-celled', 'Non-celled'], correctAnswer: 'Single-celled' },
        ],
    },
    // Social Science
    {
        id: 'quiz-ss-1',
        subject: 'Social Science',
        chapter: 'Class 8 - Indian Constitution',
        pointsPerQuestion: 1,
        questions: [
            { id: 'q-ss-1-1', text: 'Who is known as the Father of the Indian Constitution?', options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Dr. B.R. Ambedkar', 'Sardar Patel'], correctAnswer: 'Dr. B.R. Ambedkar' },
            { id: 'q-ss-1-2', text: 'When was the Indian Constitution adopted?', options: ['15th August 1947', '26th January 1950', '26th November 1949', '2nd October 1869'], correctAnswer: '26th November 1949' },
            { id: 'q-ss-1-3', text: 'The three organs of the government are legislature, executive, and ___.', options: ['media', 'judiciary', 'people', 'ministers'], correctAnswer: 'judiciary' },
            { id: 'q-ss-1-4', text: 'What does the term "secular" mean in the Indian context?', options: ['The state has an official religion', 'Only one religion is allowed', 'The state does not have an official religion', 'All religions are banned'], correctAnswer: 'The state does not have an official religion' },
            { id: 'q-ss-1-5', text: 'Right to Equality is a ___ Right.', options: ['Fundamental', 'Legal', 'Directive', 'Moral'], correctAnswer: 'Fundamental' },
            { id: 'q-ss-1-6', text: 'The system of government in India is ___.', options: ['Presidential', 'Monarchy', 'Parliamentary', 'Dictatorship'], correctAnswer: 'Parliamentary' },
            { id: 'q-ss-1-7', text: 'How many Fundamental Rights are there in the Indian Constitution?', options: ['5', '6', '7', '8'], correctAnswer: '6' },
            { id: 'q-ss-1-8', text: 'Who is the head of the state in India?', options: ['Prime Minister', 'Chief Justice', 'President', 'Vice President'], correctAnswer: 'President' },
            { id: 'q-ss-1-9', text: 'The idea of Fundamental Rights was borrowed from the constitution of ___.', options: ['UK', 'Canada', 'Ireland', 'USA'], correctAnswer: 'USA' },
            { id: 'q-ss-1-10', text: 'What is the minimum age to be eligible to vote in India?', options: ['16 years', '18 years', '21 years', '25 years'], correctAnswer: '18 years' },
        ],
    },
    // Sanskrit
    {
        id: 'quiz-sk-1',
        subject: 'Sanskrit',
        chapter: 'Class 6 - Shabd Roop (Balak)',
        pointsPerQuestion: 1,
        questions: [
            { id: 'q-sk-1-1', text: ' बालक शब्द का प्रथमा विभक्ति, एकवचन रूप क्या है?', options: ['बालकम्', 'बालकेन', 'बालकः', 'बालकाय'], correctAnswer: 'बालकः' },
            { id: 'q-sk-1-2', text: ' बालक शब्द का द्वितीया विभक्ति, बहुवचन रूप क्या है?', options: ['बालकाः', 'बालकान्', 'बालकैः', 'बालकेभ्यः'], correctAnswer: 'बालकान्' },
            { id: 'q-sk-1-3', text: ' बालक शब्द का तृतीया विभक्ति, एकवचन रूप क्या है?', options: ['बालकस्य', 'बालकात्', 'बालकेन', 'बालके'], correctAnswer: 'बालकेन' },
            { id: 'q-sk-1-4', text: ' बालक शब्द का चतुर्थी विभक्ति, द्विवचन रूप क्या है?', options: ['बालकयोः', 'बालकेषु', 'बालकाभ्याम्', 'बालकाः'], correctAnswer: 'बालकाभ्याम्' },
            { id: 'q-sk-1-5', text: ' बालक शब्द का पञ्चमी विभक्ति, बहुवचन रूप क्या है?', options: ['बालकेभ्यः', 'बालकानाम्', 'बालकेषु', 'बालकैः'], correctAnswer: 'बालकेभ्यः' },
            { id: 'q-sk-1-6', text: ' बालक शब्द का षष्ठी विभक्ति, एकवचन रूप क्या है?', options: ['बालकम्', 'बालकाय', 'बालकस्य', 'बालके'], correctAnswer: 'बालकस्य' },
            { id: 'q-sk-1-7', text: ' बालक शब्द का सप्तमी विभक्ति, द्विवचन रूप क्या है?', options: ['बालकयोः', 'बालकानाम्', 'बालकेभ्यः', 'बालकाभ्याम्'], correctAnswer: 'बालकयोः' },
            { id: 'q-sk-1-8', text: ' बालक शब्द का संबोधन, बहुवचन रूप क्या है?', options: ['हे बालक!', 'हे बालकौ!', 'हे बालकाः!', 'हे बालके!'], correctAnswer: 'हे बालकाः!' },
            { id: 'q-sk-1-9', text: '\'बालकात्\' में कौन सी विभक्ति है?', options: ['तृतीया', 'चतुर्थी', 'पञ्चमी', 'षष्ठी'], correctAnswer: 'पञ्चमी' },
            { id: 'q-sk-1-10', text: '\'बालकानाम्\' में कौन सा वचन है?', options: ['एकवचन', 'द्विवचन', 'बहुवचन', 'कोई नहीं'], correctAnswer: 'बहुवचन' },
        ],
    }
];