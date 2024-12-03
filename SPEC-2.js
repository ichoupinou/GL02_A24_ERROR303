// Exportation des fonctions dont on a besoin en dehors de ce fichier
module.exports={verifSalle, capaciteMaxSalle};
const readline = require('readline');
const DataMain = require('./main.js');
data = DataMain.structuredData

// Créer une interface pour lire et écrire dans la console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Fonction qui permet de vérifier qu'une salle apparait bien dans une base donnée
function verifSalle(salle) {
    //const exists = data.find(module => module.entries.room === salle);
    /*
    for (const module of data) {
        for (const classEntry of module.classes) {
            if (classEntry.room === salle) {
                return true;
            }
        }
    }*/
    return data.some(module => 
        module.classes.some(classEntry => classEntry.room === salle)
    );
}

//Fonction qui renvoie la capacité maximale d'une salle dans une base donnée
async function capaciteMaxSalle() {
    // Poser la question mais je sais pas encore faire donc en attendant je fais sans
    // const salle = await askQuestion("Entrez une salle pour afficher sa capacité maximale : ");
    const salle ="D105";
    if (salle === "0") {
        console.log("Retour au menu principal.");
        return;
    }
    if (!verifSalle(salle)) {
        console.log("Erreur : la salle n'existe pas dans la base de données.");
        return;
    }

    let maxCapacite = 0;
    for (const course of data) {
        for (const classEntry of course.classes) {
            if (classEntry.room === salle && classEntry.capacity > maxCapacite) {
                maxCapacite = classEntry.capacity;
            }
        }
    }

    console.log(`La capacité maximale de la salle ${salle} est : ${maxCapacite}`);
    return maxCapacite;
}
// Utilisation
/*
    const salleUtilisateur = prompt("Entrez le nom de la salle (ou 0 pour revenir en arrière) :");
    if (salleUtilisateur !== "0") {
        capaci&teMaxSalle(salleUtilisateur);
    }
        
function askQuestion(query) {
    return new Promise((resolve) => rl.question(query, resolve));
}
*/