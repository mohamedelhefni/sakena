"use client";

import { useState, useEffect } from 'react';
import { AuthScreen } from '@/components/auth-screen';
import { Dashboard } from '@/components/dashboard';
import { SecureIndexedDBStorage } from '@/lib/secure-indexeddb';
import { User, UserData } from '@/lib/types';

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [currentPin, setCurrentPin] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in (this is just UI state, data is still encrypted)
        const checkUser = async () => {
            const existingUser = await SecureIndexedDBStorage.getUserProfile();
            if (existingUser) {
                // User exists but still need PIN to decrypt data
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        };
        checkUser();
    }, []);

    const handleAuthenticated = async (authenticatedUser: User, pin: string) => {
        setUser(authenticatedUser);
        setCurrentPin(pin);

        // Load user data
        const loadedData = await SecureIndexedDBStorage.loadUserData(pin, authenticatedUser.username);
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

    const handleUpdateData = async (newData: UserData) => {
        setUserData(newData);
        await SecureIndexedDBStorage.saveUserData(newData, currentPin);
    };

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
