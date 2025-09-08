#!/bin/bash

echo "🚀 DÉPLOIEMENT NETLIFY - GPCQM PWA"
echo "==================================="
echo ""

# Version bump pour forcer le rafraîchissement
VERSION="2.1"

echo "📋 Checklist pré-déploiement:"
echo ""
echo "✅ Service Worker v2.0.0"
echo "✅ Cache buster CSS/JS ?v=2.0"
echo "✅ Header: Titre augmenté 25%"
echo "✅ Hero: Titre réduit pour une ligne"
echo "✅ Timeline: Meilleur alignement"
echo ""

echo "🔧 Mise à jour de la version dans les fichiers..."

# Update version in index.html
sed -i "s/v=2.0/v=$VERSION/g" index.html
echo "   • index.html mis à jour"

# Update service worker cache name
sed -i "s/gpcqm-v2.0.0/gpcqm-v$VERSION/g" sw.js
echo "   • Service Worker mis à jour"

echo ""
echo "📦 Fichiers prêts pour Netlify:"
ls -la index.html css/style.css css/responsive.css sw.js | awk '{print "   • " $9 " (" $5 " bytes)"}'

echo ""
echo "==================================="
echo "🌐 ÉTAPES DE DÉPLOIEMENT:"
echo ""
echo "1. SUPPRIMEZ l'ancien déploiement sur Netlify"
echo "2. Créez un NOUVEAU déploiement:"
echo "   • Allez sur app.netlify.com"
echo "   • Sites > Add new site > Deploy manually"
echo "   • Glissez-déposez ce dossier"
echo ""
echo "3. OU utilisez Netlify CLI:"
echo "   npm install -g netlify-cli"
echo "   netlify login"
echo "   netlify deploy --prod --dir ."
echo ""
echo "==================================="
echo "⚠️  IMPORTANT POUR LE CLIENT:"
echo ""
echo "• Demandez-lui de vider le cache:"
echo "  - Chrome: Ctrl+Shift+Suppr"
echo "  - Mobile: Paramètres > Effacer données navigation"
echo ""
echo "• Ou ouvrir en navigation privée"
echo "• Ou utiliser une nouvelle URL Netlify"
echo ""