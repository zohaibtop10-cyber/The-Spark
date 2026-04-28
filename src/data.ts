export interface Campus {
    id: string;
    name: string;
    description: string;
    image: string;
    theme: string; // Tailwind color class for text/bg accents
}

export interface House {
    id: string;
    section: 'PG - Class 2' | 'Class 3 - 5' | 'Class 6 - 8' | 'Class 9 - 10/12';
    name: string;
    color: string;
    points: number;
}

export interface Event {
    id: string;
    title: string;
    date: string;
    description?: string;
    image_url?: string;
    category: 'Exam' | 'Sports' | 'Academic' | 'Holiday' | 'Co-Curricular';
}

export interface Founder {
    id?: string;
    name: string;
    role: string;
    quote: string;
    img: string;
    image_url?: string;
    bio?: string;
    social?: {
        twitter?: string;
        linkedin?: string;
    };
}

export interface Review {
    id: string;
    name: string;
    role: string;
    text: string;
    image_url?: string;
    rating?: number;
}

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    status: 'read' | 'unread';
    created_at: string;
}

export const CAMPUSES: Campus[] = [
    {
        id: 'jinnah',
        name: 'Jinnah Campus',
        description: 'Main Campus',
        image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        theme: 'green'
    },
    {
        id: 'sachal',
        name: 'Sachal Campus',
        description: 'Excellence in Learning',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        theme: 'blue'
    },
    {
        id: 'latif',
        name: 'Latif Campus',
        description: 'Primary Group',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        theme: 'yellow'
    },
    {
        id: 'shebaz',
        name: 'Shebaz Campus',
        description: 'Senior Group',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        theme: 'rose'
    },
    {
        id: 'liaqat',
        name: 'Liaqat Campus',
        description: 'Creative Arts & Sciences',
        image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        theme: 'red'
    },
    {
        id: 'ghazali',
        name: 'Ghazali Campus',
        description: 'Advanced Studies',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        theme: 'orange'
    }
];

// Helper to generate house variants for sections
const createHousesForSection = (section: House['section']) => [
    { id: `${section.replace(/\s/g, '')}-zest`, section, name: 'Zest House', color: 'bg-[#4a3728]', points: 0 }, // Dark Brown
    { id: `${section.replace(/\s/g, '')}-brave`, section, name: 'Brave House', color: 'bg-[#ca8a04]', points: 0 }, // Gold
    { id: `${section.replace(/\s/g, '')}-decent`, section, name: 'Decent House', color: 'bg-[#7c4a32]', points: 0 }, // Medium Brown
    { id: `${section.replace(/\s/g, '')}-smart`, section, name: 'Smart House', color: 'bg-[#b8860b]', points: 0 }, // Dark Goldenrod
    { id: `${section.replace(/\s/g, '')}-5th`, section, name: '5th House', color: 'bg-[#5c4033]', points: 0 }, // Deep Brown
];

export const HOUSES: House[] = [
    ...createHousesForSection('PG - Class 2'),
    ...createHousesForSection('Class 3 - 5'),
    ...createHousesForSection('Class 6 - 8'),
    ...createHousesForSection('Class 9 - 10/12'),
];

export const EVENTS: Event[] = [
    {
        id: '1',
        title: 'Mid-Term Assessment',
        date: '2024-10-08',
        category: 'Exam',
        description: 'Comprehensive mid-term evaluations covering the first half of the academic syllabus.',
        image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: '2',
        title: 'Annual Athletics Day',
        date: '2024-10-22',
        category: 'Sports',
        description: 'A day of field and track events fostering sportsmanship and physical fitness.',
        image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: '3',
        title: 'Science & Tech Expo',
        date: '2024-10-28',
        category: 'Academic',
        description: 'Showcasing innovative student projects in robotics, biology, and physics.',
        image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: '4',
        title: 'Staff Workshop',
        date: '2024-10-02',
        category: 'Academic',
        description: 'Professional development session for faculty focusing on modern teaching methodologies.',
        image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
];

export const REVIEWS = [
    {
        id: '1',
        name: 'Arsalan Ahmed',
        role: 'Parent of Class 8 Student',
        text: 'The academic rigor and character building at The Spark are unparalleled. My son has shown remarkable growth in his confidence and scientific curiosity.',
        rating: 5
    },
    {
        id: '2',
        name: 'Sarah Khan',
        role: 'Alumni (Batch 2022)',
        text: 'Studying at The Spark was the best decision I made. The faculty supported me through my college applications and provided a solid foundation for my engineering studies.',
        rating: 5
    },
    {
        id: '3',
        name: 'Bilal Hassan',
        role: 'Parent of PG Student',
        text: 'The creative environment in the primary group is fantastic. The play-based learning approach makes the transition to school very smooth for children.',
        rating: 5
    }
];
