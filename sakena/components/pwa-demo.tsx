"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Wifi, 
  WifiOff, 
  Smartphone, 
  Monitor, 
  RefreshCw,
  CheckCircle,
  Globe,
  Shield,
  Zap
} from 'lucide-react';

export function PWADemo() {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop' | 'unknown'>('unknown');

  useEffect(() => {
    // Check if app is installed/running in standalone mode
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      const isIOS = (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode || isIOS);
      setIsInstalled(isStandaloneMode || isIOS);
    };

    // Detect platform
    const detectPlatform = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(userAgent)) {
        setPlatform('ios');
      } else if (/android/.test(userAgent)) {
        setPlatform('android');
      } else {
        setPlatform('desktop');
      }
    };

    // Check online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Initial checks
    checkStandalone();
    detectPlatform();
    updateOnlineStatus();

    // Add event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const features = [
    {
      icon: <Globe className="w-5 h-5" />,
      title: t('pwa.features.offline', 'Offline Access'),
      description: t('pwa.features.offlineDesc', 'Use the app even without internet connection'),
      status: true
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: t('pwa.features.nativelike', 'Native-like Experience'),
      description: t('pwa.features.nativelikeDesc', 'Feels like a native mobile app'),
      status: isInstalled
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: t('pwa.features.secure', 'Secure & Private'),
      description: t('pwa.features.secureDesc', 'All data is encrypted and stored locally'),
      status: true
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: t('pwa.features.fast', 'Lightning Fast'),
      description: t('pwa.features.fastDesc', 'Instant loading with smart caching'),
      status: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* PWA Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            PWA Status
          </CardTitle>
          <CardDescription>
            Progressive Web App capabilities and status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Platform</span>
              <Badge variant="outline" className="capitalize">
                {platform}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Connection</span>
              <Badge variant={isOnline ? "default" : "destructive"}>
                {isOnline ? (
                  <>
                    <Wifi className="w-3 h-3 mr-1" />
                    Online
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 mr-1" />
                    Offline
                  </>
                )}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Installation</span>
              <Badge variant={isInstalled ? "default" : "secondary"}>
                {isInstalled ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Installed
                  </>
                ) : (
                  <>
                    <Download className="w-3 h-3 mr-1" />
                    Browser
                  </>
                )}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Display Mode</span>
              <Badge variant={isStandalone ? "default" : "outline"}>
                {isStandalone ? (
                  <>
                    <Smartphone className="w-3 h-3 mr-1" />
                    Standalone
                  </>
                ) : (
                  <>
                    <Monitor className="w-3 h-3 mr-1" />
                    Browser
                  </>
                )}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PWA Features */}
      <Card>
        <CardHeader>
          <CardTitle>PWA Features</CardTitle>
          <CardDescription>
            Progressive Web App capabilities enabled in Sakinah
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className={`p-2 rounded-md ${feature.status ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{feature.title}</h4>
                    {feature.status && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Installation Instructions */}
      {!isInstalled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Install Instructions
            </CardTitle>
            <CardDescription>
              How to install Sakinah on your device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {platform === 'ios' && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium mb-2">iOS (Safari)</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Tap the Share button (square with arrow)</li>
                  <li>Scroll down and tap "Add to Home Screen"</li>
                  <li>Tap "Add" to confirm</li>
                </ol>
              </div>
            )}

            {platform === 'android' && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium mb-2">Android (Chrome)</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Tap the menu (three dots)</li>
                  <li>Tap "Add to Home screen"</li>
                  <li>Tap "Add" to confirm</li>
                </ol>
              </div>
            )}

            {platform === 'desktop' && (
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-medium mb-2">Desktop (Chrome/Edge)</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Look for the install icon in the address bar</li>
                  <li>Click "Install Sakinah"</li>
                  <li>Or use menu → "Install Sakinah"</li>
                </ol>
              </div>
            )}

            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh to Check Install Status
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
