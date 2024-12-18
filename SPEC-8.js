// Exportation des fonctions dont on a besoin en dehors de ce fichier
module.exports={classementSalles};
const DataMain = require('./main.js');
const SPEC2bis = require('./SPEC-2.js');
data = DataMain.structuredData

// ------------------------------------------------------------
// Fonction appelée depuis terminalcommande

/**
 * Fonction qui affiche le classement des salles données par l'utilisateur par ordre décroissant de leurs capacités maximales
 * Exemple de donnée : ["D105", "P102", A002"]
 *
 * @param {string} listSalles - La liste des salles dont on veut le classement par ordre de capacité maximale.
 * @returns {void} Cette fonction ne retourne rien, mais affiche le classement des salles par capacité maximale
 */
function classementSalles(listSalles) {
    // Trouver la capacité maximale pour chaque salle
    const capacites = listSalles.map((salle) => ({
        salle, 
        capacite: SPEC2bis.MaxCapacity(data, salle)
    }));

    // Trier par capacité décroissante
    capacites.sort((a, b) => b.capacite - a.capacite);

    // Affichage
    console.log("Classement des salles par capacité maximale :");
    for (const { salle, capacite } of capacites) {
        console.log(`${salle} : ${capacite} personnes`);
    }
}
