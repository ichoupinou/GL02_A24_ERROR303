const readline = require('readline');
const fs = require('fs');

const DataMain = require('./main.js');
data = DataMain.structuredData  

module.exports={askMainMenu, askSearchMenu, displayMainMenu, displaySearchMenu, handleMainMenu, handleSearchMenu, findGroup, findCourse};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Affiche le menu principal dans la console pour l'outil de gestion et suivi d'occupation des salles de cours.
 *
 * @function displayMainMenu
 * @returns {void} Pas de valeur de retour
 */
function displayMainMenu() {
    console.log("\nBienvenue dans l'Outil de Gestion et Suivi d'Occupation des Salles de Cours :");
    console.log('Menu Principal');
    console.log('Choisissez une option :');
    console.log('1 - Faire une recherche');
    console.log('2 - Générer un EDT au format CRU'); // pas censé être fait mdr, pas dans le sujet de base 
    console.log('3 - Générer son EDT en ICalendar');
    console.log('4 - Vérifier le non-chevauchement');
    console.log("5 - Classement des salles en fonction de leur capacité d'accueil");
    console.log("6 - Visuel taux d'occupation de chaque salle");
    console.log('0 - Quitter');
}

/**
 * Affiche le menu de recherche dans la console pour l'outil de gestion
 * 
 * @function displaySearchMenu
 * @returns {void} Pas de valeur de retour.
 */
function displaySearchMenu() {
    console.log('\nMenu de recherche');
    console.log('Choisissez une option de recherche :');
    console.log('1 - Recherche des salles assignées à un cours');
    console.log("2 - Recherche de la capacité maximale d'une salle");
    console.log("3 - Recherche des disponibilités d'une salle");
    console.log('4 - Recherche des salles libre à un créneau');
    console.log('0 - Quitter');
}

/**
 * Gère la sélection du menu principal en fonction du choix de l'utilisateur.
 *
 * @function handleMainMenu
 * @param {string} choice - Le choix de l'utilisateur sous forme de chaîne de caractères.
 * @returns {void} Pas de valeur de retour à part un print à l'user.
 */
function handleMainMenu(choice) {
    switch (choice) {
        case '1':
            askSearchMenu(); // Aller au sous-menu de recherche
            return;
        case '2':
            EDTCRU();
            return;
        case '3':
            generatePersonalSchedule();
            break;
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
            console.log('Option invalide. Veuillez choisir un nombre entre 0 et 6.');
    }
}

/**
 * Gère la sélection du menu recherche en fonction du choix de l'utilisateur.
 *
 * @function handleSearchMenu
 * @param {string} choice - Le choix de l'utilisateur sous forme de chaîne de caractères.
 * @returns {void} Pas de valeur de retour à part un print à l'user.
 */
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
            console.log('Option invalide. Veuillez choisir un nombre entre 0 et 4.');
    }
}

/**
 * Affiche le menu principal et gère l'interaction avec l'utilisateur.
 *
 * @function askMainMenu
 * @returns {void} Pas de valeur de retour.
 */
function askMainMenu() {
    displayMainMenu();
    rl.question('Votre choix : ', (choice) => {
        try {
            handleMainMenu(choice);
        } catch (error) {
            console.error('An error occurred: ', error.message);
            askMainMenu(); // on redemande si erreur
        }
    });
}

/**
 * Affiche le menu recherche et gère l'interaction avec l'utilisateur.
 *
 * @function askSearchMenu
 * @returns {void} Pas de valeur de retour.
 */
function askSearchMenu() {
    displaySearchMenu();
    rl.question('Votre choix : ', (choice) => {
        try {
            handleSearchMenu(choice);
        } catch (error) {
            console.error('An error occurred: ', error.message);
            askSearchMenu();  // on redemande si erreur
        }
    });
}

//fonctions générales qui peuvent être utilisé dans plusieurs SPEC


/**
 * Vérifie si un cours correspondant au code donné existe dans les données.
 *
 * @function findCourse
 * @param {string} courseCode - Le code du cours à rechercher.
 * @returns {boolean} `true` si un module correspondant est trouvé, sinon `false`.
 */
function findCourse(courseCode) {
    return data.some(module => module.module === courseCode);
}

/**
 * Vérifie si un groupe spécifique existe dans les données.
 * 
 * Cette fonction recherche un groupe donné (par son code) dans les modules. Elle retourne `true` si le groupe est trouvé, sinon elle retourne `false`.
 *
 * @param {string} groupCode - Le code du groupe à rechercher.
 * @returns {boolean} Retourne `true` si le groupe existe, sinon `false`.
 */
function findGroup(groupCode) {
    return data.some(module => 
        module.classes.some(classGroup => classGroup.group === groupCode)
    );
}


