// Exportation des fonctions dont on a besoin en dehors de ce fichier
module.exports={verifSalle, printedMaxCapacity, MaxCapacity};
const DataMain = require('./main.js');
data = DataMain.structuredData

// Fonmction qui renvoie vrai si la salle existe dans la base de donnée, 
// Et faux sinon
function verifSalle(salle) {
    return data.some(module => 
        module.classes.some(classEntry => classEntry.room === salle)
    );
}

//Fonction qui renvoie la capacité maximale d'une salle dans une base donnée
function printedMaxCapacity(salle) {
    let verif = verifSalle(salle); //peut partir
    if (!verif){
        console.log("Erreur : la salle n'existe pas dans la base de données.");
        retur;
    }
    console.log(`La capacité maximale de la salle ${salle} est : ${MaxCapacity(salle)}`);
    
}

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