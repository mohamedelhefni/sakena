export interface MoodEntry {
    id: string;
    date: Date;
    time?: string; // HH:MM format for time of day
    hour?: number; // 0-23 for easier analytics
    mood: MoodLevel;
    emotions: string[];
    energy: number; // 1-5 scale
    stress: number; // 1-5 scale
    sleep: number; // hours
    notes?: string;
    islamicPractices?: {
        prayer: boolean;
        quran: boolean;
        dhikr: boolean;
        charity: boolean;
    };
    gratitude?: string[];
}

export interface JournalEntry {
    id: string;
    date: Date;
    title?: string;
    content: string;
    mood?: MoodLevel;
    emotions?: string[];
    isPrivate: boolean;
}

export interface User {
    username: string;
    language: 'ar' | 'en';
    theme: 'light' | 'dark' | 'system';
    reminderTime?: string;
    profilePicture?: string;
}

export type MoodLevel = 'very-low' | 'low' | 'neutral' | 'good' | 'excellent';

export interface UserData {
    user: User;
    moodEntries: MoodEntry[];
    journalEntries: JournalEntry[];
    settings: {
        notifications: boolean;
        backupEnabled: boolean;
        islamicFeatures: boolean;
    };
}

export interface IslamicQuote {
    id: string;
    arabic: string;
    translation: string;
    source: string;
    category: 'hope' | 'patience' | 'gratitude' | 'healing' | 'strength';
}

export const EMOTIONS = [
    { value: 'happy', label: 'emotions.happy', color: '#10b981' },
    { value: 'sad', label: 'emotions.sad', color: '#3b82f6' },
    { value: 'anxious', label: 'emotions.anxious', color: '#f59e0b' },
    { value: 'angry', label: 'emotions.angry', color: '#ef4444' },
    { value: 'peaceful', label: 'emotions.peaceful', color: '#8b5cf6' },
    { value: 'grateful', label: 'emotions.grateful', color: '#06b6d4' },
    { value: 'hopeful', label: 'emotions.hopeful', color: '#84cc16' },
    { value: 'tired', label: 'emotions.tired', color: '#6b7280' },
    { value: 'excited', label: 'emotions.excited', color: '#f97316' },
    { value: 'confused', label: 'emotions.confused', color: '#a855f7' },
] as const;

export const ISLAMIC_QUOTES: IslamicQuote[] = [
    {
        id: '1',
        arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
        translation: 'And whoever fears Allah - He will make for him a way out',
        source: 'Quran 65:2',
        category: 'hope'
    },
    {
        id: '2',
        arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
        translation: 'For indeed, with hardship [will be] ease',
        source: 'Quran 94:6',
        category: 'hope'
    },
    {
        id: '3',
        arabic: 'وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ',
        translation: 'And be patient, and your patience is not but through Allah',
        source: 'Quran 16:127',
        category: 'patience'
    },
    {
        id: '4',
        arabic: 'وَاذْكُرُوا نِعْمَتَ اللَّهِ عَلَيْكُمْ',
        translation: 'And remember the favor of Allah upon you',
        source: 'Quran 3:103',
        category: 'gratitude'
    },
];
