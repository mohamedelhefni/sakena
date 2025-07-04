"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Wifi, WifiOff, X, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAFeatures() {
    const { t } = useTranslation();
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if app is already installed
        const checkIfInstalled = () => {
            if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
                setIsInstalled(true);
            }
            // Also check for iOS PWA
            if ((window.navigator as any).standalone === true) {
                setIsInstalled(true);
            }
        };

        // Handle PWA install prompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowInstallPrompt(true);
        };

        // Handle online/offline status
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        // Handle service worker updates
        const handleSWUpdate = () => {
            setShowUpdatePrompt(true);
        };

        // Check initial states
        checkIfInstalled();
        setIsOnline(navigator.onLine);

        // Add event listeners
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Listen for service worker updates
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
                    handleSWUpdate();
                }
            });
        }
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setShowInstallPrompt(false);
            setIsInstalled(true);
        }

        setDeferredPrompt(null);
    };

    const handleUpdateClick = () => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then((registration) => {
                if (registration && registration.waiting) {
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                }
            });
        }
        setShowUpdatePrompt(false);
    };

    return (
        <>
            {/* Offline Indicator */}
            {!isOnline && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-yellow-900 px-4 py-2 text-center text-sm font-medium">
                    <div className="flex items-center justify-center gap-2">
                        <WifiOff className="w-4 h-4" />
                        <span>{t('pwa.offline', 'You are currently offline. Some features may be limited.')}</span>
                    </div>
                </div>
            )}

            {/* Update Prompt */}
            {showUpdatePrompt && (
                <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
                    <Card className="shadow-lg border-blue-200 bg-white dark:bg-gray-900">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <RefreshCw className="w-5 h-5 text-blue-600" />
                                    <CardTitle className="text-base">
                                        {t('pwa.updateAvailable', 'Update Available')}
                                    </CardTitle>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowUpdatePrompt(false)}
                                    className="h-6 w-6 p-0"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <CardDescription className="text-sm">
                                {t('pwa.updateDescription', 'A new version of the app is available.')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleUpdateClick}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                    size="sm"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    {t('pwa.updateNow', 'Update Now')}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowUpdatePrompt(false)}
                                    size="sm"
                                >
                                    {t('pwa.updateLater', 'Later')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Install Prompt */}
            {showInstallPrompt && !isInstalled && (
                <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
                    <Card className="shadow-lg border-green-200 bg-white dark:bg-gray-900">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <Download className="w-5 h-5 text-green-600" />
                                    <CardTitle className="text-base">
                                        {t('pwa.installTitle', 'Install Sakinah')}
                                    </CardTitle>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowInstallPrompt(false)}
                                    className="h-6 w-6 p-0"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <CardDescription className="text-sm">
                                {t('pwa.installDescription', 'Add Sakinah to your home screen for quick access and offline use.')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleInstallClick}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    size="sm"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    {t('pwa.install', 'Install')}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowInstallPrompt(false)}
                                    size="sm"
                                >
                                    {t('pwa.later', 'Later')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Online Status Indicator (when back online) */}
            {isOnline && (
                <div className="fixed bottom-4 left-3  z-40 pointer-events-none">
                    <div className="flex justify-center pt-2">
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 animate-pulse">
                            <Wifi className="w-3 h-3" />
                            <span>{t('pwa.online', 'Online')}</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
