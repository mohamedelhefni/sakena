"use client";

import { useTranslation } from 'react-i18next';
import { Sun, Moon, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, UserData } from '@/lib/types';
import { useTheme } from 'next-themes';

interface SettingsViewProps {
    user: User;
    userData: UserData;
    onChangeUsername: () => void;
    onUpdateData: (data: UserData) => void;
}

export function SettingsView({ user, userData, onChangeUsername, onUpdateData }: SettingsViewProps) {
    const { t, i18n } = useTranslation();
    const { theme, setTheme } = useTheme();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const toggleIslamicFeatures = () => {
        const updatedData = {
            ...userData,
            settings: {
                ...userData.settings,
                islamicFeatures: !userData.settings.islamicFeatures
            }
        };
        onUpdateData(updatedData);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('nav.settings')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-medium mb-3">{t('settings.theme')}</h3>
                    <div className="flex gap-2">
                        <Button
                            variant={theme === 'light' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setTheme('light')}
                        >
                            <Sun className="w-4 h-4 ml-2" />
                            {t('settings.light')}
                        </Button>
                        <Button
                            variant={theme === 'dark' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setTheme('dark')}
                        >
                            <Moon className="w-4 h-4 ml-2" />
                            {t('settings.dark')}
                        </Button>
                    </div>
                </div>

                <div>
                    <h3 className="font-medium mb-3">{t('settings.language')}</h3>
                    <div className="flex gap-2">
                        <Button
                            variant={i18n.language === 'en' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => changeLanguage('en')}
                        >
                            English
                        </Button>
                        <Button
                            variant={i18n.language === 'ar' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => changeLanguage('ar')}
                        >
                            العربية
                        </Button>
                    </div>
                </div>

                <div>
                    <h3 className="font-medium mb-3">{t('settings.islamicFeatures')}</h3>
                    <div className="flex items-center justify-between flex-wrap">
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">
                                {t('settings.islamicFeaturesDescription')}
                            </p>
                        </div>
                        <Button
                            variant={userData.settings.islamicFeatures ? 'default' : 'outline'}
                            size="sm"
                            onClick={toggleIslamicFeatures}
                        >
                            <Star className="w-4 h-4 ml-2" />
                            {userData.settings.islamicFeatures ? t('settings.enabled') : t('settings.disabled')}
                        </Button>
                    </div>
                </div>

                <div>
                    <h3 className="font-medium mb-3">{t('settings.userInfo')}</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between flex-wrap">
                            <div>
                                <p className="text-sm font-medium">
                                    {t('auth.usernameLabel')}: {user.username}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {t('settings.changeUsernameDescription')}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onChangeUsername}
                            >
                                {t('settings.changeUsername')}
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
