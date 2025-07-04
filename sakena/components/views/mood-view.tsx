"use client";

import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoodEntry, UserData } from '@/lib/types';
import { format } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';

interface MoodViewProps {
    userData: UserData;
    onAddMood: () => void;
    onViewMoodEntry: (entry: MoodEntry) => void;
}

export function MoodView({ userData, onAddMood, onViewMoodEntry }: MoodViewProps) {
    const { t, i18n } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between flex-wrap">
                    <div>
                        <CardTitle>{t('mood.title')}</CardTitle>
                        <CardDescription>{t('mood.description')}</CardDescription>
                    </div>
                    <Button
                        onClick={onAddMood}
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
                                onClick={onAddMood}
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
                                        className="flex items-center justify-between flex-wrap p-4 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer transition-colors"
                                        onClick={() => onViewMoodEntry(entry)}
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
}
