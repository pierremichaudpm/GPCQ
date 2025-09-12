// === GPCQM 2025 - Countdown Timer ===

// Race schedule times (EDT - Eastern Daylight Time)
const RACE_SCHEDULE = {
    fanVillageOpening: '2025-09-12T09:30:00-04:00',
    teamPresentation: '2025-09-12T09:50:00-04:00',
    raceStart: '2025-09-12T11:00:00-04:00',
    raceFinish: '2025-09-12T16:05:00-04:00',
    ceremonies: '2025-09-12T16:25:00-04:00'
};

// Countdown intervals
let countdownIntervals = [];

// Initialize countdown on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initializeCountdowns();
    updateNextEvent();
});

// Initialize all countdowns
function initializeCountdowns() {
    // Main countdown to race start
    startCountdown('mainCountdown', RACE_SCHEDULE.raceStart);
    
    // Update timeline items
    updateTimelineStatus();
}

// Start a countdown timer
function startCountdown(elementId, targetDate) {
    const targetTime = new Date(targetDate).getTime();
    
    // Update immediately
    updateCountdownDisplay(elementId, targetTime);
    
    // Update every second
    const interval = setInterval(() => {
        updateCountdownDisplay(elementId, targetTime);
    }, 1000);
    
    countdownIntervals.push(interval);
}

// Update countdown display
function updateCountdownDisplay(elementId, targetTime) {
    const now = new Date().getTime();
    const distance = targetTime - now;
    
    // Get countdown container
    const container = document.getElementById(elementId);
    if (!container) return;
    
    // Update race status based on time
    updateRaceStatusByTime(distance);
    
    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Adjust separators and visibility (minimalist display)
    const items = container.querySelectorAll('.countdown-item');
    const currentLang = localStorage.getItem('language') || 'fr';
    if (items && items.length >= 4) {
        const dayItem = items[0];
        const hoursItem = items[1];
        const minutesItem = items[2];
        const secondsItem = items[3];

        // Separator after days -> "jours" | "days", others remain ':'
        if (dayItem) dayItem.setAttribute('data-sep', currentLang === 'fr' ? 'jours' : 'days');
        if (hoursItem) hoursItem.setAttribute('data-sep', ':');
        if (minutesItem) minutesItem.setAttribute('data-sep', ':');
        if (secondsItem) secondsItem.setAttribute('data-sep', '');

        // Hide days block when days <= 0 → show only HH:MM:SS
        if (dayItem) {
            if (days <= 0) {
                dayItem.classList.add('hidden');
            } else {
                dayItem.classList.remove('hidden');
            }
        }
    }
    
    // Update display
    const daysEl = container.querySelector('#days');
    const hoursEl = container.querySelector('#hours');
    const minutesEl = container.querySelector('#minutes');
    const secondsEl = container.querySelector('#seconds');
    
    if (distance > 0) {
        // Race hasn't started yet - show countdown
        container.style.display = 'flex';
        if (daysEl) daysEl.textContent = padZero(days);
        if (hoursEl) hoursEl.textContent = padZero(hours);
        if (minutesEl) minutesEl.textContent = padZero(minutes);
        if (secondsEl) secondsEl.textContent = padZero(seconds);
    } else if (distance > -5.5 * 60 * 60 * 1000) {
        // Race is ongoing - hide countdown
        container.style.display = 'none';
    } else {
        // Race is finished - hide countdown
        container.style.display = 'none';
    }
}

// Pad numbers with zero
function padZero(num) {
    return num < 10 ? '0' + num : num.toString();
}

// Update race status based on time distance
function updateRaceStatusByTime(distance) {
    if (distance > 0) {
        // Race hasn't started yet
        updateRaceStatus('upcoming');
    } else if (distance > -5.5 * 60 * 60 * 1000) {
        // Race is ongoing (within 5.5 hours after start)
        updateRaceStatus('live');
    } else {
        // Race is finished
        updateRaceStatus('finished');
    }
}

// Update race status badge
function updateRaceStatus(status) {
    const statusBadge = document.querySelector('.status-badge');
    if (!statusBadge) return;
    
    // Remove all status classes
    statusBadge.classList.remove('upcoming', 'live', 'finished');
    
    // Add new status class
    statusBadge.classList.add(status);
    
    // Update text based on language
    const statusTexts = {
        upcoming: { fr: 'À venir', en: 'Upcoming' },
        live: { fr: '🔴 En direct', en: '🔴 Live' },
        finished: { fr: 'Terminée', en: 'Finished' }
    };
    
    const currentLang = localStorage.getItem('language') || 'fr';
    statusBadge.textContent = statusTexts[status][currentLang];
    
    // Update countdown title based on status
    const countdownTitle = document.querySelector('.countdown-title');
    const countdownContainer = document.querySelector('.countdown-container');
    
    if (countdownTitle) {
        const titleTexts = {
            upcoming: { fr: 'Départ de la course dans :', en: 'Race starts in:' },
            live: { fr: 'Course en cours', en: 'Race in progress' },
            finished: { fr: 'Course terminée', en: 'Race finished' }
        };
        countdownTitle.textContent = titleTexts[status][currentLang];
        
        // Hide entire countdown container when not upcoming
        if (countdownContainer) {
            if (status === 'upcoming') {
                countdownContainer.style.display = 'block';
            } else {
                // Hide countdown container but keep the badge visible
                countdownContainer.style.display = 'none';
            }
        }
    }
    
    // Update race info message
    const raceInfo = document.getElementById('raceInfo');
    if (raceInfo) {
        if (status === 'live') {
            const infoTexts = {
                fr: 'Suivez la course en direct sur les réseaux sociaux #GPCQM',
                en: 'Follow the race live on social media #GPCQM'
            };
            raceInfo.textContent = infoTexts[currentLang];
            raceInfo.style.display = 'block';
        } else if (status === 'finished') {
            const infoTexts = {
                fr: 'Merci d\'avoir suivi la course !',
                en: 'Thank you for following the race!'
            };
            raceInfo.textContent = infoTexts[currentLang];
            raceInfo.style.display = 'block';
        } else {
            raceInfo.style.display = 'none';
        }
    }
    
    // Add animation for live status
    if (status === 'live') {
        statusBadge.style.animation = 'pulse 2s infinite';
        
        // Track live status (only once)
        if (!window.liveStatusTracked) {
            window.liveStatusTracked = true;
            if (typeof gtag !== 'undefined') {
                gtag('event', 'race_status_live', {
                    event_category: 'Race',
                    event_label: 'Race went live'
                });
            }
        }
    } else {
        statusBadge.style.animation = '';
    }
}

// Update next event display
function updateNextEvent() {
    const now = new Date().getTime();
    const nextEventEl = document.getElementById('nextEventName');
    const nextEventTimeEl = document.getElementById('nextEventTime');
    
    if (!nextEventEl || !nextEventTimeEl) return;
    
    // Find next event
    let nextEvent = null;
    let nextEventTime = null;
    
    for (const [eventKey, eventTime] of Object.entries(RACE_SCHEDULE)) {
        const eventTimestamp = new Date(eventTime).getTime();
        if (eventTimestamp > now) {
            nextEvent = eventKey;
            nextEventTime = eventTime;
            break;
        }
    }
    
    if (nextEvent) {
        // Get event name based on language
        const eventNames = {
            fanVillageOpening: { 
                fr: 'Ouverture du Village des Fans', 
                en: 'Fan Village Opening' 
            },
            teamPresentation: { 
                fr: 'Présentation des équipes', 
                en: 'Team Presentation' 
            },
            raceStart: { 
                fr: 'Départ du Grand Prix Cycliste de Québec', 
                en: 'Start of the Québec City Cycling Grand Prix' 
            },
            raceFinish: { 
                fr: 'Arrivée de la course', 
                en: 'Race Finish' 
            },
            ceremonies: { 
                fr: 'Cérémonies Protocolaires', 
                en: 'Award Ceremonies' 
            }
        };
        
        const currentLang = localStorage.getItem('language') || 'fr';
        nextEventEl.textContent = eventNames[nextEvent][currentLang];
        
        // Format time
        const eventDate = new Date(nextEventTime);
        const hours = eventDate.getHours();
        const minutes = eventDate.getMinutes();
        nextEventTimeEl.textContent = `${hours}h${minutes > 0 ? padZero(minutes) : '00'}`;
        
        // Start mini countdown to next event
        startMiniCountdown(nextEventTime);
    } else {
        // All events have passed
        const currentLang = localStorage.getItem('language') || 'fr';
        nextEventEl.textContent = currentLang === 'fr' ? 'Course terminée' : 'Race finished';
        nextEventTimeEl.textContent = '';
    }
}

// Mini countdown for next event
function startMiniCountdown(targetDate) {
    const targetTime = new Date(targetDate).getTime();
    
    const updateMini = () => {
        const now = new Date().getTime();
        const distance = targetTime - now;
        
        if (distance <= 0) {
            // Event has started, update to next one
            updateNextEvent();
        }
    };
    
    // Update every minute
    setInterval(updateMini, 60000);
}

// Update timeline status
function updateTimelineStatus() {
    const now = new Date().getTime();
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        const timeAttr = item.getAttribute('data-time');
        if (!timeAttr) return;
        
        // Parse time from data attribute
        const [hours, minutes] = timeAttr.split(':').map(t => parseInt(t));
        const eventDate = new Date('2025-09-12');
        eventDate.setHours(hours, minutes || 0, 0, 0);
        
        const eventTime = eventDate.getTime();
        
        if (now >= eventTime) {
            item.classList.add('completed');
        } else if (now >= eventTime - 30 * 60 * 1000) {
            // Within 30 minutes of event
            item.classList.add('upcoming');
        }
    });
}

// Clear all countdown intervals (cleanup)
function clearCountdowns() {
    countdownIntervals.forEach(interval => clearInterval(interval));
    countdownIntervals = [];
}

// Auto-refresh countdowns at midnight
function scheduleCountdownRefresh() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow - now;
    
    setTimeout(() => {
        clearCountdowns();
        initializeCountdowns();
        scheduleCountdownRefresh(); // Schedule next refresh
    }, msUntilMidnight);
}

// Start auto-refresh schedule
scheduleCountdownRefresh();

// Export functions if needed
window.updateRaceStatus = updateRaceStatus;
window.updateNextEvent = updateNextEvent;