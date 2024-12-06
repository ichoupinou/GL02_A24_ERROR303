const { getRoomsForCourse } = require('../SPEC-1.js');
const { verifSalle, printedMaxCapacity } = require('../SPEC-2.js');
describe("Vérification des fonctions de gestion de salles", function() {
    let mockData;
    let originalConsoleLog;
    let consoleOutput;

    beforeAll(function() {
        // Données de test mockées
        mockData = [
            {
                module: "MA02",
                classes: [
                    {
                        group: "CM1",
                        capacity: 63,
                        day: "L",
                        start: "10:00",
                        end: "12:00",
                        room: "A002"
                    },
                    {
                        group: "TD1",
                        capacity: 24,
                        day: "MA",
                        start: "8:00",
                        end: "10:00",
                        room: "S102"
                    },
                    {
                        group: "TP1",
                        capacity: 24,
                        day: "MA",
                        start: "16:00",
                        end: "19:00",
                        room: "D105"
                    }
                ]
            },
            {
                module: "MA03",
                classes: [
                    {
                        group: "CM1",
                        capacity: 48,
                        day: "J",
                        start: "10:00",
                        end: "12:00",
                        room: "C002"
                    },
                    {
                        group: "TD1",
                        capacity: 24,
                        day: "L",
                        start: "14:00",
                        end: "16:00",
                        room: "P102"
                    }
                ]
            },
        ];
    });

    beforeEach(function() {
        // Capture des logs de console
        originalConsoleLog = console.log;
        consoleOutput = [];
        console.log = function() {
            consoleOutput.push(Array.from(arguments).join(' '));
        };

        // Mock de readline pour les tests asynchrones
        spyOn(require('readline'), 'createInterface').and.returnValue({
            question: function(query, callback) {
                callback('A002');
            },
            close: function() {}
        });
    });

    afterEach(function() {
        // Restauration de console.log
        console.log = originalConsoleLog;
    });

    describe("verifSalle", function() {
        it("devrait retourner true pour une salle existante", function() {
            expect(verifSalle(mockData, 'A002')).toBe(true);
            expect(verifSalle(mockData, 'S102')).toBe(true);
            expect(verifSalle(mockData, 'D105')).toBe(true);
        });

        it("devrait retourner false pour une salle inexistante", function() {
            expect(verifSalle(mockData, 'X999')).toBe(false);
            expect(verifSalle(mockData, '')).toBe(false);
        });
    });

    describe("printedMaxCapacity", function() {
        it("devrait retourner la capacité maximale pour une salle existante", function() {
            printedMaxCapacity(mockData, 'A002');
            expect(consoleOutput).toContain('La capacité maximale de la salle A002 est : 63');
        });

        it("devrait gérer une salle inexistante", function() {
            // Mock pour une salle inexistante
            require('readline').createInterface().question = function(query, callback) {
                callback('X999');
            };

            printedMaxCapacity(mockData, 'X999');
            expect(consoleOutput).toContain('Erreur : la salle n\'existe pas dans la base de données.');
        });
    });

    describe("getRoomsForCourse", function() {
        it("devrait retourner la liste des salles pour un cours existant", function() {
            getRoomsForCourse(mockData, 'MA03');
            expect(consoleOutput).toEqual([
                `Salles assignées pour le cours "MA03" :`,
                'C002',
                'P102'
            ]);
        });

        it("devrait gérer un cours inexistant", function() {
            // Mock pour une salle inexistante
            require('readline').createInterface().question = function(query, callback) {
                callback('FB02');
            };

            getRoomsForCourse(mockData, 'FB02');
            expect(consoleOutput).toContain(`Le cours "FB02" n'existe pas.`);
        });
    });
});