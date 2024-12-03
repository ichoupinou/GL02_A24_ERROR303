// Exportation des fonctions dont on a besoin en dehors de ce fichier
module.exports={classementSalles};
const DataMain = require('./main.js');
const readline = require('readline');
data = DataMain.structuredData

// Créer une interface pour lire et écrire dans la console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Fonction qui affiche le classement des salles données par l'utilisateur
// Dans l'invite de commande. Vérifie que l'entrée de l'utilisateur est valide
async function classementSalles(base) {
    const listSalles = [];
    let salle;

    while (true) {
        salle = await askQuestion("Entrez une salle (ou 'fini' pour terminer, ou 'toutes' pour tout afficher) : ");
        if (salle === "fini") break;
        if (salle === "toutes") {
            // Ajouter toutes les salles uniques
            for (const module of base) {
                for (const entry of module.entries) {
                    if (!listSalles.includes(entry[6])) {
                        listSalles.push(entry[6]);
                    }
                }
            }
            break;
        }
        if (!verifSalle(base, salle)) {
            console.log("Erreur : la salle n'existe pas dans la base de données.");
        } else {
            listSalles.push(salle);
        }
    }
    rl.close(); // Fermer l'interface readline à la fin


    // Trouver la capacité maximale pour chaque salle
    const capacites = listSalles.map((salle) => {
        let maxCapacite = 0;
        for (const module of base) {
            for (const entry of module.entries) {
                if (entry[6] === salle && entry[2] > maxCapacite) {
                    maxCapacite = entry[2];
                }
            }
        }
        return { salle, capacite: maxCapacite };
    });

    // Trier par capacité décroissante
    capacites.sort((a, b) => b.capacite - a.capacite);

    console.log("Classement des salles par capacité maximale :");
    for (const { salle, capacite } of capacites) {
        console.log(`${salle} : ${capacite} personnes`);
    }
}

// Utilisation du classement des salles
//classementSalles(baseDeDonnees);
