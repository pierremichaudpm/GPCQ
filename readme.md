# 🚴 Grand Prix Cycliste de Montréal 2025 - PWA

Une Progressive Web Application (PWA) complète et moderne pour le Grand Prix Cycliste de Montréal 2025.

## 🌟 Fonctionnalités

### Application Web Progressive
- ✅ Installation sur l'écran d'accueil
- ✅ Mode hors ligne complet
- ✅ Mise à jour automatique
- ✅ Notifications push (préparées)
- ✅ Synchronisation en arrière-plan

### Fonctionnalités Principales
- 🕐 **Compte à rebours dynamique** vers le départ de la course
- 🗺️ **Carte interactive du parcours** avec points d'intérêt
- 🌤️ **Météo en temps réel** pour Montréal
- 📱 **Intégration Instagram** pour les dernières publications
- 📅 **Programme complet** avec timeline interactive
- 🌐 **Bilingue** (Français/English)
- 📱 **Design responsive** optimisé pour mobile

### Performance
- ⚡ Chargement rapide (<3 secondes)
- 💾 Cache intelligent avec Service Worker
- 🎯 Optimisé pour Railway hosting
- 📊 Google Analytics 4 intégré

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 16+ et npm 8+
- Compte Railway (pour le déploiement)
- Clés API (optionnelles) :
  - OpenWeatherMap API
  - Instagram Basic Display API
  - Google Analytics 4

### Installation Locale

1. **Cloner le projet**
```bash
git clone https://github.com/gpcqm/pwa-2025.git
cd gpcqm-pwa
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des variables d'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos clés API
```

4. **Lancer le serveur de développement**
```bash
npm start
```

5. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

## 🚄 Déploiement sur Railway

### Méthode 1: Via GitHub

1. **Fork ce repository** sur GitHub

2. **Connecter à Railway**
   - Aller sur [railway.app](https://railway.app)
   - Créer un nouveau projet
   - Choisir "Deploy from GitHub repo"
   - Sélectionner votre fork

3. **Configurer les variables d'environnement**
   Dans Railway Dashboard :
   - Aller dans Settings > Variables
   - Ajouter :
     ```
     PORT=3000
     NODE_ENV=production
     OPENWEATHER_API_KEY=votre_clé
     INSTAGRAM_ACCESS_TOKEN=votre_token
     ```

4. **Déployer**
   - Railway déploiera automatiquement
   - URL disponible dans Settings > Domains

### Méthode 2: Via Railway CLI

1. **Installer Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login**
```bash
railway login
```

3. **Initialiser le projet**
```bash
railway init
```

4. **Déployer**
```bash
railway up
```

5. **Ajouter un domaine**
```bash
railway domain
```

## 📁 Structure du Projet

```
GPCQM-pwa/
├── index.html          # Page principale
├── offline.html        # Page hors ligne
├── manifest.json       # Configuration PWA
├── sw.js              # Service Worker
├── server.js          # Serveur Express
├── package.json       # Dépendances npm
├── railway.json       # Config Railway
├── css/
│   ├── style.css      # Styles principaux
│   └── responsive.css # Styles responsive
├── js/
│   ├── app.js         # Logique principale
│   ├── countdown.js   # Compte à rebours
│   ├── map.js        # Carte interactive
│   ├── weather.js    # Intégration météo
│   ├── instagram.js  # Feed Instagram
│   └── pwa.js        # Fonctionnalités PWA
└── images/
    ├── icons/        # Icônes PWA
    └── logos/        # Logos GPCQM
```

## 🔧 Configuration

### Variables d'Environnement

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `PORT` | Port du serveur | ✅ |
| `NODE_ENV` | Environnement (production/development) | ✅ |
| `OPENWEATHER_API_KEY` | Clé API OpenWeatherMap | ❌ |
| `INSTAGRAM_ACCESS_TOKEN` | Token Instagram | ❌ |
| `GA_MEASUREMENT_ID` | ID Google Analytics | ❌ |

### Obtenir les Clés API

#### OpenWeatherMap
1. Créer un compte sur [openweathermap.org](https://openweathermap.org/api)
2. Générer une clé API gratuite
3. Ajouter dans `.env`

#### Instagram Basic Display
1. Créer une app sur [developers.facebook.com](https://developers.facebook.com)
2. Configurer Instagram Basic Display
3. Obtenir un token d'accès long terme
4. Ajouter dans `.env`

#### Google Analytics 4
1. Créer une propriété sur [analytics.google.com](https://analytics.google.com)
2. Obtenir l'ID de mesure (G-XXXXXXXXXX)
3. Remplacer dans `index.html`

## 📱 Installation PWA

### Sur Android
1. Ouvrir le site dans Chrome
2. Menu (⋮) > "Ajouter à l'écran d'accueil"
3. Suivre les instructions

### Sur iOS
1. Ouvrir le site dans Safari
2. Bouton partage > "Sur l'écran d'accueil"
3. Confirmer l'ajout

### Sur Desktop
1. Ouvrir le site dans Chrome/Edge
2. Cliquer sur l'icône d'installation dans la barre d'adresse
3. Suivre les instructions

## 🎨 Personnalisation

### Modifier les Couleurs
Éditer les variables CSS dans `css/style.css`:
```css
:root {
    --primary-green: #6BA053;
    --accent-green: #C8D83F;
    --deep-blue: #1D5077;
}
```

### Ajouter des Traductions
Éditer l'objet `translations` dans `js/app.js`:
```javascript
const translations = {
    fr: { /* traductions françaises */ },
    en: { /* English translations */ }
};
```

### Modifier le Parcours
Remplacer l'image dans `index.html`:
```html
<img src="votre-image-parcours.png" class="course-map">
```

## 🔍 Tests

### Tests de Performance
```bash
# Lighthouse CLI
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```

### Tests PWA
- Chrome DevTools > Application > Manifest
- Chrome DevTools > Application > Service Workers
- Chrome DevTools > Lighthouse > PWA Audit

## 📊 Monitoring

### Railway Metrics
- CPU et mémoire : Railway Dashboard > Metrics
- Logs : Railway Dashboard > Logs
- Santé : Endpoint `/health`

### Google Analytics
- Voir le dashboard sur [analytics.google.com](https://analytics.google.com)
- Événements trackés :
  - Installations PWA
  - Changements de langue
  - Clics sur la carte
  - Interactions avec les liens

## 🐛 Dépannage

### L'app ne s'installe pas
- Vérifier HTTPS (requis pour PWA)
- Vérifier manifest.json
- Vider le cache du navigateur

### Service Worker ne fonctionne pas
```javascript
// Forcer la mise à jour
navigator.serviceWorker.getRegistration().then(reg => {
    reg.unregister();
    window.location.reload();
});
```

### Problème de cache
```bash
# Vider le cache Railway
railway run npm run build --force
```

## 📝 Mise à Jour du Contenu

### Changer la Date de Course
1. Éditer `RACE_SCHEDULE` dans `js/countdown.js`
2. Mettre à jour les textes dans `index.html`

### Actualiser les Infos Météo
1. Obtenir une clé API OpenWeatherMap
2. Ajouter dans les variables d'environnement
3. Le widget se met à jour automatiquement

### Modifier le Feed Instagram
1. Configurer Instagram Basic Display API
2. Ajouter le token dans les variables
3. Le feed se rafraîchit toutes les 30 minutes

## 🤝 Contribution

Les contributions sont bienvenues! 

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amélioration`)
3. Commit (`git commit -m 'Ajouter une fonctionnalité'`)
4. Push (`git push origin feature/amélioration`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - Voir [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- UCI WorldTour
- Ville de Montréal
- Groupe Tonic
- Tous les partenaires du GPCQM

## 📞 Support

Pour toute question ou problème :
- 📧 Email : support@gpcqm.ca
- 🌐 Site : [gpcqm.ca](https://gpcqm.ca)
- 📱 Instagram : [@grandsprixcyclistes](https://instagram.com/grandsprixcyclistes)

---

**Développé avec ❤️ pour le Grand Prix Cycliste de Montréal 2025**