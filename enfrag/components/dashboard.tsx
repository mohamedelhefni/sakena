"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MoodTracker } from '@/components/mood-tracker';
import { JournalEntryComponent } from '@/components/journal-entry';
import { JournalView } from '@/components/journal-view';
import { MoodEntry, JournalEntry, User, UserData } from '@/lib/types';
import { SecureIndexedDBStorage } from '@/lib/secure-indexeddb';
import { useTheme } from 'next-themes';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';

// Import the new view components
import { DashboardOverview } from '@/components/views/dashboard-overview';
import { MoodView } from '@/components/views/mood-view';
import { MoodEntryDetail } from '@/components/views/mood-entry-detail';
import { JournalView as JournalViewList } from '@/components/views/journal-view-list';
import { InsightsView } from '@/components/views/insights-view';
import { SettingsView } from '@/components/views/settings-view';

interface DashboardProps {
    user: User;
    userData: UserData;
    onLogout: () => void;
    onUpdateData: (data: UserData) => void;
    onUpdateUser?: (user: User) => void;
    currentPin?: string;
}

type ActiveTab = 'dashboard' | 'mood' | 'journal' | 'insights' | 'settings';

export function Dashboard({ user, userData, onLogout, onUpdateData, onUpdateUser, currentPin }: DashboardProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Get initial tab from URL params, default to 'dashboard'
    const getActiveTabFromUrl = (): ActiveTab => {
        const tab = searchParams.get('tab');
        const validTabs: ActiveTab[] = ['dashboard', 'mood', 'journal', 'insights', 'settings'];
        return validTabs.includes(tab as ActiveTab) ? (tab as ActiveTab) : 'dashboard';
    };

    const [activeTab, setActiveTab] = useState<ActiveTab>(getActiveTabFromUrl());
    
    // Update URL when tab changes
    const handleTabChange = (newTab: ActiveTab) => {
        setActiveTab(newTab);
        router.push(`?tab=${newTab}`, { scroll: false });
    };

    // Listen for browser back/forward navigation
    useEffect(() => {
        const handleUrlChange = () => {
            const newTab = getActiveTabFromUrl();
            setActiveTab(newTab);
        };

        // Update tab when URL changes (back/forward buttons)
        window.addEventListener('popstate', handleUrlChange);
        
        // Update initial tab if URL changes
        handleUrlChange();

        return () => {
            window.removeEventListener('popstate', handleUrlChange);
        };
    }, [searchParams]);

    // Initialize URL on first load if no tab parameter exists
    useEffect(() => {
        if (!searchParams.get('tab')) {
            router.replace('?tab=dashboard', { scroll: false });
        }
    }, []);

    const [showMoodTracker, setShowMoodTracker] = useState(false);
    const [viewMoodEntry, setViewMoodEntry] = useState<MoodEntry | null>(null);
    const [showJournalEntry, setShowJournalEntry] = useState(false);
    const [viewJournalEntry, setViewJournalEntry] = useState<JournalEntry | null>(null);
    const [editJournalEntry, setEditJournalEntry] = useState<JournalEntry | null>(null);
    const [journalEntries, setJournalEntries] = useState(userData.journalEntries || []);
    const [confirmDeleteMood, setConfirmDeleteMood] = useState<string | null>(null);
    const [confirmDeleteJournal, setConfirmDeleteJournal] = useState<string | null>(null);
    const [showEditUsername, setShowEditUsername] = useState(false);
    const [newUsername, setNewUsername] = useState(user.username);
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

    const handleUsernameChange = async () => {
        if (!newUsername.trim() || newUsername.trim() === user.username) {
            setShowEditUsername(false);
            return;
        }

        try {
            // Update user object with new username
            const updatedUser = { ...user, username: newUsername.trim() };

            // Save the updated user data to storage
            await SecureIndexedDBStorage.saveUserData(userData, currentPin || '');

            // Update user profile in storage
            await SecureIndexedDBStorage.saveUserProfile(newUsername.trim());

            // Update both user and userData in parent component
            if (onUpdateUser) {
                onUpdateUser(updatedUser);
            }
            onUpdateData(userData);

            setShowEditUsername(false);
        } catch (error) {
            console.error('Failed to update username:', error);
            // Reset to original username on error
            setNewUsername(user.username);
            setShowEditUsername(false);
        }
    };

    // Get today's Islamic quote - moved to DashboardOverview component

    const handleSaveMoodEntry = (entry: MoodEntry) => {
        const updatedData = {
            ...userData,
            moodEntries: [...userData.moodEntries, entry],
        };
        onUpdateData(updatedData);
        setShowMoodTracker(false);
        handleTabChange('dashboard');
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
        handleTabChange('journal');
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
                    <DashboardOverview
                        user={user}
                        userData={userData}
                        onNavigateToMood={() => {
                            handleTabChange('mood');
                            setShowMoodTracker(true);
                        }}
                        onNavigateToJournal={() => handleTabChange('journal')}
                        onNavigateToInsights={() => handleTabChange('insights')}
                    />
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
                        <MoodEntryDetail
                            entry={viewMoodEntry}
                            onBack={handleBackFromMoodView}
                            onDelete={() => setConfirmDeleteMood(viewMoodEntry.id)}
                            formatDate={formatDate}
                        />
                    );
                }

                return (
                    <MoodView
                        userData={userData}
                        onAddMood={() => setShowMoodTracker(true)}
                        onViewMoodEntry={handleViewMoodEntry}
                    />
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
                    <JournalViewList
                        userData={userData}
                        onAddEntry={() => setShowJournalEntry(true)}
                        onViewEntry={handleViewJournalEntry}
                    />
                );

            case 'insights':
                return (
                    <InsightsView
                        userData={userData}
                        onNavigateToMood={() => {
                            handleTabChange('mood');
                            setShowMoodTracker(true);
                        }}
                    />
                );

            case 'settings':
                return (
                    <SettingsView
                        user={user}
                        onChangeUsername={() => {
                            setNewUsername(user.username);
                            setShowEditUsername(true);
                        }}
                    />
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
                                        onClick={() => handleTabChange(item.id as ActiveTab)}
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
                <main className="flex-1  p-6 max-w-4xl mx-auto w-full">
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

            {/* Username Change Dialog */}
            <Dialog open={showEditUsername} onOpenChange={setShowEditUsername}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('settings.changeUsername')}</DialogTitle>
                        <DialogDescription>
                            {t('settings.changeUsernameDescription')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <label htmlFor="newUsername" className="text-sm font-medium">
                                {t('auth.usernameLabel')}
                            </label>
                            <Input
                                id="newUsername"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder={t('auth.usernamePlaceholder')}
                                className="mt-1"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditUsername(false)}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            onClick={handleUsernameChange}
                            disabled={!newUsername.trim() || newUsername.trim() === user.username}
                        >
                            {t('common.save')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SidebarProvider>
    );
}
