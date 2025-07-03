"use client";

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Heart, Lock, Globe } from 'lucide-react';
import { JournalEntry } from '@/lib/types';

interface JournalViewProps {
    entry: JournalEntry;
    onEdit: () => void;
    onBack: () => void;
}

export function JournalView({ entry, onEdit, onBack }: JournalViewProps) {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            {entry.title || t('journal.untitled')}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2">
                            <span>{entry.date}</span>
                            {entry.isPrivate ? (
                                <Lock className="w-4 h-4 text-red-500" />
                            ) : (
                                <Globe className="w-4 h-4 text-green-500" />
                            )}
                            {entry.mood && (
                                <Badge variant="outline" className="ml-2">
                                    <Heart className="w-3 h-3 mr-1" />
                                    {t(`mood.levels.${entry.mood}`)}
                                </Badge>
                            )}
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onEdit}>
                            {t('journal.editEntry')}
                        </Button>
                        <Button variant="outline" onClick={onBack}>
                            {t('common.back')}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Main Content */}
                <div>
                    <h4 className="font-medium mb-3">{t('journal.contentLabel')}</h4>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                        <p dangerouslySetInnerHTML={{ __html: entry.content }} className="whitespace-pre-wrap text-sm leading-relaxed">
                        </p>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
