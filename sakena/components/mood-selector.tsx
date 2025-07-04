"use client";

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoodLevel, EMOTIONS } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MoodSelectorProps {
    selectedMood?: MoodLevel;
    selectedEmotions?: string[];
    onMoodSelect: (mood: MoodLevel | undefined) => void;
    onEmotionsSelect: (emotions: string[]) => void;
    className?: string;
}

const MOOD_LEVELS: { value: MoodLevel; emoji: string; color: string }[] = [
    { value: 'very-low', emoji: '😰', color: 'bg-red-500' },
    { value: 'low', emoji: '😔', color: 'bg-orange-500' },
    { value: 'neutral', emoji: '😐', color: 'bg-yellow-500' },
    { value: 'good', emoji: '😊', color: 'bg-green-500' },
    { value: 'excellent', emoji: '😄', color: 'bg-emerald-500' },
];

export function MoodSelector({
    selectedMood,
    selectedEmotions = [],
    onMoodSelect,
    onEmotionsSelect,
    className
}: MoodSelectorProps) {
    const { t } = useTranslation();

    const handleEmotionToggle = (emotion: string) => {
        const newEmotions = selectedEmotions.includes(emotion)
            ? selectedEmotions.filter(e => e !== emotion)
            : [...selectedEmotions, emotion];
        onEmotionsSelect(newEmotions);
    };

    return (
        <div className={cn("space-y-6", className)}>
            {/* Mood Selection */}
            <div>
                <label className="text-sm font-medium mb-3 block">
                    {t('journal.moodLabel')}
                </label>
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        variant={selectedMood === undefined ? "default" : "outline"}
                        size="sm"
                        onClick={() => onMoodSelect(undefined)}
                    >
                        {t('journal.noMood')}
                    </Button>
                    {MOOD_LEVELS.map((mood) => (
                        <Button
                            key={mood.value}
                            type="button"
                            variant={selectedMood === mood.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => onMoodSelect(mood.value)}
                            className={cn(
                                "gap-2",
                                selectedMood === mood.value && "islamic-green text-white"
                            )}
                        >
                            <span className="text-lg">{mood.emoji}</span>
                            <span>{t(`mood.levels.${mood.value}`)}</span>
                        </Button>
                    ))}
                </div>
            </div>

            {/* Emotion Selection */}
            <div>
                <label className="text-sm font-medium mb-3 block">
                    {t('emotions.title')}
                </label>
                <div className="flex flex-wrap gap-2">
                    {EMOTIONS.map((emotion) => (
                        <Badge
                            key={emotion.value}
                            variant={selectedEmotions.includes(emotion.value) ? "default" : "outline"}
                            className={cn(
                                "cursor-pointer transition-colors px-3 py-1 text-sm",
                                selectedEmotions.includes(emotion.value) && "islamic-green text-white"
                            )}
                            style={{
                                borderColor: selectedEmotions.includes(emotion.value) ? emotion.color : undefined,
                            }}
                            onClick={() => handleEmotionToggle(emotion.value)}
                        >
                            {t(emotion.label)}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    );
}
