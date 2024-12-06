function getRoomsForCourse(data, courseName) {
    // Cherche le module correspondant au cours
    const course = data.find(course => course.module === courseName);

    // Vérifie si le module existe
    if (!course) {
        console.log(`Le cours "${courseName}" n'existe pas.`);
        return;
    }

    // Récupère les classes du module et extrait les salles uniques
    const roomsSet = new Set(course.classes.map(classe => classe.room)); // Set des salles uniques

    if (roomsSet.size > 0) {
        console.log(`Salles assignées pour le cours "${courseName}" :`);
        roomsSet.forEach(room => console.log(room));
    } else {
        console.log(`Aucune salle n'est assignée pour le cours "${courseName}".`);
    }
}

module.exports = {getRoomsForCourse};