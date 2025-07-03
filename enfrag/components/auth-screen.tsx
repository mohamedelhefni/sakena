"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SecureStorage, EncryptionService } from '@/lib/encryption';
import { User } from '@/lib/types';

interface AuthProps {
    onAuthenticated: (user: User, pin: string) => void;
}

export function AuthScreen({ onAuthenticated }: AuthProps) {
    const { t } = useTranslation();
    const [pin, setPin] = useState('');
    const [username, setUsername] = useState('');
    const [isLogin, setIsLogin] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const existingUser = SecureStorage.getUserProfile();
        if (existingUser) {
            setUsername(existingUser);
            setIsLogin(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!EncryptionService.validatePin(pin)) {
            setError(t('auth.pinTooShort'));
            setIsLoading(false);
            return;
        }

        if (!isLogin && !username.trim()) {
            setError(t('auth.usernameRequired'));
            setIsLoading(false);
            return;
        }

        try {
            if (isLogin) {
                // Try to load existing data
                const userData = SecureStorage.loadUserData(pin);
                if (userData) {
                    onAuthenticated(userData.user, pin);
                } else {
                    setError(t('auth.incorrectPin'));
                }
            } else {
                // Create new user
                const newUser: User = {
                    username: username.trim(),
                    language: 'ar',
                    theme: 'system',
                };

                const userData = {
                    user: newUser,
                    moodEntries: [],
                    journalEntries: [],
                    settings: {
                        notifications: true,
                        backupEnabled: true,
                        islamicFeatures: true,
                    },
                };

                if (SecureStorage.saveUserData(userData, pin)) {
                    SecureStorage.saveUserProfile(username.trim());
                    onAuthenticated(newUser, pin);
                } else {
                    setError(t('auth.accountCreationFailed'));
                }
            }
        } catch (error) {
            setError(t('auth.unexpectedError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handlePinChange = (value: string) => {
        // Only allow numbers
        const numericValue = value.replace(/[^0-9]/g, '');
        setPin(numericValue);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">🌱</span>
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        {isLogin ? t('auth.welcomeBack', { username }) : t('auth.createAccount')}
                    </CardTitle>
                    <CardDescription>
                        {isLogin ? t('auth.enterPinToUnlock') : t('auth.setupAccount')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-2">
                                <label htmlFor="username" className="text-sm font-medium">{t('auth.usernameLabel')}</label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder={t('auth.usernamePlaceholder')}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full"
                                    aria-label={t('auth.usernameLabel')}
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="pin" className="text-sm font-medium">{t('auth.pinLabel')}</label>
                            <Input
                                id="pin"
                                type="password"
                                placeholder="••••"
                                value={pin}
                                onChange={(e) => handlePinChange(e.target.value)}
                                maxLength={4}
                                className="w-full text-center tracking-[0.5em]"
                                aria-label={t('auth.pinLabel')}
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? t('auth.loading') : (isLogin ? t('auth.loginButton') : t('auth.createButton'))}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 hover:underline dark:text-blue-400">
                            {isLogin ? t('auth.notYou') : t('auth.alreadyHaveAccount')}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
