#!/bin/bash

# Script de test local pour GPCQM PWA
echo "🚴 Test local de l'application GPCQM 2025 PWA"
echo "============================================"

# Vérifier Node.js
echo "✔ Vérification de Node.js..."
node_version=$(node -v)
echo "  Version Node.js: $node_version"

# Vérifier npm
echo "✔ Vérification de npm..."
npm_version=$(npm -v)
echo "  Version npm: $npm_version"

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "✔ Installation des dépendances..."
    npm install
else
    echo "✔ Dépendances déjà installées"
fi

# Créer les dossiers nécessaires
echo "✔ Création des dossiers..."
mkdir -p images/icons
mkdir -p images/logos
mkdir -p images/screenshots

# Message d'instructions
echo ""
echo "============================================"
echo "📋 Instructions pour tester l'application:"
echo ""
echo "1. Générer les icônes:"
echo "   Ouvrez generate-icons.html dans un navigateur"
echo "   et sauvegardez les icônes dans images/icons/"
echo ""
echo "2. Démarrer le serveur:"
echo "   npm start"
echo ""
echo "3. Ouvrir dans le navigateur:"
echo "   http://localhost:3000"
echo ""
echo "4. Tester les fonctionnalités PWA:"
echo "   - Chrome DevTools > Application > Manifest"
echo "   - Chrome DevTools > Application > Service Workers"
echo "   - Chrome DevTools > Lighthouse > Run audit"
echo ""
echo "5. Tester l'installation:"
echo "   - Attendre 30 secondes pour voir le prompt"
echo "   - Ou cliquer sur l'icône d'installation dans la barre d'adresse"
echo ""
echo "============================================"
echo "🚀 Prêt à démarrer! Exécutez: npm start"