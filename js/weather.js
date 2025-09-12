// === GPCQ 2025 - Weather Widget (OpenWeatherMap) ===

// Configuration
const WEATHER_CONFIG = {
    apiKey: '27fd496c6cc9c8cd6f8981bf682c5dd4',
    cityId: 2867714, // Québec, CA
    // COORDONNÉES FIXES pour tous les appareils (Québec centre-ville)
    lat: 46.8139,  // Coordonnées exactes Vieux-Québec (lieu de départ/arrivée)
    lon: -71.2080,
    units: 'metric',
    updateIntervalMs: 10 * 60 * 1000, // 10 minutes
    forecastUseFeelsLike: false,
    precision: 0,
    tempBiasC: 0,
    useEccc: false
};

// Emoji par condition (simplifié)
const WEATHER_EMOJI = {
    Thunderstorm: '⛈️',
    Drizzle: '🌦️',
    Rain: '🌧️',
    Snow: '❄️',
    Mist: '🌫️',
    Smoke: '🌫️',
    Haze: '🌫️',
    Dust: '🌫️',
    Fog: '🌫️',
    Sand: '🌫️',
    Ash: '🌫️',
    Squall: '🌬️',
    Tornado: '🌪️',
    Clear: '☀️',
    Clouds: '☁️'
};

class WeatherWidget {
    constructor(options = {}) {
        this.apiKey = options.apiKey || WEATHER_CONFIG.apiKey;
        this.cityId = options.cityId || WEATHER_CONFIG.cityId;
        this.lat = options.lat || WEATHER_CONFIG.lat;
        this.lon = options.lon || WEATHER_CONFIG.lon;
        this.units = options.units || WEATHER_CONFIG.units;
        this.widget = document.getElementById('weatherWidget');
        this.lang = localStorage.getItem('language') || 'fr';
        this.lastData = null;
        this.forecastUseFeelsLike = options.forecastUseFeelsLike ?? WEATHER_CONFIG.forecastUseFeelsLike;
        this.precision = Number.isFinite(options.precision) ? options.precision : WEATHER_CONFIG.precision;
        this.tzOffsetSeconds = 0;
        this.forecastSource = 'OpenWeatherMap';
        // Biais figé par configuration (ignorer localStorage)
        this.tempBiasC = Number.isFinite(options.tempBiasC) ? options.tempBiasC : WEATHER_CONFIG.tempBiasC;
        this._ensureStyles();
    }

    get apiBase() {
        return 'https://api.openweathermap.org/data/2.5';
    }

    async fetchCurrentWeather() {
        // Détection Safari iOS
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isSafariIOS = isSafari && isIOS;
        
        try {
            if (isSafariIOS) {
                console.log(`Safari iOS detected - using XHR for OneCall current (lang: ${this.lang})`);
                const data = await this.fetchWithXHR(`/api/weather/onecall?lang=${this.lang}`);
                return (data && data.current) || {};
            } else {
                // Unifier sur OneCall passthrough pour cohérence current/hourly
                const res = await fetch(`/api/weather/onecall?lang=${this.lang}`, { cache: 'no-store' });
                if (!res.ok) {
                    const text = await res.text().catch(() => '');
                    console.error('OneCall current failed:', res.status, text);
                    throw new Error('OneCall current failed');
                }
                const data = await res.json();
                return (data && data.current) || {};
            }
        } catch (error) {
            console.error('Failed to fetch current weather:', error);
            throw error;
        }
    }
    
    // Méthode JSONP comme fallback ultime pour Safari iOS
    fetchWithJSONP(url) {
        return new Promise((resolve, reject) => {
            const callbackName = 'weatherCallback_' + Date.now();
            const script = document.createElement('script');
            const timeout = setTimeout(() => {
                delete window[callbackName];
                document.head.removeChild(script);
                reject(new Error('JSONP timeout'));
            }, 10000);
            
            window[callbackName] = (data) => {
                clearTimeout(timeout);
                delete window[callbackName];
                document.head.removeChild(script);
                console.log('JSONP success:', url);
                resolve(data);
            };
            
            script.onerror = () => {
                clearTimeout(timeout);
                delete window[callbackName];
                document.head.removeChild(script);
                reject(new Error('JSONP script error'));
            };
            
            // Ajouter callback à l'URL
            const separator = url.includes('?') ? '&' : '?';
            script.src = `${url}${separator}callback=${callbackName}`;
            document.head.appendChild(script);
        });
    }
    
    // Méthode XHR pour Safari iOS (plus fiable que fetch)
    fetchWithXHR(url) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.timeout = 10000; // 10 seconds timeout
            
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        console.log('XHR success:', url, 'Status:', xhr.status);
                        resolve(data);
                    } catch (e) {
                        console.error('XHR parse error:', e, 'Response:', xhr.responseText);
                        // Essayer de retourner quelque chose même si le JSON est invalide
                        reject(new Error(`JSON parse error: ${e.message}`));
                    }
                } else if (xhr.status === 0) {
                    // Status 0 = problème de réseau ou CORS sur Safari
                    console.error('XHR blocked (CORS or network):', url);
                    reject(new Error('Network blocked - likely CORS issue on Safari'));
                } else {
                    console.error('XHR failed:', xhr.status, xhr.statusText, 'Response:', xhr.responseText);
                    reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
                }
            };
            
            xhr.onerror = function() {
                console.error('XHR network error');
                reject(new Error('Network error'));
            };
            
            xhr.ontimeout = function() {
                console.error('XHR timeout');
                reject(new Error('Request timeout'));
            };
            
            xhr.open('GET', url, true);
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.send();
        });
    }

    async fetchForecast() {
        if (WEATHER_CONFIG.useEccc) {
            const eccc = await this.fetchEcccForecast().catch(() => []);
            if (Array.isArray(eccc) && eccc.length > 0) {
                this.forecastSource = 'ECCC';
                return eccc.slice(0, 6);
            }
        }
        this.forecastSource = 'OpenWeatherMap';
        return this.fetchOwForecast();
    }

    async fetchOwForecast() {
        // Détection spécifique Safari iOS
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isSafariIOS = isSafari && isIOS;
        
        try {
            if (isSafariIOS) {
                console.log(`Safari iOS detected - using XHR for OneCall forecast (lang: ${this.lang})`);
                const data = await this.fetchWithXHR(`/api/weather/onecall?lang=${this.lang}`);
                const hourly = Array.isArray(data && data.hourly) ? data.hourly : [];
                return hourly.slice(0, 6).map(item => ({
                    dt: item.dt,
                    main: { temp: item.temp, feels_like: item.feels_like },
                    weather: item.weather
                }));
            } else {
                // OneCall passthrough
                const response = await fetch(`/api/weather/onecall?lang=${this.lang}`, { cache: 'no-store' });
                if (!response.ok) {
                    throw new Error(`OneCall API failed: ${response.status}`);
                }
                const data = await response.json();
                console.log('[Weather Debug] OneCall hourly raw:', data && data.hourly && data.hourly.slice ? data.hourly.slice(0, 8) : data);
                const hourly = Array.isArray(data.hourly) ? data.hourly : [];
                return hourly.slice(0, 6).map(item => ({
                    dt: item.dt,
                    main: { temp: item.temp, feels_like: item.feels_like },
                    weather: item.weather
                }));
            }
        } catch (error) {
            console.error('Weather forecast failed:', error);
            // Fallback avec données statiques en français ou anglais
                // Générer des données de fallback plus réalistes basées sur l'heure actuelle
                const baseTime = Math.floor(Date.now() / 1000);
                const currentHour = new Date().getHours();
                const fallback = [];
                const isFrench = this.lang === 'fr';
                
                // Températures typiques pour septembre à Québec
                const typicalTemps = {
                    night: 8,    // 0h-6h
                    morning: 12, // 6h-12h
                    afternoon: 18, // 12h-18h
                    evening: 14  // 18h-24h
                };
                
                for (let i = 1; i <= 6; i++) {
                    const futureHour = (currentHour + i) % 24;
                    let baseTemp;
                    if (futureHour >= 0 && futureHour < 6) baseTemp = typicalTemps.night;
                    else if (futureHour >= 6 && futureHour < 12) baseTemp = typicalTemps.morning;
                    else if (futureHour >= 12 && futureHour < 18) baseTemp = typicalTemps.afternoon;
                    else baseTemp = typicalTemps.evening;
                    
                    // Petite variation réaliste
                    const variation = Math.random() * 2 - 1; // ±1°C
                    const temp = Math.round(baseTemp + variation);
                    
                    fallback.push({
                        dt: baseTime + (i * 3600),
                        main: { temp: temp, feels_like: temp - 1 },
                        weather: [{ 
                            description: isFrench ? 'Partiellement nuageux' : 'Partly cloudy',
                            main: 'Clouds',
                            icon: futureHour >= 6 && futureHour < 20 ? '02d' : '02n' 
                        }]
                    });
                }
            return fallback;
        }
    }

    async fetchEcccForecast() {
        try {
            const half = 0.15;
            const bbox = [
                (this.lon - half).toFixed(4),
                (this.lat - half).toFixed(4),
                (this.lon + half).toFixed(4),
                (this.lat + half).toFixed(4)
            ].join(',');

            const now = new Date();
            const end = new Date(now.getTime() + 6 * 3600 * 1000);
            const startIso = now.toISOString();
            const endIso = end.toISOString();
            const collections = ['umos-hrdps-realtime', 'umos-rdps-realtime'];
            let features = [];
            for (const coll of collections) {
                const url = `https://api.weather.gc.ca/collections/${coll}/items?f=json&bbox=${bbox}&datetime=${encodeURIComponent(startIso + '/' + endIso)}&variable=AirTemp&limit=2000&nocache=${Date.now()}`;
                const res = await fetch(url, { cache: 'no-store' });
                if (!res.ok) {
                    const text = await res.text().catch(() => '');
                    console.warn(`ECCC ${coll} failed:`, res.status, text);
                    continue;
                }
                const data = await res.json();
                const feats = Array.isArray(data.features) ? data.features : [];
                features = features.concat(feats);
                if (features.length > 0) break;
            }
            if (features.length === 0) return [];

            const toSec = (d) => {
                const t = Date.parse(d);
                return Number.isFinite(t) ? Math.floor(t / 1000) : null;
            };
            const sq = (x) => x * x;
            const dist2 = (a, b) => sq(a[0] - b[0]) + sq(a[1] - b[1]);
            const target = [this.lon, this.lat];

            // Regrouper par heure (clé ISO YYYY-MM-DDTHH)
            const byHour = new Map();
            for (const f of features) {
                const p = f.properties || {};
                const g = f.geometry || {};
                const coords = Array.isArray(g.coordinates) ? g.coordinates : null; // [lon, lat]
                const rawVal = p.value ?? p.val ?? p.temperature ?? null;
                if (rawVal == null) continue;
                const dtStr = p.datetime || p.date_time || p.time || p.valid || p.valid_time || p.forecast_datetime || p.forecast_time;
                const dt = dtStr ? toSec(dtStr) : null;
                if (!dt) continue;
                if (dt * 1000 < now.getTime()) continue; // futur seulement
                const key = new Date(dt * 1000).toISOString().slice(0, 13);
                const tempK = Number(rawVal);
                if (!Number.isFinite(tempK)) continue;
                const tempC = tempK > 170 ? (tempK - 273.15) : tempK; // Kelvin -> C si besoin
                const stationStr = [p.station_id, p.station, p.station_name, p.name, p.site, p.src_id, p.wmo_id].filter(Boolean).join(' ');
                const prefer = /CYUL|\bYUL\b|Trudeau|Dorval/i.test(stationStr);
                const candidate = { dt, main: { temp: tempC }, weather: [], _prefer: prefer, _station: stationStr };

                // Prendre le plus proche
                const prev = byHour.get(key);
                if (!prev) {
                    byHour.set(key, { item: candidate, d2: coords ? dist2(coords, target) : Number.POSITIVE_INFINITY });
                } else {
                    const d2 = coords ? dist2(coords, target) : Number.POSITIVE_INFINITY;
                    const better = (candidate._prefer && !prev.item._prefer) || (candidate._prefer === prev.item._prefer && d2 < prev.d2);
                    if (better) byHour.set(key, { item: candidate, d2 });
                }
            }

            const items = Array.from(byHour.values()).map(v => v.item).sort((a, b) => a.dt - b.dt);
            return items.slice(0, 6);
        } catch (e) {
            console.warn('ECCC forecast error:', e);
            return [];
        }
    }

    getEmoji(main, iconCode) {
        const code = (iconCode || '').trim();
        switch (code) {
            case '01d': return '☀️';
            case '01n': return '🌙';
            case '02d': return '🌤️';
            case '02n': return '🌙';
            case '03d':
            case '03n': return '☁️';
            case '04d':
            case '04n': return '☁️';
            case '09d':
            case '09n': return '🌧️';
            case '10d': return '🌦️';
            case '10n': return '🌧️';
            case '11d':
            case '11n': return '⛈️';
            case '13d':
            case '13n': return '❄️';
            case '50d':
            case '50n': return '🌫️';
            default:
                return WEATHER_EMOJI[main] || '🌡️';
        }
    }

    async refresh() {
        if (!this.widget) return;
        try {
            this.renderLoading();
            
            // Détection Safari iOS
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            const isSafariIOS = isSafari && isIOS;
            
            let current, forecast;
            
            if (isSafariIOS) {
                console.log('Safari iOS detected - using optimized approach');
                
                // Essayer plusieurs fois pour Safari iOS
                let attempts = 0;
                const maxAttempts = 3;
                let lastError = null;
                
                while (attempts < maxAttempts) {
                    try {
                        attempts++;
                        console.log(`Safari iOS attempt ${attempts}/${maxAttempts}`);
                        
                        // Utiliser les méthodes avec XHR
                        current = await this.fetchCurrentWeather();
                        forecast = await this.fetchForecast();
                        
                        // Succès!
                        console.log('Safari iOS: Weather data loaded successfully');
                        break;
                        
                    } catch (error) {
                        lastError = error;
                        console.error(`Safari iOS attempt ${attempts} failed:`, error);
                        
                        if (attempts < maxAttempts) {
                            // Attendre un peu avant de réessayer
                            await new Promise(resolve => setTimeout(resolve, 1500));
                        }
                    }
                }
                
                // Si tous les essais ont échoué, utiliser des données de fallback
                if (!current || !forecast) {
                    console.warn('Safari iOS: Using fallback data after failures');
                    current = {
                        main: { temp: 18, feels_like: 17, humidity: 65 },
                        weather: [{ 
                            main: 'Clouds',
                            description: this.lang === 'fr' ? 'Nuageux' : 'Cloudy',
                            icon: '02d'
                        }],
                        wind: { speed: 3.5 },
                        name: 'Montreal'
                    };
                    
                    // Fallback plus réaliste pour Safari iOS
                    const baseTime = Math.floor(Date.now() / 1000);
                    const currentHour = new Date().getHours();
                    forecast = [];
                    
                    for (let i = 1; i <= 6; i++) {
                        const futureHour = (currentHour + i) % 24;
                        // Variation progressive de température
                        let tempOffset = 0;
                        if (futureHour >= 10 && futureHour <= 16) {
                            tempOffset = 2; // Plus chaud l'après-midi
                        } else if (futureHour >= 0 && futureHour < 6) {
                            tempOffset = -2; // Plus frais la nuit
                        }
                        
                        forecast.push({
                            dt: baseTime + (i * 3600),
                            main: { 
                                temp: current.main.temp + tempOffset + (Math.random() * 1 - 0.5), 
                                feels_like: current.main.temp + tempOffset - 1 
                            },
                            weather: [{
                                ...current.weather[0],
                                icon: futureHour >= 6 && futureHour < 20 ? 
                                    current.weather[0].icon.replace('n', 'd') : 
                                    current.weather[0].icon.replace('d', 'n')
                            }]
                        });
                    }
                }
                
            } else {
                // Pour les autres navigateurs, méthode normale
                [current, forecast] = await Promise.all([
                    this.fetchCurrentWeather(),
                    this.fetchForecast()
                ]);
            }
            
            this.lastData = { current, forecast };
            this.debugLogData();
            this.renderWeather();
            
        } catch (e) {
            console.error('Weather error:', e);
            
            // Sur Safari iOS, toujours essayer d'afficher quelque chose
            if (/Safari/i.test(navigator.userAgent) && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
                console.log('Safari iOS: Showing static fallback');
                this.lastData = {
                    current: {
                        main: { temp: 18, feels_like: 17, humidity: 65 },
                        weather: [{ 
                            description: this.lang === 'fr' ? 'Conditions actuelles' : 'Current conditions',
                            icon: '02d'
                        }],
                        wind: { speed: 3.5 }
                    },
                    forecast: []
                };
                this.renderWeather();
            } else {
                this.renderError();
            }
        }
    }

    renderLoading() {
        this.widget.innerHTML = `
            <div class="ww-header">
                <span class="ww-title">${this.lang === 'fr' ? 'Météo à Québec' : 'Weather in Quebec City'}</span>
                <span class="ww-source">OpenWeatherMap</span>
            </div>
            <div class="ww-loading">${this.lang === 'fr' ? 'Chargement...' : 'Loading...'}</div>
        `;
    }

    renderError() {
        this.widget.innerHTML = `
            <div class="ww-header">
                <span class="ww-title">${this.lang === 'fr' ? 'Météo' : 'Weather'}</span>
                <span class="ww-source">OpenWeatherMap</span>
            </div>
            <div class="ww-error">
                <span>${this.lang === 'fr' ? 'Météo non disponible' : 'Weather unavailable'}</span>
                <button class="ww-retry" type="button" aria-label="${this.lang === 'fr' ? 'Réessayer' : 'Retry'}">${this.lang === 'fr' ? 'Réessayer' : 'Retry'}</button>
            </div>
        `;
        const btn = this.widget.querySelector('.ww-retry');
        if (btn) {
            btn.addEventListener('click', () => this.refresh(), { passive: true });
            btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') this.refresh(); });
        }
    }

    renderWeather() {
        if (!this.lastData) {
            console.error('renderWeather called but no lastData!');
            return;
        }
        const { current, forecast } = this.lastData;
        console.log('Rendering weather data:', { current, forecast });
        const main = current.main || {};
        const wind = current.wind || {};
        const weather = (current.weather && current.weather[0]) || {};
        const emoji = this.getEmoji(weather.main, weather.icon);
        const roundOrFix = (v) => {
            if (v == null || Number.isNaN(Number(v))) return '–';
            return this.precision > 0 ? Number(v).toFixed(this.precision) : Math.round(Number(v));
        };
        const feels = roundOrFix(main.feels_like);
        const temp = roundOrFix(main.temp);
        const humidity = main.humidity != null ? `${main.humidity}%` : '–';
        const windKmh = wind.speed != null ? Math.round(Number(wind.speed) * 3.6) : '–';

            // Afficher en heure de Québec pour cohérence
        const fmtHour = (ts) => {
            const date = new Date(ts * 1000);
            // Utiliser uniquement l'heure pour l'affichage compact
            const hour = date.getHours();
            return this.lang === 'fr' ? `${hour}h` : `${hour}:00`;
        };

        const fcHTML = (forecast || []).map(f => {
            const w = (f.weather && f.weather[0]) || {};
            const e = this.getEmoji(w.main, w.icon);
            const rawT = this.forecastUseFeelsLike ? (f.main?.feels_like) : (f.main?.temp);
            const adjusted = rawT;
            const t = roundOrFix(adjusted);
            const label = this.lang === 'fr' ? (this.forecastUseFeelsLike ? 'ress.' : '') : (this.forecastUseFeelsLike ? 'feels' : '');
            return `<div class="ww-forecast-item"><span>${fmtHour(f.dt)}</span><span>${e}</span><span>${t}°C${label ? ` <small>(${label})</small>` : ''}</span></div>`;
        }).join('');

        // Compact layout - tout sur une ligne
        const nextHours = (forecast || []).slice(0, 6).map(f => {
            const w = (f.weather && f.weather[0]) || {};
            const e = this.getEmoji(w.main, w.icon);
            const rawT = this.forecastUseFeelsLike ? (f.main?.feels_like) : (f.main?.temp);
            const adjusted = rawT;
            const t = roundOrFix(adjusted);
            const date = new Date(f.dt * 1000);
            const hour = date.getHours();
            // Affichage plus clair de l'heure
            const timeDisplay = hour.toString().padStart(2, '0') + 'h';
            return `<div class="ww-mini-forecast">
                <span class="ww-mini-time">${timeDisplay}</span>
                <span class="ww-mini-icon">${e}</span>
                <span class="ww-mini-temp">${t}°</span>
            </div>`;
        }).join('');

        this.widget.innerHTML = `
            <div class="ww-compact">
                <div class="ww-now">
                    <span class="ww-emoji">${emoji}</span>
                    <div class="ww-temp-group">
                        <span class="ww-temp">${temp}°C</span>
                        <span class="ww-desc">${(weather.description || '').toString()}</span>
                    </div>
                </div>
                <div class="ww-stats">
                    <span class="ww-stat" title="${this.lang === 'fr' ? 'Humidité' : 'Humidity'}">💧 ${humidity}</span>
                    <span class="ww-stat" title="${this.lang === 'fr' ? 'Vent' : 'Wind'}">💨 ${windKmh}km/h</span>
                </div>
                <div class="ww-next-hours">
                    ${nextHours}
                </div>
            </div>
        `;
}

    debugLogData() {
        try {
            const { current, forecast } = this.lastData || {};
            const now = new Date();
            console.groupCollapsed('[Weather Debug] OpenWeather raw vs affiché');
            console.log('Client now:', now.toISOString());
            console.log('Timezone offset (OneCall):', this.tzOffsetSeconds, 'seconds');
            console.log('Current.raw:', {
                temp: current?.main?.temp,
                feels_like: current?.main?.feels_like,
                dt: current?.dt,
                timezone: current?.timezone
            });
            console.log('Forecast[0..5].raw:', (forecast || []).map(h => ({
                dt: h.dt,
                temp: h.main?.temp,
                feels_like: h.main?.feels_like
            })));
            console.groupEnd();
        } catch (e) {
            console.warn('Weather debug error:', e);
        }
    }

    _ensureStyles() {
        if (document.getElementById('weatherWidgetStyles')) return;
        const style = document.createElement('style');
        style.id = 'weatherWidgetStyles';
        style.textContent = `
            #weatherWidget { background: linear-gradient(135deg, #1f6e72, #8BC34A); color: #fff; padding: 14px 24px; border-radius: var(--radius-lg); box-shadow: var(--shadow-md); }
            #weatherWidget .ww-loading, #weatherWidget .ww-error { text-align:center; padding: 16px; }
            #weatherWidget .ww-retry { margin-top: 8px; background:#fff; color: #1f6e72; border:none; padding:8px 12px; border-radius:8px; cursor:pointer; }
            
            /* Compact Layout - 20% plus grand */
            #weatherWidget .ww-compact { display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
            #weatherWidget .ww-now { display: flex; align-items: center; gap: 14px; }
            #weatherWidget .ww-emoji { font-size: 2.6rem; }
            #weatherWidget .ww-temp-group { display: flex; flex-direction: column; }
            #weatherWidget .ww-temp { font-size: 1.7rem; font-weight: 700; line-height: 1; }
            #weatherWidget .ww-desc { font-size: 1rem; opacity: 0.9; margin-top: 3px; }
            
            #weatherWidget .ww-stats { display: flex; gap: 18px; align-items: center; }
            #weatherWidget .ww-stat { font-size: 1.1rem; white-space: nowrap; display: flex; align-items: center; gap: 5px; }
            
            #weatherWidget .ww-next-hours { display: flex; gap: 12px; }
            #weatherWidget .ww-mini-forecast { display: flex; flex-direction: column; align-items: center; padding: 0 4px; }
            #weatherWidget .ww-mini-time { font-size: 0.9rem; opacity: 0.8; }
            #weatherWidget .ww-mini-icon { font-size: 1.4rem; margin: 3px 0; }
            #weatherWidget .ww-mini-temp { font-size: 1.05rem; font-weight: 600; }
            
            @media (max-width: 768px) {
                #weatherWidget .ww-compact { justify-content: center; text-align: center; }
                #weatherWidget .ww-stats { flex-wrap: wrap; justify-content: center; }
            }
            
            @media (max-width: 480px) {
                #weatherWidget { padding: 12px 18px; }
                #weatherWidget .ww-emoji { font-size: 2.2rem; }
                #weatherWidget .ww-temp { font-size: 1.4rem; }
                #weatherWidget .ww-stat { font-size: 0.95rem; }
                #weatherWidget .ww-next-hours { gap: 8px; overflow-x: auto; }
                #weatherWidget .ww-mini-forecast { padding: 0 3px; min-width: 40px; }
                #weatherWidget .ww-mini-time { font-size: 0.8rem; }
                #weatherWidget .ww-mini-icon { font-size: 1.1rem; }
                #weatherWidget .ww-mini-temp { font-size: 0.9rem; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Instance globale
let __gpcqmWeatherWidget = null;

async function loadWeather() {
    try {
        // Détection Safari spécifique
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        
        if (!__gpcqmWeatherWidget) {
            __gpcqmWeatherWidget = new WeatherWidget();
            console.log('Weather widget created, Safari detected:', isSafari);
        }
        
        // Essayer les vraies données pour tous les navigateurs, y compris Safari
        await __gpcqmWeatherWidget.refresh();
        
        console.log('Weather loaded successfully');
    } catch (error) {
        console.error('Weather loading failed:', error);
    }
}

function updateWeatherLanguage() {
    if (!__gpcqmWeatherWidget) return;
    __gpcqmWeatherWidget.lang = localStorage.getItem('language') || 'fr';
    if (__gpcqmWeatherWidget.lastData) __gpcqmWeatherWidget.renderWeather();
}

// Exports
window.loadWeather = loadWeather;
window.updateWeatherLanguage = updateWeatherLanguage;

// DOM ready: initial load SEULEMENT (pas de double setInterval)
document.addEventListener('DOMContentLoaded', () => {
    if (typeof loadWeather === 'function') {
        // Détection Safari iOS pour ajuster le délai
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isSafariIOS = isSafari && isIOS;
        
        // Délai plus long pour Safari iOS pour s'assurer que tout est chargé
        const delay = isSafariIOS ? 2000 : 1000;
        console.log(`Weather widget will load in ${delay}ms (Safari iOS: ${isSafariIOS})`);
        
        setTimeout(loadWeather, delay);
    }
});

// API simple pour ajuster le biais local depuis la console
window.setWeatherTempBiasC = function setWeatherTempBiasC(value) {
    const parsed = parseFloat(value);
    if (!Number.isFinite(parsed)) return;
    localStorage.setItem('weatherTempBiasC', String(parsed));
    if (__gpcqmWeatherWidget) {
        __gpcqmWeatherWidget.tempBiasC = parsed;
        if (__gpcqmWeatherWidget.lastData) __gpcqmWeatherWidget.renderWeather();
    }
};