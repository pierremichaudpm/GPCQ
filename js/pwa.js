// === GPCQ 2025 - PWA Functionality ===

// PWA Configuration
const PWA_CONFIG = {
    appName: 'GPCQ 2025',
    promptDelay: 30000, // Show install prompt after 30 seconds
    dismissCookieDuration: 7, // Days before showing prompt again
    offlinePages: [
        '/',
        '/index.html',
        '/css/style.css',
        '/css/responsive.css',
        '/js/app.js',
        '/js/countdown.js',
        '/js/map.js'
    ]
};

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Désactiver le SW en local pour éviter les problèmes de cache pendant le dev
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
            caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
        } else {
            registerServiceWorker();
        }
    });
}

// Register Service Worker
async function registerServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
        });
        
        console.log('Service Worker registered successfully:', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New service worker available - activate immediately and reload
                    if (registration.waiting) {
                        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                    }
                    setTimeout(() => window.location.reload(), 150);
                }
            });
        });
        
        // Track SW registration
        if (typeof gtag !== 'undefined') {
            gtag('event', 'service_worker_registered', {
                event_category: 'PWA'
            });
        }
        
    } catch (error) {
        console.error('Service Worker registration failed:', error);
    }
}

// Show update notification
function showUpdateNotification() {
    const currentLang = localStorage.getItem('language') || 'fr';
    const message = currentLang === 'fr' ? 
        'Une nouvelle version est disponible! Rafraîchir?' : 
        'A new version is available! Refresh?';
    
    if (confirm(message)) {
        window.location.reload();
    }
}

// Install Prompt
let deferredPrompt;
let installPromptShown = false;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Pour test: ignorer les dismissals précédents
    console.log('PWA: beforeinstallprompt event captured');
    localStorage.removeItem('installPromptDismissed');
    localStorage.removeItem('installPromptDismissedTime');
    
    // Show install prompt immediately (no delay for testing)
    setTimeout(() => {
        if (!installPromptShown) {
            showInstallPrompt();
        }
    }, 3000); // Réduit à 3 secondes pour test
});

// Show install prompt
function showInstallPrompt() {
    const prompt = document.getElementById('installPrompt');
    const installBtn = document.getElementById('installBtn');
    
    if (!prompt || !deferredPrompt) return;
    
    // Show the prompt
    prompt.classList.remove('hidden');
    installPromptShown = true;
    
    // Track prompt shown
    if (typeof gtag !== 'undefined') {
        gtag('event', 'install_prompt_shown', {
            event_category: 'PWA'
        });
    }
    
    // Handle install button click
    installBtn.addEventListener('click', async () => {
        // Hide the prompt
        prompt.classList.add('hidden');
        
        // Show the browser install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        
        // Track the outcome
        if (typeof gtag !== 'undefined') {
            gtag('event', 'install_prompt_outcome', {
                event_category: 'PWA',
                event_label: outcome
            });
        }
        
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            localStorage.removeItem('installPromptDismissed');
            localStorage.removeItem('installPromptDismissedTime');
        } else {
            console.log('User dismissed the install prompt');
        }
        
        // Clear the deferred prompt
        deferredPrompt = null;
    });
}

// Handle app installed
window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    
    // Hide install prompt
    const prompt = document.getElementById('installPrompt');
    if (prompt) {
        prompt.classList.add('hidden');
    }
    
    // Track installation
    if (typeof gtag !== 'undefined') {
        gtag('event', 'pwa_installed', {
            event_category: 'PWA'
        });
    }
    
    // Show thank you message
    showInstallSuccessMessage();
});

// Show installation success message
function showInstallSuccessMessage() {
    const currentLang = localStorage.getItem('language') || 'fr';
    const message = currentLang === 'fr' ? 
        '✅ Application installée avec succès!' : 
        '✅ App installed successfully!';
    
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification success';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-green);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Detect if app is running as PWA
function isPWA() {
    return (window.matchMedia('(display-mode: standalone)').matches) ||
           (window.navigator.standalone) ||
           document.referrer.includes('android-app://');
}

// Track PWA usage
if (isPWA()) {
    console.log('App is running as PWA');
    document.body.classList.add('pwa-mode');
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'pwa_launch', {
            event_category: 'PWA'
        });
    }
}

// Handle offline/online events
window.addEventListener('online', () => {
    console.log('Back online');
    showConnectionStatus('online');
});

window.addEventListener('offline', () => {
    console.log('Gone offline');
    showConnectionStatus('offline');
});

// Show connection status
function showConnectionStatus(status) {
    const currentLang = localStorage.getItem('language') || 'fr';
    const messages = {
        online: {
            fr: '🟢 Connexion rétablie',
            en: '🟢 Connection restored'
        },
        offline: {
            fr: '🔴 Mode hors ligne',
            en: '🔴 Offline mode'
        }
    };
    
    const message = messages[status][currentLang];
    
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `toast-notification ${status}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 70px;
        left: 50%;
        transform: translateX(-50%);
        background: ${status === 'online' ? 'var(--primary-green)' : 'var(--gray-700)'};
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Prefetch important resources
function prefetchResources() {
    const resources = [
        'https://gpcqm.ca/wp-content/uploads/2025/06/27220754/225318-GPCMTL-PARCOURS_FR_13-06-25_Corrige.png'
    ];
    
    resources.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    });
}

// Initialize prefetching
if ('connection' in navigator && navigator.connection.saveData !== true) {
    prefetchResources();
}

// Share API
function shareApp() {
    const currentLang = localStorage.getItem('language') || 'fr';
    
    const shareData = {
        title: 'Grand Prix Cycliste de Québec 2025',
        text: currentLang === 'fr' ? 
            'Suivez le Grand Prix Cycliste de Québec le 12 septembre 2025!' :
            'Follow the Québec City Cycling Grand Prix on September 12, 2025!',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => {
                console.log('Successfully shared');
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'share', {
                        event_category: 'Social',
                        method: 'Web Share API'
                    });
                }
            })
            .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback to copying link
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                const message = currentLang === 'fr' ? 
                    'Lien copié!' : 
                    'Link copied!';
                alert(message);
            });
    }
}

// Clear PWA caches and unregister Service Workers
async function clearAppCache() {
    try {
        // Delete all Cache Storage entries
        if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map((k) => caches.delete(k)));
            console.log('[PWA] Caches supprimés:', keys);
        }

        // Unregister all Service Workers
        if ('serviceWorker' in navigator) {
            const regs = await navigator.serviceWorker.getRegistrations();
            await Promise.all(regs.map((r) => r.unregister()));
            console.log('[PWA] Service Workers désenregistrés:', regs.length);
        }

        // Small delay to ensure cleanup propagates
        setTimeout(() => {
            window.location.reload();
        }, 250);
    } catch (error) {
        console.error('[PWA] Échec du vidage de cache:', error);
        // Reload anyway as a fallback
        window.location.reload();
    }
}

// Export functions
window.shareApp = shareApp;
window.isPWA = isPWA;
window.clearAppCache = clearAppCache;