// Exportation des fonctions dont on a besoin en dehors de ce fichier
module.exports={classementSalles};
const DataMain = require('./main.js');
const SPEC2bis = require('./SPEC-2.js');
data = DataMain.structuredData

// Fonction qui affiche le classement des salles données par l'utilisateur
function classementSalles(listSalles) {
    // Trouver la capacité maximale pour chaque salle
    const capacites = listSalles.map((salle) => ({
        salle, 
        capacite: SPEC2bis.MaxCapacity(salle)
    }));

    // Trier par capacité décroissante
    capacites.sort((a, b) => b.capacite - a.capacite);
    console.log("Classement des salles par capacité maximale :");
    for (const { salle, capacite } of capacites) {
        console.log(`${salle} : ${capacite} personnes`);
    }
}
