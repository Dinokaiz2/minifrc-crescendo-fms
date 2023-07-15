import { Team } from "./team.js"
import * as repository from "./match-repository.js"

/**
 * Holds match data. Uniquely identified by `match`, `set`, and `type`. Roughly keeps track of the
 * same data as the match page on The Blue Alliance.
 */
export class Match {

    #number;
    #set;
    #type;
    #id;

    #red;
    #blue;

    /** @type {Match.Result} */
    result;

    /**
     * @param {number} number the number of the match
     *                       (e.g. 9 for Qualification 9, 2 for Quarterfinal 3 Match 2)
     * @param {Match.Type} type the type for this match
     * @param {number} set if this is a playoff match, the set for the match
     *                     (e.g. 3 for Quarterfinal 3 Match 2), 0 for qualifications
     */
    constructor(number, type = Match.Type.QUALIFICATION, set = 0) {
        this.#number = number;
        this.#set = type == Match.Type.QUALIFICATION ? 0 : set;
        this.#type = type;
        this.#id = [number, set, type]; // This triple uniquely identifies a match
        this.#red = new Match.#Alliance(Match.AllianceColor.RED, this);
        this.#blue = new Match.#Alliance(Match.AllianceColor.BLUE, this);

        this.result = repository.getResult(...this.#id);
    }

    /**
     * Enum-like getter for possible match results.
     */
    static get Result() {
        return {
            UNDETERMINED: "Undetermined",
            RED_WIN: "Red win",
            TIE: "Tie",
            BLUE_WIN: "Blue win"
        }
    }

    /**
     * Enum-like getter for alliance colors.
     */
    static get AllianceColor() {
        return {
            RED: "Red",
            BLUE: "Blue"
        }
    }

    /**
     * Enum-like getter for match types.
     */
    static get Type() {
        return {
            QUALIFICATION: "Qualification",
            PLAYOFF: "Playoff",
            FINAL: "Final"
        }
    }

    static get PointValues() {
        return {
            MOBILITY: 3,
            AUTO_LOW_NODE: 3,
            AUTO_MID_NODE: 4,
            AUTO_HIGH_NODE: 6,
            AUTO_DOCK: 8,
            AUTO_ENGAGE: 12,
            LOW_NODE: 2,
            MID_NODE: 3,
            HIGH_NODE: 5,
            LINK: 5,
            PARK: 2,
            DOCK: 6,
            ENGAGE: 10,
            FOUL: 5,
            TECH_FOUL: 12
        }
    }
    
    /**
     * Gets the number of this match (e.g. 9 for Qualification 9, 2 for Quarterfinal 3
     * Match 2)
     * @type {number}
     */
    get number() {
        return this.#number;
    }

    /**
     * Gets the set this match is apart of. Always 0 for qualification matches.
     * @type {number}
     */
    get set() {
        return this.#set;
    }

    /**
     * Gets the type of this match.
     * @type {Match.Type}
     */
    get type() {
        return this.#type;
    }

    /** @type {Match.Alliance} */
    get red() {
        return this.#red;
    }

    /** @type {Match.Alliance} */
    get blue() {
        return this.#blue;
    }

    /**
     * Gets this match's friendly name.
     */
    get friendlyName() {
        return this.type + " " + this.number;
    }

    /**
     * Gets all teams in this match in an array, with red teams first.
     * @type {Team[]}
     */
    get teams() {
        return this.#red.teams.concat(this.#blue.teams);
    }

    get teamNumbers() {
        return this.teams.map(team => team.number);
    }

    /**
     * Checks if the provided team is disqualified from this match.
     * 
     * @param {Team | number} team
     * @return {boolean} `true` if the provided team is disqualified, `false` otherwise.
     */
    isDisqualified(team) {
        if (team instanceof Team) {
            team = team.number;
        }
        if (this.teams.map(team => team.number).includes(team)) {
            return repository.isDisqualified(team, ...this.#id);
        }
        return false;
    }

    /**
     * Checks if the provided team is a surrogate in this match.
     * @param {Team | number} team
     * @return {boolean} `true` if the provided team is a surrogate, `false` otherwise.
     */
    isSurrogate(team) {
        if (team instanceof Team) {
            team = team.number;
        }
        if (this.teams.map(team => team.number).includes(team)) {
            return repository.isSurrogate(team, ...this.#id);
        }
        return false;
    }

    isPlayoff() {
        return this.#type == Match.Type.PLAYOFF || this.#type == Match.Type.FINAL;
    }

    determineResult() {
        if (this.red.matchPoints > this.blue.matchPoints) this.result = Match.Result.RED_WIN;
        else if (this.red.matchPoints < this.blue.matchPoints) this.result = Match.Result.BLUE_WIN;
        else this.result = Match.Result.TIE;
    }

    /**
     * Saves the state of this match to the repository.
     */
    save() {
        repository.setResult(this.result, ...this.#id);
        this.red.save();
        this.blue.save();
    }

    /**
     * Clears match data locally. Old match data stays in database until this match gets saved.
     */
    clear() {
        this.result = Match.Result.UNDETERMINED;
        this.red.clear();
        this.blue.clear();
    }

    /**
     * Gets the next match in the competition with an undetermined outcome.
     * @return {Match} the next match
     */
    static getNextMatch() {

        const PLAYOFF_STRUCTURE = {
            5: ["L", 1, "L", 2, Match.Type.PLAYOFF, 5],
            6: ["L", 3, "L", 4, Match.Type.PLAYOFF, 6],
            7: ["W", 1, "W", 2, Match.Type.PLAYOFF, 7],
            8: ["W", 3, "W", 4, Match.Type.PLAYOFF, 8],
            9: ["L", 7, "W", 6, Match.Type.PLAYOFF, 9],
            10: ["L", 8, "W", 5, Match.Type.PLAYOFF, 10],
            11: ["W", 10, "W", 9, Match.Type.PLAYOFF, 11],
            12: ["W", 7, "W", 8, Match.Type.PLAYOFF, 12],
            13: ["L", 12, "W", 11, Match.Type.PLAYOFF, 13],
            14: ["W", 12, "W", 13, Match.Type.FINAL, 1],
        };

        let matches = this.getSortedMatches();
        let match = matches.find(match => match.result == Match.Result.UNDETERMINED);
        if (!match && matches[matches.length - 1].type == Match.Type.PLAYOFF) {

            function getAlliance(number, result) {
                let match = matches.find(match => match.isPlayoff() && match.number == number);
                if (result == "W" && match.result == Match.Result.RED_WIN
                    || result == "L" && match.result == Match.Result.BLUE_WIN) return match.red;
                else if (result == "W" && match.result == Match.Result.BLUE_WIN
                    || result == "L" && match.result == Match.Result.RED_WIN) return match.blue;
                else return false;
            }

            let matchData = PLAYOFF_STRUCTURE[matches[matches.length - 1].number + 1];
            if (!matchData) return matches[matches.length - 1];
            let redAlliance = getAlliance(matchData[1], matchData[0]);
            let blueAlliance = getAlliance(matchData[3], matchData[2]);
            if (!redAlliance || !blueAlliance) return matches[matches.length - 1]; // Give up for ties

            repository.generateMatch(matchData[5], 0, matchData[4], redAlliance.teamNumbers, blueAlliance.teamNumbers, redAlliance.number, blueAlliance.number);
            if (matchData[4] == Match.Type.FINAL) {
                repository.generateMatch(2, 0, matchData[4], redAlliance.teamNumbers, blueAlliance.teamNumbers, redAlliance.number, blueAlliance.number);
                repository.generateMatch(3, 0, matchData[4], redAlliance.teamNumbers, blueAlliance.teamNumbers, redAlliance.number, blueAlliance.number);
            }
            matches = this.getSortedMatches();
            match = matches.find(match => match.result == Match.Result.UNDETERMINED);
        }
        return match ? match : matches[matches.length - 1] // If matches have been played, just return the last one
    }

    /**
     * @return {Match[]}
     */
    static getSortedMatches() {
        let matches = repository.getAllMatches();
        matches.sort((m1, m2) => {
            if (m1.type == m2.type == Match.Type.QUALIFICATION) return m1.match - m2.match;
            else if (m1.type == m2.type) {
                // Order playoffs by match first, so Bo3s are spread out
                if (m1.number != m2.number) return m1.number - m2.number;
                else return m1.set - m2.set;
            }
            else if (m1.type == Match.Type.QUALIFICATION) return -1;
            else if (m2.type == Match.Type.QUALIFICATION) return 1;
            else if (m1.type == Match.Type.PLAYOFF) return -1;
            else if (m2.type == Match.Type.PLAYOFF) return 1;
            return 0; // Both matches are finals with the same set and match, shouldn't ever happen
        });
        return matches;
    }

    /**
     * Class to hold point data per alliance for Match.
     * 
     * Emulates something like a private inner class by passing in `match` for access to
     * the enclosing Match instance.
     */
    static #Alliance = class Alliance {

        #teams;
        #color;
        #match;
        #number; // 0 in qualifications

        /** @type {number} */   mobility = 0;
        /** @type {number} */   autoLowNodes = 0;
        /** @type {number} */   autoMidNodes = 0;
        /** @type {number} */   autoHighNodes = 0;
        /** @type {number} */   autoCharge = 0; // Point value of auto dock or engage
        /** @type {number} */   lowNodes = 0; // Teleop only
        /** @type {number} */   midNodes = 0; // Teleop only
        /** @type {number} */   highNodes = 0; // Teleop only
        /** @type {number} */   links = 0;
        /** @type {boolean} */  coopertition = false;
        /** @type {number[]} */ endgame = [0, 0, 0]; // Point values of completed endgame tasks
        /** @type {number} */   fouls = 0; // Awarded to this alliance, committed by opponent
        /** @type {number} */   techFouls = 0; // Awarded to this alliance, committed by opponent

        setMobility(count)        { this.mobility = count; }
        addAutoLowNode()          { this.autoLowNodes++; };
        removeAutoLowNode()       { if (this.autoLowNodes > 0) this.autoLowNodes--; };
        addAutoMidNode()          { this.autoMidNodes++; };
        removeAutoMidNode()       { if (this.autoMidNodes > 0) this.autoMidNodes--; };
        addAutoHighNode()         { this.autoHighNodes++; };
        removeAutoHighNode()      { if (this.autoHighNodes > 0) this.autoHighNodes--; };
        setAutoCharge(pts)        { this.autoCharge = pts; }
        addLowNode()              { this.lowNodes++; };
        removeLowNode()           { if (this.lowNodes > 0) this.lowNodes--; };
        addMidNode()              { this.midNodes++; };
        removeMidNode()           { if (this.midNodes > 0) this.midNodes--; };
        addHighNode()             { this.highNodes++; };
        removeHighNode()          { if (this.highNodes > 0) this.highNodes--; };
        addLink()                 { this.links++; };
        removeLink()              { if (this.links > 0) this.links--; };
        setCoopertition(bool)     { this.coopertition = bool; }
        setEndgame(pos, pts)      { this.endgame[pos] = pts; }
        addFoul()                 { this.fouls++; }
        removeFoul()              { if (this.fouls > 0) this.fouls--; }
        addTechFoul()             { this.techFouls++; }
        removeTechFoul()          { if (this.techFouls > 0) this.techFouls--; }
        
        get teams() { return this.#teams; }
        get teamNumbers() { return this.#teams.map(team => team.number); }
        get color() { return this.#color; }
        get number() { return this.#number; }

        get matchPoints() {
            return this.autoPoints
                 + this.teleopGridPoints
                 + this.endgamePoints
                 + this.penaltyPoints;
        }

        get mobilityPoints() {
            return this.mobility * Match.PointValues.MOBILITY;
        }

        get autoGridPoints() {
            return this.autoLowNodes * Match.PointValues.AUTO_LOW_NODE
                + this.autoMidNodes * Match.PointValues.AUTO_MID_NODE
                + this.autoHighNodes * Match.PointValues.AUTO_HIGH_NODE;
        }

        get autoPoints() {
            return this.mobilityPoints + this.autoCharge + this.autoGridPoints;
        }

        get gridPoints() {
            return this.autoGridPoints
                + this.links * Match.PointValues.LINK
                + this.lowNodes * Match.PointValues.LOW_NODE
                + this.midNodes * Match.PointValues.MID_NODE
                + this.highNodes * Match.PointValues.HIGH_NODE;
        }

        get teleopGridPoints() {
            return this.links * Match.PointValues.LINK
                + this.lowNodes * Match.PointValues.LOW_NODE
                + this.midNodes * Match.PointValues.MID_NODE
                + this.highNodes * Match.PointValues.HIGH_NODE;
        }
        
        get chargeStationPoints() {
            return this.autoCharge
                + this.endgame.filter(e => e != Match.PointValues.PARK).reduce((sum, pts) => sum + pts, 0);
        }
        
        get parkPoints() {
            return this.endgame.filter(e => e == Match.PointValues.PARK).reduce((sum, pts) => sum + pts, 0);
        }

        get endgamePoints() {
            return this.endgame.reduce((sum, pts) => sum + pts, 0);
        }

        get penaltyPoints() {
            return this.fouls * Match.PointValues.FOUL
                 + this.techFouls * Match.PointValues.TECH_FOUL;
        }
        
        get sustainabilityThreshold() {
            return this.#match.#red.coopertition && this.#match.#blue.coopertition ? 5 : 6;
        }
        
        get sustainability() {
            return this.links >= this.sustainabilityThreshold;
        }

        get activation() {
            return this.chargeStationPoints >= 26;
        }
        
        get totalAutoNodes() { return this.autoLowNodes + this.autoMidNodes + this.autoHighNodes }
        get totalLowNodes() { return this.autoLowNodes + this.lowNodes; }
        get totalMidNodes() { return this.autoMidNodes + this.midNodes; }
        get totalHighNodes() { return this.autoHighNodes + this.highNodes; }

        /**
         * @param {number[]} teams 
         * @param {Match.AllianceColor} color 
         * @param {Match} match instance of Match enclosing this Alliance
         */
        constructor(color, match) {
            this.#color = color;
            this.#match = match;

            let teamNumbers = repository.getAllianceTeams(...this.#match.#id, this.color);
            this.#teams = teamNumbers.map(number => new Team(number));
            if (match.isPlayoff()) this.#number = repository.getAllianceNumber(...this.#match.#id, this.color);

            this.mobility         = repository.getMobility(...this.#match.#id, this.color);
            this.autoLowNodes     = repository.getAutoLowNodes(...this.#match.#id, this.color);
            this.autoMidNodes     = repository.getAutoMidNodes(...this.#match.#id, this.color);
            this.autoHighNodes    = repository.getAutoHighNodes(...this.#match.#id, this.color);
            this.autoCharge       = repository.getAutoCharge(...this.#match.#id, this.color);
            this.lowNodes         = repository.getLowNodes(...this.#match.#id, this.color);
            this.midNodes         = repository.getMidNodes(...this.#match.#id, this.color);
            this.highNodes        = repository.getHighNodes(...this.#match.#id, this.color);
            this.links            = repository.getLinks(...this.#match.#id, this.color);
            this.coopertition     = repository.getCoopertition(...this.#match.#id, this.color);
            this.endgame          = repository.getEndgame(...this.#match.#id, this.color);
            this.fouls            = repository.getFouls(...this.#match.#id, this.color);
            this.techFouls        = repository.getTechFouls(...this.#match.#id, this.color);
        }

        save() {
            repository.setMatchPoints(this.matchPoints, ...this.#match.#id, this.color);
            repository.setMobility(this.mobility, ...this.#match.#id, this.color);
            repository.setAutoLowNodes(this.autoLowNodes, ...this.#match.#id, this.color);
            repository.setAutoMidNodes(this.autoMidNodes, ...this.#match.#id, this.color);
            repository.setAutoHighNodes(this.autoHighNodes, ...this.#match.#id, this.color);
            repository.setAutoCharge(this.autoCharge, ...this.#match.#id, this.color);
            repository.setLowNodes(this.lowNodes, ...this.#match.#id, this.color);
            repository.setMidNodes(this.midNodes, ...this.#match.#id, this.color);
            repository.setHighNodes(this.highNodes, ...this.#match.#id, this.color);
            repository.setLinks(this.links, ...this.#match.#id, this.color);
            repository.setCoopertition(this.coopertition, ...this.#match.#id, this.color);
            repository.setEndgame(this.endgame, ...this.#match.#id, this.color);
            repository.setFouls(this.fouls, ...this.#match.#id, this.color);
            repository.setTechFouls(this.techFouls, ...this.#match.#id, this.color);
            repository.setSustainability(this.sustainability, ...this.#match.#id, this.color);
            repository.setActivation(this.activation, ...this.#match.#id, this.color);
        }
        
        clear() {
            this.mobility = 0;
            this.autoLowNodes = 0;
            this.autoMidNodes = 0;
            this.autoHighNodes = 0;
            this.autoCharge = 0;
            this.lowNodes = 0;
            this.midNodes = 0;
            this.highNodes = 0;
            this.links = 0;
            this.coopertition = false;
            this.endgame = [0, 0, 0];
            this.fouls = 0;
            this.techFouls = 0;
        }
    }
}