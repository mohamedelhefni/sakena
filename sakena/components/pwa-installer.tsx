"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstaller() {
    const { t } = useTranslation();
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if app is already installed
        const checkInstalled = () => {
            if (window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone) {
                setIsInstalled(true);
                return;
            }
        };

        checkInstalled();

        // Listen for beforeinstallprompt event
        const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };

        // Listen for app installed event
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setIsVisible(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        setDeferredPrompt(null);
        setIsVisible(false);
    };

    const handleDismiss = () => {
        setIsVisible(false);
        // Remember user dismissed the prompt for this session
        sessionStorage.setItem('pwa-install-dismissed', 'true');
    };

    // Don't show if already installed or user dismissed
    if (isInstalled || !isVisible || sessionStorage.getItem('pwa-install-dismissed')) {
        return null;
    }

    return (
        <Card className="m-4 border-l-4 border-l-blue-500 z-500">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Download className="w-5 h-5 text-blue-500" />
                        <CardTitle className="text-lg">
                            {t('pwaInstaller.title', 'Install Sakinah App')}
                        </CardTitle>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDismiss}
                        className="h-6 w-6 p-0"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
                <CardDescription>
                    {t('pwaInstaller.description', 'Install Sakinah on your device for the best offline experience')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                        <p>{t('pwaInstaller.benefits.title', 'Benefits of installing:')}</p>
                        <ul className="mt-2 space-y-1 list-disc list-inside">
                            <li>{t('pwaInstaller.benefits.offline', 'Full offline functionality')}</li>
                            <li>{t('pwaInstaller.benefits.secure', 'Secure local data storage')}</li>
                            <li>{t('pwaInstaller.benefits.fast', 'Faster app loading')}</li>
                            <li>{t('pwaInstaller.benefits.homescreen', 'Quick access from home screen')}</li>
                        </ul>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={handleInstallClick} className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            {t('pwaInstaller.install', 'Install App')}
                        </Button>
                        <Button variant="outline" onClick={handleDismiss}>
                            {t('common.notNow', 'Not Now')}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
