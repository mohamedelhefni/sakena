"use client";

import { useTranslation } from 'react-i18next';
import { Heart, BookOpen, BarChart3, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, UserData, ISLAMIC_QUOTES } from '@/lib/types';
import { QuranPlayer } from '@/components/quran-player';

interface DashboardOverviewProps {
    user: User;
    userData: UserData;
    onNavigateToMood: () => void;
    onNavigateToJournal: () => void;
    onNavigateToInsights: () => void;
}

export function DashboardOverview({
    user,
    userData,
    onNavigateToMood,
    onNavigateToJournal,
    onNavigateToInsights
}: DashboardOverviewProps) {
    const { t } = useTranslation();

    // Get today's Islamic quote
    const todayQuote = ISLAMIC_QUOTES[new Date().getDate() % ISLAMIC_QUOTES.length];

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

                {/* Quran Player - Only show if Islamic features are enabled */}
                {userData.settings.islamicFeatures && (
                    <div className="col-span-full">
                        <QuranPlayer enabled={userData.settings.islamicFeatures} />
                    </div>
                )}

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

                {userData.settings.islamicFeatures && (
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
                )}
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('dashboard.quickActions')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                            onClick={onNavigateToMood}
                            className="h-20 islamic-green text-white"
                        >
                            <div className="text-center">
                                <Heart className="w-6 h-6 mx-auto mb-2" />
                                <div>{t('dashboard.logMood')}</div>
                            </div>
                        </Button>

                        <Button
                            onClick={onNavigateToJournal}
                            variant="outline"
                            className="h-20"
                        >
                            <div className="text-center">
                                <BookOpen className="w-6 h-6 mx-auto mb-2" />
                                <div>{t('dashboard.writeJournal')}</div>
                            </div>
                        </Button>

                        <Button
                            onClick={onNavigateToInsights}
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
}
