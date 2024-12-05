const readline = require('readline');
const fs = require('fs');
const DataMain = require('./main.js');

data = DataMain.structuredData

module.exports={askMainMenu};

//Importation des fonctions des SPEC 2, 8 et 9 - SPEC de Anaelle
const SPEC_2 = require('./SPEC-2.js');  //SPEC 2 - afficher la capacité lax d'une salle donnée
const SPEC_8 = require('./SPEC-8.js');  //SPEC 8 - affichage du classement des salles par capacité
//const SPEC_9 = require('./SPEC-9.js');  //SPEC 9 - visuel du taux d'occupation de chaque salle

// Création d'une interface pour lire et écrire dans la console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Affichage du menu principal
function displayMainMenu() {
    console.log("\nBienvenue dans l'Outil de Gestion et Suivi d'Occupation des Salles de Cours :");
    console.log('Menu Principal');
    console.log('Choisissez une option :');
    console.log('1 - Faire une recherche');
    console.log('2 - Générer un EDT au format CRU'); // pas censé être fait mdr, pas dans le sujet de base 
    console.log('3 - Générer son EDT en ICalendar');
    console.log('4 - Vérifier le non-chevauchement');
    console.log("5 - Classement des salles en fonction de leur capacité d'accueil");
    console.log("6 - Visuel taux d'occupation de chaque salle");
    console.log('0 - Quitter');
}

function displaySearchMenu() {
    console.log('\nMenu de recherche');
    console.log('Choisissez une option de recherche :');
    console.log('1 - Recherche des salles assignées à un cours');
    console.log("2 - Recherche de la capacité maximale d'une salle");
    console.log("3 - Recherche des disponibilités d'une salle");
    console.log('4 - Recherche des salles libre à un créneau');
    console.log('0 - Quitter');
}

// Gérer les choix dans le main menu
function handleMainMenu(choice) {
    switch (choice) {
        case '1':
            askSearchMenu(); // Aller au sous-menu
            return;
        case '2':
            EDTCRU();
            return;
        case '3':
            generatePersonalSchedule();
            break;
        case '4':
            Chevauchement();
            return;
        case '5':
            ClassementCapaciteSalle();
            return;
        case '6':
            VisuelOccupationSalle();
            return;
        case '0':
            console.log('Au revoir !');
            rl.close(); // Fermer l'interface de lecture
            return;
        default:
            console.log('Option invalide. Veuillez choisir un nombre entre 0 et 6.');
    }
}

//on fait return après une fonction

// Gérer les choix dans le menu recherche
function handleSearchMenu(choice) {
    switch (choice) {
        case '1':
            SalleCours();
            return;
        case '2':
            CapaciteSalle();
            return;
        case '3':
            DisponibiliteSalle();
            return;
        case '4':
            CreneauLibreSalle();
            return;
        case '0':
            askMainMenu(); // Revenir au menu principal
            return;
        default:
            console.log('Option invalide. Veuillez choisir un nombre entre 0 et 4.');
    }
}

// Demander une commande dans le menu principal
function askMainMenu() {
    displayMainMenu();
    rl.question('Votre choix : ', (choice) => {
        try {
            handleMainMenu(choice); // Ensure this function calls askMainMenu or rl.close
        } catch (error) {
            console.error('An error occurred: ', error.message);
            askMainMenu(); // Prompt again in case of errors
        }
    });
}

// Demander une commande dans le sous-menu
function askSearchMenu() {
    displaySearchMenu();
    rl.question('Votre choix : ', (choice) => {
        try {
            handleSearchMenu(choice); // Ensure this function calls askMainMenu or rl.close
        } catch (error) {
            console.error('An error occurred: ', error.message);
            askSearchMenu(); // Prompt again in case of errors
        }
    });
}

// Check if the course exists in data
function findCourse(courseCode) {
    return data.some(module => module.module === courseCode);
}

function convertToISODateTime(day, time) {
    // Map of days to their corresponding date in 2024
    const dayMap = {
        'Monday': '20240108',    // First Monday of 2024
        'Tuesday': '20240109',   // First Tuesday of 2024
        'Wednesday': '20240110', // First Wednesday of 2024
        'Thursday': '20240111',  // First Thursday of 2024
        'Friday': '20240112'     // First Friday of 2024
    };

    // If day not found, default to Monday
    const datePrefix = dayMap[day] || '20240108';

    // Directly use time, adding seconds
    const formattedTime = time.replace(':', '') + '00';

    return `${datePrefix}T${formattedTime}`;
}

function generateICalendar(dict_courses_selected) {
    // Start of the iCalendar file
    let icsContent = "BEGIN:VCALENDAR\n";
    icsContent += "VERSION:2.0\n";
    icsContent += "PRODID:-//Custom Classroom Schedule//EN\n";

    // Mapping of abbreviated days to full day names
    const dayMap = {
        'L': 'Monday',
        'MA': 'Tuesday',
        'ME': 'Wednesday',
        'J': 'Thursday',
        'V': 'Friday',
        'S': 'Saturday'
    };

    // Iterate through each course in the selected courses
    for (let course in dict_courses_selected) {
        // Handle both single class and object of classes
        const classData = dict_courses_selected[course];
        
        // Ensure we have a valid class object
        if (!classData || !classData.classes) {
            console.warn(`Skipping invalid class for ${course}`);
            continue;
        }

        // Normalize the class data to ensure it's always an object
        const cls = classData.classes;

        // Ensure we have required class properties
        if (!cls.day || !cls.start || !cls.end || !cls.room) {
            console.warn(`Skipping incomplete class for ${course}`);
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
        icsContent += `SUMMARY:${course} - ${cls.group || 'Class'}\n`;
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
        console.log(`iCalendar file generated: ${fileName}`);
    } catch (error) {
        console.error('Error writing iCalendar file:', error);
    }

    // Return to main menu
    askMainMenu();
}

// Function to ask for a course and handle the logic
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
                    if (findCourse(input) == true) {
                        console.log(`Course added: ${input}`);
                        list_courses.push(input);
                    } else {
                        console.log('Course not found. Please try again.');
                    }

                    ask(); // Repeat for the next course
            }
        });
    };

    ask(); // Start the loop
}

// Function to ask for a course and handle the logic
// Function to ask for courses and handle the logic
function askForGroups(list_courses) {
    dict_courses_selected = {}
    for (let course of list_courses) {
        dict_courses_selected[course] = [];  // Use course as the key
    }

    for (let course of Object.keys(dict_courses_selected)) {
        console.log(`Choix pour le cours ${course}`)
    
        PrintGroupsAvailable(course)

        function ask() {
            rl.question("Donnez le nom de votre groupe de cours ('0' pour quitter, '1' pour terminer la sélection): ", (input) => {
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
                        if (findGroup(input) == true) {
                            console.log(`Groupe ajouté: ${input}`);
                            dict_courses_selected[course] = findGroupModule(input);
                        } else {
                            console.log('Group not found. Please try again.');
                        }

                        //ask(); // Repeat for the next course
                }
            });
        };

        ask(); // Start the loop
    }
}

function PrintGroupsAvailable(CourseCode) {
    // Find the specific module in the data array
    const moduleData = data.find(module => module.module === CourseCode);
    
    if (moduleData && Array.isArray(moduleData.classes) && moduleData.classes.length > 0) {
        console.log(`Groupes possible pour cours ${CourseCode}:`);
        // Iterate over the groups (entries) for this course
        moduleData.classes.forEach(group => {
            console.log(`Groupe: ${group.group}, Jour: ${group.day}, Heures: ${group.start}-${group.end}, Salle: ${group.room}`);
        });
    } else {
        console.log(`No groups available for course ${CourseCode}.`);
    }
}

function findGroup(groupCode) {
    return data.some(module => 
        module.classes.some(classGroup => classGroup.group === groupCode)
    );
}

function findGroupModule(groupCode) {
    // Iterate through all modules
    for (const module of data) {
        // Check if the module has classes and look for a matching group
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
   
// Entry point
function generatePersonalSchedule() {
    console.log('Welcome to the iCalendar generation tool'); //probleme
    askForCourses();
}

// SPEC 2 - Afficher la capacité maximum d'une salle
function CapaciteSalle(){
    console.log("\nVous avez choisi l'option 'Trouver la capacité max d'une salle'");
    console.log("Quel est la salle dont vous recherchez la capacité ?");
    console.log("0 - Quitter");
    rl.question('Votre choix : ', (salle) => {
        switch (salle) {
            case '0':
                console.log("\nVous avez choisi l'option 'Quitter'");
                askSearchMenu();
                return; // Quitte la fonction proprement
            default:
                console.log(`Vous avez choisi de rechercher la capacité de la salle : ${salle}`);
                SPEC_2.printedMaxCapacity(salle);
                askMainMenu();
        }
    }
    )
}

// SPEC 8 - Afficher un classement par capacité des salles données
function ClassementCapaciteSalle(){
    console.log("\nVous avez choisi l'option 'Classement des salles en fonction de leur capacité d'accueil'");
    console.log("0 - Quitter");
    afficherSalles();
    const listSalles = [];
    function ask() {
        rl.question("Entrez les salles que vous souhaitez ajouter au classement ((ou '1' pour terminer, '0' pour sortir) : ", (input) => {
            switch (input) {
                case '0':
                    console.log("Vous avez choisi de quitter");
                    askMainMenu();
                    return;
                case '1':
                    if (listSalles.length > 0) {
                        console.log('Géneration du classement des salles sélectionnées...');
                        SPEC_8.classementSalles(listSalles);
                        askMainMenu();
                        return
                    } else {
                        console.log('Pas de groupes choisis, veuillez réessayer');
                    }
                    break;
                default:
                    if (SPEC_2.verifSalle(input) == true) {
                        console.log(`Salle ajoutée: ${input}`);
                        listSalles.push(input);
                    } else {
                        console.log("Erreur : la salle n'existe pas dans la base de données.");
                    }

                    ask(); //répéter pour la prochaine salle
            }
        });
    };
    ask();
}

// Affichage de l'ensemble des salles présentes dans la base de données
function afficherSalles(){
    const listSalles = [];
    console.log("L'ensemble des salles disponibles est : ");
    for (const course of data) {
        for (const classEntry of course.classes) {
            if (!listSalles.includes(classEntry.room)) {
                console.log("Salle " + classEntry.room)
                listSalles.push(classEntry.room);
            }
        }
    }
}