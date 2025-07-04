"use client";

import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoodEntry } from '@/lib/types';
import { format, startOfWeek, addDays, subWeeks, isSameDay } from 'date-fns';

interface MoodHeatmapProps {
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

// Helper function to get color intensity based on mood value
const getMoodColor = (value: number): string => {
    if (value === 0) return 'bg-gray-100 dark:bg-gray-800'; // No data
    if (value <= 2) return 'bg-red-200 dark:bg-red-900';
    if (value <= 3) return 'bg-yellow-200 dark:bg-yellow-800';
    if (value <= 4) return 'bg-green-200 dark:bg-green-800';
    return 'bg-green-400 dark:bg-green-600';
};

export function MoodHeatmap({ moodEntries }: MoodHeatmapProps) {
    const { t } = useTranslation();

    // Get the last 12 weeks
    const weeksToShow = 12;
    const today = new Date();
    const startDate = subWeeks(startOfWeek(today), weeksToShow - 1);

    // Create a grid of days
    const weeks = [];
    for (let week = 0; week < weeksToShow; week++) {
        const weekStart = addDays(startDate, week * 7);
        const weekDays = [];
        
        for (let day = 0; day < 7; day++) {
            const currentDay = addDays(weekStart, day);
            
            // Find mood entry for this day
            const dayEntry = moodEntries.find(entry => {
                const entryDate = typeof entry.date === 'string' ? new Date(entry.date) : entry.date;
                return isSameDay(entryDate, currentDay);
            });
            
            const moodValue = dayEntry ? getMoodValue(dayEntry.mood) : 0;
            
            weekDays.push({
                date: currentDay,
                moodValue,
                colorClass: getMoodColor(moodValue),
                tooltip: dayEntry 
                    ? `${format(currentDay, 'MMM dd')}: ${t(`mood.levels.${dayEntry.mood}`)}`
                    : `${format(currentDay, 'MMM dd')}: ${t('insights.noEntry')}`
            });
        }
        
        weeks.push(weekDays);
    }

    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('insights.moodHeatmap')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Legend */}
                    <div className="flex items-center justify-between text-sm">
                        <span>{t('insights.less')}</span>
                        <div className="flex gap-1">
                            <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800"></div>
                            <div className="w-3 h-3 rounded-sm bg-red-200 dark:bg-red-900"></div>
                            <div className="w-3 h-3 rounded-sm bg-yellow-200 dark:bg-yellow-800"></div>
                            <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-800"></div>
                            <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-600"></div>
                        </div>
                        <span>{t('insights.more')}</span>
                    </div>

                    {/* Heatmap */}
                    <div className="flex gap-1 overflow-x-auto">
                        {/* Day labels */}
                        <div className="flex flex-col gap-1 mr-2">
                            <div className="h-3"></div> {/* Spacer for month labels */}
                            {dayLabels.map((day, index) => (
                                <div key={index} className="w-3 h-3 text-xs flex items-center justify-center">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Weeks */}
                        {weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="flex flex-col gap-1">
                                {/* Month label for first week of month */}
                                <div className="h-3 text-xs">
                                    {week[0].date.getDate() <= 7 ? format(week[0].date, 'MMM') : ''}
                                </div>
                                
                                {/* Days */}
                                {week.map((day, dayIndex) => (
                                    <div
                                        key={dayIndex}
                                        className={`w-3 h-3 rounded-sm ${day.colorClass} cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all`}
                                        title={day.tooltip}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Summary stats */}
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                            <div className="font-medium">{moodEntries.length}</div>
                            <div className="text-muted-foreground">{t('insights.totalEntries')}</div>
                        </div>
                        <div>
                            <div className="font-medium">
                                {moodEntries.filter(entry => {
                                    const entryDate = typeof entry.date === 'string' ? new Date(entry.date) : entry.date;
                                    const weekAgo = subWeeks(today, 1);
                                    return entryDate >= weekAgo;
                                }).length}
                            </div>
                            <div className="text-muted-foreground">{t('insights.thisWeek')}</div>
                        </div>
                        <div>
                            <div className="font-medium">
                                {Math.round((moodEntries.length / (weeksToShow * 7)) * 100)}%
                            </div>
                            <div className="text-muted-foreground">{t('insights.consistency')}</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
