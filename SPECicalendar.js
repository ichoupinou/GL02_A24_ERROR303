//Ce fichier est fait spécifiquement pour la création du fichier ICalendar

const DataMain = require('./main.js');
data = DataMain.structuredData  

const BasicFunctions = require('./terminalcommande.js');

/**
 * Lance le processus de génération d'un emploi du temps personnalisé au format iCalendar.
 * 
 * Cette fonction affiche un message d'accueil et appelle la fonction `askForCourses` pour que l'utilisateur choisisse les cours qu'il souhaite inclure dans son emploi du temps.
 *
 * @returns {void} Cette fonction n'a pas de valeur de retour, elle déclenche l'interaction avec l'utilisateur pour sélectionner les cours.
 */
function generatePersonalSchedule() {
    console.log("Bienvenue dans l'outil de génération de fichier ICalendar");
    askForCourses();
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

    // If day not found, default to Monday
    const datePrefix = dayMap[day] || '20240108';

    // Directly use time, adding seconds
    const formattedTime = time.replace(':', '') + '00';

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
    // Start of the iCalendar file
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

    // Iterate through each course in the selected courses
    for (let course in dict_courses_selected) {
        // Handle both single class and object of classes
        const classData = dict_courses_selected[course];
        
        // Ensure we have a valid class object
        if (!classData || !classData.classes) {
            console.warn(`Ignorer cours invalide : ${course}`);
            continue;
        }

        // Normalize the class data to ensure it's always an object
        const cls = classData.classes;

        // Ensure we have required class properties
        if (!cls.day || !cls.start || !cls.end || !cls.room) {
            console.warn(`Ignorer cours invalide : ${course}`);
            continue;
        }

        // Convert abbreviated day to full day name
        const fullDay = dayMap[cls.day] || cls.day;

        // Generate a unique identifier for the event
        const uid = `${course}-${cls.group}-${cls.day}-${cls.start}`;

        // Convert date to ISO format (assuming 2024 as default year)
        const startDateTime = convertToISODateTime(fullDay, cls.start);
        const endDateTime = convertToISODateTime(fullDay, cls.end);

        // Add event to iCalendar
        icsContent += "BEGIN:VEVENT\n";
        icsContent += `UID:${uid}\n`;
        icsContent += `SUMMARY:${course} - ${cls.group || 'Cours'}\n`;
        icsContent += `DTSTART:${startDateTime}\n`;
        icsContent += `DTEND:${endDateTime}\n`;
        icsContent += `LOCATION:${cls.room}\n`;
        icsContent += "END:VEVENT\n";
    }

    // Close the iCalendar file
    icsContent += "END:VCALENDAR";

    // Write to file
    const fileName = 'personal_schedule.ics';
    try {
        fs.writeFileSync(fileName, icsContent, 'utf8');
        console.log(`Fichier iCalendar généré: ${fileName}`);
    } catch (error) {
        console.error('Erreur pour la création du fichier iCalendar:', error);
    }

    // Return to main menu
    askMainMenu();
}

/**
 * Demande à l'utilisateur de sélectionner des cours pour son emploi du temps personnalisé.
 * 
 * Cette fonction gère l'interaction avec l'utilisateur pour permettre la sélection de cours.
 * Elle utilise un menu où l'utilisateur peut entrer le nom des cours, terminer la sélection ou quitter.
 * Lorsqu'un cours valide est sélectionné, il est ajouté à la liste des cours, et une fois la sélection terminée, 
 * elle appelle la fonction `askForGroups` pour que l'utilisateur choisisse les groupes associés aux cours.
 *
 * @returns {void} Cette fonction n'a pas de valeur de retour. Elle interagit avec l'utilisateur pour sélectionner des cours.
 */
function askForCourses() {
    const list_courses = [];

    function ask() {
        rl.question("Donnez le nom d'un cours ('0' pour quitter, '1' pour terminer la sélection): ", (input) => {
            switch (input) {
                case '0':
                    console.log("Vous avez choisi de quitter");
                    askMainMenu();
                    return;
                case '1':
                    if (list_courses.length > 0) {
                        console.log('Choix du groupe de cours');
                        askForGroups(list_courses);
                    } else {
                        console.log('Pas de cours choisis, veuillez réessayer');
                    }
                    return;
                default:
                    if (BasicFunctions.findCourse(input) == true) {
                        console.log(`Cours ajouté: ${input}`);
                        list_courses.push(input);
                    } else {
                        console.log('Cours pas trouvé. Veuillez réessayer.');
                    }

                    ask(); //répéter pour le prochain cours
            }
        });
    };

    ask(); // Start the loop
}

/**
 * Demande à l'utilisateur de choisir un groupe pour chaque cours dans la liste donnée et génère un fichier iCalendar avec les cours sélectionnés.
 *
 * Cette fonction parcourt chaque cours dans la liste `list_courses`, demande à l'utilisateur de spécifier un groupe pour chaque cours, et ajoute le groupe sélectionné à un dictionnaire `dict_courses_selected`. Lorsque l'utilisateur termine la sélection, un fichier iCalendar est généré avec les informations des cours et groupes choisis.
 *
 * @function askForGroups
 * @param {Array<string>} list_courses - Liste des cours pour lesquels l'utilisateur doit choisir un groupe.
 * @returns {void} Cette fonction ne retourne rien, mais lance un processus interactif pour sélectionner les groupes et générer le fichier iCalendar.
 */
function askForGroups(list_courses) {
    dict_courses_selected = {}
    for (let course of list_courses) {
        dict_courses_selected[course] = [];  //utilisation de "course" en tant que key
    }

    for (let course of Object.keys(dict_courses_selected)) {
        console.log(`Choix pour le cours ${course}`)
    
        PrintGroupsAvailable(course)

        function ask() {
            rl.question("Donnez le nom de votre groupe de cours pour ('0' pour quitter, '1' pour terminer la sélection): ", (input) => {
                switch (input) {
                    case '0':
                        console.log("Vous avez choisi de quitter");
                        askMainMenu();
                        return;
                    case '1':
                        if (list_courses.length > 0) {
                            console.log('Géneration fichier iCalendar pour les cours choisis...');
                            generateICalendar(dict_courses_selected);
                        } else {
                            console.log('Pas de groupes choisis, veuillez réessayer');
                        }
                        return;
                    default:
                        if (BasicFunctions.findGroup(input) == true) {
                            console.log(`Groupe ajouté: ${input}`);
                            dict_courses_selected[course] = findGroupModule(input);
                        } else {
                            console.log('Groupe pas trouvé. Veuillez réessayer.');
                        }

                        ask(); //répéter pour le prochain groupe
                }
            });
        };

        ask(); // Start the loop
    }
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
function findGroupModule(groupCode) {
    // itérer à travers tous les modules
    for (const module of data) {
        //si le module a des classes, on cherche le group qui match
        if (module.classes && Array.isArray(module.classes)) {
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