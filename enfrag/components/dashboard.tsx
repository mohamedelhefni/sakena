"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Calendar,
    BookOpen,
    BarChart3,
    Settings,
    Heart,
    Moon,
    Sun,
    LogOut,
    Sparkles,
    Languages
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MoodTracker } from '@/components/mood-tracker';
import { JournalEntryComponent } from '@/components/journal-entry';
import { JournalView } from '@/components/journal-view';
import { MoodEntry, JournalEntry, User, UserData, ISLAMIC_QUOTES } from '@/lib/types';
import { SecureIndexedDBStorage } from '@/lib/secure-indexeddb';
import { useTheme } from 'next-themes';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';

interface DashboardProps {
    user: User;
    userData: UserData;
    onLogout: () => void;
    onUpdateData: (data: UserData) => void;
}

type ActiveTab = 'dashboard' | 'mood' | 'journal' | 'insights' | 'settings';

export function Dashboard({ user, userData, onLogout, onUpdateData }: DashboardProps) {
    const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
    const [showMoodTracker, setShowMoodTracker] = useState(false);
    const [viewMoodEntry, setViewMoodEntry] = useState<MoodEntry | null>(null);
    const [showJournalEntry, setShowJournalEntry] = useState(false);
    const [viewJournalEntry, setViewJournalEntry] = useState<JournalEntry | null>(null);
    const [editJournalEntry, setEditJournalEntry] = useState<JournalEntry | null>(null);
    const [journalEntries, setJournalEntries] = useState(userData.journalEntries || []);
    const [confirmDeleteMood, setConfirmDeleteMood] = useState<string | null>(null);
    const [confirmDeleteJournal, setConfirmDeleteJournal] = useState<string | null>(null);
    const { theme, setTheme } = useTheme();
    const { t, i18n } = useTranslation();
    const isMobile = useIsMobile();
    const locale = i18n.language === 'ar' ? arSA : enUS;

    // Helper function to format date safely
    const formatDate = (date: Date | string) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(dateObj.getTime())) {
            return 'Invalid Date';
        }

        return format(dateObj, 'PPP p', { locale });
    };

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    // Get today's Islamic quote
    const todayQuote = ISLAMIC_QUOTES[new Date().getDate() % ISLAMIC_QUOTES.length];

    const handleSaveMoodEntry = (entry: MoodEntry) => {
        const updatedData = {
            ...userData,
            moodEntries: [...userData.moodEntries, entry],
        };
        onUpdateData(updatedData);
        setShowMoodTracker(false);
        setActiveTab('dashboard');
    };

    const handleViewMoodEntry = (entry: MoodEntry) => {
        setViewMoodEntry(entry);
    };

    const handleBackFromMoodView = () => {
        setViewMoodEntry(null);
    };

    const handleDeleteMoodEntry = async (entryId: string) => {
        const updatedMoodEntries = userData.moodEntries.filter(e => e.id !== entryId);
        const updatedData = {
            ...userData,
            moodEntries: updatedMoodEntries
        };
        onUpdateData(updatedData);

        // Also delete from secure storage
        try {
            await SecureIndexedDBStorage.deleteMoodEntry(user.username, entryId);
        } catch (error) {
            console.error('Failed to delete mood entry from storage:', error);
        }

        setViewMoodEntry(null);
        setConfirmDeleteMood(null);
    };

    const handleDeleteJournalEntry = async (entryId: string) => {
        const updatedJournalEntries = userData.journalEntries.filter(e => e.id !== entryId);
        const updatedData = {
            ...userData,
            journalEntries: updatedJournalEntries
        };
        onUpdateData(updatedData);
        setJournalEntries(updatedJournalEntries);

        // Also delete from secure storage
        try {
            await SecureIndexedDBStorage.deleteJournalEntry(user.username, entryId);
        } catch (error) {
            console.error('Failed to delete journal entry from storage:', error);
        }

        setViewJournalEntry(null);
        setConfirmDeleteJournal(null);
    };

    const handleSaveJournalEntry = (entry: JournalEntry) => {
        let updatedEntries;
        if (editJournalEntry) {
            // Update existing entry
            updatedEntries = userData.journalEntries.map(e =>
                e.id === entry.id ? entry : e
            );
        } else {
            // Add new entry
            updatedEntries = [...userData.journalEntries, entry];
        }

        const updatedData = {
            ...userData,
            journalEntries: updatedEntries,
        };
        onUpdateData(updatedData);
        setJournalEntries(updatedEntries);
        setShowJournalEntry(false);
        setEditJournalEntry(null);
        setActiveTab('journal');
    };

    const handleViewJournalEntry = (entry: JournalEntry) => {
        setViewJournalEntry(entry);
    };

    const handleEditJournalEntry = (entry: JournalEntry) => {
        setEditJournalEntry(entry);
        setViewJournalEntry(null);
        setShowJournalEntry(true);
    };

    const handleBackFromJournalView = () => {
        setViewJournalEntry(null);
        setEditJournalEntry(null);
        setShowJournalEntry(false);
    };

    const sidebarItems = [
        { id: 'dashboard', icon: Heart, label: t('nav.dashboard') },
        { id: 'mood', icon: Calendar, label: t('nav.mood') },
        { id: 'journal', icon: BookOpen, label: t('nav.journal') },
        { id: 'insights', icon: BarChart3, label: t('nav.insights') },
        { id: 'settings', icon: Settings, label: t('nav.settings') },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Welcome Card */}
                            <Card className="col-span-full">
                                <CardHeader>
                                    <CardTitle className="text-2xl">
                                        {t('dashboard.welcome', { username: user.username })}
                                    </CardTitle>
                                    <CardDescription>
                                        {t('dashboard.howFeeling')}
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            {/* Islamic Quote of the Day */}
                            <Card className="col-span-full islamic-green text-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Sparkles className="w-5 h-5" />
                                        {t('dashboard.verseOfDay')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <blockquote className="text-lg mb-4 font-arabic leading-relaxed">
                                        "{todayQuote.arabic}"
                                    </blockquote>
                                    <p className="text-sm opacity-90 mb-2">
                                        "{todayQuote.translation}"
                                    </p>
                                    <p className="text-xs opacity-75">
                                        - {todayQuote.source}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Quick Stats */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('dashboard.totalEntries')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">
                                        {userData.moodEntries.length + userData.journalEntries.length}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('dashboard.weekMood')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2">
                                        <Heart className="w-6 h-6 text-green-500" />
                                        <span className="text-lg">{t('mood.levels.good')}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('dashboard.dailyPractices')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary">{t('practices.prayer')}</Badge>
                                        <Badge variant="secondary">{t('practices.quran')}</Badge>
                                        <Badge variant="secondary">{t('practices.dhikr')}</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('dashboard.quickActions')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Button
                                        onClick={() => {
                                            setActiveTab('mood');
                                            setShowMoodTracker(true);
                                        }}
                                        className="h-20 islamic-green text-white"
                                    >
                                        <div className="text-center">
                                            <Heart className="w-6 h-6 mx-auto mb-2" />
                                            <div>{t('dashboard.logMood')}</div>
                                        </div>
                                    </Button>

                                    <Button
                                        onClick={() => setActiveTab('journal')}
                                        variant="outline"
                                        className="h-20"
                                    >
                                        <div className="text-center">
                                            <BookOpen className="w-6 h-6 mx-auto mb-2" />
                                            <div>{t('dashboard.writeJournal')}</div>
                                        </div>
                                    </Button>

                                    <Button
                                        onClick={() => setActiveTab('insights')}
                                        variant="outline"
                                        className="h-20"
                                    >
                                        <div className="text-center">
                                            <BarChart3 className="w-6 h-6 mx-auto mb-2" />
                                            <div>{t('dashboard.viewInsights')}</div>
                                        </div>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );

            case 'mood':
                if (showMoodTracker) {
                    return (
                        <MoodTracker
                            onSave={handleSaveMoodEntry}
                            onCancel={() => setShowMoodTracker(false)}
                        />
                    );
                }

                if (viewMoodEntry) {
                    return (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>{t('mood.viewEntry')}</CardTitle>
                                        <CardDescription>{formatDate(viewMoodEntry.date)} {viewMoodEntry.time && `- ${viewMoodEntry.time}`}</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="destructive" onClick={() => setConfirmDeleteMood(viewMoodEntry.id)}>
                                            {t('common.delete')}
                                        </Button>
                                        <Button variant="outline" onClick={handleBackFromMoodView}>
                                            {t('common.back')}
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-medium mb-2">{t('mood.overallMoodLabel')}</h4>
                                        <div className="flex items-center gap-2">
                                            <Heart className="w-5 h-5 text-green-500" />
                                            <span className="text-lg">{t(`mood.levels.${viewMoodEntry.mood}`)}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-2">{t('mood.emotionsLabel')}</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {viewMoodEntry.emotions.map(emotion => (
                                                <Badge key={emotion} variant="secondary">
                                                    {t(`emotions.${emotion}`)}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-2">{t('mood.energyLabel')}</h4>
                                        <p>{t(`mood.levels.${viewMoodEntry.energy === 1 ? 'very-low' : viewMoodEntry.energy === 2 ? 'low' : viewMoodEntry.energy === 3 ? 'neutral' : viewMoodEntry.energy === 4 ? 'good' : 'excellent'}`)}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-2">{t('mood.stressLabel')}</h4>
                                        <p>{t(`mood.levels.${viewMoodEntry.stress === 1 ? 'very-low' : viewMoodEntry.stress === 2 ? 'low' : viewMoodEntry.stress === 3 ? 'neutral' : viewMoodEntry.stress === 4 ? 'high' : 'very-high'}`)}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-2">{t('mood.sleepLabel')}</h4>
                                        <p>{t('mood.hours', { count: viewMoodEntry.sleep })}</p>
                                    </div>
                                </div>

                                {viewMoodEntry.islamicPractices && (
                                    <div>
                                        <h4 className="font-medium mb-2">{t('mood.islamicPracticesLabel')}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(viewMoodEntry.islamicPractices).map(([practice, completed]) => (
                                                completed && (
                                                    <Badge key={practice} variant="default">
                                                        {t(`practices.${practice}`)}
                                                    </Badge>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {viewMoodEntry.gratitude && viewMoodEntry.gratitude.length > 0 && (
                                    <div>
                                        <h4 className="font-medium mb-2">{t('mood.gratitudeLabel')}</h4>
                                        <ul className="list-disc list-inside space-y-1">
                                            {viewMoodEntry.gratitude.map((item, index) => (
                                                <li key={index} className="text-sm">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {viewMoodEntry.notes && (
                                    <div>
                                        <h4 className="font-medium mb-2">{t('mood.notesLabel')}</h4>
                                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                                            {viewMoodEntry.notes}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                }

                return (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>{t('mood.title')}</CardTitle>
                                    <CardDescription>{t('mood.description')}</CardDescription>
                                </div>
                                <Button
                                    onClick={() => setShowMoodTracker(true)}
                                    className="islamic-green text-white"
                                >
                                    {t('mood.addNewEntry')}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {userData.moodEntries.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Heart className="w-16 h-16 mx-auto text-green-500 mb-4" />
                                        <h3 className="text-lg font-medium mb-2">
                                            {t('mood.readyToTrack')}
                                        </h3>
                                        <p className="text-muted-foreground mb-6">
                                            {t('mood.trackingHelps')}
                                        </p>
                                        <Button
                                            onClick={() => setShowMoodTracker(true)}
                                            className="islamic-green text-white"
                                        >
                                            {t('mood.startMoodEntry')}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <h4 className="font-medium">{t('mood.moodHistory')}</h4>
                                        <div className="space-y-2">
                                            {userData.moodEntries.slice().reverse().map((entry) => (
                                                <div
                                                    key={entry.id}
                                                    className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer transition-colors"
                                                    onClick={() => handleViewMoodEntry(entry)}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div>
                                                            <p className="font-medium">{entry.date.toLocaleString()} </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {t(`mood.levels.${entry.mood}`)}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1">
                                                            {entry.emotions.slice(0, 3).map(emotion => (
                                                                <Badge key={emotion} variant="outline" className="text-xs">
                                                                    {t(`emotions.${emotion}`)}
                                                                </Badge>
                                                            ))}
                                                            {entry.emotions.length > 3 && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    +{entry.emotions.length - 3}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {t('mood.viewDetails')}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                );

            case 'journal':
                if (showJournalEntry) {
                    return (
                        <JournalEntryComponent
                            onSave={handleSaveJournalEntry}
                            onCancel={handleBackFromJournalView}
                            existingEntry={editJournalEntry || undefined}
                        />
                    );
                }

                if (viewJournalEntry) {
                    return (
                        <JournalView
                            entry={viewJournalEntry}
                            onEdit={() => handleEditJournalEntry(viewJournalEntry)}
                            onBack={handleBackFromJournalView}
                            onDelete={() => setConfirmDeleteJournal(viewJournalEntry.id)}
                        />
                    );
                }

                return (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>{t('nav.journal')}</CardTitle>
                                    <CardDescription>{t('journal.description')}</CardDescription>
                                </div>
                                <Button
                                    className="islamic-green text-white"
                                    onClick={() => setShowJournalEntry(true)}
                                >
                                    {t('journal.addNewEntry')}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {userData.journalEntries.length === 0 ? (
                                <div className="text-center py-8">
                                    <BookOpen className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                                    <h3 className="text-lg font-medium mb-2">
                                        {t('journal.startWriting')}
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        {t('journal.writingHelps')}
                                    </p>
                                    <Button
                                        className="islamic-green text-white"
                                        onClick={() => setShowJournalEntry(true)}
                                    >
                                        {t('journal.startFirstEntry')}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">{t('journal.allEntries')} ({userData.journalEntries.length})</h4>
                                    </div>
                                    <div className="space-y-3">
                                        {userData.journalEntries
                                            .slice()
                                            .reverse()
                                            .map((entry) => (
                                                <div
                                                    key={entry.id}
                                                    className="p-4 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer transition-colors"
                                                    onClick={() => handleViewJournalEntry(entry)}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <h5 className="font-medium">
                                                                    {entry.title || t('journal.untitled')}
                                                                </h5>
                                                                {entry.mood && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        <Heart className="w-3 h-3 mr-1" />
                                                                        {t(`mood.levels.${entry.mood}`)}
                                                                    </Badge>
                                                                )}
                                                                {entry.isPrivate && (
                                                                    <Badge variant="destructive" className="text-xs">
                                                                        Private
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div
                                                                className="text-sm text-muted-foreground mb-2 line-clamp-2"
                                                                dangerouslySetInnerHTML={{
                                                                    __html:
                                                                        entry.content && entry.content.length > 120
                                                                            ? `${entry.content.substring(0, 120)}...`
                                                                            : entry.content || ''
                                                                }}
                                                            />
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-muted-foreground">
                                                                    {format(
                                                                        typeof entry.date === 'string' ? new Date(entry.date) : entry.date,
                                                                        'PPp',
                                                                        { locale: i18n.language === 'ar' ? arSA : enUS }
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {t('journal.viewEntry')}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );

            case 'insights':
                const moodCounts = userData.moodEntries.reduce((acc, entry) => {
                    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);

                const mostCommonMood = Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0];
                const averageEnergy = userData.moodEntries.length > 0
                    ? userData.moodEntries.reduce((sum, entry) => sum + entry.energy, 0) / userData.moodEntries.length
                    : 0;
                const averageStress = userData.moodEntries.length > 0
                    ? userData.moodEntries.reduce((sum, entry) => sum + entry.stress, 0) / userData.moodEntries.length
                    : 0;

                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('insights.moodAnalytics')}</CardTitle>
                                <CardDescription>{t('insights.last30Days')}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {userData.moodEntries.length === 0 ? (
                                    <div className="text-center py-8">
                                        <BarChart3 className="w-16 h-16 mx-auto text-purple-500 mb-4" />
                                        <h3 className="text-lg font-medium mb-2">
                                            {t('insights.noDataYet')}
                                        </h3>
                                        <p className="text-muted-foreground mb-6">
                                            {t('insights.startTracking')}
                                        </p>
                                        <Button
                                            onClick={() => {
                                                setActiveTab('mood');
                                                setShowMoodTracker(true);
                                            }}
                                            className="islamic-green text-white"
                                        >
                                            {t('mood.startMoodEntry')}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="p-4 bg-muted rounded-lg">
                                            <h4 className="font-medium mb-2">{t('insights.totalEntries')}</h4>
                                            <p className="text-2xl font-bold text-green-600">
                                                {userData.moodEntries.length}
                                            </p>
                                        </div>

                                        {mostCommonMood && (
                                            <div className="p-4 bg-muted rounded-lg">
                                                <h4 className="font-medium mb-2">{t('insights.mostCommonMood')}</h4>
                                                <p className="text-lg font-semibold">
                                                    {t(`mood.levels.${mostCommonMood[0]}`)}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {mostCommonMood[1]} {t('insights.times')}
                                                </p>
                                            </div>
                                        )}

                                        <div className="p-4 bg-muted rounded-lg">
                                            <h4 className="font-medium mb-2">{t('insights.averageEnergy')}</h4>
                                            <p className="text-2xl font-bold text-yellow-600">
                                                {averageEnergy.toFixed(1)}/5
                                            </p>
                                        </div>

                                        <div className="p-4 bg-muted rounded-lg">
                                            <h4 className="font-medium mb-2">{t('insights.averageStress')}</h4>
                                            <p className="text-2xl font-bold text-red-600">
                                                {averageStress.toFixed(1)}/5
                                            </p>
                                        </div>

                                        <div className="p-4 bg-muted rounded-lg">
                                            <h4 className="font-medium mb-2">{t('insights.journalEntries')}</h4>
                                            <p className="text-2xl font-bold text-blue-600">
                                                {userData.journalEntries.length}
                                            </p>
                                        </div>

                                        <div className="p-4 bg-muted rounded-lg">
                                            <h4 className="font-medium mb-2">{t('insights.streakDays')}</h4>
                                            <p className="text-2xl font-bold text-purple-600">
                                                {userData.moodEntries.length > 0 ? Math.min(userData.moodEntries.length, 7) : 0}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {userData.moodEntries.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('insights.moodDistribution')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {Object.entries(moodCounts).map(([mood, count]) => {
                                            const percentage = (count / userData.moodEntries.length) * 100;
                                            return (
                                                <div key={mood} className="flex items-center justify-between">
                                                    <span className="font-medium">{t(`mood.levels.${mood}`)}</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-green-500 rounded-full"
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm text-muted-foreground w-12">
                                                            {percentage.toFixed(0)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                );

            case 'settings':
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('nav.settings')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-medium mb-3">{t('settings.theme')}</h3>
                                <div className="flex gap-2">
                                    <Button
                                        variant={theme === 'light' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setTheme('light')}
                                    >
                                        <Sun className="w-4 h-4 ml-2" />
                                        {t('settings.light')}
                                    </Button>
                                    <Button
                                        variant={theme === 'dark' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setTheme('dark')}
                                    >
                                        <Moon className="w-4 h-4 ml-2" />
                                        {t('settings.dark')}
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-3">{t('settings.language')}</h3>
                                <div className="flex gap-2">
                                    <Button
                                        variant={i18n.language === 'en' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => changeLanguage('en')}
                                    >
                                        English
                                    </Button>
                                    <Button
                                        variant={i18n.language === 'ar' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => changeLanguage('ar')}
                                    >
                                        العربية
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-3">{t('settings.userInfo')}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t('auth.usernameLabel')}: {user.username}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-background" dir={i18n.dir()}>
                <Sidebar side={i18n.language === 'ar' ? 'right' : 'left'}>
                    <SidebarHeader>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-8 h-8 text-green-500" />
                            <h1 className="text-2xl font-semibold">{t('appTitle')}</h1>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            {sidebarItems.map(item => (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton
                                        onClick={() => setActiveTab(item.id as ActiveTab)}
                                        isActive={activeTab === item.id}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-around p-2 rounded-md bg-muted">
                                {
                                    theme == 'dark' ? (
                                        <Button variant="ghost" size="icon" onClick={() => setTheme('light')} >
                                            <Sun className="w-5 h-5" />
                                        </Button>
                                    ) : (
                                        <Button variant="ghost" size="icon" onClick={() => setTheme('dark')}>
                                            <Moon className="w-5 h-5" />
                                        </Button>
                                    )
                                }
                            </div>
                            <div className="flex items-center justify-around p-2 rounded-md bg-muted">
                                {
                                    i18n.language == 'ar' ? (
                                        <Button variant="ghost" size="icon" onClick={() => changeLanguage('en')} >
                                            EN
                                        </Button>
                                    ) : (
                                        <Button variant="ghost" size="icon" onClick={() => changeLanguage('ar')} >
                                            ع
                                        </Button>
                                    )
                                }

                            </div>
                            <Button variant="outline" onClick={onLogout}>
                                <LogOut className="w-5 h-5 mr-2" />
                                {t('nav.logout')}
                            </Button>
                        </div>
                    </SidebarFooter>
                </Sidebar>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6  ">
                    {isMobile && (
                        <div className="mb-4">
                            <SidebarTrigger />
                        </div>
                    )}
                    {renderContent()}
                </main>
            </div>

            {/* Delete Confirmation Dialogs */}
            <Dialog open={!!confirmDeleteMood} onOpenChange={() => setConfirmDeleteMood(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('common.confirmDelete')}</DialogTitle>
                        <DialogDescription>
                            {t('mood.deleteConfirmation')}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmDeleteMood(null)}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => confirmDeleteMood && handleDeleteMoodEntry(confirmDeleteMood)}
                        >
                            {t('common.delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!confirmDeleteJournal} onOpenChange={() => setConfirmDeleteJournal(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('common.confirmDelete')}</DialogTitle>
                        <DialogDescription>
                            {t('journal.deleteConfirmation')}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmDeleteJournal(null)}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => confirmDeleteJournal && handleDeleteJournalEntry(confirmDeleteJournal)}
                        >
                            {t('common.delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SidebarProvider>
    );
}
