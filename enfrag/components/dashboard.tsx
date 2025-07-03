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
import { MoodTracker } from '@/components/mood-tracker';
import { MoodEntry, User, UserData, ISLAMIC_QUOTES } from '@/lib/types';
import { useTheme } from 'next-themes';

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
    const { theme, setTheme } = useTheme();
    const { t, i18n } = useTranslation();

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
                return showMoodTracker ? (
                    <MoodTracker
                        onSave={handleSaveMoodEntry}
                        onCancel={() => setShowMoodTracker(false)}
                    />
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('mood.title')}</CardTitle>
                            <CardDescription>
                                {t('mood.description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-center py-4">
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

                                {/* Recent Mood Entries */}
                                {userData.moodEntries.length > 0 && (
                                    <div className="border-t pt-4">
                                        <h4 className="font-medium mb-3">
                                            {t('mood.recentEntries')}
                                        </h4>
                                        <div className="space-y-2">
                                            {userData.moodEntries.slice(-3).reverse().map((entry) => (
                                                <div key={entry.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                                    <div>
                                                        <span className="font-medium">{entry.date}</span>
                                                        <span className="ml-2 text-muted-foreground">
                                                            {t(`mood.levels.${entry.mood}`)}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {entry.emotions.slice(0, 2).map(e => t(`emotions.${e}`)).join(', ')}
                                                        {entry.emotions.length > 2 && ` +${entry.emotions.length - 2}`}
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
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('nav.journal')}</CardTitle>
                            <CardDescription>
                                {t('journal.description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground py-8">
                                {t('journal.comingSoon')}
                            </p>
                        </CardContent>
                    </Card>
                );

            case 'insights':
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('nav.insights')}</CardTitle>
                            <CardDescription>
                                {t('insights.description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground py-8">
                                {t('insights.comingSoon')}
                            </p>
                        </CardContent>
                    </Card>
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
        <div className="flex h-screen bg-background" dir={i18n.dir()}>
            {/* Sidebar */}
            <div className="w-64 bg-card border-l border-border p-4 flex flex-col">
                <div className="mb-8">
                    <h1 className="text-xl font-bold text-center font-arabic">
                        🌱 {t('appTitle')}
                    </h1>
                </div>

                <nav className="space-y-2 flex-grow">
                    {sidebarItems.map((item) => (
                        <Button
                            key={item.id}
                            variant={activeTab === item.id ? 'default' : 'ghost'}
                            className="w-full justify-start gap-3"
                            onClick={() => {
                                setActiveTab(item.id as ActiveTab);
                                if (item.id === 'mood') {
                                    setShowMoodTracker(false);
                                }
                            }}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Button>
                    ))}
                </nav>

                <div className="mt-auto space-y-2">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3"
                        onClick={onLogout}
                    >
                        <LogOut className="w-4 h-4" />
                        {t('nav.logout')}
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6">
                {renderContent()}
            </main>
        </div>
    );
}
