/** Classe représentant un Parser de fichiers CRU. */
class Parser {
    /**
     * Constructeur de la classe Parser.
     * Initialise les RegEx attendus dans les fichiers CRU.
     * @constructor
     */
    constructor() {
        this.module = /^\+[A-Z]{2,7}(\d{1,2})?[A-Z]?\d?$/;
        this.entries = {
            one: /^1$/,
            type: /^(CM|TD|TP)\d{1,2}$/,
            capacity: /^P=\d{1,3}$/,
            day: /^H=(L|MA|ME|J|V|S)$/,
            time: /^(\d|1\d|2[0-3]):[0-5]\d-(\d|1\d|2[0-3]):[0-5][0-9]$/,
            //group: /^[A-Z]([0-9]|[A-Z])?$/,
            room: /^S=(?:SPOR|[A-Z]{1,3}\d{1,3})?$/,
            end: /^\/\/$/
        };
        this.isCru = true;
    }

    /**
     * Parse le texte d'entrée en le tokenisant puis en validant ses tokens.
     *
     * @async
     * @param {string} input - Le texte à parser.
     
    async parse(input) {
        await this.validate(await this.tokenize(input));
        return this.isCru;
    }

    /**
     * Tokenise le texte d'entrée en un tableau de tokens.
     *
     * @async
     * @param {string} data - Le texte à tokeniser.
     * @returns {Promise<Array>} Le tableau de tokens.
     
    async tokenize(data) {
        data = await this.replaceAll(data, /(\/\/)/, '~//');
        const separator = /\r\n|\n|,F1,|,F2,|\r|,|~| /;
        var tokens = data.split(separator);
        tokens = tokens.filter(value => value);
        return tokens;
    }
    */

    /**
     * Parse et renvoie les tokens si le fichier est valide.
     * @async
     * @param {string} input - Le texte à parser.
     * @returns {Promise<Array|null>} Les tokens ou null si non conforme.
    */
    async parseAndTokenize(data) {
        // Remove any non-printable characters and normalize line endings
        const cleanedData = data
            .replace(/[\x00-\x09\x0B-\x1F\x7F]/g, '') // Remove control characters except newline
            .replace(/\r\n/g, '\n')   // Normalize Windows line endings
            .replace(/\r/g, '\n')     // Normalize old Mac line endings
            .trim();
    
        // Split by line, filtering out truly empty lines
        const lines = cleanedData.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
    
        const tokens = [];
        for (const line of lines) {
            // More robust token splitting
            const lineTokens = line
                .split(/[,\s]+/)
                .filter(token => token.trim() !== '');
    
            tokens.push(...lineTokens);
            
            // Add end marker for each module or entry
            if (line.startsWith('+') || line.endsWith('//')) {
                tokens.push('//');
            }
        }
    
        // Validate tokens
        if (tokens.length === 0) {
            console.error("No valid tokens found in the file.");
            return null;
        }
    
        return tokens;
    }

    /**
     * Valide les tokens d'entrée en vérifiant leur ordre et leur contenu.
     *
     * Le premier token doit être un module, suivi d'un certain nombre de tokens
     * correspondant au corps d'une ligne. On lit les tokens jusqu'à ce qu'on
     * rencontre un nouveau token de début de module, auquel cas on recommence.
     *
     * @async
     * @param {Array} input - Le tableau de tokens à valider.
     */
    async validate(input) {
        await this.expect(this.module, input);
        while (!this.module.test(input[0]) && input.length > 0) {
            await this.body(input);
        }
        // Si on a encore des tokens et que le fichier est pour l'instant valide, on relance la validation
        if (input.length > 0 && this.isCru) {
            await this.validate(input);
        }
    }

    /**
     * Parcourt le corps d'une ligne et vérifie que les tokens sont bien placés.
     *
     * @async
     * @param {Array} input - Le tableau de tokens à vérifier.
     */
    async body(input) {
        for (var key in this.entries) {
            await this.expect(this.entries[key], input);
        }
    }

    /**
     * Vérifie que le premier token du tableau correspond au pattern attendu.
     *
     * @async
     * @param {RegExp} pattern - Le pattern attendu.
     * @param {Array} input - Le tableau de tokens à vérifier.
     */
    async expect(pattern, input) {
        var a = input.shift();
        //console.log(a);
        //console.log(pattern.test(a));
        if (!pattern.test(a)) {
            this.isCru = false;
        }
    }
    /**
     * Remplace toutes les occurences d'un pattern dans une chaîne de caractères.
     *
     * @async
     * @param {string} str - La chaîne de caractères à modifier.
     * @param {RegExp} find - Le pattern à remplacer.
     * @param {string} replace - La chaîne de caractères de remplacement.
     * @returns {Promise<string>} La chaîne de caractères modifiée.
     */
    async replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }
    /**
     * Retourne les tokens structurés ou bruts si besoin.
     *
     * @returns {Array|string} Les tokens du fichier.
     */
    getTokens() {
        return this.tokens; // Variable à définir pendant le traitement.
    }
}

module.exports = Parser;