# 📱 GPCQM PWA - Application Mobile-First avec QR Code

## 🎯 Concept

Cette Progressive Web Application est conçue spécifiquement pour être **téléchargée sur site** lors du Grand Prix Cycliste de Montréal 2025 via un **QR code**.

## 📲 Scénario d'Usage

1. **Sur Site (Jour de l'événement)**
   - Les spectateurs scannent le QR code affiché
   - L'app s'ouvre instantanément dans leur navigateur
   - Prompt d'installation apparaît après 30 secondes
   - Installation en 1 clic sur l'écran d'accueil

2. **Utilisation Pendant la Course**
   - Compte à rebours en temps réel
   - Programme toujours accessible
   - Carte du parcours interactive
   - Mode hors ligne disponible

## 🎨 Design Mobile-First

### Optimisations Appliquées

#### **Header Compact**
- Logo coloré sur fond blanc (meilleure visibilité au soleil)
- Titre en vert foncé pour contraste optimal
- Bouton langue petit (36x42px) mais touch-friendly

#### **Hero Section**
- **"Épreuve UCI World Tour"** - Prestige de l'événement
- Date simplifiée: "14 septembre 2025 • Montréal"
- Image de fond avec overlay pour lisibilité

#### **Navigation Simplifiée**
- Grosses zones tactiles (minimum 44px)
- Scroll vertical naturel
- Sections bien séparées

## 📊 Caractéristiques Techniques

### Performance Mobile
- **Taille légère**: < 2MB total
- **Chargement rapide**: < 3 secondes en 4G
- **Cache offline**: Fonctionne sans connexion
- **PWA optimisée**: Installation native

### Compatibilité
- ✅ iOS Safari 12+
- ✅ Android Chrome 80+
- ✅ Samsung Internet
- ✅ Firefox Mobile

## 🔧 Génération du QR Code

### Option 1: Service en Ligne
```
URL à encoder: https://votre-domaine.com
Taille recommandée: 300x300px minimum
Correction d'erreur: Niveau H (30%)
```

### Option 2: Générateur HTML
```html
<!DOCTYPE html>
<html>
<head>
    <title>QR Code GPCQM</title>
    <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
</head>
<body>
    <div id="qrcode" style="margin: 50px auto; width: 300px;"></div>
    <script>
        new QRCode(document.getElementById("qrcode"), {
            text: "https://app.gpcqm.ca",
            width: 300,
            height: 300,
            colorDark: "#6BA053",
            colorLight: "#FFFFFF",
            correctLevel: QRCode.CorrectLevel.H
        });
    </script>
</body>
</html>
```

## 📍 Placement des QR Codes sur Site

### Emplacements Recommandés
1. **Entrée du Village des Fans**
   - Panneau A1 avec instructions
   - Staff avec tablettes

2. **Points de Vue Stratégiques**
   - Belvédère Camilien-Houde
   - Ligne Départ/Arrivée
   - Zones spectateurs

3. **Materials Promotionnels**
   - Flyers distribués
   - Programme officiel
   - Bracelets/badges

## 📱 Instructions pour Spectateurs

### Français
```
TÉLÉCHARGEZ L'APP OFFICIELLE
1. Scannez le QR code
2. Cliquez "Installer" quand demandé
3. Profitez de l'app même hors ligne!
```

### English
```
DOWNLOAD THE OFFICIAL APP
1. Scan the QR code
2. Click "Install" when prompted
3. Enjoy the app even offline!
```

## 🚀 Avantages du QR Code

1. **Installation Instantanée**
   - Pas d'App Store/Google Play
   - Pas de compte requis
   - Gratuit et rapide

2. **Engagement Sur Site**
   - Conversion élevée
   - Usage immédiat
   - Valeur ajoutée pour spectateurs

3. **Analytics**
   - Tracking des scans
   - Taux d'installation
   - Usage en temps réel

## 📈 Métriques à Suivre

- Nombre de scans QR
- Taux d'installation PWA
- Temps d'usage moyen
- Features les plus utilisées
- Retour des utilisateurs

## 🎯 Objectifs

- **5,000+** installations le jour J
- **80%** taux de rétention pendant l'événement
- **4.5+** note de satisfaction
- **60%** usage des features offline

---

**Cette app est optimisée pour une expérience mobile exceptionnelle lors du Grand Prix Cycliste de Montréal 2025!**