"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Save, X, Lock, Globe, Heart } from 'lucide-react';
import { JournalEntry, MoodLevel } from '@/lib/types';
import { format } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';
import { TiptapEditor } from '@/components/tiptap-editor';
import { MoodSelector } from '@/components/mood-selector';

interface JournalEntryProps {
    onSave: (entry: JournalEntry) => void;
    onCancel: () => void;
    existingEntry?: JournalEntry;
}

export function JournalEntryComponent({ onSave, onCancel, existingEntry }: JournalEntryProps) {
    const { t, i18n } = useTranslation();
    const [title, setTitle] = useState(existingEntry?.title || '');
    const [content, setContent] = useState(existingEntry?.content || '');
    const [mood, setMood] = useState<MoodLevel | undefined>(existingEntry?.mood);
    const [emotions, setEmotions] = useState<string[]>(existingEntry?.emotions || []);
    const [isPrivate, setIsPrivate] = useState(existingEntry?.isPrivate || false);
    const locale = i18n.language === 'ar' ? arSA : enUS;

    // Helper function to format date safely
    const formatDate = (date: Date | string) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(dateObj.getTime())) {
            return 'Invalid Date';
        }

        return format(dateObj, 'PPP', { locale });
    };

    const handleSave = () => {
        if (!content.trim() && !title.trim()) return;

        const entry: JournalEntry = {
            id: existingEntry?.id || Date.now().toString(),
            date: existingEntry?.date || new Date(),
            title: title.trim() || undefined,
            content: content.trim(),
            mood,
            emotions: emotions.length > 0 ? emotions : undefined,
            isPrivate,
        };

        onSave(entry);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
                <div className="flex items-center justify-between flex-wrap p-4 max-w-4xl mx-auto">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-green-600" />
                        <div>
                            <h1 className="text-xl font-semibold">
                                {existingEntry ? t('journal.editEntry') : t('journal.newEntry')}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {existingEntry ? formatDate(existingEntry.date) : format(new Date(), 'PPP', { locale })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant={isPrivate ? "default" : "outline"}
                            size="sm"
                            onClick={() => setIsPrivate(!isPrivate)}
                            className={isPrivate ? "islamic-green text-white" : ""}
                        >
                            {isPrivate ? <Lock className="w-4 h-4 mr-2" /> : <Globe className="w-4 h-4 mr-2" />}
                            {isPrivate ? t('journal.private') : t('journal.public')}
                        </Button>
                        <Button variant="outline" onClick={onCancel} size="sm">
                            <X className="w-4 h-4 mr-2" />
                            {t('common.cancel')}
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={!content.trim() && !title.trim()}
                            className="islamic-green text-white"
                            size="sm"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {t('common.save')}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 max-w-4xl mx-auto w-full">
                {/* Title Input */}
                <div className="mb-6">
                    <Input
                        placeholder={t('journal.titlePlaceholder')}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-2xl font-bold border-0 p-0 h-auto shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/60"
                        style={{ fontSize: '2rem', lineHeight: '2.5rem' }}
                    />
                </div>

                {/* Mood and Emotion Selection */}
                <div className="mb-6 p-4 border border-border rounded-lg bg-card">
                    <MoodSelector
                        selectedMood={mood}
                        selectedEmotions={emotions}
                        onMoodSelect={setMood}
                        onEmotionsSelect={setEmotions}
                    />
                </div>

                {/* Tiptap Editor */}
                <div className="mb-6">
                    <TiptapEditor
                        content={content}
                        onChange={setContent}
                        placeholder={t('journal.contentPlaceholder')}
                        className="w-full prose prose-sm max-w-none dark:prose-invert"
                    />
                </div>

            </div>
        </div>
    );
}

