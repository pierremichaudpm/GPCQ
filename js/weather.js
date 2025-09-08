// === GPCQM 2025 - Weather Widget (OpenWeatherMap) ===

// Configuration
const WEATHER_CONFIG = {
    apiKey: '27fd496c6cc9c8cd6f8981bf682c5dd4',
    cityId: 6325494, // Québec, CA
    // Coordonnées approximatives Vieux-Québec
    lat: 46.8139,
    lon: -71.2080,
    units: 'metric',
    updateIntervalMs: 10 * 60 * 1000, // 10 minutes
    forecastUseFeelsLike: false,
    precision: 0,
    tempBiasC: 1.5
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
        // Utiliser lat/lon pour être cohérent avec OneCall
        const url = `${this.apiBase}/weather?lat=${this.lat}&lon=${this.lon}&units=${this.units}&lang=${this.lang}&appid=${this.apiKey}`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            console.error('OpenWeather current failed:', res.status, text);
            throw new Error('OpenWeather current failed');
        }
        return res.json();
    }

    async fetchForecast() {
        // Préférence ECCC (GeoMet UMOS-RDPS/HRDPS). Fallback OWM si vide
        const eccc = await this.fetchEcccForecast().catch(() => []);
        if (Array.isArray(eccc) && eccc.length > 0) {
            this.forecastSource = 'ECCC';
            return eccc.slice(0, 6);
        }
        this.forecastSource = 'OpenWeatherMap';
        return this.fetchOwForecast();
    }

    async fetchOwForecast() {
        // Hourly forecast: try One Call 3.0, fallback to 2.5
        const build = (base) => `${base}/onecall?lat=${this.lat}&lon=${this.lon}&exclude=minutely,daily,alerts,current&units=${this.units}&lang=${this.lang}&appid=${this.apiKey}`;
        const url30 = `https://api.openweathermap.org/data/3.0`;
        const url25 = `https://api.openweathermap.org/data/2.5`;
        // Try 3.0
        try {
            const res30 = await fetch(build(url30), { cache: 'no-store' });
            if (!res30.ok) {
                const text = await res30.text().catch(() => '');
                console.warn('One Call 3.0 failed:', res30.status, text);
                throw new Error('onecall30');
            }
            const data30 = await res30.json();
            this.tzOffsetSeconds = Number(data30.timezone_offset || 0);
            const hourly30 = (data30.hourly || []).slice(0, 6);
            return hourly30.map(h => ({ dt: h.dt, main: { temp: h.temp, feels_like: h.feels_like }, weather: h.weather || [] }));
        } catch (e) {
            // Fallback 2.5
            try {
                const res25 = await fetch(build(url25), { cache: 'no-store' });
                if (!res25.ok) {
                    const text = await res25.text().catch(() => '');
                    console.error('One Call 2.5 failed:', res25.status, text);
                    throw new Error('onecall25');
                }
                const data25 = await res25.json();
                this.tzOffsetSeconds = Number(data25.timezone_offset || 0);
                const hourly25 = (data25.hourly || []).slice(0, 6);
                return hourly25.map(h => ({ dt: h.dt, main: { temp: h.temp, feels_like: h.feels_like }, weather: h.weather || [] }));
            } catch (e2) {
                throw e2;
            }
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
            const [current, forecast] = await Promise.all([
                this.fetchCurrentWeather(),
                this.fetchForecast()
            ]);
            this.lastData = { current, forecast };
            this.debugLogData();
            this.renderWeather();
        } catch (e) {
            console.error('Weather error:', e);
            this.renderError();
        }
    }

    renderLoading() {
        this.widget.innerHTML = `
            <div class="ww-header">
                <span class="ww-title">${this.lang === 'fr' ? 'Météo à Québec' : 'Weather in Québec City'}</span>
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
        if (!this.lastData) return;
        const { current, forecast } = this.lastData;
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

        // Afficher en heure de Montréal pour cohérence
        const fmtHour = (ts) => new Date(ts * 1000).toLocaleTimeString(
            this.lang === 'fr' ? 'fr-CA' : 'en-CA',
            { hour: '2-digit', minute: '2-digit', timeZone: 'America/Toronto' }
        );

        const fcHTML = (forecast || []).map(f => {
            const w = (f.weather && f.weather[0]) || {};
            const e = this.getEmoji(w.main, w.icon);
            const rawT = this.forecastUseFeelsLike ? (f.main?.feels_like) : (f.main?.temp);
            const adjusted = (rawT == null || Number.isNaN(Number(rawT))) ? rawT : (Number(rawT) + (this.tempBiasC || 0));
            const t = roundOrFix(adjusted);
            const label = this.lang === 'fr' ? (this.forecastUseFeelsLike ? 'ress.' : '') : (this.forecastUseFeelsLike ? 'feels' : '');
            return `<div class="ww-forecast-item"><span>${fmtHour(f.dt)}</span><span>${e}</span><span>${t}°C${label ? ` <small>(${label})</small>` : ''}</span></div>`;
        }).join('');

        // Compact layout - tout sur une ligne
        const nextHours = (forecast || []).slice(0, 6).map(f => {
            const w = (f.weather && f.weather[0]) || {};
            const e = this.getEmoji(w.main, w.icon);
            const rawT = this.forecastUseFeelsLike ? (f.main?.feels_like) : (f.main?.temp);
            const adjusted = (rawT == null || Number.isNaN(Number(rawT))) ? rawT : (Number(rawT) + (this.tempBiasC || 0));
            const t = roundOrFix(adjusted);
            const hour = new Date(f.dt * 1000).getHours();
            return `<div class="ww-mini-forecast">
                <span class="ww-mini-time">${this.lang === 'fr' ? `${hour} h` : `${hour}h`}</span>
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
    if (!__gpcqmWeatherWidget) {
        __gpcqmWeatherWidget = new WeatherWidget();
        // Auto-refresh
        setInterval(() => __gpcqmWeatherWidget && __gpcqmWeatherWidget.refresh(), WEATHER_CONFIG.updateIntervalMs);
    }
    await __gpcqmWeatherWidget.refresh();
}

function updateWeatherLanguage() {
    if (!__gpcqmWeatherWidget) return;
    __gpcqmWeatherWidget.lang = localStorage.getItem('language') || 'fr';
    if (__gpcqmWeatherWidget.lastData) __gpcqmWeatherWidget.renderWeather();
}

// Exports
window.loadWeather = loadWeather;
window.updateWeatherLanguage = updateWeatherLanguage;

// DOM ready: initial load and periodic refresh
document.addEventListener('DOMContentLoaded', () => {
    if (typeof loadWeather === 'function') {
        loadWeather();
        setInterval(loadWeather, WEATHER_CONFIG.updateIntervalMs);
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