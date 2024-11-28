const Parser = require('./parser.js');
const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, './sample/edt.cru');
//const structuredData=null;

// Lancer l'application
const Menu = require('./terminalcommande.js');
Menu.askMainMenu();

// Lecture du fichier
fs.readFile(file, 'utf8', async (err, data) => {
    if (err) throw err;

    // Créer une nouvelle instance de Parser
    const parser = new Parser();

    console.log("Validation et tokenisation en cours...");

    // Parse et récupère les tokens structurés
    const tokens = await parser.parseAndTokenize(data);

    if (tokens) {
        console.log(`Le fichier ${file} est conforme au format CRU.`);
        //console.log("Données en tokens : ", tokens);

        // Organisation des données
        structuredData = organizeTokensbis(tokens);
        //console.log("Données structurées : ");
        //console.log(JSON.stringify(structuredData, null, 2));
    } else {
        console.log(`Le fichier ${file} n'est pas conforme au format CRU.`);
}
});
console.log("Données structurées : ");
console.log(JSON.stringify(structuredData, null, 2));

/**
 * Organise les tokens en une structure de données.
 * Exemple de structure : tableau d'objets représentant des lignes de cours.
 *
 * @param {Array<string>} tokens - Les tokens à organiser.
 * @returns {Array<Object>} Données organisées.
 */
function organizeTokens(tokens) {
    const organized = [];
    let currentModule = null;

    for (const token of tokens) {
        if (/^\+[A-Z]{2,4}(\d{1,2})?[A-Z]?\d?$/.test(token)) {
            // Détection d'un module
            currentModule = {
                module: token,
                entries: [],
            };
            organized.push(currentModule);
        } else if (currentModule) {
            // Ajout des entrées au module courant
            currentModule.entries.push(token);
        }
    }

    return organized;
}

function organizeTokensbis(tokens) {
    const organized = [];
    let currentModule = null;
    let currentCourse = [];
    console.log(tokens);
    for (const token of tokens) {
        if (/^\+[A-Z]{2,4}(\d{1,2})?[A-Z]?\d?$/.test(token)) {
            // Détection d'un nouveau module
            if (currentModule) {
                // Si on a un cours partiellement rempli, on l'ajoute
                if (currentCourse.length > 0) {
                    currentModule.entries.push(currentCourse);
                    currentCourse = [];
                }
                organized.push(currentModule);
            }
            // Initialiser un nouveau module
            currentModule = {
                module: token,
                entries: [], // Un tableau à double entrée (chaque sous-tableau représente un cours)
            };
        } else if (currentModule) {
            // Ajouter le token au cours courant
            if (/^1$|^(C|D|T)\d{1,2}$|^P=\d{1,3}$|^H=(L|MA|ME|J|V|S)$|^(\d|1\d|2[0-3]):[0-5]\d-(\d|1\d|2[0-3]):[0-5][0-9]$|^[A-Z]([0-9]|[A-Z])?$|^S=[A-Z]{1,3}\d{1,3}$/.test(token)) {
                // Transformer les valeurs spécifiques
                if (/^P=\d{1,3}$/.test(token)) {
                    currentCourse.push(parseInt(token.split("=")[1])); // "P=50" -> 50 (int)
                } else if (/^H=(L|MA|ME|J|V|S)$/.test(token)) {
                    currentCourse.push(token.split("=")[1]); // "H=MA" -> "MA"
                } else if (/^S=[A-Z]{1,3}\d{1,3}$/.test(token)) {
                    currentCourse.push(token.split("=")[1]); // "S=LAB102" -> "LAB102"
                } else if (/^(\d|1\d|2[0-3]):[0-5]\d-(\d|1\d|2[0-3]):[0-5][0-9]$/.test(token)) {
                    const [start, end] = token.split("-"); // "08:00-09:30" -> ["08:00", "09:30"]
                    currentCourse.push(start, end);
                } else {
                    currentCourse.push(token); // Ajout brut pour les autres tokens
                }
            }
            // Si le token de fin de cours est atteint
            if (token === "//") {
                currentModule.entries.push(currentCourse);
                currentCourse = [];
            }
        }
    }

    // Ajouter le dernier module traité
    if (currentModule) {
        if (currentCourse.length > 0) {
            currentModule.entries.push(currentCourse);
        }
        organized.push(currentModule);
    }

    return organized;
}
