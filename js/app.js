// === GPCQM 2025 - Main Application JavaScript ===

// App Configuration - Mobile Optimized
const APP_CONFIG = {
    raceDate: '2025-09-12T11:00:00-04:00',
    defaultLanguage: 'fr',
    isMobile: window.innerWidth <= 768
};

// Language translations
const translations = {
    fr: {
        // Header
        eventName: 'Grand Prix Cycliste de Québec',
        
        // Hero
        heroTitle: 'GRAND PRIX CYCLISTE DE QUÉBEC',
        heroSubtitle: '12 septembre 2025\nÉpreuve UCI WorldTour',
        countdownTitle: 'Départ de la course dans :',
        days: 'Jours',
        hours: 'Heures',
        minutes: 'Minutes',
        seconds: 'Secondes',
        viewCourse: 'Voir le parcours',
        viewMap: 'Voir la carte',
        whereToWatch: 'Meilleures zones spectateurs',
        viewSchedule: 'Programme',
        gettingThere: "Comment s'y rendre",
        getThereShort: "Comment s'y rendre", 
        transportTitle: "Comment s'y rendre",
        siteAccess: "Accès au site",
        bikeTitle: 'À vélo',
        metroTitle: 'Métro',
        trainTitle: 'Train/EXO',
        busTitle: 'Autobus',
        carTitle: 'Voiture/Covoiturage',
        mapEmbedTitle: 'Carte interactive',
        bikeParkingModal: '🔒 Parc à vélos surveillé gratuit disponible au Village des Fans (Parc Jeanne-Mance)',
        
        // Weather
        weatherTitle: 'Météo',
        loadingWeather: 'Chargement météo...',
        currentWeather: 'Météo actuelle',
        temperature: 'Température',
        feelsLike: 'Ressenti',
        humidity: 'Humidité',
        windSpeed: 'Vent',
        
        // Race Status
        raceStatus: 'Statut de la course',
        upcoming: 'À venir',
        live: 'En direct',
        finished: 'Terminée',
        nextEvent: 'Prochain événement :',
        fanVillageOpening: 'Ouverture du Village des Fans',
        
        // Quick Links
        ridersList: 'Liste des partants',
        ridersListTitle: 'Découvrez les coureurs',
        viewRiders: 'Liste complète',
        quebecResults: 'Résultats du Grand Prix Cycliste de Québec',
        quebecMenu: 'Grand Prix Cycliste de Montréal',
        montrealTitle: 'Grand Prix Cycliste de Montréal',
        montrealCta: 'Installer',
        liveStream: 'Le Direct',
        watchStream: 'Visionner',
        interactiveCourse: 'Parcours',
        edikaContest: 'Edika',
        silentAuction: 'Encan silencieux',
        
        fanVillageInfo: 'Zones animées',
        officialWebsite: 'Site officiel',
        quebecResults: 'Résultats Québec',

        // Riders Modal
        ridersTitle: 'Liste des partants - 2025',
        ridersInfo: 'Données officielles UCI WorldTour 2025',
        searchRider: 'Rechercher un coureur, une équipe... ',
        ridersLabel: 'Coureurs',
        teamsLabel: 'Équipes UCI',
        resultSingular: 'résultat',
        resultPlural: 'résultats',
        noResultsFor: 'Aucun résultat pour',
        close: 'Fermer',
        
        // Schedule
        scheduleTitle: 'Programmation',
        teamPresentation: 'Présentation des équipes',
        teamPresentationDesc: 'Plaines d’Abraham – Découvrez les équipes participantes',
        raceStart: 'Départ du Grand Prix Cycliste de Québec',
        raceStartDesc: 'Avenue George-VI / Devant le Manège Militaire Voltigeurs de Québec  – 216 km • 17 tours',
        raceFinish: 'Arrivée de la course',
        raceFinishDesc: 'Avenue George-VI / Devant le Manège Militaire Voltigeurs de Québec',
        ceremonies: 'Cérémonies protocolaires',
        ceremoniesDesc: 'Plaines d’Abraham - Remise des prix',
        fanVillageDesc: 'Plaines d’Abraham – Animation, activités et kiosques d’exposants',
        
        // Map
        courseTitle: 'Parcours',
        animatedCourseTitle: 'Parcours animé',
        lapDistance: 'Par tour',
        totalLaps: 'Tours',
        totalDistance: 'Distance totale',
        elevation: 'Dénivelé total',
        elevationPerLap: 'Dénivelé par tour',
        urbanCircuit: 'Circuit urbain',
        raceDuration: 'Durée de course',
        legendTitle: 'Points d\'intérêt',
        startFinish: 'Départ/Arrivée',
        keyPoints: 'Points clés',
        
        // Map Popups
        startTitle: 'Ligne de Départ/Arrivée',
        startContent: 'Avenue du Parc - Point de départ et d\'arrivée de la course. Meilleur endroit pour voir le sprint final.',
        climbTitle: 'Côte Camillien-Houde',
        climbContent: 'Montée de 1,8 km - La principale difficulté du parcours. Pente moyenne de 8%.',
        belvedereTitle: 'Belvédère Camillien-Houde',
        belvedereContent: 'Zone d\'animation avec Red Bull, DJ et écran géant. Vue spectaculaire sur la course.',
        fanvillageTitle: 'Village des Fans',
        fanvillageContent: 'Parc Jeanne-Mance - Animations, kiosques partenaires, restauration et boutique officielle.',
        parkingTitle: 'Parc à vélos',
        parkingContent: 'Stationnement sécurisé pour vélos au Parc Jeanne-Mance. Service gratuit.',
        
        // Social
        
        loadingPosts: 'Chargement des publications...',
        videoFallbackPrefix: "Si la vidéo ne s'affiche pas, ",
        videoFallbackLinkText: 'ouvrez-la sur Vimeo',
        
        // Broadcast
        broadcastTitle: 'Diffusion',
        diffusionCta: 'Diffusion',
        tvBroadcast: 'de 10 h à 16 h',
        streamBroadcast: 'Streaming international',
        webStreamTitle: 'Webdiffusion',
        giantScreen: 'Écran Géant',
        giantScreenDesc: 'Au Belvédère Camillien-Houde',
        giantScreens: 'Écrans Géants',
        giantScreensDesc: 'Plaines d’Abraham, Avenue George-VI, Zone animée (côte de la Montagne / Port Dauphin)',
        tvaApp: 'Application TVA Sports',
        tvaAppDesc: 'Télécharger',
        onSiteOnly: 'Sur site seulement',
        
        // Contest
        contestTitle: 'Concours',
        edikaDesc: 'Gagnez des prix exclusifs',
        participate: 'Participer',
        auctionDesc: 'Maillots et équipements signés',
        bidNow: 'Miser',
        
        // Fan Village
        fanVillageTitle: 'Village des Fans',
        location: 'Emplacement',
        schedule: 'Horaire',
        activities: 'Activités',
        activity1: 'Kiosques partenaires',
        activity2: 'Zone familiale',
        activity3: 'Restauration',
        activity4: 'Boutique officielle',
        access: 'Accès',
        freeEntry: 'Entrée gratuite',
        bikeParking: 'Parc à vélos disponible',
        
        // Zones animées (nouvelle section)
        animatedZonesTitle: 'Zones animées',
        zonesVillageTitle: 'Village des Fans',
        zonesVillageLocationValue: 'Rendez-vous au coin de l’Avenue Georges VI & Ontario (Plaines d’Abraham)',
        zonesVillageAct1: 'Kiosques d’exposants',
        zonesVillageAct2: 'Restauration et service de bar',
        zonesVillageAct3: 'Boutique officielle GPCQM par Santini',
        zonesVillageAct4: 'Toilettes',
        zonesVillageScheduleValue: '9 h 30 à 17 h',
        zonesVillageCTA: 'Découvrez nos exposants',
        zonesBelvedereTitle: 'Zone animée (côte de la Montagne / Port Dauphin)',
        zonesBelvedereAnimTitle: 'Animation',
        zonesBelvedereAnim1: 'Écran Géant',
        zonesBelvedereAnim2: 'Service de bar',
        zonesBelvedereAnim3: 'Toilettes',
        zonesBelvedereScheduleValue: '9 h 30 à 17 h',
        
        // Footer
        officialSite: 'Site officiel',
        privacy: 'Confidentialité',
        terms: 'Conditions',
        contact: 'Contact',
        allRights: 'Tous droits réservés.',
        // Legal modals
        privacyTitle: 'Confidentialité',
        termsTitle: 'Conditions',
        openPdf: 'Ouvrir le PDF',
        legalIntro: 'Veuillez consulter le document officiel pour le texte complet.',
        
        // PWA
        installTitle: 'Installer l\'application',
        installText: 'Ajoutez GPCQ à votre écran d\'accueil pour un accès rapide',
        installButton: 'Installer',
        iosInstallTitle: 'Installer GPCQ 2025',
        iosInstallText: 'Pour installer cette app sur votre iPhone :',
        iosStep1: 'Appuyez sur le bouton Partager',
        iosStep2: 'Sélectionnez "Sur l\'écran d\'accueil"',
        offlineMode: 'Mode hors ligne'
    },
    en: {
        // Header
        eventName: 'Québec City Cycling Grand Prix',
        
        // Hero
        heroTitle: 'GRAND PRIX CYCLISTE DE QUÉBEC',
        heroSubtitle: 'September 12, 2025\nUCI WorldTour Event',
        countdownTitle: 'Race starts in:',
        days: 'Days',
        hours: 'Hours',
        minutes: 'Minutes',
        seconds: 'Seconds',
        viewCourse: 'Circuit',
        viewMap: 'View Map',
        whereToWatch: 'Best spectator zones',
        viewSchedule: 'Schedule',
        gettingThere: 'Getting there',
        getThereShort: 'How to get there',
        transportTitle: 'Getting there',
        siteAccess: 'Site Access',
        bikeTitle: 'By bike',
        metroTitle: 'Subway',
        trainTitle: 'Train/EXO',
        busTitle: 'Bus',
        carTitle: 'Car/Carpool',
        mapEmbedTitle: 'Interactive map',
        bikeParkingModal: '🔒 Free supervised bike park available at the Fans Village (Jeanne-Mance Park)',
        
        // Weather
        weatherTitle: 'Weather Forecast',
        loadingWeather: 'Loading weather...',
        currentWeather: 'Current Weather',
        temperature: 'Temperature',
        feelsLike: 'Feels Like',
        humidity: 'Humidity',
        windSpeed: 'Wind',
        
        // Race Status
        raceStatus: 'Race Status',
        upcoming: 'Upcoming',
        live: 'Live',
        finished: 'Finished',
        nextEvent: 'Next event:',
        fanVillageOpening: 'Fans Village Opening',
        
        // Quick Links
        ridersList: 'Start list',
        ridersListTitle: 'Discover the Teams',
        viewRiders: 'Complete list',
        quebecResults: 'Québec City Race Results',
        quebecMenu: 'Grand Prix Cycliste de Montréal',
        montrealTitle: 'Grand Prix Cycliste de Montréal',
        montrealCta: 'Install',
        liveStream: 'Live Stream',
        watchStream: 'Watch',
        interactiveCourse: 'Interactive Course',
        edikaContest: 'Edika',
        silentAuction: 'Silent Auction',
        
        fanVillageInfo: 'Animation area',
        officialWebsite: 'Official Website',
        quebecResults: 'Quebec Results',

        // Riders Modal
        ridersTitle: 'Start list - 2025',
        ridersInfo: 'Official UCI WorldTour 2025 data',
        searchRider: 'Search for a rider or a team... ',
        ridersLabel: 'Riders',
        teamsLabel: 'UCI Teams',
        resultSingular: 'result',
        resultPlural: 'results',
        noResultsFor: 'No results for',
        close: 'Close',
        
        // Schedule
        scheduleTitle: 'Program',
        teamPresentation: 'Team Presentation',
        teamPresentationDesc: 'Plains of Abraham – Meet the participating teams',
        raceStart: 'Start of the Grand Prix Cycliste de Québec',
        raceStartDesc: 'George VI Avenue / In front of the Voltigeurs de Québec Armoury – 216 km • 17 laps',
        raceFinish: 'End of the race',
        raceFinishDesc: 'George VI Avenue / In front of the Voltigeurs de Québec Armoury',
        ceremonies: 'Award Ceremonies',
        ceremoniesDesc: 'Plains of Abraham – Prize giving',
        fanVillageDesc: 'Plains of Abraham – Entertainment, activities and exhibitor booths',
        
        // Map
        courseTitle: 'Circuit',
        animatedCourseTitle: 'Animated Circuit',
        lapDistance: 'Per lap',
        totalLaps: 'Laps',
        totalDistance: 'Total distance',
        elevation: 'Total elevation',
        elevationPerLap: 'Elevation per lap',
        urbanCircuit: 'Urban circuit',
        raceDuration: 'Race duration',
        legendTitle: 'Points of Interest',
        startFinish: 'Start/Finish',
        keyPoints: 'Key Points',
        
        // Map Popups
        startTitle: 'Start/Finish Line',
        startContent: 'Park Avenue - Start and finish point of the race. Best spot to see the final sprint.',
        climbTitle: 'Camillien-Houde Climb',
        climbContent: '1.8 km climb - The main difficulty of the course. Average gradient of 8%.',
        belvedereTitle: 'Camillien-Houde Lookout',
        belvedereContent: 'Entertainment zone with Red Bull, DJ and giant screen. Spectacular view of the race.',
        fanvillageTitle: 'Fans Village',
        fanvillageContent: 'Jeanne-Mance Park - Entertainment, partner booths, food and official shop.',
        parkingTitle: 'Bike Park',
        parkingContent: 'Secure bike parking at Jeanne-Mance Park. Free service.',
        
        // Social
        
        loadingPosts: 'Loading posts...',
        videoFallbackPrefix: 'If the video does not load, ',
        videoFallbackLinkText: 'open it on Vimeo',
        
        // Broadcast
        broadcastTitle: 'Broadcast',
        diffusionCta: 'Broadcast',
        tvBroadcast: 'Live broadcast from 10:00 AM to 4:00 PM',
        streamBroadcast: 'International streaming',
        webStreamTitle: 'Webcast',
        giantScreen: 'Giant Screen',
        giantScreenDesc: 'At Camillien-Houde Lookout',
        giantScreens: 'Giant Screens',
        giantScreensDesc: 'Plains of Abraham, George-VI Avenue, Animated area (Côte de la Montagne / Port Dauphin)',
        tvaApp: 'CBC Gem',
        tvaAppDesc: 'Download',
        onSiteOnly: 'On site only',
        
        // Fan Zones (new section)
        animatedZonesTitle: 'Fan Zones',
        zonesVillageTitle: 'Fans Village',
        zonesVillageLocationValue: 'Meeting point at corner of Georges V avenue & Ontario (Plains of Abraham)',
        zonesVillageAct1: 'Exhibitor booths',
        zonesVillageAct2: 'Food and bar service',
        zonesVillageAct3: 'Official boutique GPCQM by Santini',
        zonesVillageAct4: 'Restrooms',
        zonesVillageScheduleValue: '9:30 AM to 5:00 PM',
        zonesVillageCTA: 'Discover our exhibitors',
        zonesBelvedereTitle: 'Animated zone (Côte de la Montagne / Port Dauphin)',
        zonesBelvedereAnimTitle: 'Entertainment',
        zonesBelvedereAnim1: 'Giant Screen',
        zonesBelvedereAnim2: 'Bar service',
        zonesBelvedereAnim3: 'Restrooms',
        zonesBelvedereScheduleValue: '9:30 AM to 5:00 PM',
        
        // Contest
        contestTitle: 'Contests',
        edikaDesc: 'Win exclusive prizes',
        participate: 'Participate',
        auctionDesc: 'Signed jerseys and equipment',
        bidNow: 'Bid Now',
        
        // Fan Village
        fanVillageTitle: 'Fans Village',
        location: 'Location',
        schedule: 'Schedule',
        activities: 'Activities',
        activity1: 'Partner booths',
        activity2: 'Family zone',
        activity3: 'Food court',
        activity4: 'Official shop',
        access: 'Access',
        freeEntry: 'Free entry',
        bikeParking: 'Bike parking available',
        
        // Footer
        officialSite: 'Official Site',
        privacy: 'Privacy',
        terms: 'Terms',
        contact: 'Contact',
        allRights: 'All rights reserved.',
        // Legal modals
        privacyTitle: 'Privacy',
        termsTitle: 'Terms',
        openPdf: 'Open PDF',
        legalIntro: 'Please refer to the official document for the full text.',
        
        // PWA
        installTitle: 'Install App',
        installText: 'Add GPCQ to your home screen for quick access',
        installButton: 'Install',
        iosInstallTitle: 'Install GPCQ 2025',
        iosInstallText: 'To install this app on your iPhone:',
        iosStep1: 'Tap the Share button',
        iosStep2: 'Select "Add to Home Screen"',
        offlineMode: 'Offline Mode'
    },
    // Extra keys for shop
    _extra: {}
};

// Add shop translations (keeping structure minimal)
translations.fr.shopTitle = 'Boutique GPCQM';
translations.fr.shopSubtitle = 'Maillots, casquettes et souvenirs officiels';
translations.fr.shopCta = 'Découvrez';
translations.en.shopTitle = 'GPCQM Shop';
translations.en.shopSubtitle = 'Official jerseys, caps and souvenirs';
translations.en.shopCta = 'Discover';

// Current language
let currentLanguage = localStorage.getItem('language') || APP_CONFIG.defaultLanguage;

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Mobile-Optimized Touch Handler
function addSafeTapListener(element, onTap) {
    if (!element) return;
    let startX = 0, startY = 0, didMove = false, lastTouchTime = 0;
    const MOVE_THRESHOLD = APP_CONFIG.isMobile ? 12 : 16;
    const CANCEL_CLICK_MS = 300;
    
    const onTouchStart = (e) => {
        if (!e.touches?.[0]) return;
        const t = e.touches[0];
        startX = t.clientX;
        startY = t.clientY;
        didMove = false;
    };
    
    const onTouchMove = (e) => {
        if (!e.touches?.[0]) return;
        const t = e.touches[0];
        const dx = Math.abs(t.clientX - startX);
        const dy = Math.abs(t.clientY - startY);
        if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
            didMove = true;
        }
    };
    
    const onTouchEnd = (e) => {
        lastTouchTime = performance.now();
        if (didMove) {
            e.preventDefault();
            return;
        }
        e.preventDefault();
        requestAnimationFrame(onTap);
    };
    
    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchmove', onTouchMove, { passive: true });
    element.addEventListener('touchend', onTouchEnd, { passive: false });
    element.addEventListener('touchcancel', () => { didMove = true; lastTouchTime = performance.now(); }, { passive: true });
    
    element.addEventListener('click', (e) => {
        // Don't interfere with normal clicks if no recent touch events
        if (!e.isTrusted && (didMove || (performance.now() - lastTouchTime) < CANCEL_CLICK_MS)) {
            e.preventDefault();
            didMove = false;
            return;
        }
        // Allow normal clicks to pass through (important for DevTools)
        onTap();
    }, false);
}

// Initialize Application - Mobile Optimized
function initializeApp() {
    // Critical rendering path first
    updateLanguage();
    hideLoader();
    
    // Export critical functions immediately for onclick handlers
    exportCriticalFunctions();
    
    // Fire pageview beacon (counts even if page served by SW)
    try {
        navigator.sendBeacon && navigator.sendBeacon('/beacon/pageview');
        setTimeout(() => {
            fetch('/beacon/pageview', { method: 'POST', keepalive: true }).catch(()=>{});
        }, 2500);
    } catch(_) {}

    // Initialize language toggle button
    const langToggleBtn = document.getElementById('langToggleBtn');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', toggleLanguage);
    }
    
    // Lazy load non-critical functionality with fallback
    (window.requestIdleCallback || ((cb) => setTimeout(cb, 1)))(() => {
        initHeroButtons();
        initSmoothScroll();
        initModalBindings();
        initVimeoAnimatedCourse();
        initBroadcastCtas();
    });
    
    // Network status
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus, { passive: true });
    window.addEventListener('offline', updateOnlineStatus, { passive: true });
    
    // PWA Install prompts
    initPWAInstallPrompts();
    
    // Fix mobile menu touch
    initMobileMenuTouch();
    
    // Analytics (non-blocking) with fallback
    (window.requestIdleCallback || ((cb) => setTimeout(cb, 100)))(() => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: 'GPCQM 2025 PWA',
                page_location: window.location.href
            });
        }
    });

    // Optimisation images (hors maillots): lazy, decoding, fetchpriority
    (window.requestIdleCallback || ((cb) => setTimeout(cb, 150)))(optimizeImagesPerformance);

    // Prefer WebP globally on key images with graceful fallback
    (window.requestIdleCallback || ((cb) => setTimeout(cb, 200)))(applyWebpFallbacks);
}

// Lazy-load YouTube IFrame API and initialize player when ready
function loadYouTubeIframeAPI() {
    if (window.YT && window.YT.Player) {
        initAnimatedCoursePlayer();
        return;
    }
    if (document.getElementById('yt-iframe-api')) return;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.id = 'yt-iframe-api';
    tag.async = true;
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = function() {
        initAnimatedCoursePlayer();
    };
    // Global safety timeout if API cannot load (blocked by network policies)
    setTimeout(() => {
        if (!window.YT || !window.YT.Player) {
            const iframe = document.getElementById('animatedCourseFrame');
            const fb = document.getElementById('animatedCourseFallback');
            if (iframe && iframe.style) iframe.style.display = 'none';
            if (fb) fb.style.display = '';
        }
    }, 3500);
}

// Initialize Vimeo embed for animated course (no external API needed)
function initVimeoAnimatedCourse() {
    try {
        const frame = document.getElementById('animatedCourseFrame');
        if (!frame) return;
        const lang = localStorage.getItem('language') || 'fr';
        const vimeoEmbed = lang === 'en' ? 'https://player.vimeo.com/video/1093211409' : 'https://player.vimeo.com/video/1089677103';

        // Nettoyer tout poster/bouton éventuellement présent
        const poster = document.getElementById('animatedCoursePoster');
        if (poster && poster.parentElement) poster.parentElement.removeChild(poster);
        const playBadge = document.getElementById('animatedCoursePlay');
        if (playBadge && playBadge.parentElement) playBadge.parentElement.removeChild(playBadge);

        // Afficher l'iframe avec la bonne vidéo
        frame.style.display = '';
        if (frame.getAttribute('src') !== vimeoEmbed) {
            frame.setAttribute('src', vimeoEmbed);
        }
    } catch(_) {}
}

function getAnimatedCourseVideoIdForCurrentLanguage() {
    return currentLanguage === 'en' ? 'SaJbO1hV6Rs' : 'lykSV1zaLGg';
}

function initAnimatedCoursePlayer() {
    try {
        const container = document.getElementById('animatedCourseFrame');
        if (!container || !window.YT || !window.YT.Player) return;
        // If an iframe already exists (from static HTML), YT.Player can take its id
        let isReady = false;
        const fallbackTimer = setTimeout(() => {
            if (!isReady) {
                try {
                    const iframe = document.getElementById('animatedCourseFrame');
                    const fb = document.getElementById('animatedCourseFallback');
                    if (iframe && iframe.style) iframe.style.display = 'none';
                    if (fb) fb.style.display = '';
                } catch(_) {}
            }
        }, 2500);

        window.animatedCoursePlayer = new YT.Player('animatedCourseFrame', {
            videoId: getAnimatedCourseVideoIdForCurrentLanguage(),
            playerVars: {
                rel: 0,
                modestbranding: 1,
                origin: location.origin,
                enablejsapi: 1
            },
            events: {
                onReady: function() {
                    isReady = true;
                    clearTimeout(fallbackTimer);
                    const fb = document.getElementById('animatedCourseFallback');
                    const iframe = document.getElementById('animatedCourseFrame');
                    if (fb) fb.style.display = 'none';
                    if (iframe) iframe.style.display = '';
                },
                onError: function() {
                    try {
                        const iframe = document.getElementById('animatedCourseFrame');
                        if (iframe && iframe.style) iframe.style.display = 'none';
                        const fb = document.getElementById('animatedCourseFallback');
                        if (fb) fb.style.display = '';
                    } catch(_) {}
                }
            }
        });
    } catch(_) {}
}

// Export critical functions immediately
function exportCriticalFunctions() {
    window.toggleMenu = toggleMenu;
    window.setLanguage = setLanguage;
    window.toggleLanguage = toggleLanguage;
    window.scrollToSection = scrollToSection;
    window.closeInstallPrompt = closeInstallPrompt;
    window.openRidersModal = openRidersModal;
    window.closeRidersModal = closeRidersModal;
    window.openMapModal = openMapModal;
    window.closeMapModal = closeMapModal;
    window.openTransportModal = openTransportModal;
    window.closeTransportModal = closeTransportModal;
    window.openWatchModal = openWatchModal;
    window.closeWatchModal = closeWatchModal;
    window.openPrivacyModal = openPrivacyModal;
    window.closePrivacyModal = closePrivacyModal;
    window.openTermsModal = openTermsModal;
    window.closeTermsModal = closeTermsModal;
}

// Image performance optimizer (skip jerseys)
function optimizeImagesPerformance() {
    try {
        const isJersey = (src) => /\/images\/jerseys\//.test(src || '');
        // 1) Global lazy load for images except above-the-fold and jerseys
        document.querySelectorAll('img').forEach((img) => {
            const src = img.getAttribute('src') || '';
            if (isJersey(src)) return; // ne pas toucher aux maillots
            // Lazy-load si pas déjà défini et pas critique
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            // Décodage asynchrone
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
        });

        // 2) Prioriser certaines images clés
        const prioritize = [
            '#mapModalImage',            // Voir la carte
            '#watchModalImage',          // Meilleures zones spectateur
            '#auctionBigboxImage',       // Encan silencieux
            '#edikaBigboxImage',         // Concours Edika
            '#ekoiBigboxImage',          // Concours EKOI
            '#shopBigboxImage'           // Boutique
        ];
        prioritize.forEach((sel) => {
            const el = document.querySelector(sel);
            if (el) {
                el.setAttribute('loading', 'eager');
                el.setAttribute('fetchpriority', 'high');
                el.setAttribute('decoding', 'async');
            }
        });
    } catch (_) {}
}

// Prefer WebP with graceful fallback to PNG/JPG (and optional secondary fallback)
function toWebpUrl(originalUrl) {
    try {
        const qIndex = originalUrl.indexOf('?');
        const base = qIndex >= 0 ? originalUrl.slice(0, qIndex) : originalUrl;
        const query = qIndex >= 0 ? originalUrl.slice(qIndex) : '';
        const webpBase = base.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        return webpBase + query;
    } catch (_) {
        return originalUrl;
    }
}

function preferWebpThenFallback(img, primaryFallbackSrc, secondaryFallbackSrc) {
    if (!img || !primaryFallbackSrc) return;
    const webpSrc = toWebpUrl(primaryFallbackSrc);
    let step = 0; // 0: try webp, 1: try primary fallback, 2: try secondary fallback
    img.onerror = function() {
        if (step === 0) {
            step = 1;
            img.onerror = arguments.callee;
            img.src = primaryFallbackSrc;
            return;
        }
        if (step === 1 && secondaryFallbackSrc) {
            step = 2;
            img.onerror = function(){ img.style.display = 'none'; };
            img.src = secondaryFallbackSrc;
            return;
        }
        img.onerror = null;
        img.style.display = 'none';
    };
    img.src = webpSrc;
}

function applyWebpFallbacks() {
    try {
        // Header logo
        const headerLogo = document.querySelector('.logo-container img.logo');
        if (headerLogo) {
            const png = headerLogo.getAttribute('src') || 'images/logos/new logo.png';
            preferWebpThenFallback(headerLogo, png);
        }

        // Footer logo
        const footerLogo = document.querySelector('.footer-logo img');
        if (footerLogo) {
            const png = footerLogo.getAttribute('src') || 'images/logos/new logo.png';
            preferWebpThenFallback(footerLogo, png);
        }

        // Hero background: attempt to use WebP if available
        const hero = document.querySelector('.hero');
        if (hero) {
            const test = new Image();
            test.onload = function() {
                hero.style.backgroundImage = "url('images/hero.webp')";
            };
            test.src = 'images/hero.webp';
        }
    } catch(_) {}
}

// Mobile-optimized loader hiding
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        // Use CSS transition for better performance
        loader.style.opacity = '0';
        setTimeout(() => {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 300);
    }
}


function initHeroButtons() {
    const buttons = document.querySelectorAll('.quick-actions button');
    buttons.forEach(btn => {
        if (btn.textContent.includes('parcours') || btn.textContent.includes('Course')) {
            btn.onclick = (e) => smoothScrollToSection(e, 'map');
        } else if (btn.textContent.includes('Partants') || btn.textContent.includes('Riders')) {
            btn.onclick = (e) => smoothScrollToSection(e, 'riders');
        } else if (
            btn.textContent.includes('Diffusion') ||
            btn.textContent.includes('Webdiffusion') ||
            btn.textContent.includes('Broadcast') ||
            btn.querySelector('[data-lang="diffusionCta"]')
        ) {
            btn.onclick = (e) => smoothScrollToSection(e, 'broadcast');
        }
    });
}

function initModalBindings() {
    const ridersCard = document.querySelector('button.riders-card');
    if (ridersCard) {
        addSafeTapListener(ridersCard, openRidersModal);
    }

    const mapButtons = document.querySelectorAll('#map .map-actions button');
    mapButtons.forEach(btn => {
        if (btn.textContent.includes('carte') || btn.querySelector('[data-lang="viewMap"]')) {
            addSafeTapListener(btn, openMapModal);
        } else if (btn.textContent.includes('rendre') || btn.querySelector('[data-lang="getThereShort"]')) {
            addSafeTapListener(btn, openTransportModal);
        } else if (btn.textContent.includes('regarder') || btn.querySelector('[data-lang="whereToWatch"]')) {
            addSafeTapListener(btn, openWatchModal);
        }
    });

    // Ensure Fan Village CTA opens the transport modal (works even if inline handlers are blocked)
    const fvButtons = document.querySelectorAll('.getting-there-btn');
    fvButtons.forEach(btn => addSafeTapListener(btn, openTransportModal));

    // Footer links: privacy and terms
    const privacyLink = document.querySelector('.footer-links [data-lang="privacy"]');
    const termsLink = document.querySelector('.footer-links [data-lang="terms"]');
    if (privacyLink) {
        privacyLink.addEventListener('click', function(e){ e.preventDefault(); openPrivacyModal(); }, { passive: false });
    }
    if (termsLink) {
        termsLink.addEventListener('click', function(e){ e.preventDefault(); openTermsModal(); }, { passive: false });
    }
}

// Initialize broadcast CTAs to open app or store
function initBroadcastCtas() {
    try {
        const broadcastAppBtn = document.getElementById('broadcastAppBtn');
        if (broadcastAppBtn) {
            broadcastAppBtn.addEventListener('click', function(e) {
                e.preventDefault();
                openBroadcastApp(e);
            }, { passive: false });
        }
    } catch(_) {}
}

function getPlatform() {
    const ua = navigator.userAgent || navigator.vendor || window.opera || '';
    if (/android/i.test(ua)) return 'android';
    if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
    return 'other';
}

function openAppOrStore(appKey) {
    const platform = getPlatform();
    const targets = {
        tva: {
            ios: {
                storeDeep: 'itms-apps://itunes.apple.com/app/id909307725',
                storeWeb: 'https://apps.apple.com/ca/app/tva-sports/id909307725'
            },
            android: {
                // Package name best-known; fallback to website if region-restricted
                storeWeb: 'https://play.google.com/store/apps/details?id=com.nurun.tva_sports',
                alt: 'https://www.tvasports.ca/application'
            },
            other: {
                web: 'https://www.tvasports.ca/application'
            }
        },
        cbc: {
            ios: {
                storeDeep: 'itms-apps://itunes.apple.com/app/id422191503',
                storeWeb: 'https://apps.apple.com/ca/app/cbc-gem-shows-live-tv/id422191503'
            },
            android: {
                storeWeb: 'https://play.google.com/store/apps/details?id=ca.cbc.android.cbctv'
            },
            other: {
                web: 'https://gem.cbc.ca/'
            }
        }
    };

    const conf = targets[appKey] || targets.tva;
    if (platform === 'ios') {
        // Try deep App Store link; if blocked, fall back to web URL shortly after
        const timer = setTimeout(() => {
            window.location.href = (conf.ios && conf.ios.storeWeb) || conf.other?.web || '/';
        }, 1200);
        try {
            window.location.href = conf.ios && (conf.ios.storeDeep || conf.ios.storeWeb);
        } finally {
            setTimeout(() => clearTimeout(timer), 1800);
        }
    } else if (platform === 'android') {
        // Direct to Play Store web URL (works in most browsers). If region restricted, use alt.
        const play = conf.android && conf.android.storeWeb;
        window.location.href = play || conf.android?.alt || conf.other?.web || '/';
    } else {
        // Desktop or unknown: open landing page
        window.open((conf.other && conf.other.web) || conf.ios?.storeWeb || conf.android?.storeWeb || '/', '_blank', 'noopener');
    }
}

function smoothScrollToSection(e, sectionId) {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 0;
    const targetY = section.getBoundingClientRect().top + window.scrollY - headerHeight - 10;
    window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
    return false;
}

// Fallback: masquer le loader même si une erreur JS empêche l'init
function hideLoaderFallback() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove && loader.remove(), 350);
    }
}

// Si tout s'est bien passé, initializeApp masque déjà le loader.
// Sinon, on force un fallback après le chargement de la page.
window.addEventListener('load', () => {
    setTimeout(hideLoaderFallback, 2500);
});

// Riders modal controls
function openRidersModal() {
    if (window.RidersModal && typeof window.RidersModal.open === 'function') {
        window.RidersModal.open();
    } else {
        const m = document.getElementById('ridersModal');
        if (!m) return;
        m.style.display = 'block';
    }
}

// Map modal controls
function openMapModal() {
    const m = document.getElementById('mapModal');
    if (!m) return;
    // Swap map image by language
    try {
        const img = document.getElementById('mapModalImage');
        if (img) {
            const frMap = 'images/225318-gpcq_parcours_fr_(13-06-25).png';
            const enMap = 'images/225318-gpcq_parcours-en (13-06-25).png';
            const desired = currentLanguage === 'en' ? enMap : frMap;
            if (img.getAttribute('src') !== desired) {
                img.setAttribute('src', desired);
            }
            let attemptedFallback = false;
            img.onerror = function() {
                const alt = desired === frMap ? enMap : frMap;
                if (!attemptedFallback && img.getAttribute('src') !== alt) {
                    attemptedFallback = true;
                    img.setAttribute('src', alt);
                } else {
                    img.style.display = 'none';
                }
            };
            img.style.display = '';
        }
    } catch(_){}
    m.classList.remove('hidden');
    const closeBtn = m.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.focus();
        closeBtn.addEventListener('click', closeMapModal, { passive: true });
        closeBtn.addEventListener('touchend', function(e){ e.preventDefault(); closeMapModal(); }, { passive: false });
    }
    document.addEventListener('keydown', handleModalKey, { once: true });
}

function closeMapModal() {
    const m = document.getElementById('mapModal');
    if (!m) return;
    m.classList.add('hidden');
}

function closeRidersModal() {
    if (window.RidersModal && typeof window.RidersModal.close === 'function') {
        window.RidersModal.close();
    } else {
        const m = document.getElementById('ridersModal');
        if (!m) return;
        m.style.display = 'none';
    }
}

function handleModalKey(e) {
    if (e.key === 'Escape') {
        closeRidersModal();
        closeMapModal();
        closeTransportModal();
        closeWatchModal();
        closePrivacyModal();
        closeTermsModal();
    }
}

// Transport modal controls
function openTransportModal() {
    const m = document.getElementById('transportModal');
    if (!m) return;
    m.classList.remove('hidden');
    // Ensure the embedded Google My Maps iframe is initialized when the modal becomes visible
    const transportMapFrame = document.getElementById('transportMapFrame');
    if (transportMapFrame && (!transportMapFrame.getAttribute('src') || transportMapFrame.getAttribute('src') === '')) {
        transportMapFrame.setAttribute('src', buildTransportMapEmbedUrl());
    }
    const closeBtn = m.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.focus();
        closeBtn.addEventListener('click', closeTransportModal, { passive: true });
        closeBtn.addEventListener('touchend', function(e){ e.preventDefault(); closeTransportModal(); }, { passive: false });
    }
    document.addEventListener('keydown', handleModalKey, { once: true });

    // Toggle bilingual content blocks within the modal
    try {
        const showFr = currentLanguage === 'fr';
        document.querySelectorAll('#transportModal .transport-content.lang-fr').forEach(el => { el.style.display = showFr ? '' : 'none'; });
        document.querySelectorAll('#transportModal .transport-content.lang-en').forEach(el => { el.style.display = showFr ? 'none' : ''; });
    } catch(_) {}
}

function closeTransportModal() {
    const m = document.getElementById('transportModal');
    if (!m) return;
    m.classList.add('hidden');
}

// Watch modal controls
function openWatchModal() {
    const m = document.getElementById('watchModal');
    if (!m) return;
    const img = document.getElementById('watchModalImage');
    if (img) {
        const frWatch = 'images/meilleurs_endroits_qc_fr.png';
        const enWatch = 'images/meilleurs_endroits_qc_en.png';
        const desiredSrc = currentLanguage === 'en' ? enWatch : frWatch;
        if (img.getAttribute('src') !== desiredSrc) {
            img.setAttribute('src', desiredSrc);
        }
        img.onerror = function() {
            const alt = desiredSrc === frWatch ? enWatch : frWatch;
            if (img.getAttribute('src') !== alt) {
                img.setAttribute('src', alt);
            } else {
                img.style.display = 'none';
            }
        };
        img.style.display = '';
    }
    m.classList.remove('hidden');
    const closeBtn = m.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.focus();
        closeBtn.addEventListener('click', closeWatchModal, { passive: true });
        closeBtn.addEventListener('touchend', function(e){ e.preventDefault(); closeWatchModal(); }, { passive: false });
    }
    document.addEventListener('keydown', handleModalKey, { once: true });
}

function closeWatchModal() {
    const m = document.getElementById('watchModal');
    if (!m) return;
    m.classList.add('hidden');
}

// Build localized Google My Maps embed URL for the transport modal map
function buildTransportMapEmbedUrl() {
    const myMapsId = '1l3I9ifzLOA-lPHAY6dwMaDKs3oF4Iwo';
    const languageCode = currentLanguage === 'fr' ? 'fr' : 'en';
    // Using the My Maps embed endpoint instead of the viewer for reliable embedding
    const baseUrl = 'https://www.google.com/maps/d/u/0/embed';
    const urlParams = new URLSearchParams({ mid: myMapsId, hl: languageCode });
    // Center on Start/Finish (George VI Avenue, Quebec City)
    urlParams.set('ll', '46.804965,-71.215102');
    urlParams.set('z', '14');
    return baseUrl + '?' + urlParams.toString();
}

// Legal modals controls
function openPrivacyModal() {
    const modal = document.getElementById('privacyModal');
    if (!modal) return;
    // Load PDF into iframe once to avoid duplicate loads
    const frame = document.getElementById('privacyPdfFrame');
    if (frame && (!frame.src || frame.src === '')) {
        frame.src = encodeURI('Textes légaux GPCQM - Confidentialité et Conditions.pdf');
    }
    modal.classList.remove('hidden');
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.focus();
        closeBtn.addEventListener('click', closePrivacyModal, { passive: true });
        closeBtn.addEventListener('touchend', function(e){ e.preventDefault(); closePrivacyModal(); }, { passive: false });
    }
    document.addEventListener('keydown', handleModalKey, { once: true });
}

function closePrivacyModal() {
    const modal = document.getElementById('privacyModal');
    if (!modal) return;
    modal.classList.add('hidden');
}

function openTermsModal() {
    const modal = document.getElementById('termsModal');
    if (!modal) return;
    const frame = document.getElementById('termsPdfFrame');
    if (frame && (!frame.src || frame.src === '')) {
        frame.src = encodeURI('Textes légaux GPCQM - Confidentialité et Conditions.pdf');
    }
    modal.classList.remove('hidden');
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.focus();
        closeBtn.addEventListener('click', closeTermsModal, { passive: true });
        closeBtn.addEventListener('touchend', function(e){ e.preventDefault(); closeTermsModal(); }, { passive: false });
    }
    document.addEventListener('keydown', handleModalKey, { once: true });
}

function closeTermsModal() {
    const modal = document.getElementById('termsModal');
    if (!modal) return;
    modal.classList.add('hidden');
}

// Menu Toggle - Mobile Optimized
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const menuButton = document.querySelector('.menu-toggle');
    
    if (menu) {
        const isActive = menu.classList.contains('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
        
        // Update aria-expanded for accessibility
        if (menuButton) {
            menuButton.setAttribute('aria-expanded', (!isActive).toString());
        }
    }
}

function initMobileMenuTouch() {
    const menuButton = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close');
    
    if (menuButton) {
        // Remove inline handler to avoid double toggle
        try { menuButton.removeAttribute('onclick'); } catch (e) {}
        // Add touch event listener for menu button
        addSafeTapListener(menuButton, toggleMenu);
    }
    
    const menuCloseBtn = document.getElementById('menuCloseBtn');
    if (menuCloseBtn) {
        // Add touch event listener for close button
        addSafeTapListener(menuCloseBtn, toggleMenu);
    }
    
    const menuOverlay = document.getElementById('menuOverlay');
    if (menuOverlay) {
        // Close menu when clicking/touching the overlay
        addSafeTapListener(menuOverlay, toggleMenu);
    }

    // Close menu when clicking any menu link (avoid inline onclick conflicts)
    const menuLinks = document.querySelectorAll('.menu-links a');
    if (menuLinks && menuLinks.length) {
        menuLinks.forEach((link) => {
            try { link.removeAttribute('onclick'); } catch (e) {}
            link.addEventListener('click', () => {
                const menu = document.getElementById('mobileMenu');
                if (menu && menu.classList.contains('active')) {
                    toggleMenu();
                }
            }, { passive: true });
        });
    }
}

// Toggle Language
function toggleLanguage() {
    const newLang = currentLanguage === 'fr' ? 'en' : 'fr';
    setLanguage(newLang);
}

// Set Language
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updateLanguage();
    if (typeof updateWeatherLanguage === 'function') {
        updateWeatherLanguage();
    }
    // Only close menu if it's open
    const menu = document.getElementById('mobileMenu');
    if (menu && menu.classList.contains('active')) {
        toggleMenu();
    }
    
    // Track language change
    if (typeof gtag !== 'undefined') {
        gtag('event', 'language_change', {
            language: lang
        });
    }
    // Réappliquer la logique iOS poster/iframe lors d'un changement de langue
    initVimeoAnimatedCourse();
}

// Update Language
function updateLanguage() {
    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    // Update placeholders for inputs with data-lang-placeholder
    document.querySelectorAll('[data-lang-placeholder]').forEach(input => {
        const key = input.getAttribute('data-lang-placeholder');
        if (translations[currentLanguage][key]) {
            input.setAttribute('placeholder', translations[currentLanguage][key]);
        }
    });
    
    // Update auction image and links based on language - FIXED VERSION
    const auctionImage = document.getElementById('auctionBigboxImage');
    const auctionImageLink = document.getElementById('auctionImageLink');
    const auctionButtonLink = document.getElementById('auctionButtonLink');
    
    if (auctionImage) {
        const imageNamePrimary = currentLanguage === 'en' ? 'encan_EN_2025.png' : 'encan_FR_2025.png';
        const imageNameFallback = currentLanguage === 'en' ? 'encan_EN.png' : 'encan_FR.png';
        const version = '5.0';  // Incremented version to force refresh
        const ts = Date.now();
        
        // Set the correct image source
        const newSrc = `images/${imageNamePrimary}?v=${version}&t=${ts}`;
        auctionImage.src = newSrc;
        auctionImage.alt = currentLanguage === 'en' ? 'Silent Auction' : 'Encan silencieux';
        
        // Setup fallback on error
        auctionImage.onerror = function() {
            console.log('Auction image failed to load:', newSrc);
            this.onerror = null;  // Prevent infinite loop
            this.src = `images/${imageNameFallback}?v=${version}&t=${ts}`;
        };
    }
    
    // Update auction links based on language
    const auctionUrl = currentLanguage === 'en' ? 
        'https://www.zeffy.com/en-CA/ticketing/encan-silencieux-3' : 
        'https://www.zeffy.com/fr-CA/ticketing/encan-silencieux-3';
    
    if (auctionImageLink) {
        auctionImageLink.href = auctionUrl;
    }
    if (auctionButtonLink) {
        auctionButtonLink.href = auctionUrl;
    }
    
    // Update course map image based on language
    const mapModalImage = document.getElementById('mapModalImage');
    if (mapModalImage) {
        const mapImageName = currentLanguage === 'en' ? 
            '225318-gpcq_parcours-en (13-06-25).png' : 
            '225318-gpcq_parcours_fr_(13-06-25).png';
        mapModalImage.src = `images/${mapImageName}`;
        mapModalImage.alt = currentLanguage === 'en' ? 'GPCQ 2025 Course' : 'Parcours GPCQ 2025';
    }
    
    // Update course access map image based on language
    const courseMapImage = document.getElementById('courseMapImage');
    if (courseMapImage) {
        const courseImageName = currentLanguage === 'en' ? 
            'GPC-11938-CarteGPC-2025_QC-EN_VF_FINAL_Parcours ajusté.png' : 
            'GPC-11938-CarteGPC-2025_QC-FR_VF_FINAL_Parcours ajusté.png';
        const encodedUrl = `images/${encodeURIComponent(courseImageName)}`;
        console.log('Updating course map:', encodedUrl);
        courseMapImage.src = encodedUrl;
        courseMapImage.alt = currentLanguage === 'en' ? 'Site Access Map' : 'Plan d\'accès au site';
    }
    
    // Toggle bilingual legal content visibility in modals
    try {
        const showFr = currentLanguage === 'fr';
        document.querySelectorAll('.legal-content.lang-fr').forEach(el => { el.style.display = showFr ? '' : 'none'; });
        document.querySelectorAll('.legal-content.lang-en').forEach(el => { el.style.display = showFr ? 'none' : ''; });
    } catch (e) { /* no-op */ }

    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage;
    
    // Update language toggle button text
    const langToggleText = document.getElementById('langToggleText');
    if (langToggleText) {
        langToggleText.textContent = currentLanguage === 'fr' ? 'Eng' : 'Fr';
    }

    // Highlight specific phrase for Quebec results (FR only)
    const quebecTitle = document.querySelector('h2[data-lang="quebecResults"]');
    if (quebecTitle && currentLanguage === 'fr') {
        const fullText = translations.fr.quebecResults;
        const targetPhrase = 'Grand Prix Cycliste de Québec';
        quebecTitle.innerHTML = fullText.replace(
            targetPhrase,
            '<span class="quebec-highlight">' + targetPhrase + '</span>'
        );
    }

    // Highlight specific phrase for Riders List title (FR and EN)
    const ridersTitle = document.querySelector('.race-status h2[data-lang="ridersList"]');
    if (ridersTitle) {
        if (currentLanguage === 'fr') {
            const fullTextRiders = translations.fr.ridersList;
            const ridersPhrase = 'Liste des Partants';
            ridersTitle.innerHTML = fullTextRiders.replace(
                ridersPhrase,
                '<span class="riders-highlight">' + ridersPhrase + '</span>'
            );
        } else if (currentLanguage === 'en') {
            const fullTextRidersEn = translations.en.ridersList;
            const ridersPhraseEn = 'Riders List';
            ridersTitle.innerHTML = fullTextRidersEn.replace(
                ridersPhraseEn,
                '<span class="riders-highlight">' + ridersPhraseEn + '</span>'
            );
        }
    }
    
    // Update elevation value per language (FR uses space thousands, EN uses comma)
    try {
        const elevationValue = document.querySelector('.stat-card-4 .stat-value');
        if (elevationValue) {
            elevationValue.textContent = currentLanguage === 'en' ? '4,573 m' : '2 610 m';
        }
    } catch (_) {}

    // Update shop bigbox image per language with safe fallback
    const shopImg = document.getElementById('shopBigboxImage');
    if (shopImg) {
        const frSrc = 'images/bannieres web - boutique_boutique-bigbox-fr_qc.png';
        const enSrc = 'images/bannieres web - boutique_boutique-bigbox-en_qc.png';
        const desired = currentLanguage === 'en' ? enSrc : frSrc;
        if (shopImg.getAttribute('src') !== desired) {
            shopImg.setAttribute('src', desired);
        }
        // Ensure a working fallback if an asset fails to load
        shopImg.onerror = function() {
            // Try the other language as a quick fallback
            const alt = desired === frSrc ? enSrc : frSrc;
            if (shopImg.getAttribute('src') !== alt) {
                shopImg.setAttribute('src', alt);
            } else {
                // As a last resort, hide the image container to avoid broken UI
                const container = shopImg.closest('.shop-bigbox');
                if (container) container.style.display = 'none';
            }
        };
    }

    // Update animated course video (Vimeo) per language
    try {
        const frame = document.getElementById('animatedCourseFrame');
        const link = document.getElementById('animatedCourseLink');
        const fb = document.getElementById('animatedCourseFallback');
        if (frame) {
            const vimeoEmbed = 'https://player.vimeo.com/video/1093211409';
            const vimeoWatch = 'https://vimeo.com/1093211409';
            if (frame.getAttribute('src') !== vimeoEmbed) {
                frame.setAttribute('src', vimeoEmbed);
            }
            // link/fallback removed in HTML
            // show fallback if frame errors
            let triedAlt = false;
            frame.onerror = function() {
                if (fb) fb.style.display = '';
                // Try reload once to handle transient failures
                if (!triedAlt) {
                    triedAlt = true;
                    frame.setAttribute('src', vimeoEmbed);
                }
            };
            // Do not hide fallback here; wait for onload
        }
    } catch(_) {}

    // Update EKOI contest bigbox image per language with safe fallback
    const ekoiImg = document.getElementById('ekoiBigboxImage');
    const ekoiImageLink = document.getElementById('ekoiImageLink');
    const ekoiButtonLink = document.getElementById('ekoiButtonLink');
    if (ekoiImg) {
        const frEkoiSrc = 'images/concours_ekoi_fr.jpg';
        const enEkoiSrc = 'images/concours_ekoi_en.jpg';
        const frEkoiUrl = 'https://www.ekoi.com/fr-ca/content/1267-jeu-concours-ekoi-grand-prix-cyclistes-de-quebec-et-de-montreal?utm_source=ban-grand-prix-quebec&utm_medium=ban&utm_campaign=ads-grand-prix-quebec-jc-0925&utm_id=ads-grand-prix-quebec-jc';
        const enEkoiUrl = 'https://www.ekoi.com/en-ca/content/1267-contest-game-ekoi-grand-prix-cyclists-of-quebec-and-montreal?utm_source=ban-grand-prix-quebec&utm_medium=ban&utm_campaign=ads-grand-prix-quebec-jc-0925&utm_id=ads-grand-prix-quebec-jc';
        const desiredEkoi = currentLanguage === 'en' ? enEkoiSrc : frEkoiSrc;
        if (ekoiImg.getAttribute('src') !== desiredEkoi) {
            ekoiImg.setAttribute('src', desiredEkoi);
        }
        if (ekoiImageLink) ekoiImageLink.href = currentLanguage === 'en' ? enEkoiUrl : frEkoiUrl;
        if (ekoiButtonLink) ekoiButtonLink.href = currentLanguage === 'en' ? enEkoiUrl : frEkoiUrl;
        ekoiImg.onerror = function() {
            const altEkoi = desiredEkoi === frEkoiSrc ? enEkoiSrc : frEkoiSrc;
            if (ekoiImg.getAttribute('src') !== altEkoi) {
                ekoiImg.setAttribute('src', altEkoi);
            } else {
                const container = ekoiImg.closest('.edika-bigbox');
                if (container) container.style.display = 'none';
            }
        };
    }

    // Update Edika contest bigbox image per language with safe fallback
    const edikaImg = document.getElementById('edikaBigboxImage');
    if (edikaImg) {
        const frEdikaSrc = 'images/concoursedika__300x250-fr.png';
        const enEdikaSrc = 'images/concoursedika__300x250-en.png';
        const desiredEdika = currentLanguage === 'en' ? enEdikaSrc : frEdikaSrc;
        if (edikaImg.getAttribute('src') !== desiredEdika) {
            edikaImg.setAttribute('src', desiredEdika);
        }
        edikaImg.onerror = function() {
            const altEdika = desiredEdika === frEdikaSrc ? enEdikaSrc : frEdikaSrc;
            if (edikaImg.getAttribute('src') !== altEdika) {
                edikaImg.setAttribute('src', altEdika);
            } else {
                const container = edikaImg.closest('.edika-bigbox');
                if (container) container.style.display = 'none';
            }
        };
    }

    // REMOVED - Duplicate auction image handling code that was overriding the correct language-based logic above
}

// Smooth Scroll
function initSmoothScroll() {
    // Intercepter les clics d'ancre pour appliquer un offset lié au header sticky
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const id = href.slice(1);
            const target = document.getElementById(id);
            if (target) {
                e.preventDefault();
                smoothScrollWithOffset(target);
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'navigation', { nav_target: href });
                }
            }
        });
    });

    // Si la page se charge avec un hash, réaligner avec offset après rendu
    if (location.hash && location.hash.length > 1) {
        const id = decodeURIComponent(location.hash.slice(1));
        const target = document.getElementById(id);
        if (target) {
            setTimeout(() => smoothScrollWithOffset(target, 0), 0);
        }
    }
}

// Scroll to Section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    smoothScrollWithOffset(section);
    // Track scroll action
    if (typeof gtag !== 'undefined') {
        gtag('event', 'scroll_to_section', { section: sectionId });
    }
}

// Défilement avec offset pour header sticky
function smoothScrollWithOffset(targetElement, extraOffset = 8) {
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 0;
    const targetY = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - extraOffset;
    window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
}

// Online/Offline Status
function updateOnlineStatus() {
    const offlineIndicator = document.getElementById('offlineIndicator');
    if (offlineIndicator) {
        if (navigator.onLine) {
            offlineIndicator.classList.add('hidden');
            // Reload dynamic content if coming back online
            loadWeather();
            
        } else {
            offlineIndicator.classList.remove('hidden');
        }
    }
}

// Initialize PWA Install Prompts
function initPWAInstallPrompts() {
    const installCloseBtn = document.querySelector('.install-close');
    const iosInstallCloseBtn = document.querySelector('.ios-install-close');
    
    if (installCloseBtn) {
        installCloseBtn.addEventListener('click', function() {
            const prompt = document.getElementById('installPrompt');
            if (prompt) {
                prompt.classList.add('hidden');
            }
        });
    }
    
    if (iosInstallCloseBtn) {
        iosInstallCloseBtn.addEventListener('click', function() {
            const prompt = document.getElementById('iosInstallPrompt');
            if (prompt) {
                prompt.classList.add('hidden');
                localStorage.setItem('iosInstallPromptDismissed', 'true');
                localStorage.setItem('iosInstallPromptDismissedTime', Date.now());
            }
        });
    }
    
    // Detect iOS Safari (exclude Chrome iOS) and show install prompt
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isSafari = /Safari\//.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
    const isInStandaloneMode = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    
    if (isIOS && isSafari && !isInStandaloneMode) {
        const iosPromptDismissed = localStorage.getItem('iosInstallPromptDismissed');
        const dismissedTime = localStorage.getItem('iosInstallPromptDismissedTime');
        const daysSinceDismissed = dismissedTime ? (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24) : 999;
        
        if (!iosPromptDismissed || daysSinceDismissed > 7) {
            setTimeout(() => {
                const iosPrompt = document.getElementById('iosInstallPrompt');
                if (iosPrompt) {
                    iosPrompt.classList.remove('hidden');
                }
            }, 5000);
        }
    }
}

// Close Install Prompt
function closeInstallPrompt() {
    const prompt = document.getElementById('installPrompt');
    if (prompt) {
        prompt.classList.add('hidden');
        localStorage.setItem('installPromptDismissed', 'true');
    }
}

// Broadcast App Links Function (TVA Sports FR / CBC Gem EN)
function openBroadcastApp(e) {
    if (e && e.preventDefault) e.preventDefault();

    const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isFrench = (currentLanguage || 'fr') === 'fr';

    // App deep links and store URLs
    const tvDeepLink = 'tvasports://';
    const tvAppStore = 'https://apps.apple.com/ca/app/tva-sports/id909307725';
    const tvPlayStore = 'https://play.google.com/store/apps/details?id=com.nurun.tva_sports';

    const gemDeepLink = 'cbcgem://';
    const gemAppStore = 'https://apps.apple.com/ca/app/cbc-gem-shows-live-tv/id422191503';
    const gemPlayStore = 'https://play.google.com/store/apps/details?id=ca.cbc.android.cbctv';

    const deepLink = isFrench ? tvDeepLink : gemDeepLink;
    const appStoreUrl = isFrench ? tvAppStore : gemAppStore;
    const playStoreUrl = isFrench ? tvPlayStore : gemPlayStore;

    // Aller directement vers l'App Store sans deep link
    if (isIOS) {
        window.open(appStoreUrl, '_blank', 'noopener');
    } else if (isAndroid) {
        window.open(playStoreUrl, '_blank', 'noopener');
    } else {
        // Desktop fallback: app landing pages
        window.open(isFrench ? 'https://www.tvasports.ca/application' : 'https://gem.cbc.ca/', '_blank', 'noopener');
    }
}

// Functions are now exported immediately in exportCriticalFunctions()

// Lazy load third-party content for mobile performance
if (navigator.onLine && !APP_CONFIG.isMobile) {
    // Only on desktop or fast connections
    (window.requestIdleCallback || ((cb) => setTimeout(cb, 2000)))(() => {
        if (typeof loadWeather === 'function') loadWeather();
        if (typeof loadInstagramFeed === 'function') loadInstagramFeed();
    });
} else if (navigator.onLine) {
    // Mobile: delay more for performance
    setTimeout(() => {
        if (typeof loadWeather === 'function') loadWeather();
    }, 1500);
    setTimeout(() => {
        if (typeof loadInstagramFeed === 'function') loadInstagramFeed();
    }, 3000);
}