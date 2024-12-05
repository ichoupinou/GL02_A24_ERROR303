const readline = require('readline');
const fs = require('fs');
const DataMain = require('./main.js');
const SPEC_1 = require('./SPEC-1.js');
const SPEC_3 = require('./SPEC-3.js');
const SPEC_4 = require('./SPEC-4.js');
const SPEC_7 = require('./SPEC-7.js');
const SPEC_9 = require('./SPEC-9.js')

data = DataMain.structuredData
module.exports = { askMainMenu, askSearchMenu, displayMainMenu, displaySearchMenu, handleMainMenu, handleSearchMenu };

// Créer une interface pour lire et écrire dans la console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



// Fonction pour afficher le menu
function displayMainMenu() {
    console.log("\nBienvenue dans l'Outil de Gestion et Suivi d'Occupation des Salles de Cours :");
    console.log('Menu Principal');
    console.log('Choisissez une option :');
    console.log('1 - Faire une recherche');
    console.log('2 - Générer un EDT au format CRU');
    console.log('3 - Générer son EDT en ICalendar');
    console.log('4 - Vérifier le non-chevauchement');
    console.log("5 - Classement des salles en fonction de leur capacité d'accueil");
    console.log("6 - Visuel taux d'occupation de chaque salle");
    console.log('0 - Quitter');
}

function displaySearchMenu() {
    console.log('\nMenu de recherche');
    console.log('Choisissez une option de recherche :');
    console.log('1 - Recherche des salles assignées à un cours');
    console.log("2 - Recherche de la capacité maximale d'une salle");
    console.log("3 - Recherche des disponibilités d'une salle");
    console.log('4 - Recherche des salles libre à un créneau');
    console.log('0 - Quitter');
}

// Gérer les choix dans le sous-menu
function handleMainMenu(choice) {
    switch (choice) {
        case '1':
            askSearchMenu(); // Aller au sous-menu
            return;
        case '2':
            EDTCRU();
            return;
        case '3':
            EDTICalendar();
            return;
        case '4':
            Chevauchement();
            return;
        case '5':
            ClassementCapaciteSalle();
            return;
        case '6':
            VisuelOccupationSalle();
            return;
        case '0':
            console.log('Au revoir !');
            rl.close(); // Fermer l'interface de lecture
            return;
        default:
            console.log('Option invalide. Veuillez choisir un nombre entre 1 et 3.');
    }
    askSubMenu(); // Revenir au sous-menu après chaque action
}

//on fait return après une fonction

// Gérer les choix dans le menu principal
function handleSearchMenu(choice) {
    switch (choice) {
        case '1':
            SalleCours();
            return;
        case '2':
            CapaciteSalle();
            return;
        case '3':
            DisponibiliteSalle();
            return;
        case '4':
            CreneauLibreSalle();
            return;
        case '0':
            askMainMenu(); // Revenir au menu principal
            return;
        default:
            console.log('Option invalide. Veuillez choisir un nombre entre 1 et 3.');
    }
    askMainMenu(); // Revenir au menu principal après chaque action
}

// Demander une commande dans le menu principal
function askMainMenu() {
    displayMainMenu();
    rl.question('Votre choix : ', (choice) => {
        handleMainMenu(choice);
    });
}

// Demander une commande dans le sous-menu
function askSearchMenu() {
    displaySearchMenu();
    rl.question('Votre choix : ', (choice) => {
        handleSearchMenu(choice);
    });
}

//search menu
function SalleCours() {
    console.log("\nVous avez choisi l'option 'Recherche des salles assignées à un cours'");
    console.log("Quel est le cours dont vous recherchez les salles ?");
    console.log("0 - Quitter");

    rl.question('Votre choix : ', (choice) => {
        switch (choice) {
            case '0':
                console.log("\nVous avez choisi l'option 'Quitter'");
                askSearchMenu();
                return; // Quitte la fonction proprement
            default:
                console.log(`Vous avez choisi de rechercher les salles pour le cours : ${choice}`);
                SPEC_1.getRoomsForCourse(data, choice);
                rl.close();
        }
    });
}

function CapaciteSalle() {

}

function DisponibiliteSalle() {
    console.log("\nVous avez choisi l'option 'Recherche des créneaux pour une salle'");
    console.log("Quel est la salle dont vous recherchez les créneaux ?");
    console.log("0 - Quitter");

    rl.question('Votre choix : ', (choice) => {
        switch (choice) {
            case '0':
                console.log("\nVous avez choisi l'option 'Quitter'");
                askSearchMenu();
                return; // Quitte la fonction proprement
            default:
                console.log(`Vous avez choisi de rechercher les créneaux pour la salle : ${choice}`);
                SPEC_3.findFreeSlotsByRoom(choice);       
                rl.close();
        }
    });
}



function Chevauchement() {
    console.log("\nVérification du non-chevauchement des cours");
    SPEC_7.checkOverlaps(data);
    rl.close();
}

function ClassementCapaciteSalle() {
    console.log("\nClassement des salles par capacité");

    const sortedRooms = [...rooms].sort((a, b) => b.capacity - a.capacity);

    console.log("Salles classées par capacité décroissante :");
    sortedRooms.forEach((room, index) => {
        console.log(`${index + 1}. Salle ${room.id}: ${room.capacity} places (${room.building})`);
    });

    askMainMenu();
}

function VisuelOccupationSalle() {
    console.log("\nVous avez choisi l'option 'Visuel taux d'occupation d'une salle'");
    console.log("Quel est la salle dont vous recherchez le taux d'occupation ?");
    console.log("0 - Quitter");

    rl.question('Votre choix : ', (choice) => {
        switch (choice) {
            case '0':
                console.log("\nVous avez choisi l'option 'Quitter'");
                askSearchMenu();
                return; // Quitte la fonction proprement
            default:
                console.log(`Vous avez choisi de voir le taux d'occupation de la salle : ${choice}`);
                SPEC_9.visualiserOccupation(choice);       
                rl.close();
        }
    });
}


function CapaciteSalle() {
    console.log("\nRecherche de la capacité maximale d'une salle");
    console.log("0 - Retour au menu précédent");

    rl.question('Entrez le numéro ou l\'identifiant de la salle : ', (input) => {
        if (input === '0') {
            askSearchMenu();
            return;
        }

        const room = rooms.find(r =>
            r.id.toLowerCase() === input.toLowerCase()
        );

        if (room) {
            console.log(`\nSalle ${room.id}`);
            console.log(`Bâtiment: ${room.building}`);
            console.log(`Capacité maximale: ${room.capacity} places`);
        } else {
            console.log("Salle non trouvée.");
        }

        askSearchMenu();
    });
}


function CreneauLibreSalle() {
    console.log("\nRecherche des salles libres à un créneau");
    console.log("0 - Retour au menu précédent");

    rl.question('Entrez le jour (ex: L/MA/ME/J/V/S) : ', (jour) => {
        if (jour === '0') {
            askSearchMenu();
            return;
        }

        rl.question('Entrez l\'heure de début (HH:MM) : ', (heureDebut) => {
            if (heureDebut === '0') {
                askSearchMenu();
                return;
            }

            rl.question('Entrez l\'heure de fin (HH:MM) : ', (heureFin) => {
                if (heureFin === '0') {
                    askSearchMenu();
                    return;
                }
                SPEC_4.findFreeRooms(jour, heureDebut, heureFin);

                rl.close();
            });
        });
    });
}