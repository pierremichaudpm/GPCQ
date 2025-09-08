// Chargeur de données pour la liste des engagés
let ridersData = { teams: [] };

// Fonction pour charger les données depuis riders.json
async function loadRidersData() {
    try {
        // Essayer de charger depuis le fichier riders.json à la racine
        const response = await fetch('/riders.json');
        if (response.ok) {
            ridersData = await response.json();
            console.log('Données chargées:', ridersData.teams.length, 'équipes');
            // Déclencher le rendu après chargement
            if (typeof renderRidersModal !== 'undefined') {
                renderRidersModal();
            }
        } else {
            console.error('Impossible de charger riders.json');
            // Utiliser les données par défaut du fichier riders.js
        }
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // Utiliser les données par défaut du fichier riders.js
    }
}

// Charger les données au démarrage
document.addEventListener('DOMContentLoaded', loadRidersData);
