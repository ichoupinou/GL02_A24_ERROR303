const readline = require('readline');
const fs = require('fs');
module.exports={askMainMenu, askSearchMenu, displayMainMenu, displaySearchMenu, handleMainMenu, handleSearchMenu};

// Créer une interface pour lire et écrire dans la console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Fonction pour afficher le menu
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

// Gérer les choix dans le sous-menu
function handleMainMenu(choice) {
    switch (choice) {
        case '1':
            askSearchMenu(); // Aller au sous-menu
            return;
        case '2':
            EDTCRU();
            return;
        case '3':
            EDTICalendar();
            return;
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
            console.log('Option invalide. Veuillez choisir un nombre entre 1 et 3.');
    }
    askSubMenu(); // Revenir au sous-menu après chaque action
}

//on fait return après une fonction


// Gérer les choix dans le menu principal
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
            console.log('Option invalide. Veuillez choisir un nombre entre 1 et 3.');
    }
    askMainMenu(); // Revenir au menu principal après chaque action
}

// Demander une commande dans le menu principal
function askMainMenu() {
    displayMainMenu();
    rl.question('Votre choix : ', (choice) => {
        handleMainMenu(choice);
    });
}

// Demander une commande dans le sous-menu
function askSearchMenu() {
    displaySearchMenu();
    rl.question('Votre choix : ', (choice) => {
        handleSearchMenu(choice);
    });
}

//main menu
function EDTCRU() {

}

function EDTICalendar() {

}

function Chevauchement() {

}

function ClassementCapaciteSalle() {

}

function VisuelOccupationSalle() {

}

//search menu
function SalleCours() {
    console.log("\nVous avez choisi l'option 'Recherche des salles assignées à un cours'");
    console.log("Quel est le cours dont vous recherchez les salles ?");
    console.log("0 - Quitter");
    
    rl.question('Votre choix : ', (choice) => {
        switch (choice) {
            case '0': 
                console.log("\nVous avez choisi l'option 'Quitter'");
                return; // Quitte la fonction proprement
            default:
                console.log(`Vous avez choisi de rechercher les salles pour le cours : ${choice}`);
                // Ajouter ici le traitement pour rechercher les salles assignées
                break;
        }
    });
}


function CapaciteSalle() {

}

function DisponibiliteSalle() {

}

function CreneauLibreSalle() {

}

//claude a fait la suite


// Simulated data structures
const courses = [
    { id: 'INFO101', name: 'Introduction to Programming', department: 'Computer Science' },
    { id: 'MATH202', name: 'Linear Algebra', department: 'Mathematics' },
    { id: 'PHYS301', name: 'Advanced Physics', department: 'Physics' }
];

const rooms = [
    { id: 'A101', capacity: 30, building: 'Science Block' },
    { id: 'B202', capacity: 50, building: 'Main Building' },
    { id: 'C303', capacity: 20, building: 'Humanities Block' }
];

const schedules = [
    { 
        courseId: 'INFO101', 
        roomId: 'A101', 
        day: 'Monday', 
        startTime: '09:00', 
        endTime: '11:00' 
    },
    { 
        courseId: 'MATH202', 
        roomId: 'B202', 
        day: 'Tuesday', 
        startTime: '14:00', 
        endTime: '16:00' 
    }
];

// Existing code remains the same...

function EDTCRU() {
    console.log("\nGénération de l'EDT au format CRU");
    console.log("0 - Retour au menu principal");
    
    rl.question('Voulez-vous générer un EDT pour un département ou un cours spécifique ? (Département/Cours/0) : ', (input) => {
        if (input === '0') {
            askMainMenu();
            return;
        }
        
        try {
            const filteredSchedules = schedules.filter(schedule => 
                courses.some(course => 
                    course.department === input || course.id === input
                )
            );
            
            if (filteredSchedules.length === 0) {
                console.log("Aucun emploi du temps trouvé pour ce département ou cours.");
            } else {
                console.log("\nEmploi du Temps (Format CRU) :");
                filteredSchedules.forEach(schedule => {
                    const course = courses.find(c => c.id === schedule.courseId);
                    const room = rooms.find(r => r.id === schedule.roomId);
                    console.log(`Cours: ${course.name} (${course.id})`);
                    console.log(`Salle: ${room.id} (${room.building})`);
                    console.log(`Jour: ${schedule.day}`);
                    console.log(`Horaire: ${schedule.startTime} - ${schedule.endTime}\n`);
                });
            }
        } catch (error) {
            console.log("Une erreur s'est produite lors de la génération de l'EDT.");
        }
        
        askMainMenu();
    });
}

function EDTICalendar() {
    console.log("\nGénération de l'EDT en ICalendar");
    console.log("0 - Retour au menu principal");
    
    rl.question('Entrez votre nom ou identifiant : ', (input) => {
        if (input === '0') {
            askMainMenu();
            return;
        }
        
        try {
            const personalSchedule = schedules.filter(schedule => 
                courses.some(course => course.id.includes(input))
            );
            
            if (personalSchedule.length === 0) {
                console.log("Aucun emploi du temps trouvé.");
            } else {
                const icalContent = personalSchedule.map(schedule => {
                    const course = courses.find(c => c.id === schedule.courseId);
                    const room = rooms.find(r => r.id === schedule.roomId);
                    return `BEGIN:VEVENT
SUMMARY:${course.name}
LOCATION:${room.id}
DTSTART:2024-01-01T${schedule.startTime}:00
DTEND:2024-01-01T${schedule.endTime}:00
END:VEVENT`;
                }).join('\n');
                
                const filename = `EDT_${input}.ics`;
                fs.writeFileSync(filename, `BEGIN:VCALENDAR\n${icalContent}\nEND:VCALENDAR`);
                console.log(`Fichier ICalendar généré : ${filename}`);
            }
        } catch (error) {
            console.log("Une erreur s'est produite lors de la génération du calendrier.");
        }
        
        askMainMenu();
    });
}

function Chevauchement() {
    console.log("\nVérification du non-chevauchement des cours");
    console.log("0 - Retour au menu principal");
    
    const checkOverlap = (schedule1, schedule2) => {
        return schedule1.day === schedule2.day && 
               !(schedule1.endTime <= schedule2.startTime || 
                 schedule1.startTime >= schedule2.endTime);
    };
    
    const overlappingCourses = schedules.filter((schedule, index) => 
        schedules.some((otherSchedule, otherIndex) => 
            index !== otherIndex && checkOverlap(schedule, otherSchedule)
        )
    );
    
    if (overlappingCourses.length === 0) {
        console.log("Aucun chevauchement de cours détecté.");
    } else {
        console.log("Cours en chevauchement détectés :");
        overlappingCourses.forEach(schedule => {
            const course = courses.find(c => c.id === schedule.courseId);
            const room = rooms.find(r => r.id === schedule.roomId);
            console.log(`Cours: ${course.name} (${course.id})`);
            console.log(`Salle: ${room.id}`);
            console.log(`Jour: ${schedule.day}`);
            console.log(`Horaire: ${schedule.startTime} - ${schedule.endTime}\n`);
        });
    }
    
    askMainMenu();
}

function ClassementCapaciteSalle() {
    console.log("\nClassement des salles par capacité");
    
    const sortedRooms = [...rooms].sort((a, b) => b.capacity - a.capacity);
    
    console.log("Salles classées par capacité décroissante :");
    sortedRooms.forEach((room, index) => {
        console.log(`${index + 1}. Salle ${room.id}: ${room.capacity} places (${room.building})`);
    });
    
    askMainMenu();
}

function VisuelOccupationSalle() {
    console.log("\nTaux d'occupation des salles");
    
    rooms.forEach(room => {
        const roomSchedules = schedules.filter(schedule => schedule.roomId === room.id);
        const occupiedHours = roomSchedules.reduce((total, schedule) => {
            const start = new Date(`2024-01-01T${schedule.startTime}`);
            const end = new Date(`2024-01-01T${schedule.endTime}`);
            return total + (end - start) / (1000 * 60 * 60);
        }, 0);
        
        const totalWeeklyHours = 40; // Assuming 40-hour work week
        const occupationRate = (occupiedHours / totalWeeklyHours * 100).toFixed(2);
        
        console.log(`Salle ${room.id}: ${occupationRate}% occupée`);
    });
    
    askMainMenu();
}

function SalleCours() {
    console.log("\nRecherche des salles assignées à un cours");
    console.log("0 - Retour au menu précédent");
    
    rl.question('Entrez le code ou le nom du cours : ', (input) => {
        if (input === '0') {
            askSearchMenu();
            return;
        }
        
        const matchingCourses = courses.filter(course => 
            course.id.toLowerCase().includes(input.toLowerCase()) || 
            course.name.toLowerCase().includes(input.toLowerCase())
        );
        
        if (matchingCourses.length === 0) {
            console.log("Aucun cours trouvé.");
        } else {
            matchingCourses.forEach(course => {
                const courseSchedules = schedules.filter(schedule => schedule.courseId === course.id);
                console.log(`\nCours: ${course.name} (${course.id})`);
                
                if (courseSchedules.length === 0) {
                    console.log("Aucune salle assignée.");
                } else {
                    courseSchedules.forEach(schedule => {
                        const room = rooms.find(r => r.id === schedule.roomId);
                        console.log(`Salle: ${room.id} (${room.building})`);
                        console.log(`Jour: ${schedule.day}`);
                        console.log(`Horaire: ${schedule.startTime} - ${schedule.endTime}`);
                    });
                }
            });
        }
        
        askSearchMenu();
    });
}

function CapaciteSalle() {
    console.log("\nRecherche de la capacité maximale d'une salle");
    console.log("0 - Retour au menu précédent");
    
    rl.question('Entrez le numéro ou l\'identifiant de la salle : ', (input) => {
        if (input === '0') {
            askSearchMenu();
            return;
        }
        
        const room = rooms.find(r => 
            r.id.toLowerCase() === input.toLowerCase()
        );
        
        if (room) {
            console.log(`\nSalle ${room.id}`);
            console.log(`Bâtiment: ${room.building}`);
            console.log(`Capacité maximale: ${room.capacity} places`);
        } else {
            console.log("Salle non trouvée.");
        }
        
        askSearchMenu();
    });
}

function DisponibiliteSalle() {
    console.log("\nRecherche des disponibilités d'une salle");
    console.log("0 - Retour au menu précédent");
    
    rl.question('Entrez le numéro ou l\'identifiant de la salle : ', (salle) => {
        if (salle === '0') {
            askSearchMenu();
            return;
        }
        
        const room = rooms.find(r => r.id.toLowerCase() === salle.toLowerCase());
        
        if (!room) {
            console.log("Salle non trouvée.");
            askSearchMenu();
            return;
        }
        
        rl.question('Entrez le jour (ex: Monday) : ', (jour) => {
            if (jour === '0') {
                askSearchMenu();
                return;
            }
            
            const roomSchedules = schedules.filter(schedule => 
                schedule.roomId === room.id && schedule.day === jour
            );
            
            if (roomSchedules.length === 0) {
                console.log(`La salle ${room.id} est entièrement disponible le ${jour}.`);
            } else {
                console.log(`Créneaux occupés pour la salle ${room.id} le ${jour} :`);
                roomSchedules.forEach(schedule => {
                    const course = courses.find(c => c.id === schedule.courseId);
                    console.log(`Cours: ${course.name}`);
                    console.log(`Horaire: ${schedule.startTime} - ${schedule.endTime}\n`);
                });
            }
            
            askSearchMenu();
        });
    });
}

function CreneauLibreSalle() {
    console.log("\nRecherche des salles libres à un créneau");
    console.log("0 - Retour au menu précédent");
    
    rl.question('Entrez le jour (ex: Monday) : ', (jour) => {
        if (jour === '0') {
            askSearchMenu();
            return;
        }
        
        rl.question('Entrez l\'heure de début (HH:MM) : ', (heureDebut) => {
            if (heureDebut === '0') {
                askSearchMenu();
                return;
            }
            
            rl.question('Entrez l\'heure de fin (HH:MM) : ', (heureFin) => {
                if (heureFin === '0') {
                    askSearchMenu();
                    return;
                }
                
                const availableRooms = rooms.filter(room => 
                    !schedules.some(schedule => 
                        schedule.roomId === room.id && 
                        schedule.day === jour && 
                        !(heureFin <= schedule.startTime || 
                          heureDebut >= schedule.endTime)
                    )
                );
                
                if (availableRooms.length === 0) {
                    console.log("Aucune salle disponible sur ce créneau.");
                } else {
                    console.log("Salles disponibles :");
                    availableRooms.forEach(room => {
                        console.log(`${room.id} (${room.building}, ${room.capacity} places)`);
                    });
                }
                
                askSearchMenu();
            });
        });
    });
}

// Rest of the existing code remains the same
