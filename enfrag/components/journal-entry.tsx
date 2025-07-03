"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Tag, Heart } from 'lucide-react';
import { JournalEntry, MoodLevel } from '@/lib/types';
import { format } from 'date-fns';

interface JournalEntryProps {
    onSave: (entry: JournalEntry) => void;
    onCancel: () => void;
    existingEntry?: JournalEntry;
}

export function JournalEntryComponent({ onSave, onCancel, existingEntry }: JournalEntryProps) {
    const { t } = useTranslation();
    const [title, setTitle] = useState(existingEntry?.title || '');
    const [content, setContent] = useState(existingEntry?.content || '');
    const [mood, setMood] = useState<MoodLevel | undefined>(existingEntry?.mood);
    const [tags, setTags] = useState<string[]>(existingEntry?.tags || []);
    const [newTag, setNewTag] = useState('');
    const [isPrivate, setIsPrivate] = useState(existingEntry?.isPrivate || false);
    const [islamicReflection, setIslamicReflection] = useState(existingEntry?.islamicReflection || '');

    const moodOptions = [
        { value: 'very-low', label: t('mood.levels.very-low') },
        { value: 'low', label: t('mood.levels.low') },
        { value: 'neutral', label: t('mood.levels.neutral') },
        { value: 'good', label: t('mood.levels.good') },
        { value: 'excellent', label: t('mood.levels.excellent') },
    ];

    const addTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSave = () => {
        if (!content.trim()) return;

        const entry: JournalEntry = {
            id: existingEntry?.id || Date.now().toString(),
            date: existingEntry?.date || format(new Date(), 'yyyy-MM-dd'),
            title: title.trim() || undefined,
            content: content.trim(),
            tags,
            mood,
            isPrivate,
            islamicReflection: islamicReflection.trim() || undefined,
        };

        onSave(entry);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        {existingEntry ? t('journal.editEntry') : t('journal.newEntry')}
                    </CardTitle>
                    <CardDescription>
                        {existingEntry ? existingEntry.date : format(new Date(), 'yyyy-MM-dd')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">{t('journal.titleLabel')}</Label>
                        <Input
                            id="title"
                            placeholder={t('journal.titlePlaceholder')}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <Label htmlFor="content">{t('journal.contentLabel')} *</Label>
                        <Textarea
                            id="content"
                            placeholder={t('journal.contentPlaceholder')}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={8}
                            className="min-h-[200px]"
                        />
                    </div>

                    {/* Mood */}
                    <div className="space-y-2">
                        <Label htmlFor="mood">{t('journal.moodLabel')}</Label>
                        <Select value={mood || ''} onValueChange={(value) => setMood(value as MoodLevel || undefined)}>
                            <SelectTrigger>
                                <SelectValue placeholder={t('journal.selectMood')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="no">{t('journal.noMood')}</SelectItem>
                                {moodOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tags */}
                    <div className="space-y-3">
                        <Label>{t('journal.tagsLabel')}</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder={t('journal.addTagPlaceholder')}
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addTag();
                                    }
                                }}
                            />
                            <Button type="button" onClick={addTag} variant="outline">
                                <Tag className="w-4 h-4" />
                            </Button>
                        </div>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="cursor-pointer"
                                        onClick={() => removeTag(tag)}
                                    >
                                        {tag} ×
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Islamic Reflection */}
                    <div className="space-y-2">
                        <Label htmlFor="reflection">{t('journal.islamicReflectionLabel')}</Label>
                        <Textarea
                            id="reflection"
                            placeholder={t('journal.islamicReflectionPlaceholder')}
                            value={islamicReflection}
                            onChange={(e) => setIslamicReflection(e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Privacy Toggle */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="private"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                            className="rounded"
                        />
                        <Label htmlFor="private">{t('journal.markPrivate')}</Label>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={onCancel}>
                    {t('common.cancel')}
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={!content.trim()}
                    className="islamic-green text-white"
                >
                    {t('common.save')}
                </Button>
            </div>
        </div>
    );
}
