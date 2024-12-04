// Exportation des fonctions dont on a besoin en dehors de ce fichier
module.exports={tauxOccupation, visualiserOccupation};
const DataMain = require('./main.js');
const readline = require('readline');
data = DataMain.structuredData
const SPEC_2 = require('./SPEC-2.js'); 

//Specifique à l'affichage
const vega = require("vega");
const vegaLite = require("vega-lite");
const fs = require('fs'); //utile?


// Créer une interface pour lire et écrire dans la console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//renvoie total des heures et le nb de cours?
function tauxOccupation(salle) {
    if (!SPEC_2.verifSalle(salle)) {
        console.log("Erreur : la salle n'existe pas dans la base de données.");
        return null;
    }

    let totalHeures = 0; // Nombre total d'heures d'occupation
    let nbCours = 0;     // Nombre total de cours
    for (const course of data) {
        for (const classEntry of course.classes) {
            if (classEntry.room === salle) {
                const [start, end] = [classEntry.start, classEntry.end]; // Horaires début et fin
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
async function visualiserOccupation() {
    // ------- faire la demande à l'élève de manière clean avec readline ---------
    let salle = "D105";
    const stats = tauxOccupation(salle);
    if (!stats){
        console.log(`Aucune donnée trouvée pour la salle ${salle}`);
        return;
    }

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
    // Compile la spécification Vega-Lite en Vega
    const runtime = vega.parse(vegaLite.compile(spec).spec);

    // Crée un nouvel affichage (view) Vega
    const view = new vega.View(runtime, {
        renderer: "none", // Aucun rendu HTML (rendu en Node.js)
        container: null, // Pas de conteneur HTML
        logLevel: vega.Warn,
    });
 
    try {
        // Génère un SVG
        const svg = await view.toSVG(); // await view.toSVG()
        fs.writeFileSync("taux_occupation.svg", svg);
        console.log("Graphique sauvegardé sous 'taux_occupation.svg'.");
    } catch (err) {
        console.error("Erreur lors de la génération du graphique :", err);
    }    //vegaEmbed('#vis', spec); // L'élément HTML où afficher le graphique
}

// Utilisation
//visualiserOccupation(baseDeDonnees, "D105");
