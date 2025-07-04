"use client";

import { useTranslation } from 'react-i18next';
import { BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserData } from '@/lib/types';
import { MoodTrendChart } from '@/components/charts/mood-trend-chart';
import { MoodDistributionChart } from '@/components/charts/mood-distribution-chart';
import { MoodHeatmap } from '@/components/charts/mood-heatmap';

interface InsightsViewProps {
    userData: UserData;
    onNavigateToMood: () => void;
}

export function InsightsView({ userData, onNavigateToMood }: InsightsViewProps) {
    const { t } = useTranslation();

    // Calculate statistics
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

    // Calculate mood trend (last week vs previous week)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const lastWeekEntries = userData.moodEntries.filter(entry => {
        const entryDate = typeof entry.date === 'string' ? new Date(entry.date) : entry.date;
        return entryDate >= oneWeekAgo;
    });

    const previousWeekEntries = userData.moodEntries.filter(entry => {
        const entryDate = typeof entry.date === 'string' ? new Date(entry.date) : entry.date;
        return entryDate >= twoWeeksAgo && entryDate < oneWeekAgo;
    });

    const getMoodValue = (mood: string): number => {
        const moodMap: Record<string, number> = {
            'terrible': 1,
            'bad': 2,
            'neutral': 3,
            'good': 4,
            'excellent': 5
        };
        return moodMap[mood] || 3;
    };

    const lastWeekAvg = lastWeekEntries.length > 0
        ? lastWeekEntries.reduce((sum, entry) => sum + getMoodValue(entry.mood), 0) / lastWeekEntries.length
        : 0;

    const previousWeekAvg = previousWeekEntries.length > 0
        ? previousWeekEntries.reduce((sum, entry) => sum + getMoodValue(entry.mood), 0) / previousWeekEntries.length
        : 0;

    const moodTrend = lastWeekAvg - previousWeekAvg;

    if (userData.moodEntries.length === 0) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('insights.moodAnalytics')}</CardTitle>
                        <CardDescription>{t('insights.last30Days')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8">
                            <BarChart3 className="w-16 h-16 mx-auto text-purple-500 mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                                {t('insights.noDataYet')}
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                {t('insights.startTracking')}
                            </p>
                            <Button
                                onClick={onNavigateToMood}
                                className="islamic-green text-white"
                            >
                                {t('mood.startMoodEntry')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Statistics */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('insights.moodAnalytics')}</CardTitle>
                    <CardDescription>{t('insights.overallSummary')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                            <h4 className="font-medium mb-2">{t('insights.weeklyTrend')}</h4>
                            <div className="flex items-center gap-2">
                                <p className={`text-2xl font-bold ${moodTrend > 0 ? 'text-green-600' : moodTrend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                    {moodTrend > 0 ? '↗' : moodTrend < 0 ? '↘' : '→'}
                                </p>
                                <span className="text-sm text-muted-foreground">
                                    {moodTrend > 0 ? t('insights.improving') :
                                        moodTrend < 0 ? t('insights.declining') :
                                            t('insights.stable')}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MoodTrendChart moodEntries={userData.moodEntries} />
                <MoodDistributionChart moodEntries={userData.moodEntries} />
            </div>

            {/* Heatmap */}
            <MoodHeatmap moodEntries={userData.moodEntries} />

            {/* Additional Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('insights.energyStressAnalysis')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span>{t('insights.averageEnergy')}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-500 rounded-full"
                                            style={{ width: `${(averageEnergy / 5) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium">{averageEnergy.toFixed(1)}/5</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>{t('insights.averageStress')}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-red-500 rounded-full"
                                            style={{ width: `${(averageStress / 5) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium">{averageStress.toFixed(1)}/5</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('insights.journalInsights')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>{t('insights.journalEntries')}</span>
                                <span className="font-medium">{userData.journalEntries.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('insights.averageLength')}</span>
                                <span className="font-medium">
                                    {userData.journalEntries.length > 0
                                        ? Math.round(
                                            userData.journalEntries.reduce(
                                                (sum, entry) => sum + (entry.content?.length || 0), 0
                                            ) / userData.journalEntries.length
                                        )
                                        : 0
                                    } {t('insights.characters')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('insights.privateEntries')}</span>
                                <span className="font-medium">
                                    {userData.journalEntries.filter(entry => entry.isPrivate).length}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
