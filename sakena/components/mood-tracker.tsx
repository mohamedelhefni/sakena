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
import { Heart, Star, Moon, Zap, Coffee } from 'lucide-react';
import { MoodEntry, MoodLevel, EMOTIONS, UserData } from '@/lib/types';
import { format } from 'date-fns';

interface MoodTrackerProps {
    userData: UserData;
    onSave: (entry: MoodEntry) => void;
    onCancel: () => void;
}

export function MoodTracker({ userData, onSave, onCancel }: MoodTrackerProps) {
    const { t } = useTranslation();
    const [mood, setMood] = useState<MoodLevel>('neutral');
    const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
    const [energy, setEnergy] = useState(3);
    const [stress, setStress] = useState(3);
    const [sleep, setSleep] = useState(8);
    const [notes, setNotes] = useState('');
    const [islamicPractices, setIslamicPractices] = useState({
        prayer: false,
        quran: false,
        dhikr: false,
        charity: false,
    });
    const [gratitude, setGratitude] = useState<string[]>(['', '', '']);

    const moodLevels = [
        { value: 'very-low', label: t('mood.levels.very-low'), emoji: '😔', color: 'bg-red-500' },
        { value: 'low', label: t('mood.levels.low'), emoji: '😞', color: 'bg-orange-500' },
        { value: 'neutral', label: t('mood.levels.neutral'), emoji: '😐', color: 'bg-yellow-500' },
        { value: 'good', label: t('mood.levels.good'), emoji: '😊', color: 'bg-green-500' },
        { value: 'excellent', label: t('mood.levels.excellent'), emoji: '😄', color: 'bg-emerald-500' },
    ] as const;

    const toggleEmotion = (emotion: string) => {
        setSelectedEmotions(prev =>
            prev.includes(emotion)
                ? prev.filter(e => e !== emotion)
                : [...prev, emotion]
        );
    };

    const toggleIslamicPractice = (practice: keyof typeof islamicPractices) => {
        setIslamicPractices(prev => ({
            ...prev,
            [practice]: !prev[practice]
        }));
    };

    const updateGratitude = (index: number, value: string) => {
        setGratitude(prev => {
            const newGratitude = [...prev];
            newGratitude[index] = value;
            return newGratitude;
        });
    };

    const handleSave = () => {
        const now = new Date();
        const entry: MoodEntry = {
            id: Date.now().toString(),
            date: now,
            time: format(now, 'HH:mm'),
            hour: now.getHours(),
            mood,
            emotions: selectedEmotions,
            energy,
            stress,
            sleep,
            notes: notes.trim() || undefined,
            islamicPractices,
            gratitude: gratitude.filter(g => g.trim()).length > 0 ? gratitude.filter(g => g.trim()) : undefined,
        };

        onSave(entry);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        {t('mood.title')}
                    </CardTitle>
                    <CardDescription>
                        {t('mood.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Mood Selection */}
                    <div className="space-y-3">
                        <Label className="text-base font-medium">{t('mood.howAreYouFeeling')}</Label>
                        <div className="flex justify-around p-2   rounded-lg">
                            {moodLevels.map(({ value, label, emoji, color }) => (
                                <button
                                    key={value}
                                    onClick={() => setMood(value)}
                                    className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-transform transform hover:scale-110 ${mood === value ? `ring-2 ring-offset-2 ring-blue-500 ${color}` : color}`}>
                                    <span className="text-3xl">{emoji}</span>
                                    <span className="text-xs font-semibold text-white">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Emotions */}
                    <div className="space-y-3">
                        <Label className="text-base font-medium">{t('mood.whatEmotions')}</Label>
                        <div className="flex flex-wrap gap-2">
                            {EMOTIONS.map(emotion => (
                                <Badge
                                    key={emotion.value}
                                    variant={selectedEmotions.includes(emotion.value) ? 'default' : 'outline'}
                                    onClick={() => toggleEmotion(emotion.value)}
                                    className={"cursor-pointer select-none"}
                                    style={{
                                        backgroundColor: selectedEmotions.includes(emotion.value) ? emotion.color : 'transparent', color: selectedEmotions.includes(emotion.value) ? '#fff' : emotion.color
                                    }}
                                >
                                    {t(emotion.label)}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Energy & Stress */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label htmlFor="energy" className="text-base font-medium flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-500" /> {t('mood.energyLevel')}
                            </Label>
                            <Select value={String(energy)} onValueChange={(v) => setEnergy(Number(v))}>
                                <SelectTrigger id="energy"><SelectValue placeholder={t('mood.selectLevel')} /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">{t('mood.levels.very-low')}</SelectItem>
                                    <SelectItem value="2">{t('mood.levels.low')}</SelectItem>
                                    <SelectItem value="3">{t('mood.levels.neutral')}</SelectItem>
                                    <SelectItem value="4">{t('mood.levels.high')}</SelectItem>
                                    <SelectItem value="5">{t('mood.levels.very-high')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="stress" className="text-base font-medium flex items-center gap-2">
                                <Zap className="w-5 h-5 text-red-500" /> {t('mood.stressLevel')}
                            </Label>
                            <Select value={String(stress)} onValueChange={(v) => setStress(Number(v))}>
                                <SelectTrigger id="stress"><SelectValue placeholder={t('mood.selectLevel')} /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">{t('mood.levels.very-low')}</SelectItem>
                                    <SelectItem value="2">{t('mood.levels.low')}</SelectItem>
                                    <SelectItem value="3">{t('mood.levels.neutral')}</SelectItem>
                                    <SelectItem value="4">{t('mood.levels.high')}</SelectItem>
                                    <SelectItem value="5">{t('mood.levels.very-high')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Sleep */}
                    <div className="space-y-3">
                        <Label htmlFor="sleep" className="text-base font-medium flex items-center gap-2">
                            <Moon className="w-5 h-5 text-indigo-500" /> {t('mood.sleepQuality')}
                        </Label>
                        <div className="flex items-center gap-4">
                            <Input
                                id="sleep"
                                type="range"
                                min="0"
                                max="12"
                                step="0.5"
                                value={sleep}
                                onChange={(e) => setSleep(Number(e.target.value))}
                                className="w-full"
                            />
                            <span className="font-semibold flex">{t('mood.hours', { count: sleep })}</span>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-3">
                        <Label htmlFor="notes" className="text-base font-medium">{t('mood.journalTitle')}</Label>
                        <Textarea
                            id="notes"
                            placeholder={t('mood.journalPlaceholder')}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    {/* Islamic Practices */}
                    {userData.settings.islamicFeatures && (
                        <div className="space-y-3">
                            <Label className="text-base font-medium flex items-center gap-2">
                                <Star className="w-5 h-5 text-amber-500" /> {t('mood.islamicPracticesTitle')}
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                <Button variant={islamicPractices.prayer ? 'default' : 'outline'} onClick={() => toggleIslamicPractice('prayer')}>{t('mood.practices.prayer')}</Button>
                                <Button variant={islamicPractices.quran ? 'default' : 'outline'} onClick={() => toggleIslamicPractice('quran')}>{t('mood.practices.quran')}</Button>
                                <Button variant={islamicPractices.dhikr ? 'default' : 'outline'} onClick={() => toggleIslamicPractice('dhikr')}>{t('mood.practices.dhikr')}</Button>
                                <Button variant={islamicPractices.charity ? 'default' : 'outline'} onClick={() => toggleIslamicPractice('charity')}>{t('mood.practices.charity')}</Button>
                            </div>
                        </div>
                    )}

                    {/* Gratitude */}
                    <div className="space-y-3">
                        <Label className="text-base font-medium flex items-center gap-2">
                            <Coffee className="w-5 h-5 text-lime-600" /> {t('mood.gratitudeTitle')}
                        </Label>
                        <div className="space-y-2">
                            {gratitude.map((item, index) => (
                                <Input
                                    key={index}
                                    type="text"
                                    placeholder={t('mood.gratitudePlaceholder', { count: index + 1 })}
                                    value={item}
                                    onChange={(e) => updateGratitude(index, e.target.value)}
                                />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={onCancel}>{t('common.cancel')}</Button>
                <Button onClick={handleSave}>{t('common.save')}</Button>
            </div>
        </div>
    );
}
