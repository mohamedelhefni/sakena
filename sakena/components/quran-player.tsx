"use client";

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, RefreshCw, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QuranVerse {
    number: number;
    text: string;
    surah: {
        number: number;
        name: string;
        englishName: string;
        revelationType: string;
    };
    numberInSurah: number;
    audio?: string;
}

interface QuranPlayerProps {
    enabled: boolean;
}

export function QuranPlayer({ enabled }: QuranPlayerProps) {
    const { t, i18n } = useTranslation();
    const [verse, setVerse] = useState<QuranVerse | null>(null);
    const [loading, setLoading] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const fetchRandomVerse = async () => {
        setLoading(true);
        try {
            // Get a random verse number (there are 6236 verses in total)
            const randomVerseNumber = Math.floor(Math.random() * 6236) + 1;

            // Fetch verse data with audio
            const response = await fetch(
                `https://api.alquran.cloud/v1/ayah/${randomVerseNumber}/editions/quran-uthmani,en.asad,ar.alafasy`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch verse');
            }

            const data = await response.json();

            if (data.status === 'OK' && data.data && data.data.length >= 3) {
                const arabicVerse = data.data[0];
                const englishVerse = data.data[1];
                const audioVerse = data.data[2];

                setVerse({
                    number: arabicVerse.number,
                    text: i18n.language === 'ar' ? arabicVerse.text : englishVerse.text,
                    surah: {
                        number: arabicVerse.surah.number,
                        name: arabicVerse.surah.name,
                        englishName: arabicVerse.surah.englishName,
                        revelationType: arabicVerse.surah.revelationType,
                    },
                    numberInSurah: arabicVerse.numberInSurah,
                    audio: audioVerse.audio,
                });
            }
        } catch (error) {
            console.error('Error fetching verse:', error);
        } finally {
            setLoading(false);
        }
    };

    const togglePlay = () => {
        if (!audioRef.current || !verse?.audio) return;

        if (playing) {
            audioRef.current.pause();
            setPlaying(false);
        } else {
            audioRef.current.src = verse.audio;
            audioRef.current.play();
            setPlaying(true);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !muted;
            setMuted(!muted);
        }
    };

    useEffect(() => {
        if (enabled && !verse) {
            fetchRandomVerse();
        }
    }, [enabled]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const handleEnded = () => setPlaying(false);
            const handleError = () => setPlaying(false);

            audio.addEventListener('ended', handleEnded);
            audio.addEventListener('error', handleError);

            return () => {
                audio.removeEventListener('ended', handleEnded);
                audio.removeEventListener('error', handleError);
            };
        }
    }, []);

    if (!enabled) {
        return null;
    }

    return (
        <Card className="w-full quran-font">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        📖 {t('quranPlayer.title')}
                    </CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchRandomVerse}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <RefreshCw className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {verse ? (
                    <>
                        <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="secondary">
                                {i18n.language === 'ar' ? verse.surah.name : verse.surah.englishName}
                            </Badge>
                            <Badge variant="outline">
                                {t('quranPlayer.verse')} {verse.numberInSurah}
                            </Badge>
                        </div>

                        <div
                            className={`text-${i18n.language === 'ar' ? 'right' : 'left'} leading-relaxed`}
                            dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                        >
                            <p className={`${i18n.language === 'ar' ? 'text-xl font-amiri' : 'text-base'} mb-3`}>
                                {verse.text}
                            </p>
                        </div>

                        {verse.audio && (
                            <div className="flex items-center gap-2 pt-2 border-t">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={togglePlay}
                                    disabled={!verse.audio}
                                >
                                    {playing ? (
                                        <Pause className="w-4 h-4" />
                                    ) : (
                                        <Play className="w-4 h-4" />
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleMute}
                                >
                                    {muted ? (
                                        <VolumeX className="w-4 h-4" />
                                    ) : (
                                        <Volume2 className="w-4 h-4" />
                                    )}
                                </Button>
                                <span className="text-xs text-muted-foreground">
                                    {t('quranPlayer.reciter')}: Al-Afasy
                                </span>
                            </div>
                        )}

                        <audio ref={audioRef} preload="none" />
                    </>
                ) : loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="ml-2">{t('quranPlayer.loading')}</span>
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>{t('quranPlayer.error')}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchRandomVerse}
                            className="mt-2"
                        >
                            {t('quranPlayer.retry')}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
