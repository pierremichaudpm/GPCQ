#!/bin/bash

echo "🔧 Test et Déploiement GPCQM PWA"
echo "================================"
echo ""

# 1. Nettoyer le cache du navigateur
echo "📋 Instructions pour nettoyer le cache:"
echo "1. Ouvrir Chrome DevTools (F12)"
echo "2. Onglet Application > Storage"
echo "3. Cliquer 'Clear site data'"
echo ""

# 2. Vérifier les changements
echo "✅ Vérifications des changements:"
echo ""

echo "Header blanc?"
grep -n "background: var(--white)" css/style.css | head -1

echo ""
echo "Menu burger?"
grep -n "menu-toggle" index.html | head -1

echo ""
echo "Service Worker v2?"
grep -n "gpcqm-v2" sw.js | head -1

echo ""
echo "Cache buster CSS?"
grep -n "css/style.css?v=2" index.html | head -1

echo ""
echo "================================"
echo "🚀 Pour déployer sur Netlify:"
echo ""
echo "1. SUPPRIMER le déploiement actuel sur Netlify"
echo "2. Créer un NOUVEAU déploiement (nouvelle URL)"
echo "3. Ou utiliser Netlify CLI:"
echo "   netlify deploy --prod --dir ."
echo ""
echo "================================"
echo "🧹 Pour forcer le nettoyage complet:"
echo ""
echo "Sur le site déployé:"
echo "1. Ouvrir Chrome DevTools"
echo "2. Application > Service Workers > Unregister"
echo "3. Application > Storage > Clear site data"
echo "4. Hard refresh: Ctrl+Shift+R"
echo ""