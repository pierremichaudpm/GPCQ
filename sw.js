// === GPCQ 2025 - Service Worker - Mobile Optimized ===

const CACHE_NAME = 'gpcq-v3.5';
const RUNTIME_CACHE = 'gpcq-runtime-v3.5';
const IMAGE_CACHE = 'gpcq-images-v3.5';
const API_CACHE = 'gpcq-api-v3.5';

// Mobile-specific configurations
const MOBILE_CACHE_CONFIG = {
    maxImageCacheSize: 20, // Limit image cache on mobile
    maxApiCacheSize: 10,   // Limit API cache on mobile
    cacheStrategy: 'conservative' // Less aggressive caching on mobile
};

// Files to cache on install
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/css/style.css',
    '/css/responsive.css',
    '/css/overrides.css',
    '/js/app.js',
    '/js/countdown.js',
    '/js/map.js',
    '/js/weather.js',
    // '/js/instagram.js', // supprimé
    '/js/pwa.js',
    // Add Google Fonts
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    // Add offline fallback page (we'll create this)
    '/offline.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching static assets');
                return cache.addAll(STATIC_CACHE_URLS.map(url => {
                    return new Request(url, { cache: 'reload' });
                }));
            })
            .then(() => {
                console.log('[Service Worker] Install complete');
                // Skip waiting to activate immediately
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] Install failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            return cacheName.startsWith('gpcqm-') && 
                                   cacheName !== CACHE_NAME &&
                                   cacheName !== RUNTIME_CACHE;
                        })
                        .map((cacheName) => {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activate complete');
                // Take control of all clients immediately
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http(s) protocols
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // Handle API requests differently (network first)
    if (url.pathname.includes('/api/') || 
        url.hostname.includes('api.') ||
        url.hostname.includes('instagram.com') ||
        url.hostname.includes('openweathermap.org')) {
        
        event.respondWith(
            networkFirstStrategy(request)
        );
        return;
    }
    
    // Handle image requests with SWR strategy for instant display then refresh
    if (request.destination === 'image' ||
        url.pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|webp)$/i)) {
        // Bypass cache for encan images to avoid stale content
        if (/\/images\/encan_/i.test(url.pathname)) {
            event.respondWith(fetch(request, { cache: 'no-store' }));
            return;
        }

        event.respondWith(staleWhileRevalidateImages(request));
        return;
    }
    
    // HTML navigations: network-first to avoid stale pages
    if (request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('.html')) {
        event.respondWith(networkFirstStrategy(request));
        return;
    }

    // Static assets (CSS, JS): network-first to avoid stale assets during dev/updates
    if (url.pathname.match(/\.(css|js)$/i)) {
        event.respondWith(networkFirstStrategy(request));
        return;
    }
    
    // Default strategy for everything else
    event.respondWith(
        cacheFirstStrategy(request, RUNTIME_CACHE)
    );
});

// Cache-first strategy
async function cacheFirstStrategy(request, cacheName = CACHE_NAME) {
    try {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('[Service Worker] Fetch failed:', error);
        
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            const cache = await caches.open(CACHE_NAME);
            return cache.match('/offline.html');
        }
        
        throw error;
    }
}

// Network-first strategy
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('[Service Worker] Network request failed:', error);
        
        // Try to serve from cache
        const cache = await caches.open(RUNTIME_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return a custom offline response for API requests
        return new Response(
            JSON.stringify({ 
                error: 'Offline',
                message: 'Data not available offline'
            }),
            {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }
        );
    }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request)
        .then((networkResponse) => {
            // Update cache in background
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch((error) => {
            console.error('[Service Worker] Fetch failed:', error);
            return cachedResponse;
        });
    
    // Return cached response immediately if available
    return cachedResponse || fetchPromise;
}

// Message handling
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('[Service Worker] Skip waiting received');
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        const urls = event.data.payload;
        caches.open(RUNTIME_CACHE)
            .then((cache) => cache.addAll(urls))
            .then(() => {
                event.ports[0].postMessage({ cached: true });
            });
    }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('[Service Worker] Background sync:', event.tag);
    
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

// Sync data when back online
async function syncData() {
    try {
        // Here you would sync any offline data
        console.log('[Service Worker] Syncing data...');
        
        // Example: sync user preferences
        const cache = await caches.open(RUNTIME_CACHE);
        // Implementation would go here
        
        return Promise.resolve();
    } catch (error) {
        console.error('[Service Worker] Sync failed:', error);
        throw error;
    }
}

// Push notifications (for future implementation)
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push received');
    
    const options = {
        body: event.data ? event.data.text() : 'Nouvelle notification GPCQM',
        icon: '/images/icons/icon-192x192.png',
        badge: '/images/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'open',
                title: 'Ouvrir',
                icon: '/images/icons/checkmark.png'
            },
            {
                action: 'close',
                title: 'Fermer',
                icon: '/images/icons/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Grand Prix Cycliste de Québec', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification click:', event.action);
    
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Periodic background sync (for future implementation)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-race-status') {
        event.waitUntil(updateRaceStatus());
    }
});

// Update race status in background
async function updateRaceStatus() {
    try {
        // Fetch latest race status
        const response = await fetch('/api/race-status');
        const data = await response.json();
        
        // Update cache
        const cache = await caches.open(RUNTIME_CACHE);
        await cache.put(
            new Request('/api/race-status'),
            new Response(JSON.stringify(data))
        );
        
        // Notify clients
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'RACE_STATUS_UPDATE',
                payload: data
            });
        });
        
    } catch (error) {
        console.error('[Service Worker] Failed to update race status:', error);
    }
}

// Images: stale-while-revalidate with cache size limit
async function staleWhileRevalidateImages(request) {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);

    const fetchPromise = fetch(request)
        .then(async (networkResponse) => {
            if (networkResponse && networkResponse.ok) {
                try {
                    // Enforce simple LRU-ish policy
                    const keys = await cache.keys();
                    if (keys.length >= MOBILE_CACHE_CONFIG.maxImageCacheSize) {
                        const oldestKey = keys[0];
                        await cache.delete(oldestKey);
                    }
                    await cache.put(request, networkResponse.clone());
                } catch (e) {
                    console.warn('[Service Worker] Could not update image cache:', e);
                }
            }
            return networkResponse;
        })
        .catch((err) => {
            console.warn('[Service Worker] Image fetch failed:', err);
            return cachedResponse;
        });

    return cachedResponse || fetchPromise;
}

// Utility: Clean up old cache entries for mobile
async function cleanupMobileCaches() {
    const caches = await caches.keys();
    
    for (const cacheName of caches) {
        if (cacheName.includes('images')) {
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            
            if (keys.length > MOBILE_CACHE_CONFIG.maxImageCacheSize) {
                // Keep only recent entries
                const keysToDelete = keys.slice(0, keys.length - MOBILE_CACHE_CONFIG.maxImageCacheSize);
                await Promise.all(keysToDelete.map(key => cache.delete(key)));
            }
        }
    }
}

// Log Service Worker version
console.log('[Service Worker] Version:', CACHE_NAME);