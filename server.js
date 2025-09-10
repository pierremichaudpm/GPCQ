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

// Logging middleware
app.use((req, res, next) => {
    const url = req.originalUrl || req.url || req.path;
    const wid = process.env.WORKER_ID ? `W${process.env.WORKER_ID}` : 'W?';
    console.log(`${new Date().toISOString()} [${wid}] ${req.method} ${url}`);
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
const fs = require('fs').promises;

// CMS Authentication
const CMS_USER = process.env.CMS_USER || 'admin';
const CMS_PASS = process.env.CMS_PASS || 'Quebec2025';

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

// Serve CMS interface
app.get('/cms', (req, res) => {
    res.sendFile(path.join(__dirname, 'cms.html'));
});

// CMS API endpoints  
const TEAMS_FILE = path.join(__dirname, 'teams-data.json');
const RIDERS_FILE = path.join(__dirname, 'riders.json');

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
        
        // Save to CMS data file
        await fs.writeFile(TEAMS_FILE, JSON.stringify(teams, null, 2));
        
        // Also update riders.json
        const ridersData = { teams };
        await fs.writeFile(RIDERS_FILE, JSON.stringify(ridersData, null, 2));
        
        // Copy to listeengages directory for the UI
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
        const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=${lang}&exclude=minutely,daily,alerts,current&appid=${apiKey}`;
        console.log(`[Safari iOS] Fetching hourly forecast: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`OpenWeather API failed: ${response.status}`);
        }
        const data = await response.json();
        const hourly = Array.isArray(data.hourly) ? data.hourly : [];
        const six = hourly.slice(1, 7).map(item => ({
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
        timestamp: new Date().toISOString()
    });
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