// Exportation des fonctions dont on a besoin en dehors de ce fichier
module.exports={tauxOccupation, visualiserOccupation};
const DataMain = require('./main.js');
const readline = require('readline');
data = DataMain.structuredData

// Créer une interface pour lire et écrire dans la console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//renvoie total des heures et le nb de cours?
function tauxOccupation(base, salle) {
    if (!verifSalle(base, salle)) {
        console.log("Erreur : la salle n'existe pas dans la base de données.");
        return null;
    }

    let totalHeures = 0; // Nombre total d'heures d'occupation
    let nbCours = 0;     // Nombre total de cours
    for (const module of base) {
        for (const entry of module.entries) {
            if (entry[6] === salle) {
                const [start, end] = [entry[4], entry[5]]; // Horaires début et fin
                const heures = parseInt(end.split(":")[0]) - parseInt(start.split(":")[0]);
                const minutes = parseInt(end.split(":")[1]) - parseInt(start.split(":")[1]);
                totalHeures += heures + minutes / 60;
                nbCours++;
            }
        }
    }

    return { totalHeures, nbCours };
}

// Affichage en utilisant VegaLite
function visualiserOccupation(base, salle) {
    const stats = tauxOccupation(base, salle);
    if (!stats) return;

    const data = [
        { category: "Temps occupé", value: stats.totalHeures },
        { category: "Temps libre", value: 40 - stats.totalHeures }, // Hypothèse : 40h/semaine
    ];

    const spec = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        description: `Taux d'occupation de la salle ${salle}`,
        data: { values: data },
        mark: "arc",
        encoding: {
            theta: { field: "value", type: "quantitative" },
            color: { field: "category", type: "nominal" }
        }
    };

    vegaEmbed('#vis', spec); // L'élément HTML où afficher le graphique
}

// Utilisation
//visualiserOccupation(baseDeDonnees, "D105");
