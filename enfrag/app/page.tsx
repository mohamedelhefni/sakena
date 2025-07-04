"use client";

import { useState, useEffect, Suspense } from 'react';
import { AuthScreen } from '@/components/auth-screen';
import { Dashboard } from '@/components/dashboard';
import { LandingPage } from '@/components/landing-page';
import { SecureIndexedDBStorage } from '@/lib/secure-indexeddb';
import { User, UserData } from '@/lib/types';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentPin, setCurrentPin] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthScreen, setShowAuthScreen] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      // Check for existing session first
      const existingUser = await SecureIndexedDBStorage.getUserProfile();
      const validSession = await SecureIndexedDBStorage.getValidSession();

      if (existingUser && validSession) {
        // Try to load user data with the session PIN
        const loadedData = await SecureIndexedDBStorage.loadUserData(validSession, existingUser);
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
    };

    initializeApp();
  }, []);

  const handleAuthenticated = async (authenticatedUser: User, pin: string) => {
    setUser(authenticatedUser);
    setCurrentPin(pin);

    // Save session for auto-login
    await SecureIndexedDBStorage.saveSession(pin);

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

  const handleLogout = async () => {
    await SecureIndexedDBStorage.clearSession();
    setIsAuthenticated(false);
    setUser(null);
    setUserData(null);
    setCurrentPin('');
    setShowAuthScreen(false); // Return to landing page
  };

  const handleUpdateUser = async (newUser: User) => {
    setUser(newUser);
    // Optionally save the updated user profile
    await SecureIndexedDBStorage.saveUserProfile(newUser.username);
  };

  const handleUpdateData = async (newData: UserData) => {
    setUserData(newData);
    await SecureIndexedDBStorage.saveUserData(newData, currentPin);
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

  // Show landing page if not authenticated and not showing auth screen
  if (!isAuthenticated && !showAuthScreen) {
    return <LandingPage onGetStarted={() => setShowAuthScreen(true)} />;
  }

  // Show auth screen if requested but not authenticated
  if (!isAuthenticated || !user || !userData) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />;
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>جاري التحميل... / Loading...</p>
        </div>
      </div>
    }>
      <Dashboard
        user={user}
        userData={userData}
        onLogout={handleLogout}
        onUpdateData={handleUpdateData}
        onUpdateUser={handleUpdateUser}
        currentPin={currentPin}
      />
    </Suspense>
  );
}
