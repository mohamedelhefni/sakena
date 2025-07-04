"use client";

import { useState, useEffect } from 'react';

export function useOffline() {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        // Set initial state
        setIsOnline(navigator.onLine);

        // Handle online/offline events
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return {
        isOnline,
        isOffline: !isOnline
    };
}

// Helper function to check if a feature requires internet
export function requiresInternet(feature: string): boolean {
    const onlineOnlyFeatures = [
        'quran-audio',
        'quran-api',
        'updates',
        'sync'
    ];

    return onlineOnlyFeatures.includes(feature);
}

// Helper function to check if a feature works offline
export function worksOffline(feature: string): boolean {
    const offlineFeatures = [
        'mood-tracking',
        'mood-entry',
        'journal',
        'journal-entry',
        'insights',
        'settings',
        'authentication',
        'data-storage',
        'encryption',
        'dashboard',
        'navigation',
        'charts',
        'analytics'
    ];

    return offlineFeatures.includes(feature);
}

// Get user-friendly message about offline capabilities
export function getOfflineCapabilityMessage(feature: string): string {
    if (worksOffline(feature)) {
        return `${feature} works completely offline. Your data is stored securely on your device.`;
    } else if (requiresInternet(feature)) {
        return `${feature} requires an internet connection to function properly.`;
    } else {
        return `${feature} has limited offline functionality.`;
    }
}

// Check if current action should be blocked when offline
export function shouldBlockOffline(action: string): boolean {
    // Only block actions that absolutely require internet
    const internetRequiredActions = [
        'fetch-quran-verse',
        'play-quran-audio',
        'check-updates',
        'sync-data'
    ];

    return internetRequiredActions.includes(action);
}
