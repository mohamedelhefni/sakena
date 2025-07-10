"use client";

import { useEffect, useState } from 'react';
import { useOffline } from '@/hooks/use-offline';
import indexedDBStorage from '@/lib/indexeddb';
import { SecureIndexedDBStorage } from '@/lib/secure-indexeddb';

export function OfflineAppInitializer() {
    const { isOffline } = useOffline();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initializeOfflineCapabilities = async () => {
            try {
                // Initialize IndexedDB
                await indexedDBStorage.init();

                // Check if service worker is available and working
                if ('serviceWorker' in navigator) {
                    // Register our custom service worker if not already registered
                    try {
                        const registration = await navigator.serviceWorker.getRegistration();
                        if (!registration) {
                            await navigator.serviceWorker.register('/sw.js');
                            console.log('Service Worker registered successfully');
                        }

                        // Listen for service worker updates
                        navigator.serviceWorker.addEventListener('controllerchange', () => {
                            console.log('Service Worker updated, reloading page...');
                            window.location.reload();
                        });
                    } catch (error) {
                        console.warn('Service Worker registration failed:', error);
                    }
                }

                // Test offline storage capabilities
                try {
                    const testData = { test: true, timestamp: Date.now() };
                    await SecureIndexedDBStorage.saveUserData(testData, 'test-key');
                    console.log('Offline storage test successful');
                } catch (error) {
                    console.warn('Offline storage test failed:', error);
                }

                setIsInitialized(true);
            } catch (error) {
                console.error('Failed to initialize offline capabilities:', error);
                setIsInitialized(true); // Set to true even on error so app doesn't hang
            }
        };

        initializeOfflineCapabilities();
    }, []);

    useEffect(() => {
        // Handle online/offline transitions
        if (isOffline) {
            console.log('App is now offline - using local storage');
            // Ensure offline UI components are ready
            document.body.classList.add('app-offline');
        } else {
            console.log('App is now online - network available');
            document.body.classList.remove('app-offline');

            // Optionally sync data when coming back online
            // This is where you'd implement background sync
        }
    }, [isOffline]);

    // Add offline styles to the document
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
      .app-offline .network-required {
        opacity: 0.5;
        pointer-events: none;
      }
      
      .app-offline .offline-indicator {
        display: block !important;
      }
      
      .app-online .offline-indicator {
        display: none;
      }
    `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // This component doesn't render anything visible
    return null;
}
