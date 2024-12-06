// Exportation des fonctions dont on a besoin en dehors de ce fichier
module.exports={verifSalle, printedMaxCapacity, MaxCapacity};
const DataMain = require('./main.js');
data = DataMain.structuredData

// ------------------------------------------------------------
// Fonction appelée depuis terminalcommande par la fonction RoomCapacity

/**
 * Fonction qui affiche la capacité maximale d'une salle donnée
 * Exemple de donnée : "D105"
 *
 * @param {string} salle - La salle dont on veut afficher la capacité maximale.
 * @returns {void} Cette fonction ne retourne rien, mais affiche la capacité maximale de la salle donnée
 */
function printedMaxCapacity(salle) {
    salle=salle.toUpperCase(); // Met en majuscule
    if (!verifSalle(salle)){
        console.log("Erreur : la salle n'existe pas dans la base de données.");
        return;
    }
    console.log(`La capacité maximale de la salle ${salle} est : ${MaxCapacity(salle)}`);
}

// ------------------------------------------------------------
// Fonctions appelée plusieurs fois depuis les autres fichiers

/**
 * Fonction qui renvoie vrai si la salle donnée existe dans la base de donnée, et faux sinon
 * Exemple de donnée : "D105"
 *
 * @param {string} salle - La salle dont on veut vérifier l'existence dans la base de données.
 * @returns {boolean} Vrai si la salle existe dans la base de données, faux sinon.
 */
function verifSalle(salle) {
    return data.some(module => 
        module.classes.some(classEntry => classEntry.room === salle)
    );
}

/**
 * Fonction qui renvoie la capacité maximale d'une salle donnée
 * Exemple de donnée : "D105" (on sait déjà que la salle existe dans la base de données)
 *
 * @param {string} salle - La salle dont on veut avoir la capacité maximale.
 * @returns {int} La capacité maximale de la salle.
 */
function MaxCapacity(salle){
    let maxCapacite = 0;
    for (const course of data) {
        for (const classEntry of course.classes) {
            if (classEntry.room === salle && classEntry.capacity > maxCapacite) {
                maxCapacite = classEntry.capacity;
            }
        }
    }
    return maxCapacite;
}
