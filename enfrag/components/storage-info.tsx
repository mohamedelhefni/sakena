"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SecureIndexedDBStorage } from '@/lib/secure-indexeddb';
import { Badge } from '@/components/ui/badge';

interface StorageInfoProps {
  onClearData?: () => void;
}

export function StorageInfo({ onClearData }: StorageInfoProps) {
  const { t } = useTranslation();
  const [storageInfo, setStorageInfo] = useState<{
    usage: number;
    quota: number;
    usagePercentage: number;
    formattedUsage: string;
    formattedQuota: string;
  }>({
    usage: 0,
    quota: 0,
    usagePercentage: 0,
    formattedUsage: '0 B',
    formattedQuota: '0 B',
  });

  useEffect(() => {
    async function getStorageStats() {
      const stats = await SecureIndexedDBStorage.getStorageInfo();
      setStorageInfo(stats);
    }
    
    getStorageStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(getStorageStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.storageInfo')}</CardTitle>
        <CardDescription>{t('settings.storageDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <span>{t('settings.usedSpace')}</span>
          <span>{storageInfo.formattedUsage}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span>{t('settings.totalSpace')}</span>
          <span>{storageInfo.formattedQuota}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4">
          <div 
            className="bg-green-600 h-2.5 rounded-full" 
            style={{ width: `${Math.min(storageInfo.usagePercentage, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center text-sm mt-1">
          <span>{Math.round(storageInfo.usagePercentage)}% {t('settings.used')}</span>
          <Badge 
            variant={storageInfo.usagePercentage > 80 ? "destructive" : "outline"}
          >
            {storageInfo.usagePercentage > 80 
              ? t('settings.storageAlmostFull') 
              : t('settings.storageOk')}
          </Badge>
        </div>
        
        {onClearData && (
          <div className="mt-6">
            <button 
              onClick={onClearData}
              className="text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              {t('settings.clearAllData')}
            </button>
            <p className="text-xs text-gray-500 mt-1">
              {t('settings.clearDataWarning')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
