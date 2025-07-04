"use client";

import { useOffline } from '@/hooks/use-offline';
import { CheckCircle, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

interface OfflineIndicatorProps {
    feature?: string;
    showWhenOnline?: boolean;
}

export function OfflineIndicator({ feature, showWhenOnline = false }: OfflineIndicatorProps) {
    const { isOffline } = useOffline();
    const { t } = useTranslation();

    if (!isOffline && !showWhenOnline) return null;

    return (
        <div className="flex items-center gap-2 text-sm">
            {isOffline ? (
                <>
                    <WifiOff className="w-4 h-4 text-green-500" />
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {t('offlineIndicator.savesOffline', 'Saves Offline')}
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                        {feature
                            ? t('offlineIndicator.featureWorksOffline', `${feature} works without internet`)
                            : t('offlineIndicator.dataStoredLocally', 'Data stored locally')
                        }
                    </span>
                </>
            ) : (
                <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {t('offlineIndicator.online', 'Online')}
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                        {t('offlineIndicator.connectedAndSaving', 'Connected and saving')}
                    </span>
                </>
            )}
        </div>
    );
}
