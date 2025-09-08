# 📋 Checklist de Déploiement - GPCQM 2025 PWA

## ✅ Avant le Déploiement

### 1. Configuration des Icônes
- [ ] Ouvrir `generate-icons.html` dans un navigateur
- [ ] Générer toutes les icônes PWA
- [ ] Sauvegarder les icônes dans `/images/icons/`
- [ ] Vérifier que toutes les tailles sont présentes

### 2. Logos (Optionnel)
- [ ] Remplacer les logos placeholder par les vrais logos GPCQM
- [ ] `images/logos/GPCQM_logo_white.png`
- [ ] `images/logos/GPCQM_logo_colored.png`

### 3. Variables d'Environnement
- [ ] Créer un fichier `.env` basé sur `.env.example`
- [ ] Ajouter la clé API OpenWeatherMap (optionnel)
- [ ] Ajouter le token Instagram (optionnel)
- [ ] Configurer Google Analytics ID dans `index.html`

### 4. Test Local
```bash
# Installer les dépendances
npm install

# Démarrer le serveur
npm start

# Ouvrir http://localhost:3000
```

- [ ] Vérifier le compte à rebours
- [ ] Tester le changement de langue (FR/EN)
- [ ] Vérifier la carte interactive
- [ ] Tester l'installation PWA
- [ ] Vérifier le mode hors ligne

## 🚀 Déploiement sur Railway

### Option A: Via GitHub
1. [ ] Fork/Push le code sur GitHub
2. [ ] Se connecter à [railway.app](https://railway.app)
3. [ ] Créer un nouveau projet
4. [ ] Sélectionner "Deploy from GitHub repo"
5. [ ] Choisir votre repository
6. [ ] Configurer les variables d'environnement dans Railway
7. [ ] Déployer

### Option B: Via CLI
```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Initialiser
railway init

# Déployer
railway up

# Obtenir l'URL
railway domain
```

### Variables à Configurer dans Railway
```
PORT=3000
NODE_ENV=production
OPENWEATHER_API_KEY=votre_clé_ici
INSTAGRAM_ACCESS_TOKEN=votre_token_ici
GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🔍 Vérifications Post-Déploiement

### Performance
- [ ] Tester avec Lighthouse (score PWA > 90)
- [ ] Vérifier le temps de chargement (< 3 secondes)
- [ ] Tester sur connexion 3G lente

### Compatibilité
- [ ] Tester sur Chrome/Safari/Firefox
- [ ] Vérifier sur iOS (iPhone/iPad)
- [ ] Vérifier sur Android
- [ ] Tester l'installation PWA sur mobile

### Fonctionnalités
- [ ] Compte à rebours fonctionne
- [ ] Changement de langue OK
- [ ] Carte interactive responsive
- [ ] Mode hors ligne opérationnel
- [ ] Service Worker actif

### Monitoring
- [ ] Vérifier `/health` endpoint
- [ ] Consulter les logs Railway
- [ ] Vérifier Google Analytics
- [ ] Tester les métriques (`/metrics`)

## 📊 Optimisations Recommandées

### Pour Production
1. **CDN pour images**
   - Utiliser Cloudflare ou similaire
   - Optimiser les images (WebP)

2. **Clés API**
   - OpenWeatherMap pour météo réelle
   - Instagram Basic Display pour feed live
   - Google Analytics pour tracking

3. **Domaine personnalisé**
   ```bash
   railway domain
   ```
   Ou configurer `app.gpcqm.ca`

4. **SSL/HTTPS**
   - Automatique avec Railway
   - Requis pour PWA

## 🐛 Dépannage Commun

### Problème: PWA ne s'installe pas
- Vérifier HTTPS activé
- Vérifier manifest.json valide
- Service Worker doit être actif

### Problème: Mode hors ligne ne fonctionne pas
```javascript
// Forcer mise à jour Service Worker
navigator.serviceWorker.getRegistration().then(reg => {
    reg.unregister();
    window.location.reload();
});
```

### Problème: Erreur de déploiement Railway
- Vérifier `package.json` est valide
- Vérifier les logs: `railway logs`
- Redéployer: `railway up --force`

## 📞 Support

### Ressources
- [Documentation Railway](https://docs.railway.app)
- [PWA Guidelines](https://web.dev/progressive-web-apps/)
- [MDN Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

### Contact Technique
- GitHub Issues du projet
- Email: dev@gpcqm.ca

## ✨ Lancement Réussi!

Une fois toutes les étapes complétées:
1. L'application est accessible via l'URL Railway
2. Les utilisateurs peuvent l'installer comme PWA
3. Le mode hors ligne est fonctionnel
4. Le monitoring est actif

**Bonne course! 🚴‍♂️**

---
*Dernière mise à jour: Décembre 2024*