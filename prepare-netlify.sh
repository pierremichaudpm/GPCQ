#!/bin/bash

# Script de préparation pour déploiement Netlify
echo "🚀 Préparation pour déploiement Netlify"
echo "========================================"

# Créer les dossiers nécessaires
echo "✓ Création des dossiers d'images..."
mkdir -p images/icons
mkdir -p images/logos
mkdir -p images/screenshots

# Créer des icônes placeholder si elles n'existent pas
if [ ! -f "images/icons/icon-192x192.png" ]; then
    echo "✓ Création d'icônes placeholder..."
    # Créer un fichier PNG placeholder simple
    echo "⚠️  N'oubliez pas de générer les vraies icônes avec generate-icons.html"
fi

# Vérifier les fichiers essentiels
echo ""
echo "📋 Vérification des fichiers..."
files_ok=true

for file in "index.html" "manifest.json" "sw.js" "offline.html"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file manquant!"
        files_ok=false
    fi
done

echo ""
if [ "$files_ok" = true ]; then
    echo "✅ Tous les fichiers essentiels sont présents!"
    echo ""
    echo "🎯 Prochaines étapes:"
    echo "1. Ouvrir generate-icons.html dans un navigateur"
    echo "2. Sauvegarder les icônes dans images/icons/"
    echo "3. Aller sur https://app.netlify.com/drop"
    echo "4. Glisser-déposer ce dossier complet"
    echo ""
    echo "💡 Ou utiliser Netlify CLI:"
    echo "   npm install -g netlify-cli"
    echo "   netlify login"
    echo "   netlify deploy --prod"
else
    echo "⚠️  Certains fichiers manquent. Vérifiez l'installation."
fi

echo ""
echo "========================================"
echo "📁 Dossier prêt pour Netlify: $(pwd)"
echo "========================================"