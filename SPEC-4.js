function findFreeRooms(day, startTime, endTime) {
    // Collecte toutes les salles de tous les cours
    const allRooms = new Set();
    data.forEach(course => {
        course.classes.forEach(classe => {
            allRooms.add(classe.room); // Ajoute les salles uniques
        });
    });

    // Convertir les heures demandées en minutes
    const reqStartTime = timeToMinutes(startTime);
    const reqEndTime = timeToMinutes(endTime);

    // Trouver les salles occupées pour le créneau horaire spécifié
    const occupiedRooms = new Set();
    data.forEach(course => {
        course.classes.forEach(classe => {
            // Vérifier si la classe a lieu le jour spécifié
            if (classe.day !== day) return;

            // Convertir les horaires de la classe en minutes
            const classStartTime = timeToMinutes(classe.start);
            const classEndTime = timeToMinutes(classe.end);

            // Vérifier si les horaires se chevauchent
            const isOverlapping = (reqStartTime < classEndTime && reqEndTime > classStartTime);

            if (isOverlapping) {
                occupiedRooms.add(classe.room);
            }
        });
    });

    // Trouver les salles libres en soustrayant les salles occupées des salles totales
    const freeRooms = [...allRooms].filter(room => !occupiedRooms.has(room));

    // Afficher les résultats
    console.log(`Salles libres ${day} entre ${startTime} et ${endTime} :`);
    if (freeRooms.length === 0) {
        console.log('  Pas de salles libres à ce créneau.');
    } else {
        freeRooms.forEach(room => {
            console.log(`  ${room}`);
        });
    }

    return freeRooms;
}

function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

module.exports = {findFreeRooms};