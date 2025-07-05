"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SecureIndexedDBStorage } from '@/lib/secure-indexeddb';
import { EncryptionService } from '@/lib/encryption';
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
    const [showPassword, setShowPassword] = useState(false);

    // Password strength indicator component
    const PasswordStrengthIndicator = ({ password }: { password: string }) => {
        if (!password || isLogin) return null;
        
        const strength = EncryptionService.getPasswordStrength(password);
        const strengthColors = {
            weak: 'bg-red-500',
            fair: 'bg-yellow-500',
            good: 'bg-blue-500',
            strong: 'bg-green-500'
        };
        
        const strengthWidths = {
            weak: 'w-1/4',
            fair: 'w-2/4',
            good: 'w-3/4',
            strong: 'w-full'
        };

        return (
            <div className="mt-2">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{t('auth.passwordStrength')}</span>
                    <span className="capitalize">{t(`auth.passwordStrength${strength.charAt(0).toUpperCase() + strength.slice(1)}`)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-300 ${strengthColors[strength]} ${strengthWidths[strength]}`}></div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        const loadExistingUser = async () => {
            const existingUser = await SecureIndexedDBStorage.getUserProfile();
            if (existingUser) {
                setUsername(existingUser);
                setIsLogin(true);
            }
        };
        loadExistingUser();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!EncryptionService.validatePin(pin)) {
            setError(t('auth.passwordTooShort'));
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
                const userData = await SecureIndexedDBStorage.loadUserData(pin, username);
                if (userData) {
                    onAuthenticated(userData.user, pin);
                } else {
                    setError(t('auth.incorrectPassword'));
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

                if (await SecureIndexedDBStorage.saveUserData(userData, pin)) {
                    await SecureIndexedDBStorage.saveUserProfile(username.trim());
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
        // Allow any characters for password
        setPin(value);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-white-400 to-green-600 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">🌱</span>
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        {isLogin ? t('auth.welcomeBack', { username }) : t('auth.createAccount')}
                    </CardTitle>
                    <CardDescription>
                        {isLogin ? t('auth.enterPasswordToUnlock') : t('auth.setupAccount')}
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
                            <label htmlFor="pin" className="text-sm font-medium">{t('auth.passwordLabel')}</label>
                            <div className="relative">
                                <Input
                                    id="pin"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t('auth.passwordPlaceholder')}
                                    value={pin}
                                    onChange={(e) => handlePinChange(e.target.value)}
                                    className="w-full pr-10"
                                    aria-label={t('auth.passwordLabel')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            <PasswordStrengthIndicator password={pin} />
                            {!isLogin && (
                                <div className="flex items-center text-xs text-muted-foreground">
                                    <Info className="w-3 h-3 mr-1" />
                                    {t('auth.passwordHelp')}
                                </div>
                            )}
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
