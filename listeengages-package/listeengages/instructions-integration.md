# Instructions d'intégration - Liste des partants GPCQM 2025

## 📦 Contenu du package

Ce package contient tous les éléments nécessaires pour intégrer la fonctionnalité "Liste des partants" du Grand Prix Cycliste de Montréal 2025 dans votre projet.

### Structure des fichiers :
```
listeengages/
├── listeengages.html       # Fichier HTML autonome
├── css/
│   └── riders-styles.css   # Tous les styles CSS nécessaires
├── js/
│   └── riders.js           # JavaScript complet avec les données
├── images/
│   └── jerseys/           # Images des maillots d'équipes (optionnel)
└── INSTRUCTIONS-INTEGRATION.md
```

## 🚀 Intégration rapide (Version Autonome)

### Option 1 : Page complète autonome
1. Ouvrez simplement le fichier `listeengages.html` dans un navigateur
2. La fonctionnalité est immédiatement disponible avec un bouton pour ouvrir la modal

### Option 2 : Intégration dans votre site existant

#### Étape 1 : Copier les fichiers
```bash
# Copiez les dossiers css, js et images dans votre projet
cp -r css/* /chemin/vers/votre/projet/css/
cp -r js/* /chemin/vers/votre/projet/js/
cp -r images/* /chemin/vers/votre/projet/images/
```

#### Étape 2 : Ajouter le HTML dans votre page

Ajoutez ce code HTML où vous voulez dans votre page :

```html
<!-- Bouton pour ouvrir la liste (personnalisable) -->
<button onclick="openRidersModal()">🚴 Liste des partants</button>

<!-- Modal des riders (à ajouter avant la fermeture de </body>) -->
<div id="ridersModal" class="riders-modal" style="display: none;">
    <div class="riders-modal-overlay" onclick="closeRidersModal()"></div>
    <div class="riders-modal-content">
        <!-- Modal Header -->
        <div class="riders-modal-header">
            <h2>Liste des partants - GPCQM 2025</h2>
            <button class="riders-modal-close" onclick="closeRidersModal()">×</button>
        </div>

        <!-- Stats Bar -->
        <div class="riders-stats">
            <div class="stat-item">
                <span class="stat-number">190</span>
                <span class="stat-label">Coureurs</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">24</span>
                <span class="stat-label">Équipes UCI</span>
            </div>
        </div>

        <!-- Search Bar -->
        <div class="riders-search-container">
            <input type="text" 
                   id="ridersSearch" 
                   class="riders-search-input" 
                   placeholder="Rechercher un coureur, une équipe..." 
                   onkeyup="searchRiders()">
            <span class="riders-search-icon">🔍</span>
        </div>

        <!-- Modal Body -->
        <div class="riders-modal-body">
            <div id="teamsView" class="riders-view active">
                <div class="teams-accordion" id="teamsAccordion"></div>
            </div>
            <div id="searchResultsView" class="riders-view" style="display: none;">
                <div class="search-results-list" id="searchResultsList"></div>
            </div>
        </div>

        <!-- Modal Footer -->
        <div class="riders-modal-footer">
            <p class="riders-info">
                <span class="info-icon">ℹ️</span>
                Données officielles UCI World Tour 2025
            </p>
        </div>
    </div>
</div>
```

#### Étape 3 : Inclure les ressources

Dans le `<head>` de votre page HTML :

```html
<!-- CSS -->
<link rel="stylesheet" href="css/riders-styles.css">

<!-- Font (si pas déjà inclus) -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Avant la fermeture de `</body>` :

```html
<!-- JavaScript -->
<script src="js/riders.js"></script>
```

## 🎨 Personnalisation

### Changer les couleurs principales

Dans `css/riders-styles.css`, modifiez les couleurs du thème :

```css
/* Couleur principale */
--primary-color: #6BA053;  /* Vert par défaut */
--primary-dark: #5a8f44;   /* Vert foncé */

/* Remplacez toutes les occurrences de #6BA053 et #5a8f44 */
```

### Modifier le bouton d'ouverture

```html
<!-- Exemple de bouton personnalisé -->
<button class="votre-classe-custom" onclick="openRidersModal()">
    Voir les coureurs
</button>
```

### Ouvrir automatiquement au chargement

```javascript
window.addEventListener('DOMContentLoaded', function() {
    openRidersModal();
});
```

## 📱 Fonctionnalités incluses

- ✅ **Liste complète** : 24 équipes UCI et 190 coureurs
- ✅ **Recherche en temps réel** : Par nom de coureur ou d'équipe
- ✅ **Design responsive** : Adapté mobile et desktop
- ✅ **Accordéon interactif** : Expansion/réduction des équipes
- ✅ **Maillots d'équipes** : Affichage visuel (si images disponibles)
- ✅ **Raccourcis clavier** : 
  - `ESC` pour fermer
  - `/` ou `Ctrl+F` pour focus sur la recherche

## 🔧 API JavaScript disponible

```javascript
// Ouvrir la modal
openRidersModal();

// Fermer la modal
closeRidersModal();

// Rechercher programmatiquement
document.getElementById('ridersSearch').value = "Pogačar";
searchRiders();

// Accéder aux données
console.log(ridersData.teams); // Toutes les équipes et coureurs
```

## 📊 Structure des données

Les données sont stockées dans `js/riders.js` dans l'objet `ridersData` :

```javascript
ridersData = {
    teams: [
        {
            id: 1,
            name: "UAE Team Emirates",
            country: "🇦🇪",
            riders: [
                { number: 51, name: "Tadej POGAČAR", country: "🇸🇮" },
                // ...
            ]
        },
        // ... autres équipes
    ]
}
```

## ⚠️ Notes importantes

1. **Images des maillots** : Le dossier `images/jerseys/` contient quelques maillots. Si des images manquent, le système affiche automatiquement un maillot SVG généré avec les couleurs de l'équipe.

2. **Compatibilité** : Testé sur Chrome, Firefox, Safari, Edge (versions récentes)

3. **Performance** : La modal charge toutes les données au premier clic pour une navigation fluide

4. **Accessibilité** : Includes ARIA labels et navigation au clavier

## 🆘 Dépannage

### La modal ne s'ouvre pas
- Vérifiez que `riders.js` est bien chargé
- Vérifiez la console pour les erreurs JavaScript
- Assurez-vous que les IDs des éléments HTML ne sont pas dupliqués

### Les styles ne s'appliquent pas
- Vérifiez le chemin vers `riders-styles.css`
- Assurez-vous qu'il n'y a pas de conflits CSS avec votre site

### Les maillots ne s'affichent pas
- C'est normal si les images ne sont pas disponibles
- Le système utilise automatiquement des maillots SVG de fallback

## 📞 Support

Pour toute question sur l'intégration, référez-vous au code source ou contactez votre équipe technique.

---

**Version** : 1.0  
**Date** : Décembre 2024  
**Événement** : Grand Prix Cycliste de Montréal 2025