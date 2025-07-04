"use client";

import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoodEntry } from '@/lib/types';
import { format, subDays, isAfter } from 'date-fns';

interface MoodTrendChartProps {
    moodEntries: MoodEntry[];
}

// Helper function to map mood strings to numeric values
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

export function MoodTrendChart({ moodEntries }: MoodTrendChartProps) {
    const { t } = useTranslation();

    // Get last 30 days of data
    const thirtyDaysAgo = subDays(new Date(), 30);
    const recentEntries = moodEntries.filter(entry => {
        const entryDate = typeof entry.date === 'string' ? new Date(entry.date) : entry.date;
        return isAfter(entryDate, thirtyDaysAgo);
    });

    // Prepare data for chart
    const chartData = recentEntries
        .map(entry => ({
            date: format(typeof entry.date === 'string' ? new Date(entry.date) : entry.date, 'MMM dd'),
            mood: getMoodValue(entry.mood),
            energy: entry.energy,
            stress: entry.stress
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (chartData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{t('insights.moodTrend')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        {t('insights.noDataForChart')}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('insights.moodTrend')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="date" 
                                tick={{ fontSize: 12 }}
                                interval="preserveStartEnd"
                            />
                            <YAxis 
                                domain={[1, 5]} 
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip 
                                labelFormatter={(label) => `Date: ${label}`}
                                formatter={(value, name) => [
                                    value,
                                    name === 'mood' ? t('insights.mood') :
                                    name === 'energy' ? t('insights.energy') :
                                    t('insights.stress')
                                ]}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="mood" 
                                stroke="#10b981" 
                                strokeWidth={2}
                                dot={{ fill: '#10b981' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="energy" 
                                stroke="#f59e0b" 
                                strokeWidth={2}
                                dot={{ fill: '#f59e0b' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="stress" 
                                stroke="#ef4444" 
                                strokeWidth={2}
                                dot={{ fill: '#ef4444' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
