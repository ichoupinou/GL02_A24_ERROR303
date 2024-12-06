//Ce fichier est fait spécifiquement pour la création du fichier ICalendar

const DataMain = require('./main.js');
data = DataMain.structuredData  

//export fonction generatePersonalSchedule()
module.exports={findCourse, PrintGroupsAvailable, generateICalendar, findGroup, findGroupModule}
const fs = require('fs');

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


function findGroup(CourseCode, groupCode) {
    //on itère à travers tous les modules
    console.log(CourseCode + groupCode);
    for (let module of data) {
        //on verifie que le module matche le coursecode
        if (module.module === CourseCode) {
            console.log("Module trouvé");

            // si le module a des classes, on cherche la bonne
            if (Array.isArray(module.classes)) {
                const group = module.classes.find(entry => entry.group === groupCode);
                // true si groupe trouvé
                if (group) {
                    return true;
                }
            }
        }
    }
    //false si groupe pas trouvé
    return false;
}
 
/**
 * Convertit un jour de la semaine et une heure en un format de date et heure ISO.
 *
 * Cette fonction prend un jour de la semaine (ex. "Monday", "Tuesday") et une heure sous forme de chaîne
 * (ex. "08:00") et génère une chaîne de caractères représentant la date et l'heure en format ISO (ex. "2024-01-08T080000").
 * Le jour de la semaine est mappé à une date spécifique de l'année 2024.
 *
 * @function convertToISODateTime
 * @param {string} day - Le jour de la semaine sous forme d'une chaîne (ex. "Monday", "Tuesday").
 * @param {string} time - L'heure sous forme d'une chaîne au format "HH:MM" (ex. "08:00").
 * @returns {string} La date et l'heure au format ISO (ex. "2024-01-08T080000").
 */
function convertToISODateTime(day, time) {
    const dayMap = {
        'Lundi': '20240108',    // Premier Lundi de 2024
        'Mardi': '20240109',   // Premier Mardi de 2024
        'Mercredi': '20240110', // Premier Mercredi de 2024
        'Jeudi': '20240111',  // Premier Jeudi de 2024
        'Vendredi': '20240112',     // Premier Vendredi de 2024
        'Samedi': '20240113'     //Premier Samedi de 2024
    };

    const datePrefix = dayMap[day] || '20240108';
    //on traduit le temps pour le icalendar (8:00 en 080000)
    const formattedTime = ('0000' + time.replace(':', '')).slice(-4) + '00';

    return `${datePrefix}T${formattedTime}`;
}

/**
 * Génère un fichier iCalendar à partir des cours sélectionnés et les écrit dans un fichier.
 *
 * Cette fonction prend un dictionnaire de cours sélectionnés et pour chaque cours, génère un événement iCalendar avec les informations suivantes :
 * - Titre de l'événement : le nom du cours et le groupe.
 * - Heure de début et de fin.
 * - Salle de cours.
 * 
 * Le fichier iCalendar est ensuite sauvegardé localement sous le nom `personal_schedule.ics`.
 *
 * @function generateICalendar
 * @param {Object} dict_courses_selected - Dictionnaire des cours sélectionnés, où chaque clé représente un cours et chaque valeur contient les informations relatives à ce cours.
 * @returns {void} Cette fonction ne retourne rien, mais génère un fichier `.ics`.
 */
function generateICalendar(dict_courses_selected) {
    //début du Icalendar
    let icsContent = "BEGIN:VCALENDAR\n";
    icsContent += "VERSION:2.0\n";
    icsContent += "PRODID:-//Custom Classroom Schedule//EN\n";

    //Mapping des abréviations jours en nom du jour
    const dayMap = {
        'L': 'Lundi',
        'MA': 'Mardi',
        'ME': 'Mercredi',
        'J': 'Jeudi',
        'V': 'Vendredi',
        'S': 'Samedi',
    };
    
    //on itère pour chaque cours
    for (let course in dict_courses_selected) {
        //on itère pour chaque groupe de chaque cours
        for (let i=0 ; i<dict_courses_selected[course].length;i++) {
            //changer les jours en leurs noms larges
            const fullDay = dayMap[dict_courses_selected[course][i]["classes"]["day"]] || dict_courses_selected[course][0]["classes"]["day"];
            //nom que portera notre évènement
            const uid = `${course}-${dict_courses_selected[course][i]["classes"]["group"]}-${dict_courses_selected[course][i]["classes"]["day"]}-${dict_courses_selected[course][i]["classes"]["start"]}`;
            //dates de lévènement et heures
            const startDateTime = convertToISODateTime(fullDay, dict_courses_selected[course][i]["classes"]["start"]);
            const endDateTime = convertToISODateTime(fullDay, dict_courses_selected[course][i]["classes"]["end"]);

            icsContent += "BEGIN:VEVENT\n";
            icsContent += `UID:${uid}\n`;
            icsContent += `SUMMARY:${course} - ${dict_courses_selected[course][i]["classes"]["group"] || 'Cours'}\n`;
            icsContent += `DTSTART:${startDateTime}\n`;
            icsContent += `DTEND:${endDateTime}\n`;
            icsContent += `LOCATION:${dict_courses_selected[course][i]["classes"]["room"]}\n`;
            icsContent += "END:VEVENT\n";
        }
    }
    //fin du icalendar
    icsContent += "END:VCALENDAR";

    const fileName = 'personal_schedule.ics';
    //écriture du fichier si on y arrive
    try {
        fs.writeFileSync(fileName, icsContent, 'utf8');
        console.log(`Fichier iCalendar généré: ${fileName}`);
    } catch (error) {
        console.error('Erreur pour la création du fichier iCalendar:', error);
    }
    return;
}


/**
 * Affiche les groupes disponibles pour un cours donné.
 * 
 * Cette fonction recherche les informations relatives à un cours spécifique (basé sur son code) dans les données et affiche les groupes disponibles ainsi que leurs informations (jour, horaire et salle).
 *
 * @param {string} CourseCode - Le code du cours pour lequel on souhaite afficher les groupes disponibles.
 * @returns {void} Cette fonction n'a pas de valeur de retour, elle affiche simplement les informations dans la console.
 */
function PrintGroupsAvailable(CourseCode) {
    // on trouve le module correspondant dans notre data
    const moduleData = data.find(module => module.module === CourseCode);
    //si on peut extraire des infos, qu'elles sont bien de la bonne manière et qu'elles sont présentes
    if (moduleData && Array.isArray(moduleData.classes) && moduleData.classes.length > 0) {
        console.log(`Groupes possible pour cours ${CourseCode}:`);
        // Itérer sur les groupes pour ce cours”.
        moduleData.classes.forEach(group => {
            console.log(`Groupe: ${group.group}, Jour: ${group.day}, Heures: ${group.start}-${group.end}, Salle: ${group.room}`);
        });
    } else {
        console.log(`Pas de groupe disponible pour ce cours ${CourseCode}.`);
    }
}

/**
 * Recherche un groupe spécifique et retourne les informations du module auquel il appartient.
 * 
 * Cette fonction parcourt tous les modules pour trouver un groupe donné. Elle retourne les informations du module ainsi que les détails du groupe (jour, horaire, salle, etc.).
 *
 * @param {string} groupCode - Le code du groupe à rechercher.
 * @returns {Object|null} Retourne un objet contenant les informations du module et du groupe si trouvé, sinon `null`.
 */
function findGroupModule(CourseCode, groupCode) {
    // itérer à travers tous les modules
    for (let module of data) {
        //si le module a des classes, on cherche le group qui match
        if (module.module === CourseCode) {
            if (Array.isArray(module.classes)) {
                const group = module.classes.find(entry => entry.group === groupCode);
                if (group) {
                    return {
                        module: module.module,
                        classes: group
                    };
                }
            }
        }
    }
    return {};
};