// Custom service worker for enhanced PWA functionality
// This file extends the automatically generated service worker by next-pwa

// Workbox will inject the manifest here
self.__WB_MANIFEST;

const CACHE_NAME = 'sakinah-v1';
const APP_SHELL_CACHE = 'sakinah-app-shell-v1';

// Enhanced caching strategy for critical resources
const CRITICAL_RESOURCES = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Handle service worker installation
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      caches.open(APP_SHELL_CACHE).then(async (cache) => {
        // Pre-cache the main app page which contains your React app
        try {
          const response = await fetch('/');
          if (response.ok) {
            await cache.put('/', response);
            console.log('Successfully cached root page');
          }
        } catch (err) {
          console.warn('Failed to cache root page during install:', err);
        }
      })
    ])
  );
  
  // Force immediate activation
  self.skipWaiting();
});

// Handle service worker activation
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== CACHE_NAME && cacheName !== APP_SHELL_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Claim all clients immediately
  self.clients.claim();
});

// Enhanced fetch handler with intelligent caching
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip chrome-extension and internal requests
  if (event.request.url.startsWith('chrome-extension://') || 
      event.request.url.includes('/_next/webpack-hmr') ||
      event.request.url.includes('/_next/static/hmr/')) {
    return;
  }

  const url = new URL(event.request.url);
  
  // Handle navigation requests (when user navigates to app routes)
  if (event.request.mode === 'navigate') {
    event.respondWith(handleAppShellRequest(event.request));
    return;
  }
  
  // Handle API requests (for future server integration)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(event.request));
    return;
  }

  // Default caching strategy for assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        // Fetch from network in background to update cache
        fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
        }).catch(() => {
          // Network failed, but we have cache
        });
        return cachedResponse;
      }

      // Fetch from network
      return fetch(event.request).then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Network failed and no cache available
        console.log('Network failed for:', event.request.url);
        throw new Error('Network failed and no cache available');
      });
    })
  );
});

// Handle app shell requests with cache-first strategy
async function handleAppShellRequest(request) {
  try {
    const url = new URL(request.url);
    
    // For navigation requests to app routes, always serve from cache or fallback to root
    if (request.mode === 'navigate') {
      // Try to get the exact cached page first
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // For app routes, fallback to root page (which contains the React app)
      const rootCache = await caches.match('/');
      if (rootCache) {
        return rootCache;
      }
      
      // If no root cache, try to fetch
      try {
        const networkResponse = await fetch('/');
        if (networkResponse && networkResponse.status === 200) {
          const cache = await caches.open(APP_SHELL_CACHE);
          cache.put('/', networkResponse.clone());
          return networkResponse;
        }
      } catch (fetchError) {
        console.log('Failed to fetch root page:', fetchError);
      }
    }

    // For non-navigation requests, try cache first then network
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Try to fetch from network
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      // Cache the response
      const cache = await caches.open(APP_SHELL_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }

    throw new Error('Network failed and no cache available');
  } catch (error) {
    console.log('App shell request failed:', error);
    
    // For navigation requests, always try to serve the root page
    if (request.mode === 'navigate') {
      const rootCache = await caches.match('/');
      if (rootCache) {
        return rootCache;
      }
    }
    
    return new Response('App unavailable offline', { 
      status: 503, 
      statusText: 'Service Unavailable' 
    });
  }
}

// Handle API requests (for when you add server functionality)
async function handleApiRequest(request) {
  try {
    // Try network first for API requests
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      // Cache successful API responses
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    throw new Error('Network request failed');
  } catch (error) {
    // Try cache as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return appropriate offline response
    return new Response(JSON.stringify({ 
      error: 'Offline', 
      message: 'This feature requires an internet connection' 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle background sync for mood entries (when offline capabilities are added)
self.addEventListener('sync', (event) => {
  if (event.tag === 'mood-sync') {
    event.waitUntil(syncMoodEntries());
  }
});

async function syncMoodEntries() {
  // Implementation for syncing offline mood entries
  try {
    // Get pending entries from IndexedDB
    // Send to server when online
    console.log('Syncing mood entries...');
  } catch (error) {
    console.error('Failed to sync mood entries:', error);
  }
}

// Handle push notifications (future feature)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-72x72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// Notify clients about updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Periodically check for updates
setInterval(() => {
  self.registration.update();
}, 60000); // Check every minute
