// === GPCQ 2025 PWA - Express Server for Railway ===

const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// === CMS Persistence (Railway volume or local folder) ===
const fs = require('fs').promises;
const fsSync = require('fs');

// Detect Railway to decide on persistent storage path
const IS_RAILWAY = !!process.env.RAILWAY_PUBLIC_DOMAIN || !!process.env.RAILWAY_ENVIRONMENT || !!process.env.RAILWAY_STATIC_URL;

// Persistent base dir: Railway volume in prod, local folder in dev
const CMS_BASE_DIR = process.env.CMS_DATA_DIR || (IS_RAILWAY ? '/data/cms' : path.join(__dirname, 'cms-data'));
try { fsSync.mkdirSync(CMS_BASE_DIR, { recursive: true }); } catch(_) {}

// Default files from repo and persistent targets
const DEFAULT_TEAMS_FILE  = path.join(__dirname, 'teams-data.json');
const DEFAULT_RIDERS_FILE = path.join(__dirname, 'riders.json');
const TEAMS_FILE  = path.join(CMS_BASE_DIR, 'teams-data.json');
const RIDERS_FILE = path.join(CMS_BASE_DIR, 'riders.json');
const PAGEVIEWS_FILE = path.join(CMS_BASE_DIR, 'pageviews.json');

// Pageviews counter (persisted)
let pageviews = { total: 0, byDate: {} };
try {
    if (fsSync.existsSync(PAGEVIEWS_FILE)) {
        const pvRaw = fsSync.readFileSync(PAGEVIEWS_FILE, 'utf8');
        const pv = JSON.parse(pvRaw || '{}');
        if (pv && typeof pv.total === 'number') pageviews.total = pv.total;
        if (pv && pv.byDate && typeof pv.byDate === 'object') pageviews.byDate = pv.byDate;
    } else {
        fsSync.writeFileSync(PAGEVIEWS_FILE, JSON.stringify(pageviews));
    }
} catch (e) {
    console.warn('Pageviews init:', e.message);
}

async function persistPageviews() {
    try {
        await fs.writeFile(PAGEVIEWS_FILE, JSON.stringify(pageviews));
    } catch (e) {
        console.warn('Pageviews persist:', e.message);
    }
}

// Active users (in-memory, cookie-based)
const activeClients = new Map(); // cid -> lastSeen (ms)
function touchClient(req, res) {
    try {
        const cookieHeader = req.headers.cookie || '';
        const cookies = Object.fromEntries(cookieHeader.split(';').map(p=>{
            const i=p.indexOf('=');
            return i>0?[p.slice(0,i).trim(), decodeURIComponent(p.slice(i+1))]:[p.trim(),''];
        }));
        let cid = cookies.cid;
        if (!cid) {
            cid = (crypto.randomUUID && crypto.randomUUID()) || (Date.now().toString(36)+Math.random().toString(36).slice(2));
            const existing = res.getHeader('Set-Cookie');
            const newCookie = `cid=${cid}; Path=/; SameSite=Lax; Max-Age=${30*24*60*60}`;
            if (existing) {
                res.setHeader('Set-Cookie', Array.isArray(existing) ? [...existing, newCookie] : [existing, newCookie]);
            } else {
                res.setHeader('Set-Cookie', newCookie);
            }
        }
        activeClients.set(cid, Date.now());
    } catch(_) {}
}
function countActive(windowMs) {
    const now = Date.now();
    let n = 0;
    for (const [, last] of activeClients) {
        if (now - last <= windowMs) n++;
    }
    return n;
}

// Initial seed (if empty)
try {
    if (!fsSync.existsSync(TEAMS_FILE) && fsSync.existsSync(DEFAULT_TEAMS_FILE)) fsSync.copyFileSync(DEFAULT_TEAMS_FILE, TEAMS_FILE);
    if (!fsSync.existsSync(RIDERS_FILE) && fsSync.existsSync(DEFAULT_RIDERS_FILE)) fsSync.copyFileSync(DEFAULT_RIDERS_FILE, RIDERS_FILE);
    if (!fsSync.existsSync(TEAMS_FILE))  fsSync.writeFileSync(TEAMS_FILE,  JSON.stringify({ teams: [] }, null, 2));
    if (!fsSync.existsSync(RIDERS_FILE)) fsSync.writeFileSync(RIDERS_FILE, JSON.stringify({ teams: [] }, null, 2));
} catch(e) { console.warn('CMS data init:', e.message); }

// Optional database pool (PostgreSQL or MySQL) - configured via env
// DB_TYPE=postgres|mysql  DB_URL=connection_string  DB_POOL_MAX=10  DB_POOL_IDLE_MS=30000
let dbPool = null;
let dbType = (process.env.DB_TYPE || '').toLowerCase();
let dbStatus = 'not_configured';

async function initDbPool() {
    try {
        if (!process.env.DB_URL || !dbType) {
            dbStatus = 'not_configured';
            return;
        }
        if (dbType === 'postgres') {
            const { Pool } = require('pg');
            dbPool = new Pool({
                connectionString: process.env.DB_URL,
                ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false },
                max: parseInt(process.env.DB_POOL_MAX || '10', 10),
                idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_MS || '30000', 10)
            });
        } else if (dbType === 'mysql') {
            const mysql = require('mysql2/promise');
            dbPool = await mysql.createPool(process.env.DB_URL);
            if (process.env.DB_POOL_MAX) dbPool.config.connectionLimit = parseInt(process.env.DB_POOL_MAX, 10);
        } else {
            dbStatus = 'unsupported_db_type';
            return;
        }
        dbStatus = 'initialized';
    } catch (e) {
        console.error('DB init error:', e);
        dbStatus = 'init_error';
    }
}

async function checkDb() {
    if (!dbPool) return { status: dbStatus };
    try {
        if (dbType === 'postgres') {
            await dbPool.query('SELECT 1');
        } else if (dbType === 'mysql') {
            await dbPool.query('SELECT 1');
        }
        return { status: 'connected' };
    } catch (e) {
        return { status: 'error', error: e.message };
    }
}

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://www.googletagmanager.com", "https://www.google-analytics.com", "https://snapwidget.com"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'", "https://api.openweathermap.org", "https://graph.instagram.com", "https://www.google-analytics.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'", "https://player.vimeo.com", "https://vimeo.com"],
            frameSrc: ["'self'", "https://player.vimeo.com", "https://www.youtube.com", "https://www.youtube-nocookie.com", "https://www.google.com", "https://www.google.ca", "https://snapwidget.com"],
            childSrc: ["'self'", "https://player.vimeo.com", "https://www.youtube.com", "https://www.youtube-nocookie.com", "https://www.google.com", "https://www.google.ca", "https://snapwidget.com"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

// Enable CORS
app.use(cors());

// Compression for better performance
app.use(compression());

// Rate limiting to prevent abuse
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || (15 * 60 * 1000), 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '1000', 10),
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Lightweight pageview beacon (counts even if HTML served from SW cache)
app.post('/beacon/pageview', (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        pageviews.total += 1;
        pageviews.byDate[today] = (pageviews.byDate[today] || 0) + 1;
        persistPageviews();
        // also touch active user
        touchClient(req, res);
        res.status(204).end();
    } catch (e) {
        console.warn('beacon/pageview error:', e.message);
        res.status(204).end();
    }
});

// Always serve the PERSISTED riders.json (bypass static) - must come BEFORE express.static
app.get('/riders.json', (req, res) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.sendFile(RIDERS_FILE);
});

// Logging middleware
app.use((req, res, next) => {
    const url = req.originalUrl || req.url || req.path;
    const wid = process.env.WORKER_ID ? `W${process.env.WORKER_ID}` : 'W?';
    console.log(`${new Date().toISOString()} [${wid}] ${req.method} ${url}`);
    try {
        // Count only top-level page views
        if (req.method === 'GET' && (url === '/' || url.startsWith('/index.html'))) {
            const today = new Date().toISOString().slice(0, 10);
            pageviews.total += 1;
            pageviews.byDate[today] = (pageviews.byDate[today] || 0) + 1;
            persistPageviews();
        }
        // Track active users (cookie-based)
        if (req.method === 'GET') {
            touchClient(req, res);
        }
    } catch (_) {}
    next();
});

// Cache control for static assets
const setCache = (req, res, next) => {
    const isDev = (process.env.NODE_ENV || 'production') === 'development';
    const period = req.path.match(/\.(jpg|jpeg|png|gif|svg|ico|webp)$/i) ? '1y' :
                   req.path.match(/\.(css|js)$/i) ? '1d' : '1h';

    if (req.method === 'GET') {
        if (isDev) {
            // In development, disable caching for quicker feedback
            res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.set('Pragma', 'no-cache');
            res.set('Expires', '0');
        } else {
            res.set('Cache-Control', `public, max-age=${period === '1y' ? 31536000 : period === '1d' ? 86400 : 3600}`);
        }
    }
    next();
};

// Serve static files with caching
app.use(setCache);
app.use(express.static(path.join(__dirname), {
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
        if (path.match(/\.(?:png|jpg|jpeg|gif|webp|svg|ico)$/i)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
        if (path.endsWith('sw.js')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

// === CMS Integration ===
// CMS Authentication
const CMS_USER = process.env.CMS_USER || process.env.BASIC_AUTH_USER || 'admin';
const CMS_PASS = process.env.CMS_PASS || process.env.BASIC_AUTH_PASS || 'Axelle20';
const crypto = require('crypto');
const CMS_SINGLE_PASS = process.env.CMS_SINGLE_PASS || CMS_PASS;
const CMS_PASS_HASH = crypto.createHash('sha256').update(String(CMS_SINGLE_PASS)).digest('hex');

function basicAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Basic ')) {
        return res.status(401).set('WWW-Authenticate', 'Basic realm="CMS"').send('Authentication required');
    }
    
    const credentials = Buffer.from(auth.slice(6), 'base64').toString().split(':');
    if (credentials[0] !== CMS_USER || credentials[1] !== CMS_PASS) {
        return res.status(401).send('Invalid credentials');
    }
    
    next();
}

// Password-only gate using a cookie (no username)
function parseCookies(cookieHeader) {
    const out = {};
    if (!cookieHeader) return out;
    cookieHeader.split(';').forEach(pair => {
        const idx = pair.indexOf('=');
        if (idx > -1) {
            const k = pair.slice(0, idx).trim();
            const v = pair.slice(idx + 1).trim();
            out[k] = decodeURIComponent(v);
        }
    });
    return out;
}

function cmsGate(req, res, next) {
    try {
        const cookies = parseCookies(req.headers.cookie || '');
        if (cookies['cms_auth'] && cookies['cms_auth'] === CMS_PASS_HASH) {
            return next();
        }
        // If Basic Auth provided and password matches, accept and set cookie
        const auth = req.headers.authorization || '';
        if (auth.startsWith('Basic ')) {
            const decoded = Buffer.from(auth.slice(6), 'base64').toString();
            const parts = decoded.split(':');
            const pass = parts[1] || '';
            if (pass === CMS_SINGLE_PASS) {
                res.setHeader('Set-Cookie', `cms_auth=${CMS_PASS_HASH}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${12 * 60 * 60}`);
                return next();
            }
        }
        // Show minimal password form (no username)
        res.status(401).send(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Accès CMS</title><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,sans-serif;background:#f5f7f4;margin:0;display:flex;min-height:100vh;align-items:center;justify-content:center} .card{background:#fff;padding:24px 28px;border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,0.08);width:min(92vw,360px)} h1{font-size:1.1rem;margin:0 0 12px;color:#1f6e72} label{display:block;margin:12px 0 6px;color:#333} input[type=password]{width:100%;padding:10px 12px;border:1px solid #d0d7cd;border-radius:8px;font-size:1rem} button{width:100%;margin-top:16px;padding:10px 14px;border:none;border-radius:8px;background:#1f6e72;color:#fff;font-weight:700;cursor:pointer} .hint{margin-top:10px;color:#777;font-size:.9rem}</style></head><body><form class="card" method="POST" action="/cms/login"><h1>Accès CMS</h1><label for="password">Mot de passe</label><input id="password" name="password" type="password" autocomplete="current-password" required><button type="submit">Entrer</button><div class="hint">Entrez le mot de passe CMS pour accéder.</div></form></body></html>`);
    } catch (e) {
        console.error('cmsGate error:', e);
        res.status(500).send('CMS auth error');
    }
}

// Serve CMS interface (password-only gate, no impact on public content)
app.get('/cms', cmsGate, (req, res) => {
    res.sendFile(path.join(__dirname, 'cms.html'));
});

// Handle CMS login (password-only)
app.post('/cms/login', express.urlencoded({ extended: true }), (req, res) => {
    try {
        const pw = (req.body && req.body.password) || '';
        if (pw === CMS_SINGLE_PASS) {
            res.setHeader('Set-Cookie', `cms_auth=${CMS_PASS_HASH}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${12 * 60 * 60}`);
            return res.redirect('/cms');
        }
        return res.status(401).send('Invalid password');
    } catch (e) {
        console.error('/cms/login error:', e);
        return res.status(500).send('Login error');
    }
});

// CMS API endpoints  (use persistent files TEAMS_FILE / RIDERS_FILE)

// Get teams
app.get('/api/teams', async (req, res) => {
    try {
        const data = await fs.readFile(TEAMS_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading teams:', error);
        res.status(500).json({ error: 'Failed to load teams' });
    }
});

// Save teams (requires auth)
app.post('/api/teams', basicAuth, async (req, res) => {
    try {
        const teams = req.body;
        
        // Save to CMS data file (persistent)
        await fs.writeFile(TEAMS_FILE, JSON.stringify(teams, null, 2));

        // Also update riders.json (persistent)
        const ridersData = { teams };
        await fs.writeFile(RIDERS_FILE, JSON.stringify(ridersData, null, 2));
        
        // Copy to listeengages directory for the UI (non-persistent mirror)
        const listeEngagesPath = path.join(__dirname, 'listeengages-package', 'listeengages', 'riders.json');
        await fs.writeFile(listeEngagesPath, JSON.stringify(ridersData, null, 2));
        
        // Force cache invalidation by updating a timestamp file
        const timestampPath = path.join(__dirname, 'last-update.txt');
        await fs.writeFile(timestampPath, new Date().toISOString());
        
        console.log('Teams saved successfully to all locations at', new Date().toISOString());
        res.json({ success: true, message: 'Teams saved successfully', timestamp: Date.now() });
    } catch (error) {
        console.error('Error saving teams:', error);
        res.status(500).json({ error: 'Failed to save teams' });
    }
});

// Always serve the PERSISTED riders.json (bypass static) [duplicate removed above]

// API Routes (placeholder for future implementation)

// Weather proxy endpoint (to hide API key)
app.get('/api/weather/current', async (req, res) => {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY || '27fd496c6cc9c8cd6f8981bf682c5dd4';
        
        const lang = req.query.lang || 'fr';
        
        // Coordonnées de Québec (Vieux-Québec)
        const lat = 46.8139;
        const lon = -71.2080;
        
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=${lang}&appid=${apiKey}`;
        
        console.log(`[Safari iOS] Fetching weather for Quebec: ${url}`);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`OpenWeather API failed: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`[Safari iOS] Weather data received for Quebec`);
        
        // Ajouter les headers CORS pour Safari
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        
        res.json(data);
    } catch (error) {
        console.error('Weather API error:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Weather forecast proxy endpoint (hourly, 6 items) for Safari iOS
app.get('/api/weather/forecast', async (req, res) => {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY || '27fd496c6cc9c8cd6f8981bf682c5dd4';
        const lang = req.query.lang || 'fr';
        const lat = 46.8139;
        const lon = -71.2080;
        const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=${lang}&exclude=minutely,daily,alerts,current&appid=${apiKey}&_=${Date.now()}`;
        console.log(`[Safari iOS] Fetching hourly forecast: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`OpenWeather API failed: ${response.status}`);
        }
        const data = await response.json();
        const hourly = Array.isArray(data.hourly) ? data.hourly : [];
        const six = hourly.slice(0, 6).map(item => ({
            dt: item.dt,
            main: { temp: item.temp, feels_like: item.feels_like },
            weather: item.weather
        }));
        // CORS headers for Safari
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.json(six);
    } catch (error) {
        console.error('Weather forecast API error:', error);
        res.status(500).json({ error: 'Failed to fetch forecast data' });
    }
});

// OneCall simulation using standard APIs (OneCall 2.5 is deprecated)
app.get('/api/weather/onecall', async (req, res) => {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY || '27fd496c6cc9c8cd6f8981bf682c5dd4';
        const lang = req.query.lang || 'fr';
        const lat = 46.8139;
        const lon = -71.2080;
        
        // Fetch current weather and forecast in parallel
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=${lang}&appid=${apiKey}`),
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=${lang}&cnt=8&appid=${apiKey}`)
        ]);
        
        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error(`OpenWeather API failed`);
        }
        
        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();
        
        // Convert current weather to OneCall format
        const current = {
            dt: currentData.dt,
            sunrise: currentData.sys.sunrise,
            sunset: currentData.sys.sunset,
            temp: currentData.main.temp,
            feels_like: currentData.main.feels_like,
            pressure: currentData.main.pressure,
            humidity: currentData.main.humidity,
            clouds: currentData.clouds.all,
            visibility: currentData.visibility,
            wind_speed: currentData.wind.speed,
            wind_deg: currentData.wind.deg,
            weather: currentData.weather
        };
        
        // Convert forecast to hourly format (forecast API gives 3-hour intervals)
        // Utiliser une interpolation plus réaliste basée sur les tendances météo
        const hourly = [];
        const now = Date.now() / 1000;
        const currentHour = new Date().getHours();
        
        // Prendre les 3 premières prévisions (9 heures)
        const forecasts = forecastData.list.slice(0, 3);
        
        // Pour chaque heure des 6 prochaines
        for (let h = 1; h <= 6; h++) {
            const targetTime = now + (h * 3600);
            const targetHour = (currentHour + h) % 24;
            
            // Trouver les prévisions encadrantes
            let before = currentData;
            let after = forecasts[0] || currentData;
            
            // Déterminer quelle prévision utiliser
            for (let i = 0; i < forecasts.length; i++) {
                if (forecasts[i].dt <= targetTime) {
                    before = forecasts[i];
                    after = forecasts[i + 1] || forecasts[i];
                } else {
                    after = forecasts[i];
                    break;
                }
            }
            
            // Calculer le poids pour l'interpolation
            let weight = 0;
            if (before.dt !== after.dt) {
                weight = (targetTime - before.dt) / (after.dt - before.dt);
            }
            
            // Interpoler avec une courbe plus naturelle (cosinus pour transition douce)
            const smoothWeight = (1 - Math.cos(weight * Math.PI)) / 2;
            
            // Calculer la température interpolée
            const beforeTemp = before.main ? before.main.temp : before.temp || currentData.main.temp;
            const afterTemp = after.main ? after.main.temp : after.temp || currentData.main.temp;
            const interpolatedTemp = beforeTemp + (afterTemp - beforeTemp) * smoothWeight;
            
            // Ajuster selon l'heure de la journée (effet diurne)
            let diurnalAdjustment = 0;
            if (targetHour >= 6 && targetHour < 12) {
                // Matin : léger réchauffement
                diurnalAdjustment = 0.2;
            } else if (targetHour >= 12 && targetHour < 16) {
                // Après-midi : pic de température
                diurnalAdjustment = 0.5;
            } else if (targetHour >= 16 && targetHour < 20) {
                // Soir : refroidissement
                diurnalAdjustment = -0.2;
            } else {
                // Nuit : plus frais
                diurnalAdjustment = -0.5;
            }
            
            // Appliquer l'ajustement diurne de manière subtile
            const finalTemp = interpolatedTemp + (diurnalAdjustment * 0.3);
            
            hourly.push({
                dt: Math.floor(targetTime),
                temp: Math.round(finalTemp * 10) / 10,
                feels_like: Math.round((finalTemp - 1) * 10) / 10,
                pressure: after.main ? after.main.pressure : after.pressure || currentData.main.pressure,
                humidity: after.main ? after.main.humidity : after.humidity || currentData.main.humidity,
                clouds: after.clouds ? after.clouds.all : currentData.clouds.all,
                wind_speed: after.wind ? after.wind.speed : currentData.wind.speed,
                wind_deg: after.wind ? after.wind.deg : currentData.wind.deg || 0,
                weather: after.weather || currentData.weather
            });
        }
        
        // CORS headers for Safari
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        
        res.json({
            current,
            timezone_offset: -14400, // Quebec timezone offset (EST/EDT)
            hourly: hourly.slice(0, 12)
        });
    } catch (e) {
        console.error('/api/weather/onecall error:', e);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Instagram feed proxy (to hide access token)
app.get('/api/instagram/feed', async (req, res) => {
    try {
        const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
        if (!accessToken) {
            return res.status(503).json({ error: 'Instagram service not configured' });
        }
        
        // Implementation would fetch from Instagram API
        // For now, return mock data
        res.json({
            data: [
                {
                    id: '1',
                    caption: 'Grand Prix Cycliste de Montréal 2025!',
                    media_url: 'https://via.placeholder.com/400',
                    permalink: 'https://instagram.com/grandsprixcyclistes',
                    like_count: 342,
                    comments_count: 28
                }
            ]
        });
    } catch (error) {
        console.error('Instagram API error:', error);
        res.status(500).json({ error: 'Failed to fetch Instagram feed' });
    }
});

// Race status endpoint
app.get('/api/race-status', (req, res) => {
    const now = new Date();
    const raceDate = new Date('2025-09-12T11:00:00-04:00');
    
    let status = 'upcoming';
    if (now >= raceDate && now <= new Date('2025-09-12T16:25:00-04:00')) {
        status = 'live';
    } else if (now > new Date('2025-09-12T16:25:00-04:00')) {
        status = 'finished';
    }
    
    res.json({
        status,
        raceDate: raceDate.toISOString(),
        lastUpdated: now.toISOString()
    });
});

// Health check endpoint for Railway (includes memory and optional DB status)
app.get('/health', async (req, res) => {
    const mem = process.memoryUsage();
    const db = await checkDb();
    res.status(200).json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: {
            rss: mem.rss,
            heapTotal: mem.heapTotal,
            heapUsed: mem.heapUsed,
            external: mem.external
        },
        db: { type: dbType || 'none', ...db }
    });
});

// Cluster debug endpoint: shows worker id and pid handling the request
app.get('/worker', (req, res) => {
    res.json({
        workerId: process.env.WORKER_ID || null,
        pid: process.pid,
        timestamp: new Date().toISOString()
    });
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
    res.json({
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        cpuUsage: process.cpuUsage(),
        timestamp: new Date().toISOString(),
        pageviews,
        users: {
            active_5m: countActive(5 * 60 * 1000),
            active_15m: countActive(15 * 60 * 1000)
        }
    });
});

// Mini dashboard lecture seule pour visualiser les métriques
app.get('/admin/metrics', (req, res) => {
    const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>GPCQ - Métriques</title>
<style>
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,sans-serif;margin:0;background:#f5f7f4;color:#123;}
.wrap{max-width:960px;margin:24px auto;padding:0 16px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}
.card{background:#fff;border-radius:12px;padding:16px;box-shadow:0 6px 20px rgba(0,0,0,.08)}
.title{margin:0 0 8px;font-size:18px;color:#1f6e72}
.val{font-size:28px;font-weight:800}
code,pre{background:#eef2ec;border-radius:8px;padding:8px;display:block;overflow:auto}
.footer{margin-top:18px;color:#678}
button{background:#1f6e72;color:#fff;border:none;border-radius:8px;padding:8px 12px;font-weight:700;cursor:pointer}
</style></head>
<body><div class="wrap">
 <h1 style="margin:0 0 16px;color:#1f6e72">Métriques GPCQ</h1>
 <div class="cards">
  <div class="card"><h2 class="title">Pages ouvertes (total)</h2><div id="pvTotal" class="val">—</div></div>
  <div class="card"><h2 class="title">Pages ouvertes (aujourd'hui)</h2><div id="pvToday" class="val">—</div></div>
  <div class="card"><h2 class="title">Utilisateurs actifs (5 min)</h2><div id="u5" class="val">—</div></div>
  <div class="card"><h2 class="title">Utilisateurs actifs (15 min)</h2><div id="u15" class="val">—</div></div>
 </div>
 <h3 style="margin:24px 0 8px">JSON brut</h3>
 <pre id="raw">Chargement…</pre>
 <div class="footer"><button id="refresh">Rafraîchir</button> <span id="ts"></span></div>
</div>
<script>
async function load(){
  try{
    const r = await fetch('/metrics',{cache:'no-store'});
    const j = await r.json();
    const today = new Date().toISOString().slice(0,10);
    const pvTotal = j.pageviews && j.pageviews.total || 0;
    const pvToday = j.pageviews && j.pageviews.byDate && j.pageviews.byDate[today] || 0;
    const u5 = j.users && j.users.active_5m || 0;
    const u15 = j.users && j.users.active_15m || 0;
    document.getElementById('pvTotal').textContent = pvTotal;
    document.getElementById('pvToday').textContent = pvToday;
    document.getElementById('u5').textContent = u5;
    document.getElementById('u15').textContent = u15;
    document.getElementById('raw').textContent = JSON.stringify(j,null,2);
    document.getElementById('ts').textContent = 'Mis à jour: '+ new Date().toLocaleTimeString();
  }catch(e){ document.getElementById('raw').textContent = 'Erreur: '+e; }
}
document.getElementById('refresh').onclick = load;
load();
setInterval(load, 10000);
</script></body></html>`;
    res.setHeader('Cache-Control', 'no-cache');
    res.send(html);
});

// Handle 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'offline.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', async () => {
    await initDbPool();
    console.log(`
    ========================================
    🚴 GPCQ 2025 PWA Server
    ========================================
    Server running on port ${PORT}
    Environment: ${process.env.NODE_ENV || 'production'}
    URL: http://localhost:${PORT}
    ========================================
    `);
});

// Tune HTTP timeouts for high concurrency
server.keepAliveTimeout = parseInt(process.env.KEEP_ALIVE_TIMEOUT_MS || '65000', 10);
server.headersTimeout = parseInt(process.env.HEADERS_TIMEOUT_MS || '66000', 10);
server.requestTimeout = parseInt(process.env.REQUEST_TIMEOUT_MS || '300000', 10);

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('unhandledRejection', (reason) => {
    console.error('UnhandledRejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('UncaughtException:', err);
});

module.exports = app;