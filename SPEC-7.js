function checkOverlaps(data) {
    // Regroupe les classes par salle
    const classesByRoom = {};

    let overlapsDetected = false;

    // Collecte les classes par salle et vérifie les chevauchements
    data.forEach(course => {
        course.classes.forEach((classe) => {
            if (!classesByRoom[classe.room]) {
                classesByRoom[classe.room] = [];
            }

            // Vérifie les chevauchements avec les autres classes déjà enregistrées dans la même salle
            for (let i = 0; i < classesByRoom[classe.room].length; i++) {
                const existingClass = classesByRoom[classe.room][i];

                // Vérifie si les classes ont le même jour et des horaires qui se chevauchent
                if (
                    classe.day === existingClass.day &&
                    areOverlapping(classe.start, classe.end, existingClass.start, existingClass.end)
                ) {
                    console.log(`Chevauchement détecté dans la salle ${classe.room} (${existingClass.day} ${existingClass.start}-${existingClass.end})`);
                    overlapsDetected = true;
                }
            }

            // Ajoute la classe à la liste des classes dans la salle
            classesByRoom[classe.room].push(classe);
        });
    });
    if(!overlapsDetected){
        console.log("Pas de chevauchement détecté.");
    }
}

function areOverlapping(start1, end1, start2, end2) {
    const start1Time = timeToMinutes(start1);
    const end1Time = timeToMinutes(end1);
    const start2Time = timeToMinutes(start2);
    const end2Time = timeToMinutes(end2);

    return start1Time < end2Time && start2Time < end1Time;
}

function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

module.exports = {checkOverlaps};