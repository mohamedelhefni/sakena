"use client";

import { useTranslation } from 'react-i18next';
import { BookOpen, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JournalEntry, UserData } from '@/lib/types';
import { format } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';

interface JournalViewProps {
    userData: UserData;
    onAddEntry: () => void;
    onViewEntry: (entry: JournalEntry) => void;
}

export function JournalView({ userData, onAddEntry, onViewEntry }: JournalViewProps) {
    const { t, i18n } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between flex-wrap">
                    <div>
                        <CardTitle>{t('nav.journal')}</CardTitle>
                        <CardDescription>{t('journal.description')}</CardDescription>
                    </div>
                    <Button
                        className="islamic-green text-white"
                        onClick={onAddEntry}
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
                            onClick={onAddEntry}
                        >
                            {t('journal.startFirstEntry')}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between flex-wrap">
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
                                        onClick={() => onViewEntry(entry)}
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
}
