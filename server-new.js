// === GPCQM 2025 PWA - New Express Server ===

const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.NEW_APP_PORT || 4000;

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.google-analytics.com", "https://snapwidget.com"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'", "https://api.openweathermap.org", "https://graph.instagram.com", "https://www.google-analytics.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'", "https://player.vimeo.com", "https://vimeo.com"],
            frameSrc: ["'self'", "https://player.vimeo.com", "https://www.youtube.com", "https://www.google.com", "https://www.google.ca", "https://snapwidget.com"],
            childSrc: ["'self'", "https://player.vimeo.com", "https://www.youtube.com", "https://www.google.com", "https://www.google.ca", "https://snapwidget.com"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic logging
app.use((req, res, next) => {
    const url = req.originalUrl || req.url || req.path;
    console.log(`${new Date().toISOString()} - [NEW] ${req.method} ${url}`);
    next();
});

// Static files (same root)
app.use(express.static(path.join(__dirname)));

// Health
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy:new', port: PORT, timestamp: new Date().toISOString() });
});

// Root
app.get('/', (req, res) => {
    res.send('<h1>Nouvelle App GPCQM</h1><p>Server-new opérationnel.</p>');
});

// 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'offline.html'));
});

// Error
app.use((err, req, res, next) => {
    console.error('New server error:', err.stack);
    res.status(500).json({ error: 'Something went wrong (new server)!' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n=== 🚴 New GPCQM server running on http://localhost:${PORT} ===`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM: closing new server');
    server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
    console.log('SIGINT: closing new server');
    server.close(() => process.exit(0));
});

module.exports = app;


