// === GPCQM 2025 - Interactive Map ===

// Map configuration
const MAP_CONFIG = {
    initialZoom: 1,
    maxZoom: 3,
    minZoom: 0.5,
    zoomStep: 0.25,
    panSpeed: 1
};

// Map state
let mapState = {
    zoom: MAP_CONFIG.initialZoom,
    isDragging: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
    currentTransform: { x: 0, y: 0 }
};

// Hotspot information
const hotspotInfo = {
    start: {
        fr: {
            title: 'Ligne de Départ/Arrivée',
            content: 'Avenue du Parc - Point de départ et d\'arrivée de la course. Meilleur endroit pour voir le sprint final. Accès facile par métro (station Mont-Royal ou Laurier).'
        },
        en: {
            title: 'Start/Finish Line',
            content: 'Park Avenue - Start and finish point of the race. Best spot to see the final sprint. Easy access by metro (Mont-Royal or Laurier station).'
        }
    },
    climb: {
        fr: {
            title: 'Côte Camillien-Houde',
            content: 'Montée de 1,8 km - La principale difficulté du parcours. Pente moyenne de 8% avec des passages à 12%. Les coureurs passeront ici 17 fois!'
        },
        en: {
            title: 'Camillien-Houde Climb',
            content: '1.8 km climb - The main difficulty of the course. Average gradient of 8% with sections at 12%. Riders will pass here 17 times!'
        }
    },
    belvedere: {
        fr: {
            title: 'Belvédère Camillien-Houde',
            content: 'Zone d\'animation avec Red Bull, DJ et écran géant. Vue spectaculaire sur la course et la ville. Restauration disponible sur place.'
        },
        en: {
            title: 'Camillien-Houde Lookout',
            content: 'Entertainment zone with Red Bull, DJ and giant screen. Spectacular view of the race and the city. Food available on site.'
        }
    },
    fanvillage: {
        fr: {
            title: 'Village des Fans',
            content: 'Parc Jeanne-Mance - Animations, kiosques partenaires, zone familiale, restauration et boutique officielle. Entrée gratuite de 9h à 17h.'
        },
        en: {
            title: 'Fan Village',
            content: 'Jeanne-Mance Park - Entertainment, partner booths, family zone, food court and Official boutique GPCQM by Santini. Free entry from 9 AM to 5 PM.'
        }
    },
    parking: {
        fr: {
            title: 'Parc à vélos',
            content: 'Stationnement sécurisé et gratuit pour vélos au Parc Jeanne-Mance. Surveillé toute la journée. Capacité de 500 vélos.'
        },
        en: {
            title: 'Bike Park',
            content: 'Secure and free bike parking at Jeanne-Mance Park. Supervised all day. Capacity for 500 bikes.'
        }
    }
};

// Initialize map on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
});

// Initialize interactive map
function initializeMap() {
    const mapContainer = document.getElementById('mapContainer');
    const mapWrapper = document.querySelector('.map-wrapper');
    const courseMap = document.getElementById('courseMap');
    
    if (!mapContainer || !mapWrapper || !courseMap) return;
    
    // Set up hotspot interactions
    setupHotspots();
    
    // Set up map controls
    setupMapControls();
    
    // Set up touch/mouse interactions
    setupMapInteractions(mapWrapper, courseMap);
    
    // Set up keyboard navigation
    setupKeyboardNavigation(mapContainer, courseMap);
}

// Setup hotspot interactions
function setupHotspots() {
    const hotspots = document.querySelectorAll('.map-hotspot');
    
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', function(e) {
            e.stopPropagation();
            const infoKey = this.getAttribute('data-info');
            if (infoKey) {
                showPopup(infoKey);
                
                // Track hotspot click
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'map_hotspot_click', {
                        hotspot: infoKey
                    });
                }
            }
        });
        
        // Add hover effect for desktop
        hotspot.addEventListener('mouseenter', function() {
            this.querySelector('.hotspot-marker').style.transform = 'scale(1.2)';
        });
        
        hotspot.addEventListener('mouseleave', function() {
            this.querySelector('.hotspot-marker').style.transform = 'scale(1)';
        });
    });
}

// Show popup with information
function showPopup(infoKey) {
    const popup = document.getElementById('mapPopup');
    const popupTitle = document.getElementById('popupTitle');
    const popupContent = document.getElementById('popupContent');
    
    if (!popup || !popupTitle || !popupContent) return;
    
    const currentLang = localStorage.getItem('language') || 'fr';
    const info = hotspotInfo[infoKey];
    
    if (info && info[currentLang]) {
        popupTitle.textContent = info[currentLang].title;
        popupContent.textContent = info[currentLang].content;
        popup.classList.remove('hidden');
    }
}

// Close popup
function closePopup() {
    const popup = document.getElementById('mapPopup');
    if (popup) {
        popup.classList.add('hidden');
    }
}

// Setup map controls (zoom in/out/reset)
function setupMapControls() {
    // Zoom controls are defined as global functions
    window.zoomIn = function() {
        adjustZoom(MAP_CONFIG.zoomStep);
    };
    
    window.zoomOut = function() {
        adjustZoom(-MAP_CONFIG.zoomStep);
    };
    
    window.resetMap = function() {
        resetMapView();
    };
    
    window.closePopup = closePopup;
}

// Adjust zoom level
function adjustZoom(delta) {
    const courseMap = document.getElementById('courseMap');
    if (!courseMap) return;
    
    mapState.zoom = Math.max(MAP_CONFIG.minZoom, Math.min(MAP_CONFIG.maxZoom, mapState.zoom + delta));
    updateMapTransform(courseMap);
    
    // Track zoom action
    if (typeof gtag !== 'undefined') {
        gtag('event', 'map_zoom', {
            zoom_level: mapState.zoom,
            action: delta > 0 ? 'zoom_in' : 'zoom_out'
        });
    }
}

// Reset map view
function resetMapView() {
    const courseMap = document.getElementById('courseMap');
    if (!courseMap) return;
    
    mapState.zoom = MAP_CONFIG.initialZoom;
    mapState.currentTransform = { x: 0, y: 0 };
    updateMapTransform(courseMap);
    
    // Close any open popup
    closePopup();
}

// Update map transform
function updateMapTransform(mapElement) {
    const transform = `scale(${mapState.zoom}) translate(${mapState.currentTransform.x}px, ${mapState.currentTransform.y}px)`;
    mapElement.style.transform = transform;
}

// Setup touch and mouse interactions
function setupMapInteractions(wrapper, map) {
    let isPinching = false;
    let lastDistance = 0;
    
    // Mouse drag
    wrapper.addEventListener('mousedown', startDragging);
    wrapper.addEventListener('mousemove', drag);
    wrapper.addEventListener('mouseup', stopDragging);
    wrapper.addEventListener('mouseleave', stopDragging);
    
    // Touch drag
    wrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
    wrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
    wrapper.addEventListener('touchend', handleTouchEnd);
    
    // Mouse wheel zoom
    wrapper.addEventListener('wheel', handleWheel, { passive: false });
    
    function startDragging(e) {
        mapState.isDragging = true;
        wrapper.classList.add('dragging');
        mapState.startX = e.pageX - wrapper.offsetLeft;
        mapState.startY = e.pageY - wrapper.offsetTop;
        mapState.scrollLeft = wrapper.scrollLeft;
        mapState.scrollTop = wrapper.scrollTop;
    }
    
    function drag(e) {
        if (!mapState.isDragging) return;
        e.preventDefault();
        const x = e.pageX - wrapper.offsetLeft;
        const y = e.pageY - wrapper.offsetTop;
        const walkX = (x - mapState.startX) * MAP_CONFIG.panSpeed;
        const walkY = (y - mapState.startY) * MAP_CONFIG.panSpeed;
        wrapper.scrollLeft = mapState.scrollLeft - walkX;
        wrapper.scrollTop = mapState.scrollTop - walkY;
    }
    
    function stopDragging() {
        mapState.isDragging = false;
        wrapper.classList.remove('dragging');
    }
    
    function handleTouchStart(e) {
        if (e.touches.length === 1) {
            // Single touch - start dragging
            mapState.isDragging = true;
            mapState.startX = e.touches[0].pageX - wrapper.offsetLeft;
            mapState.startY = e.touches[0].pageY - wrapper.offsetTop;
            mapState.scrollLeft = wrapper.scrollLeft;
            mapState.scrollTop = wrapper.scrollTop;
        } else if (e.touches.length === 2) {
            // Two fingers - start pinch zoom
            isPinching = true;
            lastDistance = getDistance(e.touches[0], e.touches[1]);
        }
    }
    
    function handleTouchMove(e) {
        e.preventDefault();
        
        if (e.touches.length === 1 && mapState.isDragging) {
            // Single touch - drag
            const x = e.touches[0].pageX - wrapper.offsetLeft;
            const y = e.touches[0].pageY - wrapper.offsetTop;
            const walkX = (x - mapState.startX) * MAP_CONFIG.panSpeed;
            const walkY = (y - mapState.startY) * MAP_CONFIG.panSpeed;
            wrapper.scrollLeft = mapState.scrollLeft - walkX;
            wrapper.scrollTop = mapState.scrollTop - walkY;
        } else if (e.touches.length === 2 && isPinching) {
            // Two fingers - pinch zoom
            const currentDistance = getDistance(e.touches[0], e.touches[1]);
            const delta = currentDistance - lastDistance;
            
            if (Math.abs(delta) > 10) {
                adjustZoom(delta > 0 ? MAP_CONFIG.zoomStep : -MAP_CONFIG.zoomStep);
                lastDistance = currentDistance;
            }
        }
    }
    
    function handleTouchEnd(e) {
        if (e.touches.length === 0) {
            mapState.isDragging = false;
            isPinching = false;
        }
    }
    
    function handleWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -MAP_CONFIG.zoomStep : MAP_CONFIG.zoomStep;
        adjustZoom(delta);
    }
    
    function getDistance(touch1, touch2) {
        const dx = touch1.pageX - touch2.pageX;
        const dy = touch1.pageY - touch2.pageY;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

// Setup keyboard navigation
function setupKeyboardNavigation(container, map) {
    container.setAttribute('tabindex', '0');
    
    container.addEventListener('keydown', function(e) {
        const step = 20;
        let handled = false;
        
        switch(e.key) {
            case 'ArrowUp':
                container.scrollTop -= step;
                handled = true;
                break;
            case 'ArrowDown':
                container.scrollTop += step;
                handled = true;
                break;
            case 'ArrowLeft':
                container.scrollLeft -= step;
                handled = true;
                break;
            case 'ArrowRight':
                container.scrollLeft += step;
                handled = true;
                break;
            case '+':
            case '=':
                adjustZoom(MAP_CONFIG.zoomStep);
                handled = true;
                break;
            case '-':
            case '_':
                adjustZoom(-MAP_CONFIG.zoomStep);
                handled = true;
                break;
            case '0':
                resetMapView();
                handled = true;
                break;
            case 'Escape':
                closePopup();
                handled = true;
                break;
        }
        
        if (handled) {
            e.preventDefault();
        }
    });
}

// Add elevation profile data (for future enhancement)
const elevationProfile = {
    points: [
        { km: 0, elevation: 45 },
        { km: 1.5, elevation: 85 },
        { km: 3.3, elevation: 165 }, // Côte Camillien-Houde peak
        { km: 5, elevation: 95 },
        { km: 7, elevation: 75 },
        { km: 9, elevation: 110 },
        { km: 11, elevation: 60 },
        { km: 12.3, elevation: 45 } // Back to start
    ]
};

// Export functions
window.showMapPopup = showPopup;
window.closeMapPopup = closePopup;