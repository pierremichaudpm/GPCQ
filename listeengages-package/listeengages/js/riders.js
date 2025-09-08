// === GPCQM 2025 - Riders Modal Management ===

// Données officielles des équipes et coureurs GPCQM 2025
// Team colors and jersey mapping
const teamStyles = {
    "UAE Team Emirates": { color: "#000000", bg: "#FFD700", jersey: "uae-team-emirates.png" },
    "Lotto Dstny": { color: "#ED1C24", bg: "#FFFFFF", jersey: "lotto-dstny.png" },
    "Team Visma | Lease a Bike": { color: "#FFD700", bg: "#000000", jersey: "team-visma-lease-a-bike.png" },
    "INEOS Grenadiers": { color: "#E30613", bg: "#001E3A", jersey: "ineos-grenadiers.png" },
    "Soudal Quick-Step": { color: "#003189", bg: "#FFFFFF", jersey: "soudal-quick-step.png" },
    "Lidl-Trek": { color: "#E30613", bg: "#000000", jersey: "lidl-trek.png" },
    "Decathlon AG2R La Mondiale Team": { color: "#8B4513", bg: "#87CEEB", jersey: "decathlon-ag2r.png" },
    "Red Bull - BORA - hansgrohe": { color: "#00A551", bg: "#FFFFFF", jersey: "red-bull-bora.png" },
    "Alpecin-Deceuninck": { color: "#00A9E0", bg: "#FFFFFF", jersey: "alpecin-deceuninck.png" },
    "Groupama-FDJ": { color: "#003DA5", bg: "#FFFFFF", jersey: "groupama-fdj.png" },
    "EF Education - EasyPost": { color: "#EF3340", bg: "#003D7C", jersey: "ef-education.png" },
    "Bahrain Victorious": { color: "#ED1C24", bg: "#FFD700", jersey: "bahrain-victorious.png" },
    "Movistar Team": { color: "#003D7C", bg: "#00B4E6", jersey: "movistar-team.png" },
    "Team Jayco AlUla": { color: "#FFD700", bg: "#000080", jersey: "team-jayco-alula.png" },
    "Arkéa-B&B Hotels": { color: "#E30613", bg: "#FFFFFF", jersey: "arkea-bb-hotels.png" },
    "Team DSM-Firmenich PostNL": { color: "#000000", bg: "#FF6600", jersey: "team-dsm.png" },
    "Intermarché - Wanty": { color: "#00A9E0", bg: "#FFFFFF", jersey: "intermarche-wanty.png" },
    "Cofidis": { color: "#ED1C24", bg: "#FFFFFF", jersey: "cofidis.png" },
    "Astana Qazaqstan Team": { color: "#00BFFF", bg: "#FFD700", jersey: "astana-qazaqstan.png" },
    "Israel - Premier Tech": { color: "#0038A8", bg: "#FFFFFF", jersey: "israel-premier-tech.png" },
    "Uno-X Mobility": { color: "#FFD700", bg: "#E30613", jersey: "uno-x-mobility.png" },
    "Tudor Pro Cycling Team": { color: "#E30613", bg: "#000000", jersey: "tudor-pro-cycling.png" },
    "Équipe Canada": { color: "#FF0000", bg: "#FFFFFF", jersey: "equipe-canada.png" }
};

let ridersData = {
    teams: [
        {
            id: 1,
            name: "UAE Team Emirates",
            displayName: "UAE TEAM EMIRATES XRG",
            country: "🇦🇪",
            director: "PEDRAZZINI, SIMONE (SUI)",
            riders: [
                { number: 11, name: "Tadej POGACAR", country: "🇸🇮" },
                { number: 12, name: "Brandon MCNULTY", country: "🇺🇸" },
                { number: 13, name: "Jhonatan NARVAEZ", country: "🇪🇨" },
                { number: 14, name: "Nils POLITT", country: "🇩🇪" },
                { number: 15, name: "Pavel SIVAKOV", country: "🇫🇷" },
                { number: 16, name: "Tim WELLENS", country: "🇧🇪" },
                { number: 17, name: "Adam YATES", country: "🇬🇧" },
                
            ]
        },
        {
            id: 2,
            name: "Lotto Dstny",
            displayName: "LOTTO",
            country: "🇧🇪",
            director: "GALLOPIN, Tony",
            riders: [
                { number: 181, name: "DE LIE, Arnaud", country: "🇧🇪" },
                { number: 182, name: "BERCKMOES, Jenno", country: "🇧🇪" },
                { number: 183, name: "DRIZNERS, Jarrad", country: "🇦🇺" },
                { number: 184, name: "GRIGNARD, Sébastien", country: "🇧🇪" },
                { number: 185, name: "THOMPSON, Reuben", country: "🇳🇿" },
                { number: 186, name: "CURRIE, Logan", country: "🇳🇿" },
                { number: 187, name: "VANDENABEELE, Henri", country: "🇧🇪" }
            ]
        },
        {
            id: 3,
            name: "Team Visma | Lease a Bike",
            displayName: "TEAM VISMA | LEASE A BIKE",
            director: "MAASSEN, Frans",
            country: "🇳🇱",
            riders: [
                { number: 21, name: "VAN AERT, Wout", country: "🇧🇪" },
                { number: 22, name: "BENOOT, Tiesj", country: "🇧🇪" },
                { number: 23, name: "LAPORTE, Christophe", country: "🇫🇷" },
                { number: 24, name: "NORDHAGEN, Jorgen", country: "🇳🇴" },
                { number: 25, name: "VALTER, Attila", country: "🇭🇺" },
                { number: 26, name: "YATES, Simon", country: "🇬🇧" },
                { number: 27, name: "KRUIJSWIJK, Steven", country: "🇳🇱" }
            ]
        },
        {
            id: 4,
            name: "INEOS Grenadiers",
            country: "🇬🇧",
            displayName: "INEOS GRENADIERS",
            director: "BASSO, LEONARDO (ITA)",
            riders: [
                { number: 51, name: "LAURANCE, Axel", country: "🇫🇷" },
                { number: 52, name: "AUGUST, Andrew Jacob", country: "🇺🇸" },
                { number: 53, name: "HAMILTON, Lucas", country: "🇦🇺" },
                { number: 54, name: "LEONARD, Michael", country: "🇨🇦" },
                { number: 55, name: "HANSEN, Peter Øxenberg", country: "🇩🇰" },
                { number: 56, name: "PUCCIO, Salvatore", country: "🇮🇹" },
                { number: 57, name: "SCHMIDT, Artem", country: "🇺🇸" }
            ]
        },
        {
            id: 5,
            name: "Soudal Quick-Step",
            country: "🇧🇪",
            riders: [
                { number: 41, name: "CATTANEO, Mattia", country: "🇮🇹" },
                { number: 42, name: "EENKHOORN, Pascal", country: "🇳🇱" },
                { number: 43, name: "GELDERS, Gil", country: "🇧🇪" },
                { number: 44, name: "HUBY, Antoine", country: "🇫🇷" },
                { number: 45, name: "PARET-PEINTRE, Valentin", country: "🇫🇷" },
                { number: 46, name: "LAMPERTI, Lucianno", country: "🇺🇸" },
                { number: 47, name: "SERRY, Pieter", country: "🇧🇪" }
            ]
        },
        {
            id: 6,
            name: "Lidl-Trek",
            displayName: "LIDL-TREK",
            country: "🇺🇸",
            director: "MONFORT, Maxime",
            riders: [
                { number: 31, name: "SIMMONS, Quinn", country: "🇺🇸" },
                { number: 32, name: "LOPEZ PEREZ, Juan Pedro", country: "🇪🇸" },
                { number: 33, name: "MOSCA, Jacopo", country: "🇮🇹" },
                { number: 34, name: "NYS, Thibau", country: "🇧🇪" },
                { number: 35, name: "OOMEN, Sam", country: "🇳🇱" },
                { number: 36, name: "JENSEN, Mattias", country: "🇩🇰" },
                { number: 37, name: "VERGAERDE, Otto", country: "🇧🇪" }
            ]
        },
        {
            id: 7,
            name: "Decathlon AG2R La Mondiale Team",
            displayName: "DECATHLON AG2R LA MONDIALE TEAM",
            country: "🇫🇷",
            director: "GUILLE, Nicolas",
            riders: [
                { number: 101, name: "GODON, Dorian", country: "🇫🇷" },
                { number: 102, name: "BERTHET, Clément", country: "🇫🇷" },
                { number: 103, name: "DEWULF, Stan", country: "🇧🇪" },
                { number: 104, name: "LAFAY, Victor", country: "🇫🇷" },
                { number: 105, name: "LAPEIRA, Paul", country: "🇫🇷" },
                { number: 106, name: "TRONCHON, Bastien", country: "🇫🇷" },
                { number: 107, name: "GAUTHERAT, Pierre", country: "🇫🇷" }
            ]
        },
        {
            id: 8,
            name: "Red Bull - BORA - hansgrohe",
            displayName: "RED BULL - BORA – HANSGROHE",
            country: "🇩🇪",
            director: "VAN HECKE, Preben",
            riders: [
                { number: 61, name: "VAN GILS, Maxim", country: "🇧🇪" },
                { number: 62, name: "ADRIA OLIVERAS, Roger", country: "🇪🇸" },
                { number: 63, name: "KOCH, Jonas", country: "🇩🇪" },
                { number: 64, name: "LIPOWITZ, Florian", country: "🇩🇪" },
                { number: 65, name: "PALZER, Anton", country: "🇩🇪" },
                { number: 66, name: "PITHIE, Laurence", country: "🇳🇿" },
                { number: 67, name: "TRATNIK, Jan", country: "🇸🇮" }
            ]
        },
        {
            id: 9,
            name: "Alpecin-Deceuninck",
            displayName: "ALPECIN-DECEUNINCK",
            country: "🇧🇪",
            director: "VAN HECKE, Preben",
            riders: [
                { number: 71, name: "HERMANS, Quinten", country: "🇧🇪" },
                { number: 72, name: "BOVEN, Lars", country: "🇳🇱" },
                { number: 73, name: "GHYS, Robbe", country: "🇧🇪" },
                { number: 74, name: "VERMEERSCH, Gianni", country: "🇧🇪" },
                { number: 75, name: "MEURISSE, Xandro", country: "🇧🇪" },
                { number: 76, name: "VAN TRICHT, Stan", country: "🇧🇪" },
                { number: 77, name: "VAN DEN BOSSCHE, Fabio", country: "🇧🇪" }
            ]
        },
        {
            id: 10,
            name: "Groupama-FDJ",
            displayName: "GROUPAMA-FDJ",
            country: "🇫🇷",
            director: "BRICAUD, Thierry (FRA)",
            riders: [
                { number: 81, name: "MADOUAS, Valentin", country: "🇫🇷" },
                { number: 82, name: "ASKEY, Lewis", country: "🇬🇧" },
                { number: 83, name: "DAVY, Clement", country: "🇫🇷" },
                { number: 84, name: "GENIETS, Kevin", country: "🇱🇺" },
                { number: 85, name: "JACOBS, Johan", country: "🇨🇭" },
                { number: 86, name: "PACHER, Quentin", country: "🇫🇷" },
                { number: 87, name: "ROCHAS, Remy", country: "🇫🇷" }
            ]
        },
        {
            id: 11,
            name: "EF Education - EasyPost",
            country: "🇺🇸",
            riders: [
                { number: 101, name: "Tejay VAN GARDEREN", country: "🇺🇸" },
                { number: 102, name: "Ben HEALY", country: "🇮🇪" },
                { number: 103, name: "Mikkel HONORÉ", country: "🇩🇰" },
                { number: 104, name: "Lukas NERURKAR", country: "🇬🇧" },
                { number: 105, name: "Nelson QUINN", country: "🇺🇸" },
                { number: 106, name: "Stefan DE BOD", country: "🇿🇦" },
                { number: 107, name: "Michael VALGREN", country: "🇩🇰" }
            ]
        },
        {
            id: 12,
            name: "Bahrain Victorious",
            displayName: "BAHRAIN VICTORIOUS",
            country: "🇧🇭",
            director: "GOLAŚ, Michal",
            riders: [
                { number: 91, name: "BILBAO LOPEZ DE ARMENTIA, Pello", country: "🇪🇸" },
                { number: 92, name: "MARTINEZ, Lenny", country: "🇫🇷" },
                { number: 93, name: "MIHOLJEVIC, Fran", country: "🇭🇷" },
                { number: 94, name: "MOHORIC, Matej", country: "🇸🇮" },
                { number: 95, name: "ARNDT, Nikias", country: "🇩🇪" },
                { number: 96, name: "EULALIO, Afonso", country: "🇵🇹" },
                { number: 97, name: "ZAMBANINI, Edoardo", country: "🇮🇹" }
            ]
        },
        {
            id: 13,
            name: "Movistar Team",
            displayName: "MOVISTAR TEAM",
            country: "🇪🇸",
            director: "ROJAS GIL, Jose Joaquin",
            riders: [
                { number: 121, name: "RUBIO, Einer Augusto", country: "🇨🇴" },
                { number: 122, name: "BARRENETXEA, Jon", country: "🇪🇸" },
                { number: 123, name: "BARTA, William", country: "🇺🇸" },
                { number: 124, name: "FORMOLO, Davide", country: "🇮🇹" },
                { number: 125, name: "GUERREIRO, Ruben Antonio", country: "🇵🇹" },
                { number: 126, name: "MUHLBERGER, Gregor", country: "🇦🇹" },
                { number: 127, name: "TESFAZIÓN OCBIT, Natnael", country: "🇪🇷" }
            ]
        },
        {
            id: 14,
            name: "Team Jayco AlUla",
            displayName: "TEAM JAYCO ALULA",
            country: "🇦🇺",
            director: "HAYMAN, Mathew (AUS)",
            riders: [
                { number: 1, name: "Michael MATTHEWS", country: "🇦🇺" },
                { number: 2, name: "Luke DURBRIDGE", country: "🇦🇺" },
                { number: 3, name: "Asbjørn HELLEMOSE", country: "🇩🇰" },
                { number: 4, name: "Michael HEPBURN", country: "🇦🇺" },
                { number: 5, name: "Mauro SCHMID", country: "🇨🇭" },
                { number: 6, name: "DONALDSON, Robert Edward ", country: "🇬🇧" },
                { number: 7, name: "Filippo ZANA", country: "🇮🇹" },
            ]
        },
        {
            id: 15,
            name: "Arkéa-B&B Hotels",
            displayName: "ARKEA-B&B HOTELS",
            director: "GERARD, ARNAUD",
            country: "🇫🇷",
            riders: [
                { number: 171, name: "COSTIOU, Ewen", country: "🇫🇷" },
                { number: 172, name: "DELAPLACE, Anthony", country: "🇫🇷" },
                { number: 173, name: "HUYS, Laurens", country: "🇧🇪" },
                { number: 174, name: "LE BERRE, Mathis", country: "🇫🇷" },
                { number: 175, name: "SVESTAD-BARDSENG, Embret", country: "🇳🇴" },
                { number: 176, name: "GRONDIN, Donavan", country: "🇫🇷" },
                { number: 177, name: "RIES, Michel", country: "🇱🇺" }
            ]
        },
        {
            id: 16,
            name: "Team DSM-Firmenich PostNL",
            displayName: "TEAM PICNIC POSTNL",
            director: "WINSTON, Matt",
            country: "🇳🇱",
            riders: [
                { number: 141, name: "ONLEY, Oscar", country: "🇬🇧" },
                { number: 142, name: "ANDRESEN, Tobias Lund", country: "🇩🇰" },
                { number: 143, name: "BARGUIL, Warren", country: "🇫🇷" },
                { number: 144, name: "VAN DEN BROEK, Frank", country: "🇳🇱" },
                { number: 145, name: "COMBAUD, Romain", country: "🇫🇷" },
                { number: 146, name: "DHONDT, Robbe", country: "🇧🇪" },
                { number: 147, name: "NABERMAN, Tim", country: "🇳🇱" }
            ]
        },
        {
            id: 17,
            name: "Intermarché - Wanty",
            displayName: "INTERMARCHÉ - WANTY",
            country: "🇧🇪",
            riders: [
                { number: 151, name: "GIRMAY, Biniam", country: "🇪🇷" },
                { number: 152, name: "BARRÉ, Louis", country: "🇫🇷" },
                { number: 153, name: "BRAET, Vito", country: "🇧🇪" },
                { number: 154, name: "KAMP, Alexander", country: "🇩🇰" },
                { number: 155, name: "PAQUOT, Tom", country: "🇧🇪" },
                { number: 156, name: "RUTSCH, Jonas", country: "🇩🇪" },
                { number: 157, name: "VAN SINTMAARTENSDIJK, Roel", country: "🇳🇱" }
            ]
        },
        {
            id: 18,
            name: "Cofidis",
            displayName: "COFIDIS",
            country: "🇫🇷",
            director: "GERRIKAGOITIA, Gorka",
            riders: [
                { number: 161, name: "ARANBURU, Alex", country: "🇪🇸" },
                { number: 162, name: "DEBEAUMARCHE, Nicolas", country: "🇫🇷" },
                { number: 163, name: "IZAGUIRRE, Ion", country: "🇪🇸" },
                { number: 164, name: "MAISONOBE, Sam", country: "🇫🇷" },
                { number: 165, name: "PEREZ, Anthony", country: "🇫🇷" },
                { number: 166, name: "ROBEET, Ludovic", country: "🇧🇪" },
                { number: 167, name: "TOUZE, Damien", country: "🇫🇷" },
            ]
        },
        {
            id: 19,
            name: "Astana Qazaqstan Team",
            displayName: "XDS ASTANA TEAM",
            country: "🇰🇿",
            director: "FOFONOV, Dmitriy",
            riders: [
                { number: 131, name: "BETTIOL, Alberto", country: "🇮🇹" },
                { number: 132, name: "CHARMIG, Anthon", country: "🇩🇰" },
                { number: 133, name: "GATE, Aaron Murray", country: "🇳🇿" },
                { number: 134, name: "MULUEBERHAN SOLOMON, Henok", country: "🇪🇷" },
                { number: 135, name: "KANTER, Max", country: "🇩🇪" },
                { number: 136, name: "VELASCO, Simone", country: "🇮🇹" },
                { number: 137, name: "SCHELLING, Ide", country: "🇳🇱" }
            ]
        },
        {
            id: 20,
            name: "Israel - Premier Tech",
            displayName: "IPT",
            country: "🇮🇱",
            director: "BAUER, Steve",
            riders: [
                { number: 191, name: "STRONG, Corbin", country: "🇳🇿" },
                { number: 192, name: "BLACKMORE, Joseph Peter", country: "🇬🇧" },
                { number: 193, name: "BOIVIN, Guillaume", country: "🇨🇦" },
                { number: 194, name: "CLARKE, Simon", country: "🇦🇺" },
                { number: 195, name: "HOULE, Hugo", country: "🇨🇦" },
                { number: 196, name: "NEILANDS, Krists", country: "🇱🇻" },
                { number: 197, name: "SHEEHAN, Riley", country: "🇺🇸" }
            ]
        },
        {
            id: 21,
            name: "Uno-X Mobility",
            displayName: "UNO-X MOBILITY",
            director: "RASCH, Gabriel",
            country: "🇳🇴",
            riders: [
                { number: 201, name: "JOHANNESSEN, Tobias Halland", country: "🇳🇴" },
                { number: 202, name: "JOHANNESSEN, Anders Halland", country: "🇳🇴" },
                { number: 203, name: "ABRAHAMSEN, Jonas", country: "🇳🇴" },
                { number: 204, name: "DVERSNES, Fredrik", country: "🇳🇴" },
                { number: 205, name: "LEVY, William Blume", country: "🇩🇰" },
                { number: 206, name: "LØLAND, Sakarias", country: "🇳🇴" },
                { number: 207, name: "SKAARSETH, Anders", country: "🇳🇴" }
            ]
        },
        {
            id: 22,
            name: "Tudor Pro Cycling Team",
            country: "🇨🇭",
            riders: [
                { number: 211, name: "ALAPHILIPPE, Julian", country: "🇫🇷" },
                { number: 212, name: "ERIKSSON, Jacob", country: "🇸🇪" },
                { number: 213, name: "ERIKSSON, Lucas", country: "🇸🇪" },
                { number: 214, name: "MAYRHOFER, Marius", country: "🇩🇪" },
                { number: 215, name: "WARBASSE, Lawrence", country: "🇺🇸" },
                { number: 216, name: "WEISS, Fabian", country: "🇨🇭" },
                { number: 217, name: "WILKSCH, Hannes", country: "🇩🇪" }
            ]
        },
        {
            id: 23,
            name: "Équipe Canada",
            displayName: "ÉQUIPE NATIONALE CANADA",
            country: "🇨🇦",
            riders: [
                { number: 221, name: "JACOB, Philippe", country: "🇨🇦" },
                { number: 222, name: "GAUTHIER, Jérôme", country: "🇨🇦" },
                { number: 223, name: "MATTERN, Carson", country: "🇨🇦" },
                { number: 224, name: "COUTURE, Samuel", country: "🇨🇦" },
                { number: 225, name: "COWAN, Quentin", country: "🇨🇦" },
                { number: 226, name: "BOUCHARD, Félix", country: "🇨🇦" },
                { number: 227, name: "HAMEL, Félix", country: "🇨🇦" }
            ]
        }
    ]
};

// Filename overrides for jersey images present in the package
const jerseySlugOverrides = {
    "UAE Team Emirates": "emirates",
    "Lotto Dstny": "lotto",
    "Team Visma | Lease a Bike": "visma",
    "INEOS Grenadiers": "ineos",
    "Soudal Quick-Step": "soudal",
    "Lidl-Trek": "lidltrek",
    "Decathlon AG2R La Mondiale Team": "decathlon",
    "Red Bull - BORA - hansgrohe": "redbullbora",
    "Alpecin-Deceuninck": "alpecin",
    "Groupama-FDJ": "groupama",
    "EF Education - EasyPost": "EF",
    "Bahrain Victorious": "bahrain",
    "Movistar Team": "movistar",
    "Team Jayco AlUla": "jayco",
    "Arkéa-B&B Hotels": "arkea",
    "Team DSM-Firmenich PostNL": "picnic",
    "Intermarché - Wanty": "intermarchewanty",
    "Cofidis": "cofidis",
    "Astana Qazaqstan Team": "astana",
    "Israel - Premier Tech": "palestine",
    "Uno-X Mobility": "uno",
    "Tudor Pro Cycling Team": "tudor",
    "Équipe Canada": "canada"
};

// State management
let currentView = 'teams';
let searchTerm = '';
let expandedTeams = new Set();

// Initialize the riders modal
function initializeRidersModal() {
    loadTeamsView();
    updateRidersStats();
}

// Open modal
async function openRidersModal() {
    const modal = document.getElementById('ridersModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // TOUJOURS recharger et réafficher
    try {
        const response = await fetch('/riders.json?t=' + Date.now());
        if (response.ok) {
            ridersData = await response.json();
            console.log('Données rechargées:', ridersData.teams.length, 'équipes');
            console.log('Première équipe:', ridersData.teams[0]);
            
            // Réinitialiser et réafficher TOUJOURS
            loadTeamsView();
            updateRidersStats();
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Close modal
function closeRidersModal() {
    const modal = document.getElementById('ridersModal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

// No longer needed - only teams view

// Load teams view
function loadTeamsView() {
    const container = document.getElementById('teamsAccordion');
    const teamsView = document.getElementById('teamsView');
    
    let html = '';

    // Utiliser l'ordre du CMS directement, sans tri
    const sortedTeams = (ridersData.teams || []).slice();

    // Fonction pour obtenir le nom du fichier de maillot
    function getJerseyFile(team) {
        // Essayer d'abord avec le code de l'équipe
        const jerseyMap = {
            'UAE': 'emirates.png',
            'LTD': 'lotto.png',
            'TJV': 'visma.png',
            'IGD': 'ineos.png',
            'SOQ': 'soudal.png',
            'LTK': 'lidltrek.png',
            'DEC': 'decathlon.png',
            'RBH': 'redbullbora.png',
            'ALP': 'alpecin.png',
            'GFC': 'groupama.png',
            'EF': 'ef.png',
            'BAH': 'bahrain.png',
            'MOV': 'movistar.png',
            'JAY': 'jayco.png',
            'ARK': 'arkea.png',
            'DSM': 'decathlon.png',
            'IWA': 'intermarchewanty.png',
            'COF': 'cofidis.png',
            'AST': 'astana.png',
            'IPT': 'ipt.png',
            'UNO': 'uno.png',
            'TUD': 'tudor.png',
            'CAN': 'canada.png',
            'PNP': 'picnic.png'
        };
        
        // Si on a un code, l'utiliser
        if (team.code && jerseyMap[team.code]) {
            return jerseyMap[team.code];
        }
        
        // Sinon, essayer de déduire depuis le nom de l'équipe
        const name = (team.name || '').toLowerCase();
        if (name.includes('jayco')) return 'jayco.png';
        if (name.includes('emirates')) return 'emirates.png';
        if (name.includes('visma')) return 'visma.png';
        if (name.includes('lidl') || name.includes('trek')) return 'lidltrek.png';
        if (name.includes('soudal')) return 'soudal.png';
        if (name.includes('ineos')) return 'ineos.png';
        if (name.includes('bora')) return 'redbullbora.png';
        if (name.includes('alpecin')) return 'alpecin.png';
        if (name.includes('groupama')) return 'groupama.png';
        if (name.includes('education') || name.includes('ef ')) return 'ef.png';
        if (name.includes('bahrain')) return 'bahrain.png';
        if (name.includes('movistar')) return 'movistar.png';
        if (name.includes('arkea')) return 'arkea.png';
        if (name.includes('decathlon') || name.includes('ag2r') || name.includes('dsm')) return 'decathlon.png';
        if (name.includes('intermarche') || name.includes('wanty')) return 'intermarchewanty.png';
        if (name.includes('cofidis')) return 'cofidis.png';
        if (name.includes('astana')) return 'astana.png';
        if (name.includes('israel') || name.includes('premier')) return 'ipt.png';
        if (name.includes('uno')) return 'uno.png';
        if (name.includes('tudor')) return 'tudor.png';
        if (name.includes('canada')) return 'canada.png';
        if (name.includes('picnic')) return 'picnic.png';
        if (name.includes('lotto')) return 'lotto.png';
        
        return 'maillot-generique.png';
    }

    sortedTeams.forEach(team => {
        const isExpanded = expandedTeams.has(team.id);
        
        html += `
            <div class="team-card ${isExpanded ? 'expanded' : ''}" data-team-id="${team.id}">
                <div class="team-header" role="button" tabindex="0" aria-expanded="${isExpanded ? 'true' : 'false'}">
                    <div class="team-info">
                        <img src="/images/jerseys/${getJerseyFile(team)}" alt="${team.name}" style="height: 30px; width: auto; margin-right: 10px; vertical-align: middle;" onerror="this.src='/images/jerseys/maillot-generique.png'">
                        <span class="team-name">${team.displayName || team.name}</span>
                    </div>
                    <span class="team-chevron">▼</span>
                </div>
                <div class="team-riders">
                    <div class="team-jersey-display">
                        <div class="team-jersey-bg" data-team="${team.name}"></div>
                    </div>
                    <div class="riders-grid">
                        ${team.riders.map(rider => `
                            <div class="rider-item">
                                <span class="rider-number">${rider.number}</span>
                                <span class="rider-name">${rider.name}</span>
                                <span class="rider-flag">${rider.country}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    teamsView.style.display = 'block';
    
    // Apply jersey backgrounds
    applyJerseyBackgrounds();

    // Bind direct click/keydown handlers on headers (robust in prod)
    bindTeamHeaders();
}

function updateRidersStats() {
    try {
        const teams = ridersData.teams || [];
        const teamCount = teams.length;
        let riderCount = 0;
        teams.forEach(t => { riderCount += (t.riders ? t.riders.length : 0); });
        const ridersEl = document.getElementById('ridersCount');
        const teamsEl = document.getElementById('teamsCount');
        if (ridersEl) ridersEl.textContent = String(riderCount);
        if (teamsEl) teamsEl.textContent = String(teamCount);
    } catch(_) {}
}

// Apply jersey backgrounds to expanded teams
function applyJerseyBackgrounds() {
    document.querySelectorAll('.team-jersey-bg').forEach(bg => {
        const teamName = bg.dataset.team;
        const style = teamStyles[teamName] || { color: '#6BA053', bg: '#ffffff' };

        // Set a visible placeholder immediately
        const placeholder = 'images/jerseys/jersey-placeholder.svg';
        const altPlaceholder = 'listeengages-package/listeengages/images/jerseys/jersey-placeholder.svg';
        tryLoadImageInOrder([placeholder, altPlaceholder], function(path){
            bg.style.backgroundImage = `url(${path})`;
            bg.style.backgroundSize = '80%';
            bg.style.backgroundPosition = 'center';
            bg.style.backgroundRepeat = 'no-repeat';
            bg.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        });

        // Build candidate paths in priority order
        const slug = slugifyTeamName(teamName);
        const overrideSlug = jerseySlugOverrides[teamName];
        const explicit = style && style.jersey ? [style.jersey] : [];
        const candidates = [];

        // 1) Explicit mapping
        explicit.forEach(file => {
            candidates.push(`images/jerseys/${file}`);
            candidates.push(`listeengages-package/listeengages/images/jerseys/${file}`);
        });

        // 2) Derived from team name
        const slugCandidates = [];
        if (overrideSlug) {
            slugCandidates.push(overrideSlug);
            // Try lowercase variant too (for files like EF.png)
            if (overrideSlug.toLowerCase() !== overrideSlug) {
                slugCandidates.push(overrideSlug.toLowerCase());
            }
        }
        slugCandidates.push(slug);
        // Build path candidates for each slug candidate
        slugCandidates.forEach(base => {
            ['png', 'svg', 'webp'].forEach(ext => {
                candidates.push(`images/jerseys/${base}.${ext}`);
                candidates.push(`listeengages-package/listeengages/images/jerseys/${base}.${ext}`);
            });
        });

        tryLoadImageInOrder(candidates, function(path) {
            bg.style.backgroundImage = `url(${path})`;
            bg.style.backgroundSize = '80%';
            bg.style.backgroundPosition = 'center';
            bg.style.backgroundRepeat = 'no-repeat';
            bg.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            bg.setAttribute('data-jersey-path', path);
        }, function() {
            // Fallback: SVG jersey with team colors
            const teamId = teamName.replace(/[^a-zA-Z0-9]/g, '');
            const svgJersey = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240">
                    <defs>
                        <linearGradient id="grad${teamId}" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style="stop-color:${style.bg};stop-opacity:1" />
                            <stop offset="50%" style="stop-color:${style.bg};stop-opacity:1" />
                            <stop offset="50%" style="stop-color:${style.color};stop-opacity:1" />
                            <stop offset="100%" style="stop-color:${style.color};stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <path d="M50 60 L50 40 Q50 20 70 20 L80 20 L85 10 L115 10 L120 20 L130 20 Q150 20 150 40 L150 60 L180 80 L180 120 L160 100 L160 180 Q160 200 150 200 L50 200 Q40 200 40 180 L40 100 L20 120 L20 80 L50 60 Z" 
                          fill="url(#grad${teamId})" 
                          stroke="#444" 
                          stroke-width="1.5"/>
                    <text x="100" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="${style.bg === '#FFFFFF' ? '#333' : '#FFF'}">
                        ${teamName.split(' ')[0].substring(0, 3).toUpperCase()}
                    </text>
                </svg>
            `;
            const encodedSvg = encodeURIComponent(svgJersey);
            bg.style.backgroundImage = `url("data:image/svg+xml,${encodedSvg}")`;
            bg.style.backgroundSize = '70%';
            bg.style.backgroundPosition = 'center';
            bg.style.backgroundRepeat = 'no-repeat';
            bg.setAttribute('data-jersey-path', 'inline-svg');
        });
    });
}

function slugifyTeamName(name) {
    return name
        .toLowerCase()
        .replace(/\|/g, ' ')
        .replace(/\s+&\s+/g, ' ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .replace(/--+/g, '-');
}

function tryLoadImageInOrder(paths, onSuccess, onFailure) {
    let index = 0;
    function tryNext() {
        if (index >= paths.length) {
            try { console.warn('[Jersey] No image found for candidates:', paths); } catch(_){}
            onFailure && onFailure();
            return;
        }
        const path = paths[index++];
        const testImg = new Image();
        testImg.onload = function() { try { console.debug('[Jersey] Loaded', path); } catch(_){} onSuccess && onSuccess(path); };
        testImg.onerror = function() { tryNext(); };
        testImg.src = path;
    }
    tryNext();
}

// Toggle team expansion
function toggleTeam(teamId) {
    const teamCard = document.querySelector(`[data-team-id="${teamId}"]`);
    
    if (expandedTeams.has(teamId)) {
        expandedTeams.delete(teamId);
        teamCard.classList.remove('expanded');
        const header = teamCard.querySelector('.team-header');
        if (header) header.setAttribute('aria-expanded', 'false');
    } else {
        expandedTeams.add(teamId);
        teamCard.classList.add('expanded');
        const header = teamCard.querySelector('.team-header');
        if (header) header.setAttribute('aria-expanded', 'true');
        
        // Apply jersey background when expanding
        setTimeout(() => applyJerseyBackgrounds(), 50);
    }
}



// Search functionality
function searchRiders() {
    const searchInput = document.getElementById('ridersSearch');
    searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm.length < 2) {
        // Show normal view if search is too short
        document.getElementById('searchResultsView').style.display = 'none';
        document.getElementById('teamsView').style.display = 'block';
        return;
    }
    
    // Hide all views
    document.querySelectorAll('.riders-view').forEach(v => {
        v.style.display = 'none';
    });
    
    // Collect matching riders
    let results = [];
    ridersData.teams.forEach(team => {
        // Check if team name matches
        if (team.name.toLowerCase().includes(searchTerm)) {
            team.riders.forEach(rider => {
                results.push({
                    ...rider,
                    teamName: team.name,
                    matchType: 'team'
                });
            });
        } else {
            // Check individual riders
            team.riders.forEach(rider => {
                if (rider.name.toLowerCase().includes(searchTerm)) {
                    results.push({
                        ...rider,
                        teamName: team.name,
                        matchType: 'rider'
                    });
                }
            });
        }
    });
    
    // Display results
    const searchResultsView = document.getElementById('searchResultsView');
    const searchResultsList = document.getElementById('searchResultsList');
    
    const lang = (window.currentLanguage || (window.localStorage && localStorage.getItem('language')) || 'fr');
    const isEn = String(lang).toLowerCase() === 'en';
    const resultWord = isEn ? 'result' : 'résultat';
    const resultPlural = isEn ? 'results' : 'résultats';
    const noResultsPrefix = isEn ? 'No results for' : 'Aucun résultat pour';

    if (results.length > 0) {
        searchResultsList.innerHTML = `
            <div class="search-results">
                <div class="search-results-header">
                    <h3>${results.length} ${results.length > 1 ? resultPlural : resultWord}</h3>
                </div>
                ${results.map(rider => `
                    <div class="rider-item ${rider.matchType}">
                        <span class="rider-number">${rider.number}</span>
                        <span class="rider-name">${highlightMatch(rider.name, searchTerm)}</span>
                        <span class="rider-team">${highlightMatch(rider.teamName, searchTerm)}</span>
                        <span class="rider-flag">${rider.country}</span>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        searchResultsList.innerHTML = `
            <div class="no-results">
                <p>${noResultsPrefix} "<strong>${searchTerm}</strong>"</p>
            </div>
        `;
    }
    
    searchResultsView.style.display = 'block';
}

// Highlight search matches
function highlightMatch(text, search) {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}



// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('ridersModal');
    if (modal && modal.style.display === 'block') {
        if (e.key === 'Escape') {
            closeRidersModal();
        } else if (e.key === '/' || (e.ctrlKey && e.key === 'f')) {
            e.preventDefault();
            document.getElementById('ridersSearch').focus();
        }
    }
});

// Add some missing CSS styles for new elements
const style = document.createElement('style');
style.textContent = `
    .rider-team {
        font-size: 0.85rem;
        color: #666;
        margin-left: 10px;
    }
    
    .search-results .rider-item {
        margin-bottom: 5px;
    }
    
    .search-results .rider-item.team {
        background: #e8f5e8;
    }
    
    .search-results-header {
        padding: 15px 0;
        border-bottom: 2px solid #6BA053;
        margin-bottom: 15px;
    }
    
    .search-results-header h3 {
        margin: 0;
        color: #6BA053;
        font-size: 1.1rem;
    }
    
    mark {
        background: #ffeb3b;
        padding: 2px;
        border-radius: 2px;
    }
    
    .no-results {
        text-align: center;
        padding: 40px;
        color: #666;
    }
`;
document.head.appendChild(style);

// Expose a namespaced API for integration
window.RidersModal = window.RidersModal || {
    open: openRidersModal,
    close: closeRidersModal,
    init: initializeRidersModal,
    search: searchRiders,
    toggleTeam: toggleTeam
};

// Robust bind for the close button in case inline handler fails
document.addEventListener('click', function(evt) {
    const target = evt.target;
    if (target && target.classList && target.classList.contains('riders-modal-close')) {
        try { closeRidersModal(); } catch (e) {}
    }
});

// Delegate clicks on team headers to toggle expansion
function bindTeamsAccordionDelegation() {
    const container = document.getElementById('teamsAccordion');
    if (!container || container.dataset.bound === 'true') return;
    container.addEventListener('click', function(e) {
        const header = e.target.closest('.team-header');
        if (!header) return;
        const card = header.closest('.team-card');
        if (!card) return;
        const teamId = parseInt(card.getAttribute('data-team-id'), 10);
        if (!isNaN(teamId)) {
            toggleTeam(teamId);
        }
    });
    container.addEventListener('keydown', function(e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const header = e.target.closest('.team-header');
        if (!header) return;
        e.preventDefault();
        const card = header.closest('.team-card');
        if (!card) return;
        const teamId = parseInt(card.getAttribute('data-team-id'), 10);
        if (!isNaN(teamId)) {
            toggleTeam(teamId);
        }
    });
    container.dataset.bound = 'true';
}

// Direct binding on each rendered header (fallback for environments where delegation/inline is blocked)
function bindTeamHeaders() {
    const container = document.getElementById('teamsAccordion');
    if (!container) return;
    const headers = container.querySelectorAll('.team-header');
    headers.forEach(header => {
        if (header.dataset.bound === 'true') return;
        header.addEventListener('click', function() {
            const card = header.closest('.team-card');
            if (!card) return;
            const teamId = parseInt(card.getAttribute('data-team-id'), 10);
            if (!isNaN(teamId)) toggleTeam(teamId);
        });
        header.addEventListener('keydown', function(e) {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            e.preventDefault();
            const card = header.closest('.team-card');
            if (!card) return;
            const teamId = parseInt(card.getAttribute('data-team-id'), 10);
            if (!isNaN(teamId)) toggleTeam(teamId);
        });
        header.dataset.bound = 'true';
    });
}

// Ensure content and bindings are ready in production even before opening the modal
document.addEventListener('DOMContentLoaded', function() {
    try {
        const modal = document.getElementById('ridersModal');
        const accordion = document.getElementById('teamsAccordion');
        if (modal && accordion) {
            // Build content and bind once
            loadTeamsView();
            updateRidersStats();
            modal.dataset.initialized = 'true';
        }
    } catch (_) {}
});