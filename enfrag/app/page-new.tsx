"use client";

import { useState, useEffect } from 'react';
import { AuthScreen } from '@/components/auth-screen';
import { Dashboard } from '@/components/dashboard';
import { SecureStorage } from '@/lib/encryption';
import { User, UserData } from '@/lib/types';

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [currentPin, setCurrentPin] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in (this is just UI state, data is still encrypted)
        const existingUser = SecureStorage.getUserProfile();
        if (existingUser) {
            // User exists but still need PIN to decrypt data
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, []);

    const handleAuthenticated = (authenticatedUser: User, pin: string) => {
        setUser(authenticatedUser);
        setCurrentPin(pin);

        // Load user data
        const loadedData = SecureStorage.loadUserData(pin);
        if (loadedData) {
            setUserData(loadedData);
        } else {
            // Create initial data structure
            const initialData: UserData = {
                user: authenticatedUser,
                moodEntries: [],
                journalEntries: [],
                settings: {
                    notifications: true,
                    backupEnabled: true,
                    islamicFeatures: true,
                },
            };
            setUserData(initialData);
        }

        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setUserData(null);
        setCurrentPin('');
    };

    const handleUpdateData = (newData: UserData) => {
        setUserData(newData);
        SecureStorage.saveUserData(newData, currentPin);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p>جاري التحميل... / Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !user || !userData) {
        return <AuthScreen onAuthenticated={handleAuthenticated} />;
    }

    return (
        <Dashboard
            user={user}
            userData={userData}
            onLogout={handleLogout}
            onUpdateData={handleUpdateData}
        />
    );
}
