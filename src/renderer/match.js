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
            REACH: 2,
            AUTO_CROSS: 10,
            AUTO_LOW_GOAL: 5,
            AUTO_HIGH_GOAL: 10,
            CROSS: 5,
            LOW_GOAL: 2,
            HIGH_GOAL: 5,
            CHALLENGE: 5,
            SCALE: 15,
            PLAYOFF_BREACH: 20,
            PLAYOFF_CAPTURE: 25,
            FOUL: 5,
            TECH_FOUL: 5 // Also increases opponent tower strength by one
        }
    }
    
    static MAX_TOWER_STRENGTH = 6;
    
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

    get red() {
        return this.#red;
    }

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
        // TODO: Bo3 played all at once or one match at a time?
        let matches = this.getSortedMatches();
        let match = matches.find(match => match.result == Match.Result.UNDETERMINED);
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
     * Puts a new playoff match in the schedule.
     * @param {string} name 
     * @param {Team[]} redTeams 
     * @param {string} redAllianceName 
     * @param {Team[]} blueTeams 
     * @param {string} blueAllianceName 
     */
    static generatePlayoffMatch(name, redTeams, redAllianceName, blueTeams, blueAllianceName) {
        // TODO: Should we persist playoff alliances separately?
        // Plan without persisting playoff alliances:
        //  Add alliance name fields to Alliance, only included in playoffs
        //  Manually enter the 8 guaranteed quarterfinal matches into the db after alliance selections
        //  From there, generate tiebreaker matches as needed and semifinal and final matches as they're determined
        // If we persisted playoff alliances we could generate the initial quarterfinal matches automatically too
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

        /** @type {number[]} */ autoMovement = [0, 0, 0]; // Point values of auto reach and cross
        /** @type {number} */   autoLowGoals;
        /** @type {number} */   autoHighGoals;
        /** @type {number} */   lowGoals; // Teleop only
        /** @type {number} */   highGoals; // Teleop only
        /** @type {number[]} */ defenseStrengths = [2, 2, 2, 2, 2];
        /** @type {number[]} */ endgame = [0, 0, 0]; // Point values of completed endgame tasks
        /** @type {number} */   fouls; // Awarded to this alliance, committed by opponent
        /** @type {number} */   techFouls; // Awarded to this alliance, committed by opponent

        setAutoMovement(pos, pts) { this.autoMovement[pos] = pts; }
        addAutoLowGoal()          { this.autoLowGoals++; };
        removeAutoLowGoal()       { if (this.autoLowGoals > 0) this.autoLowGoals--; };
        addAutoHighGoal()         { this.autoHighGoals++; };
        removeAutoHighGoal()      { if (this.autoHighGoals > 0) this.autoHighGoals--; };
        addLowGoal()              { this.lowGoals++; };
        removeLowGoal()           { if (this.lowGoals > 0) this.lowGoals--; };
        addHighGoal()             { this.highGoals++; };
        removeHighGoal()          { if (this.highGoals > 0) this.highGoals--; };
        damageDefense(pos)        { if (this.defenseStrengths[pos] > 0) this.defenseStrengths[pos]--; };
        undoDefenseDamage(pos)    { if (this.defenseStrengths[pos] < 2) this.defenseStrengths[pos]++; };
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
            return this.reachPoints
                 + this.defensePoints
                 + this.boulderPoints
                 + this.endgamePoints
                 + this.penaltyPoints
                 + (this.breach && this.#match.type != Match.Type.QUALIFICATION ? Match.PointValues.PLAYOFF_BREACH : 0)
                 + (this.capture && this.#match.type != Match.Type.QUALIFICATION  ? Match.PointValues.PLAYOFF_CAPTURE : 0);
        }

        get reachPoints() {
            return this.reaches * Match.PointValues.REACH;
        }

        get autoPoints() {
            return this.autoMovement.reduce((sum, pts) => sum + pts, 0)
                 + this.autoLowGoals * Match.PointValues.AUTO_LOW_GOAL
                 + this.autoHighGoals * Match.PointValues.AUTO_HIGH_GOAL;
        }

        get defensePoints() {
            return (10 - this.defenseStrengths.reduce((sum, str) => sum + str, 0) - this.autoCrossings) * Match.PointValues.CROSS
                 + this.autoCrossings * Match.PointValues.AUTO_CROSS;
        }

        get boulderPoints() {
            return this.autoLowGoals * Match.PointValues.AUTO_LOW_GOAL
                 + this.autoHighGoals * Match.PointValues.AUTO_HIGH_GOAL
                 + this.lowGoals * Match.PointValues.LOW_GOAL
                 + this.highGoals * Match.PointValues.HIGH_GOAL;
        }

        get endgamePoints() {
            return this.endgame.reduce((sum, pts) => sum + pts, 0);
        }

        get penaltyPoints() {
            return this.fouls * Match.PointValues.FOUL
                 + this.techFouls * Match.PointValues.TECH_FOUL;
        }
        
        get opponentTowerStrength() {
            return Match.MAX_TOWER_STRENGTH - (this.autoLowGoals + this.autoHighGoals + this.lowGoals + this.highGoals) + this.techFouls;
        }

        // Clamped percentage of strength depletion for UI
        get opponentTowerProgress() {
            let progress = Match.MAX_TOWER_STRENGTH - this.opponentTowerStrength;
            return Math.min(100, Math.max(0, (progress / Match.MAX_TOWER_STRENGTH) * 100));
        }
        
        // Check if the tower is weakened but three robots have not yet completed endgame
        get capturePossible() {
            return this.opponentTowerStrength <= 0 && this.endgame.some(e => e == 0);
        }

        get breach() {
            return this.defenseStrengths.filter(str => str == 0).length >= 4;
        }

        // Note: Section 3.1.4 of the FRC Stronghold manual says each robot has to challenge/scale a UNIQUE tower face to capture.
        // We've decided to ignore this for MiniFRC.
        get capture() {
            return this.opponentTowerStrength <= 0 && this.endgame.every(pts => pts != 0);
        }
        
        get reaches() { return this.autoMovement.filter(e => e == Match.PointValues.REACH).length; }
        get autoCrossings() { return this.autoMovement.filter(e => e == Match.PointValues.AUTO_CROSS).length; }
        get totalHighGoals() { return this.autoHighGoals + this.highGoals; }
        get totalLowGoals() { return this.autoLowGoals + this.lowGoals; }

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

            this.autoMovement     = repository.getAutoMovement(...this.#match.#id, this.color);
            this.autoLowGoals     = repository.getAutoLowGoals(...this.#match.#id, this.color);
            this.autoHighGoals    = repository.getAutoHighGoals(...this.#match.#id, this.color);
            this.lowGoals         = repository.getLowGoals(...this.#match.#id, this.color);
            this.highGoals        = repository.getHighGoals(...this.#match.#id, this.color);
            this.defenseStrengths = repository.getDefenseStrengths(...this.#match.#id, this.color);
            this.endgame          = repository.getEndgame(...this.#match.#id, this.color);
            this.fouls            = repository.getFouls(...this.#match.#id, this.color);
            this.techFouls        = repository.getTechFouls(...this.#match.#id, this.color);
        }

        save() {
            repository.setMatchPoints(this.matchPoints, ...this.#match.#id, this.color);
            repository.setAutoMovement(this.autoMovement, ...this.#match.#id, this.color);
            repository.setAutoLowGoals(this.autoLowGoals, ...this.#match.#id, this.color);
            repository.setAutoHighGoals(this.autoHighGoals, ...this.#match.#id, this.color);
            repository.setLowGoals(this.lowGoals, ...this.#match.#id, this.color);
            repository.setHighGoals(this.highGoals, ...this.#match.#id, this.color);
            repository.setDefenseStrengths(this.defenseStrengths, ...this.#match.#id, this.color);
            repository.setEndgame(this.endgame, ...this.#match.#id, this.color);
            repository.setFouls(this.fouls, ...this.#match.#id, this.color);
            repository.setTechFouls(this.techFouls, ...this.#match.#id, this.color);
            repository.setBreach(this.breach, ...this.#match.#id, this.color);
            repository.setCapture(this.capture, ...this.#match.#id, this.color);
        }
        
        clear() {
            this.autoMovement = [0, 0, 0];
            this.autoLowGoals = 0;
            this.autoHighGoals = 0;
            this.lowGoals = 0;
            this.highGoals = 0;
            this.defenseStrengths = [2, 2, 2, 2, 2];
            this.endgame = [0, 0, 0];
            this.fouls = 0;
            this.techFouls = 0;
        }
    }
}