// Service Worker for Performance Optimization
// Version 1.0.0

const CACHE_NAME = 'capture-by-christian-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/admin',
  '/manifest.json',
  // Add critical CSS and JS files here
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[ServiceWorker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests differently
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  // Default: network first, then cache
  event.respondWith(handleDefault(request));
});

// Cache-first strategy for static assets
async function handleStaticAsset(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[ServiceWorker] Static asset fetch failed:', error);
    return new Response('Asset not available', { status: 404 });
  }
}

// Network-first strategy for API requests
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful GET responses that aren't user-specific
    if (networkResponse.status === 200 && !isUserSpecific(request.url)) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[ServiceWorker] API request failed, trying cache:', error);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response(JSON.stringify({ 
      error: 'Network unavailable', 
      message: 'Please check your connection' 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Network-first strategy for navigation
async function handleNavigation(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.log('[ServiceWorker] Navigation failed, serving cached index:', error);
    
    const cachedResponse = await caches.match('/');
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Application offline', { status: 503 });
  }
}

// Default strategy - network first, then cache
async function handleDefault(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Resource not available', { status: 404 });
  }
}

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|ico)$/);
}

function isUserSpecific(url) {
  return url.includes('/user/') || 
         url.includes('/profile/') ||
         url.includes('/auth/') ||
         url.includes('/session/');
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForms());
  }
});

async function syncContactForms() {
  // Handle offline form submissions when connection is restored
  console.log('[ServiceWorker] Syncing offline contact forms');
  // Implementation would depend on your offline storage strategy
}