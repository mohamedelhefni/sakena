"use client";

import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoodEntry } from '@/lib/types';
import { format } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';

interface MoodEntryDetailProps {
    entry: MoodEntry;
    onBack: () => void;
    onDelete: () => void;
    formatDate: (date: Date | string) => string;
}

export function MoodEntryDetail({ entry, onBack, onDelete, formatDate }: MoodEntryDetailProps) {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between flex-wrap">
                    <div>
                        <CardTitle>{t('mood.viewEntry')}</CardTitle>
                        <CardDescription>{formatDate(entry.date)} {entry.time && `- ${entry.time}`}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="destructive" onClick={onDelete}>
                            {t('common.delete')}
                        </Button>
                        <Button variant="outline" onClick={onBack}>
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
                            <span className="text-lg">{t(`mood.levels.${entry.mood}`)}</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">{t('mood.emotionsLabel')}</h4>
                        <div className="flex flex-wrap gap-1">
                            {entry.emotions.map(emotion => (
                                <Badge key={emotion} variant="secondary">
                                    {t(`emotions.${emotion}`)}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">{t('mood.energyLabel')}</h4>
                        <p>{t(`mood.levels.${entry.energy === 1 ? 'very-low' : entry.energy === 2 ? 'low' : entry.energy === 3 ? 'neutral' : entry.energy === 4 ? 'good' : 'excellent'}`)}</p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">{t('mood.stressLabel')}</h4>
                        <p>{t(`mood.levels.${entry.stress === 1 ? 'very-low' : entry.stress === 2 ? 'low' : entry.stress === 3 ? 'neutral' : entry.stress === 4 ? 'high' : 'very-high'}`)}</p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">{t('mood.sleepLabel')}</h4>
                        <p>{t('mood.hours', { count: entry.sleep })}</p>
                    </div>
                </div>

                {entry.islamicPractices && (
                    <div>
                        <h4 className="font-medium mb-2">{t('mood.islamicPracticesLabel')}</h4>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(entry.islamicPractices).map(([practice, completed]) => (
                                completed && (
                                    <Badge key={practice} variant="default">
                                        {t(`practices.${practice}`)}
                                    </Badge>
                                )
                            ))}
                        </div>
                    </div>
                )}

                {entry.gratitude && entry.gratitude.length > 0 && (
                    <div>
                        <h4 className="font-medium mb-2">{t('mood.gratitudeLabel')}</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {entry.gratitude.map((item, index) => (
                                <li key={index} className="text-sm">{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {entry.notes && (
                    <div>
                        <h4 className="font-medium mb-2">{t('mood.notesLabel')}</h4>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                            {entry.notes}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
