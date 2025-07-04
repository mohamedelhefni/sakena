"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Wifi, WifiOff, Heart, BookOpen, BarChart3, Settings, Shield, X } from 'lucide-react';
import { useOffline, worksOffline, requiresInternet } from '@/hooks/use-offline';
import { useTranslation } from 'react-i18next';

export function OfflineCapabilities() {
    const { isOnline, isOffline } = useOffline();
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(true);

    const features = [
        {
            name: t('offlineCapabilities.moodTracking', 'Mood Tracking'),
            icon: <Heart className="w-4 h-4" />,
            offline: true,
            description: t('offlineCapabilities.moodTrackingDesc', 'Log and track your emotions completely offline')
        },
        {
            name: t('offlineCapabilities.journaling', 'Journaling'),
            icon: <BookOpen className="w-4 h-4" />,
            offline: true,
            description: t('offlineCapabilities.journalingDesc', 'Write private journal entries with encryption')
        },
        {
            name: t('offlineCapabilities.analytics', 'Analytics & Insights'),
            icon: <BarChart3 className="w-4 h-4" />,
            offline: true,
            description: t('offlineCapabilities.analyticsDesc', 'View charts and insights from your local data')
        },
        {
            name: t('offlineCapabilities.settings', 'Settings'),
            icon: <Settings className="w-4 h-4" />,
            offline: true,
            description: t('offlineCapabilities.settingsDesc', 'Customize app preferences and themes')
        },
        {
            name: t('offlineCapabilities.encryption', 'Data Security'),
            icon: <Shield className="w-4 h-4" />,
            offline: true,
            description: t('offlineCapabilities.encryptionDesc', 'End-to-end encryption works completely offline')
        },
        {
            name: t('offlineCapabilities.quranPlayer', 'Quran Audio Player'),
            icon: <Wifi className="w-4 h-4" />,
            offline: false,
            description: t('offlineCapabilities.quranPlayerDesc', 'Requires internet for verses and audio streaming')
        }
    ];

    if (!isVisible) return null;

    return (
        <Card className="m-4 border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {isOffline ? (
                            <WifiOff className="w-5 h-5 text-orange-500" />
                        ) : (
                            <Wifi className="w-5 h-5 text-green-500" />
                        )}
                        <CardTitle className="text-lg">
                            {isOffline
                                ? t('offlineCapabilities.offlineMode', 'Offline Mode Active')
                                : t('offlineCapabilities.onlineMode', 'Online Mode')
                            }
                        </CardTitle>
                        <Badge variant={isOffline ? "secondary" : "default"}>
                            {isOffline ? t('common.offline', 'Offline') : t('common.online', 'Online')}
                        </Badge>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsVisible(false)}
                        className="h-6 w-6 p-0"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
                {isOffline && (
                    <p className="text-sm text-muted-foreground">
                        {t('offlineCapabilities.offlineMessage', 'Most features work perfectly offline. Your data is stored securely on your device.')}
                    </p>
                )}
            </CardHeader>
            <CardContent className="space-y-3">
                {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                        <div className="flex-shrink-0 p-1">
                            {feature.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{feature.name}</span>
                                {feature.offline ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                    <XCircle className="w-4 h-4 text-orange-500" />
                                )}
                                <Badge variant={feature.offline ? "default" : "secondary"} className="text-xs">
                                    {feature.offline
                                        ? t('offlineCapabilities.worksOffline', 'Works Offline')
                                        : t('offlineCapabilities.needsInternet', 'Needs Internet')
                                    }
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {feature.description}
                            </p>
                        </div>
                    </div>
                ))}

                {isOffline && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <h4 className="font-medium text-green-800 dark:text-green-200 text-sm mb-1">
                            {t('offlineCapabilities.encouragementTitle', '✅ You can continue using Sakinah!')}
                        </h4>
                        <p className="text-xs text-green-700 dark:text-green-300">
                            {t('offlineCapabilities.encouragementText', 'Track your mood, write journal entries, and view insights. All your data will be safely stored and available when you reconnect.')}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
