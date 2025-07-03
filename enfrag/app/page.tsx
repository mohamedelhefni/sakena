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
    // Check for existing session first
    const existingUser = SecureStorage.getUserProfile();
    const validSession = SecureStorage.getValidSession();

    if (existingUser && validSession) {
      // Try to load user data with the session PIN
      const loadedData = SecureStorage.loadUserData(validSession);
      if (loadedData) {
        const user: User = {
          username: existingUser,
          language: 'ar',
          theme: 'system',
        };
        setUser(user);
        setCurrentPin(validSession);
        setUserData(loadedData);
        setIsAuthenticated(true);
      }
    }

    setIsLoading(false);
  }, []);

  const handleAuthenticated = (authenticatedUser: User, pin: string) => {
    setUser(authenticatedUser);
    setCurrentPin(pin);

    // Save session for auto-login
    SecureStorage.saveSimpleSession(pin);

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
    SecureStorage.clearSession();
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
